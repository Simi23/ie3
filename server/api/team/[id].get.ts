import { prisma } from "~/db/prismaClient";
import { catchError } from "~/utils/catchError";

export type TeamResponse = {
  name: string;
  users: {
    id: string;
    name: string;
    isLeader: boolean;
    isMe: boolean;
  }[];
  competitionTitle: string;
  competitionId: string;
  invites: {
    id: string;
    name: string;
  }[];
  teamLimit: number;
};

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
    prisma.team.findFirst({
      where: {
        id: id,
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        invites: {
          select: {
            invitee: {
              select: {
                username: true,
                id: true,
              },
            },
          },
        },
        competition: {
          select: {
            title: true,
            teamLimit: true,
          },
        },
      },
    }),
  );

  if (error !== undefined || data === null) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "team-not-found",
    });
  }

  const mapped: TeamResponse = {
    name: data.name,
    users: data.users.map((u) => {
      return {
        id: u.userId,
        name: u.user.username,
        isLeader: u.isLeader,
        isMe: u.userId === event.context.user?.id,
      };
    }),
    competitionTitle: data.competition.title,
    competitionId: data.competitionId,
    invites: data.invites.map((i) => {
      return {
        id: i.invitee.id,
        name: i.invitee.username,
      };
    }),
    teamLimit: data.competition.teamLimit,
  };

  return mapped;
});
