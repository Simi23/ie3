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
          id: true,
          class: {
            select: { name: true },
          },
          ownPc: true,
          ethernetPort: true,
          ownChair: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return seats;
});
