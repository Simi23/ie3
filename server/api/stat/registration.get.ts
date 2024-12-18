import { prisma } from "~/db/prismaClient";

export default defineEventHandler(async (event) => {
  const result = await prisma.option.findFirst({
    where: {
      name: "registrationStatus",
    },
  });

  if (result == null) return 0;

  return Number(result.value);
});
