import { prisma } from "~/db/prismaClient";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (id === undefined || event.context.user === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  const [error, data] = await catchError(
    prisma.competition.findFirst({
      where: {
        id: id,
      },
      include: {
        teams: {
          where: {
            users: {
              some: {
                userId: event.context.user.id,
              },
            },
          },
          include: {
            users: true,
          },
        },
      },
    }),
  );

  if (error !== undefined || data === null) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "competition-not-found",
    });
  }

  if (data.teams.length == 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  const teamId = data.teams[0].id;
  const userId = event.context.user.id;
  const isLeader =
    data.teams[0].users.find((u) => u.userId === userId)?.isLeader ?? false;

  if (isLeader) {
    const [disbandError, disbandData] = await catchError(
      prisma.team.delete({
        where: {
          id: teamId,
        },
      }),
    );
    if (disbandError !== undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "competition-leave-unsuccessful",
      });
    }
  } else {
    const [leaveError, leaveData] = await catchError(
      prisma.userInTeam.delete({
        where: {
          userId_teamId: {
            userId: userId,
            teamId: teamId,
          },
        },
      }),
    );
    if (leaveError !== undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "competition-leave-unsuccessful",
      });
    }
  }

  logEventAction(event, {
    category: "COMPETITION",
    severity: "INFO",
    message: `User ${event.context.user?.username} left competition ${data.title}.`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "A verseny elhagyása sikeres!",
    }),
  };
});
