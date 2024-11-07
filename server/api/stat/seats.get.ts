import { prisma } from "~/db/prismaClient";

export default defineEventHandler(async (event) => {
  let totalSeats = prisma.seat.count({
    where: {
      public: true,
    },
  });
  let freeSeats = prisma.seat.count({
    where: {
      public: true,
      owner: null,
    },
  });

  const results = await Promise.allSettled([totalSeats, freeSeats]);

  const cTotal = results[0].status == "fulfilled" ? results[0].value : 0;
  const cFree = results[1].status == "fulfilled" ? results[1].value : 0;

  return {
    totalSeats: cTotal,
    freeSeats: cFree,
    occupiedSeats: cTotal - cFree,
  };
});
