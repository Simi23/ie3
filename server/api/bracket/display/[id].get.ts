import { prisma } from "~/db/prismaClient";
import { catchError } from "~/utils/catchError";
import type { CellData, DisplayBracket } from "~/utils/types";

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
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        competitionId: true,
        numberOfCompetitors: true,

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
                id: true,
                users: {
                  select: { user: { select: { fullname: true } } },
                },
              },
            },
          },
        },
        competition: {
          select: { teamCompetition: true, title: true },
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

  const newOutput: DisplayBracket = {
    id: data.id,
    title: data.title,
    competition: {
      id: data.competitionId,
      title: data.competition.title,
      teamCompetition: data.competition.teamCompetition,
    },
    competitionId: data.competitionId,
    numberOfCompetitors: data.numberOfCompetitors,
    parts: data.parts.map((p) => {
      let team = null;
      if (p.team?.id && p.team?.name) {
        if (data.competition.teamCompetition) {
          team = {
            id: p.team.id,
            name: p.team.name,
          };
        } else if (p.team.users.length == 1) {
          team = {
            id: p.team.id,
            name: p.team.users[0].user.fullname,
          };
        }
      }

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
        bracketId: data.id,
        team: team,
        teamId: p.team?.id ?? null,
        isTracked: p.isTracked,
      };
    }),
  };

  return newOutput;
});
