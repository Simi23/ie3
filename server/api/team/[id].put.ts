import { z } from "zod";
import { prisma } from "~/db/prismaClient";
import { catchError } from "~/utils/catchError";
import checkTeamLeader from "~/utils/checkTeamLeader";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

const bodySchema = z.object({
  newName: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (id === undefined || event.context.user === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  const userId = event.context.user.id;

  const body = await readValidatedBody(event, (body) =>
    bodySchema.safeParse(body),
  );

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  const isLeader = await checkTeamLeader(userId, id);

  if (!isLeader) {
    throw createError({
      status: 401,
      statusMessage: "Unauthorized",
      message: "team-not-leader",
    });
  }

  const newName = body.data.newName;

  const [error, data] = await catchError(
    prisma.team.update({
      where: {
        id: id,
      },
      data: {
        name: newName,
      },
    }),
  );

  if (error !== undefined) {
    throw createError({
      status: 500,
      statusMessage: "Internal Server Error",
      message: "modification-failed",
    });
  }

  logEventAction(event, {
    severity: "INFO",
    category: "TEAM",
    message: `${event.context.user.username} renamed team ${data.id} to ${newName}.`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Csapat átnevezése sikeres!",
    }),
  };
});
