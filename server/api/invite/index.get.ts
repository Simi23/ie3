import { prisma } from "~/db/prismaClient";
import { catchError } from "~/utils/catchError";

export type InviteResponse = {
  id: string;
  teamName: string;
  competitionTitle: string;
}[];

export default defineEventHandler(async (event) => {
  if (event.context.user === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }
  const userId = event.context.user.id;

  const [error, data] = await catchError(
    prisma.invite.findMany({
      where: {
        inviteeId: userId,
      },
      include: {
        team: {
          select: {
            name: true,
            competition: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    }),
  );

  if (error !== undefined) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "unknown-error",
    });
  }

  const mapped = data.map((d) => {
    return {
      id: d.id,
      teamName: d.team.name,
      competitionTitle: d.team.competition.title,
    };
  });

  return mapped;
});
