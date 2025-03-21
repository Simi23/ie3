import { prisma } from "~/db/prismaClient";
import { catchError } from "~/utils/catchError";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (id === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  const [error, data] = await catchError(
    prisma.bracket.findFirst({
      select: {
        id: true,
        title: true,
        parts: {
          select: {
            id: true,
            round: true,
            roundLocation: true,
            upper: true,
            startLocation: true,
            points: true,
            won: true,
            started: true,
            ended: true,
            isTracked: true,
            team: {
              select: {
                name: true,
                users: {
                  select: { user: { select: { fullname: true } } },
                },
              },
            },
          },
        },
        competition: {
          select: { teamCompetition: true },
        },
      },
    }),
  );

  if (error || data === null) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "error-in-process",
    });
  }

  const output = {
    id: data.id,
    title: data.title,
    parts: data.parts.map((p) => {
      return {
        id: p.id,
        round: p.round,
        roundLocation: p.roundLocation,
        upper: p.upper,
        startLocation: p.startLocation,
        points: p.points,
        won: p.won,
        started: p.started,
        ended: p.ended,
        isTracked: p.isTracked,
        teamName: data.competition.teamCompetition
          ? (p.team?.name ?? "")
          : (p.team?.users[0].user.fullname ?? ""),
      };
    }),
  };

  return output;
});
