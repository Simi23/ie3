import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import createNotification from "~/utils/createNotification";

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const id = getRouterParam(event, "id");

  if (id === undefined) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "classgroup-not-found",
    });
  }

  try {
    await prisma.classGroup.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "classgroup-not-found",
    });
  }

  return {
    notification: createNotification("SUCCESS", {
      message: "Az évfolyam sikeresen törlésre került!",
    }),
  };
});
