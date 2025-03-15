import { prisma } from "~/db/prismaClient";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";

export default defineEventHandler(async (event) => {
  if (event.context.user === undefined) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "session-not-found",
    });
  }

  const [dcError, dcData] = await catchError(
    prisma.user.update({
      where: {
        id: event.context.user.id,
      },
      data: {
        dcConnected: false,
        dcAvatar: "",
        dcId: "",
        dcGlobalName: "",
      },
    }),
  );

  if (dcError) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "error-in-process",
    });
  }

  return {
    notification: createNotification("SUCCESS", {
      message: "Discord fiók leválasztása sikeres!",
    }),
  };
});
