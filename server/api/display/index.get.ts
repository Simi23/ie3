import { prisma } from "~/db/prismaClient";
import { catchError } from "~/utils/catchError";

export default defineEventHandler(async (event) => {
  const [error, data] = await catchError(
    prisma.displayContent.findMany({
      orderBy: {
        order: "asc",
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
