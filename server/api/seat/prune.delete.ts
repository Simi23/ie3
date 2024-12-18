import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const deleted = await prisma.seat.deleteMany({
    where: {
      owner: null,
    },
  });

  logEventAction(event, {
    category: "OPTION",
    severity: "INFO",
    message: `User ${event.context.user?.username} has deleted ${deleted.count} seats.`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: `${deleted.count} db ülőhely sikeresen törölve!`,
    }),
  };
});
