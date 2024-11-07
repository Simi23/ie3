import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

interface SchoolPC {
  schoolpc: number;
}

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const body = (await readBody(event)) as SchoolPC;

  if (body == null || body.schoolpc === null) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "validation-failed",
    });
  }

  await prisma.option.upsert({
    where: {
      name: "schoolPC",
    },
    update: {
      value: body.schoolpc,
    },
    create: {
      name: "schoolPC",
      value: body.schoolpc,
    },
  });

  logEventAction(event, {
    category: "OPTION",
    severity: "INFO",
    message: `User ${event.context.user?.username} has updated schoolPC to ${body.schoolpc}.`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Iskolai PC-k megváltoztatása sikeres!",
    }),
  };
});
