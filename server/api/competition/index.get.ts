import { prisma } from "~/db/prismaClient";

export type CompetitionResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  title: string;
  description: string;
  imageId: string;
  imageUrl: string;
  teamCompetition: boolean;
  teamLimit: number;
  teamCount: number;
};

export default defineEventHandler(async (event) => {
  const competitions = await prisma.competition.findMany({
    include: {
      _count: {
        select: {
          teams: true,
        },
      },
      image: {
        select: {
          url: true,
        },
      },
    },
  });

  const mapped = competitions.map((c) => {
    return {
      id: c.id,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      title: c.title,
      description: c.description,
      imageId: c.imageId,
      imageUrl: c.image.url,
      teamCompetition: c.teamCompetition,
      teamLimit: c.teamLimit,
      teamCount: c._count.teams,
    };
  });

  return mapped;
});
