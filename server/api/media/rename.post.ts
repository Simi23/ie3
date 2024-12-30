import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

type EventBody = {
  id: string;
  newName: string;
};

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const body = (await readBody(event)) as EventBody;

  if (!body || !body.id || !body.newName) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  let updated;
  try {
    updated = await prisma.media.update({
      where: {
        id: body.id,
      },
      data: {
        name: body.newName,
      },
    });
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "media-not-found",
    });
  }

  logEventAction(event, {
    category: "UPLOAD",
    severity: "INFO",
    message: `${event.context.user?.username} renamed file ${updated.id} to "${updated.name}"`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Fájl átnevezése sikeres!",
    }),
  };
});
