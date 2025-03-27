import { prisma } from "~/db/prismaClient";

export default defineEventHandler(async (event) => {
  const queueLink = await prisma.option.findUnique({
    where: {
      name: "queueLink",
    },
  });

  if (queueLink === null) {
    return "";
  }

  return queueLink.value as string;
});
