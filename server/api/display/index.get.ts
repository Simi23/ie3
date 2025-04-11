import { prisma } from "~/db/prismaClient";
import { catchError } from "~/utils/catchError";
import { getDisplaySerial } from "~/utils/displaySerial";

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

  const serial = await getDisplaySerial();

  return {
    rows: data,
    serial: serial,
  };
});
