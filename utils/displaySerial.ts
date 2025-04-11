import { prisma } from "~/db/prismaClient";
import { catchError } from "~/utils/catchError";

export async function incrementDisplaySerial() {
  const [error, original] = await catchError(
    prisma.option.findFirst({
      where: {
        name: "displaySerial",
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

  let newCount = original === null ? 1 : Number(original.value) + 1;

  const [upsertError, upsertData] = await catchError(
    prisma.option.upsert({
      where: {
        name: "displaySerial",
      },
      update: {
        value: newCount,
      },
      create: {
        name: "displaySerial",
        value: newCount,
      },
    }),
  );

  if (upsertError) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "error-in-process",
    });
  }
}

export async function getDisplaySerial() {
  const [error, original] = await catchError(
    prisma.option.findFirst({
      where: {
        name: "displaySerial",
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

  let count = original === null ? 0 : Number(original.value) + 1;

  return count;
}
