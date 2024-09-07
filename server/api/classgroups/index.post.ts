import adminCheck from "~/utils/adminCheck";
import { classGroupSchema } from "~/schemas/classGroupSchema";
import { prisma } from "~/db/prismaClient";
import createNotification from "~/utils/createNotification";

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const body = await readBody(event);
  const parsedBody = classGroupSchema.safeParse(body);

  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "form-invalid",
    });
  }

  try {
    await prisma.classGroup.create({
      data: {
        name: parsedBody.data.name,
        year: parsedBody.data.year,
        hidden: parsedBody.data.hidden,
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
      message: "Évfolyam sikeresen létrehozva!",
    }),
  };
});
