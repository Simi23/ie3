import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

interface RegistrationStatus {
  registrationStatus: number;
}

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const data = (await readBody(event)) as RegistrationStatus;

  if (data.registrationStatus == null || data.registrationStatus == undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "unknown-error",
    });
  }

  const status = Number(data.registrationStatus);

  await prisma.option.upsert({
    create: {
      name: "registrationStatus",
      value: status,
    },
    where: {
      name: "registrationStatus",
    },
    update: {
      value: status,
    },
  });

  logEventAction(event, {
    category: "OPTION",
    severity: "INFO",
    message: `User ${event.context.user?.username} has updated registrationStatus to ${status}.`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Regisztrációs állapot megváltoztatása sikeres!",
    }),
  };
});
