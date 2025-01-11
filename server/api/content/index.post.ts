import { z } from "zod";
import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

const bodySchema = z.object({
  title: z.string(),
  text: z.string(),
});

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

  const [error, newData] = await catchError(
    prisma.mdContent.create({
      data: {
        name: body.data.title,
        content: body.data.text,
      },
    }),
  );

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "unknown-error",
    });
  }

  logEventAction(event, {
    category: "CONTENT",
    severity: "INFO",
    message: `User ${event.context.user?.username} uploaded content ${newData.id}.`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Tartalom léthozása sikeres!",
    }),
  };
});
