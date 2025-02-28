import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";
import { newUserSchema } from "~/schemas/newUserSchema";

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const body = await readValidatedBody(event, (uvbody) => {
    return newUserSchema.safeParse(uvbody);
  });

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "form-invalid",
    });
  }

  const [error, newUser] = await catchError(
    prisma.user.create({
      data: {
        email: body.data.email,
        username: body.data.username,
        fullname: body.data.fullname,
        ownPc: body.data.ownPc,
        ethernetPort: body.data.ethernetPort,
        ownChair: body.data.ownChair,
        classId: body.data.classId,
        seatId: body.data.seatId,
        passwordHash: "invalid",
      },
    }),
  );

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "form-invalid",
    });
  }

  logEventAction(event, {
    category: "ADMIN",
    severity: "INFO",
    message: `User ${event.context.user?.username} created new user ${newUser.username}`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Felhasználó létrehozása sikeres!",
    }),
  };
});
