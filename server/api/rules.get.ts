import { prisma } from "~/db/prismaClient";
import { catchError } from "~/utils/catchError";

export default defineEventHandler(async (event) => {
  const [error, rules] = await catchError(
    prisma.option.findUnique({
      where: {
        name: "rulesContent",
      },
    }),
  );

  if (error || rules === null) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "content-not-found",
    });
  }

  return {
    contentId: rules.value as string,
  };
});
