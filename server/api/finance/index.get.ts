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
      paid: true,
      class: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      class: {
        name: "asc",
      },
    },
  });

  const formatted = users.map((user) => {
    return {
      id: user.id,
      fullname: user.fullname,
      paid: user.paid,
      class: user.class.name,
    };
  });

  return formatted;
});
