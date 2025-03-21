import { z } from "zod";
import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";

const schema = z.object({
  bracketId: z.string().cuid(),
  competitors: z.array(z.string().cuid()),
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

  const competitors = [...body.data.competitors];
  shuffleArray(competitors);

  const freeSlots = await prisma.bracketPart.findMany({
    where: {
      bracketId: body.data.bracketId,
      startLocation: true,
    },
  });

  if (freeSlots.length != competitors.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "bracket-count-mismatch",
    });
  }

  const bracketPartFillPromises = [];

  for (let i = 0; i < freeSlots.length; i++) {
    bracketPartFillPromises.push(
      prisma.bracketPart.update({
        where: {
          id: freeSlots[i].id,
        },
        data: {
          team: {
            connect: {
              id: competitors[i],
            },
          },
        },
      }),
    );
  }

  const [error, data] = await catchError(
    prisma.$transaction(bracketPartFillPromises),
  );

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "error-in-process",
    });
  }

  return {
    notification: createNotification("SUCCESS", {
      message: "Keret feltöltése sikeres!",
    }),
  };
});

function shuffleArray(array: any[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}
