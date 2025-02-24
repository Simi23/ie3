import { prisma } from "~/db/prismaClient";
import { userEditSchema } from "~/schemas/userEditSchema";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const body = await readValidatedBody(event, (uvbody) =>
    userEditSchema.safeParse(uvbody),
  );
  const userId = event.context.params?.id ?? "0";

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  const [error, result] = await catchError(
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        email: body.data.email,
        fullname: body.data.fullname,
        adminClass: body.data.adminClass,
        ownPc: body.data.ownPc,
        ethernetPort: body.data.ethernetPort,
        ownChair: body.data.ownChair,
        class: {
          connect: {
            id: body.data.classId,
          },
        },
      },
    }),
  );

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  logEventAction(event, {
    category: "ADMIN",
    severity: "INFO",
    message: `${event.context.user?.username} updated user ${result.username}`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Felhasználó sikeresen frissítve!",
    }),
  };
});
