import adminCheck from "~/utils/adminCheck";
import { classSchema } from "~/schemas/classSchema";
import { prisma } from "~/db/prismaClient";
import createNotification from "~/utils/createNotification";

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const body = await readBody(event);
  const parsedBody = classSchema.safeParse(body);

  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "form-invalid",
    });
  }

  try {
    await prisma.class.create({
      data: {
        name: parsedBody.data.name,
        hidden: parsedBody.data.hidden,
        group: {
          connect: {
            id: parsedBody.data.groupId,
          },
        },
      },
    });
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "unknown-error",
    });
  }

  return {
    notification: createNotification("SUCCESS", {
      message: "Osztály sikeresen létrehozva!",
    }),
  };
});
