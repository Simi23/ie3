import { z } from "zod";
import { prisma } from "~/db/prismaClient";
import { bracketCreateSchema } from "~/schemas/bracket";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

interface BracketPart {
  round: number;
  roundLocation: number;
  upper: boolean;
  startLocation: boolean;
}

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const body = await readValidatedBody(event, bracketCreateSchema.safeParse);

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  const bracketParts = calculateBracketParts(body.data.numberOfCompetitors);

  const [error, created] = await catchError(
    prisma.bracket.create({
      data: {
        title: body.data.title,
        administrativeTitle: body.data.administrativeTitle,
        numberOfCompetitors: body.data.numberOfCompetitors,
        competition: {
          connect: {
            id: body.data.competitionId,
          },
        },
        parts: {
          createMany: {
            data: bracketParts,
          },
        },
      },
    }),
  );

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "error-in-process",
    });
  }

  logEventAction(event, {
    category: "COMPETITION",
    severity: "INFO",
    message: `User ${event.context.user?.username} created bracket ${body.data.administrativeTitle}`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Keret létrehozása sikeres!",
    }),
  };
});

function calculateBracketParts(numberOfCompetitors: number) {
  const { roundCount, fullRoundCount } =
    calculateBracketSize(numberOfCompetitors);
  const evenBracket = roundCount == fullRoundCount;

  // If numberOfCompetitors is a power of 2
  if (evenBracket) {
    const output = [] as BracketPart[];

    for (let round = roundCount - 1; round >= 0; round--) {
      for (
        let roundLocation = 0;
        roundLocation < Math.pow(2, roundCount - round - 1);
        roundLocation++
      ) {
        const upperPart = {
          round: round,
          roundLocation: roundLocation,
          upper: true,
          startLocation: round == 0,
        } as BracketPart;
        const lowerPart = {
          round: round,
          roundLocation: roundLocation,
          upper: false,
          startLocation: round == 0,
        } as BracketPart;
        output.push(upperPart, lowerPart);
      }
    }

    return output;
  }

  // If numberOfCompetitors is NOT a power of 2
  const output = [] as BracketPart[];

  // At first generate the first round
  const locations = Math.pow(2, roundCount - 1);
  const extras = numberOfCompetitors - locations;
  for (let i = 0; i < extras; i++) {
    const currentN = i + locations + 1;
    const locationIdentifiers = [] as number[];
    let modifiedN = currentN;
    for (let j = 0; j < fullRoundCount; j++) {
      locationIdentifiers.push(modifiedN % 2);
      modifiedN = modifiedN >> 1;
    }
    let locationSum = 0;
    let exponent = 0;
    for (let j = locationIdentifiers.length - 1; j >= 0; j--) {
      locationSum += locationIdentifiers[j] * Math.pow(2, exponent);
      exponent++;
    }

    const upperPart = {
      round: 0,
      roundLocation: locationSum,
      upper: true,
      startLocation: true,
    } as BracketPart;
    const lowerPart = {
      round: 0,
      roundLocation: locationSum,
      upper: false,
      startLocation: true,
    } as BracketPart;
    output.push(upperPart, lowerPart);
  }

  // After the first round is generated, generate the remaining rounds similar to the previous method
  for (let round = roundCount - 1; round >= 1; round--) {
    for (
      let roundLocation = 0;
      roundLocation < Math.pow(2, roundCount - round - 1);
      roundLocation++
    ) {
      let upperStart = !output.some(
        (value) => value.round == 0 && value.roundLocation == roundLocation * 2,
      );
      let lowerStart = !output.some(
        (value) =>
          value.round == 0 && value.roundLocation == roundLocation * 2 + 1,
      );
      if (round != 1) {
        upperStart = false;
        lowerStart = false;
      }
      const upperPart = {
        round: round,
        roundLocation: roundLocation,
        upper: true,
        startLocation: upperStart,
      } as BracketPart;
      const lowerPart = {
        round: round,
        roundLocation: roundLocation,
        upper: false,
        startLocation: lowerStart,
      } as BracketPart;
      output.push(upperPart, lowerPart);
    }
  }

  return output;
}

function calculateBracketSize(numberOfCompetitors: number) {
  const rounds = nLog(2, numberOfCompetitors);
  const roundCount = Math.ceil(rounds);
  const fullRoundCount = Math.floor(rounds);
  return {
    roundCount,
    fullRoundCount,
  };
}

function nLog(n: number, x: number) {
  return Math.log(x) / Math.log(n);
}
