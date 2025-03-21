import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const [error, data] = await catchError(
    prisma.bracket.findMany({
      include: {
        competition: true,
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

  return data;
});
