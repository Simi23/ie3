import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      fullname: true,
      class: {
        select: {
          name: true,
        },
      },
      seat: {
        select: {
          name: true,
        },
      },
    },
  });

  const formatted = users.map((user) => {
    return {
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      class: user.class.name,
      seat: user.seat.name,
    };
  });

  return formatted;
});
