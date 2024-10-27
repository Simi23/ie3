import { prisma } from "~/db/prismaClient";
import { mailSettingSchema } from "~/schemas/mailSettingSchema";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

export default defineEventHandler(async (event) => {
  if (Number(event.context.user?.adminClass ?? 0) < 2) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "access-denied",
    });
  }

  const body = await readBody(event);
  body.from = decodeURIComponent(body.from);

  const validatedBody = mailSettingSchema.safeParse(body);

  if (!validatedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "validation-failed",
    });
  }

  await prisma.option.upsert({
    where: {
      name: "email",
    },
    update: {
      value: validatedBody.data,
    },
    create: {
      name: "email",
      value: validatedBody.data,
    },
  });

  logEventAction(event, {
    category: "OPTION",
    severity: "INFO",
    message: `User "${event.context.user?.username}" changed email settings.`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Email beállítások módosítása sikeres!",
    }),
  };
});
