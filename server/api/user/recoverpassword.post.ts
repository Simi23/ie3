import { z } from "zod";
import { prisma } from "~/db/prismaClient";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";
import * as argon2 from "argon2";

const schema = z.object({
  token: z.string().uuid(),
  newPassword: z.string().min(8),
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

  const [error, user] = await catchError(
    prisma.user.findFirst({
      where: {
        passwordResetRequests: {
          some: {
            token: body.data.token,
            valid: true,
          },
        },
      },
    }),
  );

  if (error || user === null) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "token-invalid",
    });
  }

  const [invalidateError, pwReset] = await catchError(
    prisma.passwordResetRequest.update({
      where: {
        token: body.data.token,
      },
      data: {
        valid: false,
      },
    }),
  );

  if (invalidateError) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "token-invalid",
    });
  }

  const hashedPassword = await argon2.hash(body.data.newPassword, {
    type: argon2.argon2id,
  });

  const [updateError, result] = await catchError(
    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash: hashedPassword,
      },
    }),
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
    message: `${user.username} recovered their password.`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Jelszó sikeresen frissítve!",
    }),
  };
});
