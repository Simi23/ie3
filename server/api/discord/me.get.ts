import { prisma } from "~/db/prismaClient";
import { catchError } from "~/utils/catchError";

export default defineEventHandler(async (event) => {
  if (event.context.user === undefined) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "session-not-found",
    });
  }

  const [error, user] = await catchError(
    prisma.user.findUnique({
      where: {
        id: event.context.user.id,
      },
      select: {
        dcConnected: true,
        dcAvatar: true,
        dcGlobalName: true,
        dcId: true,
      },
    }),
  );

  if (error || user === null) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "session-not-found",
    });
  }

  return user;
});
