import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";
import { z } from "zod";
import * as argon2 from "argon2";

const passwordSchema = z.object({
  password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const body = await readValidatedBody(event, (uvbody) =>
    passwordSchema.safeParse(uvbody),
  );
  const userId = event.context.params?.id ?? "0";

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "password-length",
    });
  }

  const hashedPassword = await argon2.hash(body.data.password, {
    type: argon2.argon2id,
  });

  const [error, result] = await catchError(
    prisma.user.update({
      where: {
        id: userId,
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
    message: `${event.context.user?.username} updated password of user ${result.username}`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Felhasználó jelszava sikeresen frissítve!",
    }),
  };
});
