import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const seats = await prisma.seat.findMany({
    include: {
      owner: {
        select: {
          username: true,
          fullname: true,
        },
      },
    },
  });

  return seats;
});
