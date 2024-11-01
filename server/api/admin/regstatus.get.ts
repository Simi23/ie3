import { prisma } from "~/db/prismaClient";

export default defineEventHandler(async (event) => {
  const response = await prisma.option.findFirst({
    where: {
      name: "registrationStatus",
    },
  });

  return Number(response?.value) ?? 0;
});
