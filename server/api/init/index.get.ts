import { prisma } from "~/db/prismaClient";

export default defineEventHandler(async () => {
  const initDone = await prisma.option.findFirst({
    where: {
      name: "initDone",
    },
  });

  if (initDone == null) {
    await prisma.option.create({
      data: {
        name: "initDone",
        value: false,
      },
    });

    return false;
  }

  if (typeof initDone.value !== "boolean" || initDone.value === true) {
    return true;

    // throw createError({
    //   statusCode: 406,
    //   statusMessage: "Not Acceptable",
    //   message: "Init already done",
    // });
  }

  return false;
});
