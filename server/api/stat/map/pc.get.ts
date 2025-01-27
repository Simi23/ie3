import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const seats = await prisma.seat.findMany({
    where: {
      public: true,
      owner: {
        isNot: null,
      },
    },
    select: {
      name: true,
      owner: {
        select: {
          id: true,
          ownPc: true,
          fullname: true,
          class: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const mapped = seats.map((s) => {
    return {
      name: s.name,
      owner: {
        id: s.owner?.id ?? "",
        fullname: s.owner?.fullname ?? "",
        classname: s.owner?.class.name ?? "",
      },
      stat: s.owner?.ownPc ?? false,
    };
  });

  return mapped;
});
