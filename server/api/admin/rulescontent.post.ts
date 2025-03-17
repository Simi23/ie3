import { z } from "zod";
import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

const bodySchema = z.object({ id: z.string() });

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const body = await readValidatedBody(event, (body) =>
    bodySchema.safeParse(body),
  );

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  await prisma.option.upsert({
    where: {
      name: "rulesContent",
    },
    update: {
      value: body.data.id,
    },
    create: {
      name: "rulesContent",
      value: body.data.id,
    },
  });

  logEventAction(event, {
    category: "OPTION",
    severity: "INFO",
    message: `User has updated rules content.`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Szabályzat tartalmának frissítése sikeres!",
    }),
  };
});
