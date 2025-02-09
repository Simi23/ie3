import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";

export default defineEventHandler(async (event) => {
  const userId = event.context.params?.id ?? "0";

  if (event.context.user === undefined || event.context.user.id !== userId) {
    adminCheck(event, 2);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      createdAt: true,
      email: true,
      username: true,
      fullname: true,
      class: {
        select: {
          name: true,
        },
      },
      adminClass: true,
      sessions: {
        select: {
          id: true,
          createdAt: true,
          expiresAt: true,
          valid: true,
          address: true,
          userAgent: true,
        },
      },
      ownPc: true,
      ethernetPort: true,
      ownChair: true,
      teams: {
        select: {
          isLeader: true,
          team: {
            select: {
              name: true,
              competition: {
                select: {
                  id: true,
                  title: true,
                  teamCompetition: true,
                },
              },
            },
          },
        },
      },
      seat: {
        select: {
          name: true,
          public: true,
        },
      },
      paid: true,
    },
  });

  if (user == null) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "user-not-found",
    });
  }

  return user;
});
