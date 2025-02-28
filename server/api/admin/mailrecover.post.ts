import { z } from "zod";
import { prisma } from "~/db/prismaClient";
import { passwordResetMail } from "~/mail/mail";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

const schema = z.object({
  email: z.string().email(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (uvbody) => {
    return schema.safeParse(uvbody);
  });

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "form-invalid",
    });
  }

  const isAdmin = adminCheck(event, 2, true);

  const [error, data] = await catchError(
    prisma.passwordResetRequest.create({
      data: {
        user: {
          connect: {
            email: body.data.email,
          },
        },
      },
      include: {
        user: {
          select: {
            email: true,
            username: true,
          },
        },
      },
    }),
  );

  if (error) {
    if (!isAdmin) {
      return {
        notification: createNotification("SUCCESS", {
          message: "Jelszó-helyreállító email elküldve!",
        }),
      };
    }
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "user-not-found",
    });
  }

  const tokenLink = `${useRuntimeConfig().public.siteName}/recover?token=${data.token}`;
  passwordResetMail(data.user.email, tokenLink);

  logEventAction(event, {
    category: "ADMIN",
    severity: "INFO",
    message: `${event.context.user?.username ?? "GUEST (not signed in)"} sent a password recovery mail to ${data.user.username}`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Jelszó-helyreállító email elküldve!",
    }),
  };
});
