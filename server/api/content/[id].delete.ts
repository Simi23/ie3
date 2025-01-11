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

  const [error, deleted] = await catchError(
    prisma.mdContent.delete({
      where: {
        id: id,
      },
    }),
  );

  if (error) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "content-not-found",
    });
  }

  logEventAction(event, {
    category: "CONTENT",
    severity: "INFO",
    message: `User ${event.context.user?.username} deleted content "${deleted.id}".`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Tartalom törlése sikeres!",
    }),
  };
});
