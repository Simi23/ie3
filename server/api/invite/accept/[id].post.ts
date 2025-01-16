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

  const userId = event.context.user.id;

  const [error, invite] = await catchError(
    prisma.invite.findFirst({
      where: {
        id: id,
        inviteeId: userId,
      },
      include: {
        team: {
          select: {
            _count: {
              select: {
                users: true,
              },
            },
            competition: {
              select: {
                teamLimit: true,
                id: true,
              },
            },
          },
        },
        invitee: {
          select: {
            teams: {
              select: {
                team: {
                  select: {
                    competitionId: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  );

  if (error !== undefined || invite === null) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "invite-not-found",
    });
  }

  if (invite.team._count.users >= invite.team.competition.teamLimit) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "team-full",
    });
  }

  if (
    invite.invitee.teams.some(
      (t) => t.team.competitionId == invite.team.competition.id,
    )
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "already-in-competition",
    });
  }

  const [transactionError, output] = await catchError(
    prisma.$transaction([
      prisma.userInTeam.create({
        data: {
          team: {
            connect: {
              id: invite.teamId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
          isLeader: false,
        },
      }),
      prisma.invite.delete({
        where: {
          id: id,
          inviteeId: userId,
        },
      }),
    ]),
  );

  if (transactionError !== undefined) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "team-join-failed",
    });
  }

  logEventAction(event, {
    category: "INVITE",
    severity: "INFO",
    message: `User ${event.context.user.username} accepted invite ${invite.id}`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Sikeresen csatlakoztál a csapathoz!",
    }),
  };
});
