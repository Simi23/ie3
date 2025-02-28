import { z } from "zod";
import { prisma } from "~/db/prismaClient";
import { registerMail } from "~/mail/mail";
import adminCheck from "~/utils/adminCheck";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

const schema = z.object({
  userId: z.string().cuid(),
});

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const body = await readValidatedBody(event, (uvbody) => {
    return schema.safeParse(uvbody);
  });

  if (!body.success) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "user-not-found",
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      id: body.data.userId,
    },
    select: {
      emailToken: true,
      email: true,
      username: true,
    },
  });

  if (user === null) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "user-not-found",
    });
  }

  const tokenLink = `${useRuntimeConfig().public.siteName}/verifymail?token=${user.emailToken}`;
  registerMail(user.email, tokenLink);

  logEventAction(event, {
    category: "ADMIN",
    severity: "INFO",
    message: `${event.context.user?.username} sent a verification mail to ${user.username}`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Megerősítő email elküldve!",
    }),
  };
});
