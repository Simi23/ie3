import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";

export type CompetitionReturn = {
  teams: {
    name: string;
    users: {
      user: {
        seat: {
          name: string;
        };
        username: string;
        fullname: string;
      };
      isLeader: boolean;
    }[];
  }[];
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  title: string;
  description: string;
  imageId: string;
  teamCompetition: boolean;
  teamLimit: number;
};

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const id = getRouterParam(event, "id");

  if (id === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  const [error, data] = await catchError(
    prisma.competition.findUnique({
      where: {
        id: id,
      },
      include: {
        teams: {
          select: {
            name: true,
            id: true,
            users: {
              select: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    fullname: true,
                    seat: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
                isLeader: true,
              },
            },
          },
          orderBy: [
            {
              name: "asc",
            },
            {
              id: "asc",
            },
          ],
        },
      },
    }),
  );

  if (error || data === null || data === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  return data;
});
