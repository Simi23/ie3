import { prisma } from "~/db/prismaClient";

export default defineEventHandler(async (event) => {
  const freeSeats = await prisma.seat.findMany({
    where: {
      public: true,
      owner: null,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return freeSeats;
});
