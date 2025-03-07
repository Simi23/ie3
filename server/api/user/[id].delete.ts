import { prisma } from "~/db/prismaClient";
import { userEditSchema } from "~/schemas/userEditSchema";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const userId = event.context.params?.id ?? "0";

  const [error, result] = await catchError(
    prisma.$transaction([
      prisma.team.deleteMany({
        where: {
          users: {
            some: {
              userId: userId,
              isLeader: true,
            },
          },
        },
      }),
      prisma.user.delete({
        where: {
          id: userId,
        },
      }),
    ]),
  );

  if (error) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "user-not-found",
    });
  }

  logEventAction(event, {
    category: "ADMIN",
    severity: "INFO",
    message: `${event.context.user?.username} deleted user ${result[1].username}`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Felhasználó sikeresen törölve!",
    }),
  };
});
