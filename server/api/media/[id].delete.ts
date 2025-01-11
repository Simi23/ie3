import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);
  const id = getRouterParam(event, "id");

  if (id === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  const [error, result] = await catchError(
    prisma.media.delete({
      where: {
        id: id,
      },
    }),
  );

  if (error) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "media-not-found",
    });
  }

  logEventAction(event, {
    category: "MEDIA",
    severity: "INFO",
    message: `User ${event.context.user?.username} deleted media ${id}.`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Fájl törlése sikeres!",
    }),
  };
});
