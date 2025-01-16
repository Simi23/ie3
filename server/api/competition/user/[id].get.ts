import { prisma } from "~/db/prismaClient";
import { catchError } from "~/utils/catchError";

export type CompetitionUserResponse = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  teamCompetition: boolean;
  teamLimit: number;

  participation: boolean;
  invited: boolean;

  isLeader: boolean;
  teamId: string;
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
        image: {
          select: {
            url: true,
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

  const [inviteError, inviteCount] = await catchError(
    prisma.invite.count({
      where: {
        team: {
          competitionId: id,
        },
        inviteeId: event.context.user.id,
      },
    }),
  );

  if (inviteError !== undefined) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "competition-not-found",
    });
  }

  const mapped: CompetitionUserResponse = {
    id: data.id,
    title: data.title,
    description: data.description,
    imageUrl: data.image.url,
    teamCompetition: data.teamCompetition,
    teamLimit: data.teamLimit,

    participation: data.teams.length !== 0,
    invited: inviteCount > 0,

    isLeader:
      data.teams[0]?.users.find((u) => u.userId == event.context.user?.id)
        ?.isLeader ?? false,
    teamId: data.teams[0]?.id ?? "0",
  };

  return mapped;
});
