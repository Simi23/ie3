import { z } from "zod";
import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

const requestSchema = z.object({
  kickId: z.string().cuid(),
  teamId: z.string().cuid(),
  invite: z.boolean(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body) =>
    requestSchema.safeParse(body),
  );

  if (event.context.user === undefined || !body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }
  const userId = event.context.user.id;

  const [leaderError, leader] = await catchError(
    prisma.userInTeam.findFirst({
      where: {
        team: {
          id: body.data.teamId,
        },
        user: {
          id: userId,
        },
      },
    }),
  );

  const [leaderKickError, leaderKick] = await catchError(
    prisma.userInTeam.findFirst({
      where: {
        team: {
          id: body.data.teamId,
        },
        user: {
          id: body.data.kickId,
        },
      },
    }),
  );

  const isAdmin = adminCheck(event, 2, true);

  if ((leaderError !== undefined || leader === null) && !isAdmin) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "error-in-process",
    });
  }

  if (!(leader?.isLeader === true || isAdmin === true)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "team-not-leader",
    });
  }

  if (body.data.invite) {
    // If it is an invite only yet, not a membership
    const [kickError, kick] = await catchError(
      prisma.invite.delete({
        where: {
          teamId_inviteeId: {
            teamId: body.data.teamId,
            inviteeId: body.data.kickId,
          },
        },
      }),
    );
    if (kickError !== undefined) {
      throw createError({
        statusCode: 404,
        statusMessage: "Resource Not Found",
        message: "user-not-found",
      });
    }
  } else {
    // If the user is already in the team

    if (leaderKick?.isLeader === true) {
      // If the user is the leader, delete the team
      const [disbandError, disbandData] = await catchError(
        prisma.team.delete({
          where: {
            id: body.data.teamId,
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
      // Else, just kick the user
      const [kickError, kick] = await catchError(
        prisma.userInTeam.delete({
          where: {
            userId_teamId: {
              userId: body.data.kickId,
              teamId: body.data.teamId,
            },
          },
        }),
      );
      if (kickError !== undefined) {
        throw createError({
          statusCode: 404,
          statusMessage: "Resource Not Found",
          message: "user-not-found",
        });
      }
    }
  }

  logEventAction(event, {
    category: "TEAM",
    severity: "INFO",
    message: `User ${event.context.user.username} kicked user ${body.data.kickId} from team ${body.data.teamId}.`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Felhasználó kirúgása sikeres!",
    }),
  };
});
