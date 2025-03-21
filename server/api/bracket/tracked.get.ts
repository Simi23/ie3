import { prisma } from "~/db/prismaClient";
import { catchError } from "~/utils/catchError";

export default defineEventHandler(async (event) => {
  const [error, data] = await catchError(
    prisma.bracketPart.findMany({
      where: {
        isTracked: true,
      },
      include: {
        team: {
          select: {
            name: true,
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

  const output = data.map((d) => d.team?.name ?? "");
  output.push("", "");

  const output2 = {
    side1: output[0],
    side2: output[1],
  };

  return output2;
});
