import { prisma } from "~/db/prismaClient";

export default defineEventHandler(async (event) => {
  if (Number(event.context.user?.adminClass ?? 0) < 1) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "access-denied",
    });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullname: true,
      class: true,
      paid: true,
    },
    orderBy: {
      class: "asc",
    },
  });

  return users;
});
