import { prisma } from "~/db/prismaClient";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.token) {
    return -1;
  }

  try {
    await prisma.user.update({
      where: {
        emailToken: body.token,
      },
      data: {
        emailVerified: true,
      },
    });
  } catch (error) {
    return -2;
  }

  return 0;
});
