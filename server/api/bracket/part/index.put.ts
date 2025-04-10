import { brotliDecompressSync } from "zlib";
import { z } from "zod";
import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";

const schema = z.object({
  started: z.boolean(),
  ended: z.boolean(),
  upper: z.object({
    id: z.string().cuid(),
    won: z.boolean(),
    points: z.array(z.number()),
  }),
  lower: z.object({
    id: z.string().cuid(),
    won: z.boolean(),
    points: z.array(z.number()),
  }),
});

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const body = await readValidatedBody(event, schema.safeParse);

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  const [error, data] = await catchError(
    prisma.$transaction([
      prisma.bracketPart.update({
        where: {
          id: body.data.upper.id,
        },
        data: {
          started: body.data.started,
          ended: body.data.ended,
          won: body.data.upper.won,
          points: body.data.upper.points,
        },
        include: {
          bracket: true,
        },
      }),
      prisma.bracketPart.update({
        where: {
          id: body.data.lower.id,
        },
        data: {
          started: body.data.started,
          ended: body.data.ended,
          won: body.data.lower.won,
          points: body.data.lower.points,
        },
      }),
    ]),
  );

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "error-in-process",
    });
  }

  const roundCount = Math.ceil(nLog(2, data[0].bracket.numberOfCompetitors));
  const isLastRound = data[0].round >= roundCount - 1;

  // Auto-promote
  if ((data[0].won || data[1].won) && !isLastRound) {
    // nextRound: upperResult.round + 1,
    // nextRoundLocation: Math.floor(upperResult.roundLocation / 2),
    // nextRoundLocationUpper: upperResult.roundLocation % 2 == 0,
    // winnerId: (upperResult.won ? upperResult.userId : lowerResult.userId) ?? -1,
    // bracketId: upperResult.bracketId,

    const nextRound = data[0].round + 1;
    const nextRoundLocation = Math.floor(data[0].roundLocation / 2);
    const nextRoundLocationUpper = data[0].roundLocation % 2 == 0;
    const winnerId = (data[0].won ? data[0].teamId : data[1].teamId) ?? "";
    const bracketId = data[0].bracketId;

    const [nextBPError, nextBP] = await catchError(
      prisma.bracketPart.findFirst({
        where: {
          round: nextRound,
          roundLocation: nextRoundLocation,
          upper: nextRoundLocationUpper,
          bracketId: bracketId,
        },
      }),
    );

    if (nextBPError || nextBP === null) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "error-in-process",
      });
    }

    const [promoteError, promoteData] = await catchError(
      prisma.bracketPart.update({
        where: {
          id: nextBP.id,
        },
        data: {
          team: {
            connect: {
              id: winnerId,
            },
          },
        },
      }),
    );

    if (promoteError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "error-in-process",
      });
    }
  }

  return {
    notification: createNotification("SUCCESS", {
      message: "Keret frissítve.",
    }),
  };
});

function nLog(n: number, x: number) {
  return Math.log(x) / Math.log(n);
}
