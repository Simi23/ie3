import { z } from "zod";
import { prisma } from "~/db/prismaClient";
import { catchError } from "~/utils/catchError";
import checkTeamLeader from "~/utils/checkTeamLeader";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

const bodySchema = z.object({
  teamId: z.string().cuid(),
  username: z.string(),
});

export default defineEventHandler(async (event) => {
  if (event.context.user === undefined) {
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

  const isLeader = await checkTeamLeader(userId, body.data.teamId);

  if (!isLeader) {
    throw createError({
      status: 401,
      statusMessage: "Unauthorized",
      message: "team-not-leader",
    });
  }

  const [error, data] = await catchError(
    prisma.invite.create({
      data: {
        team: {
          connect: {
            id: body.data.teamId,
          },
        },
        invitee: {
          connect: {
            username: body.data.username,
          },
        },
      },
    }),
  );

  if (error !== undefined) {
    throw createError({
      status: 404,
      statusMessage: "Resource Not Found",
      message: "user-not-found-try-username",
    });
  }

  logEventAction(event, {
    category: "COMPETITION",
    severity: "INFO",
    message: `User ${event.context.user.username} invited user ${body.data.username} to team ${body.data.teamId}.`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Meghívó sikeresen elküldve!",
    }),
  };
});
