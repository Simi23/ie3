import { z } from "zod";
import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

const bodySchema = z.object({ queueLink: z.string() });

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const body = await readValidatedBody(event, bodySchema.safeParse);

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  await prisma.option.upsert({
    where: {
      name: "queueLink",
    },
    update: {
      value: body.data.queueLink,
    },
    create: {
      name: "queueLink",
      value: body.data.queueLink,
    },
  });

  logEventAction(event, {
    category: "OPTION",
    severity: "INFO",
    message: `User ${event.context.user?.username} has updated queue link.`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Várólista link frissítése sikeres!",
    }),
  };
});
