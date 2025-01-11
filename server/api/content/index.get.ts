import { prisma } from "~/db/prismaClient";

export default defineEventHandler(async (event) => {
  const content = await prisma.mdContent.findMany();

  return content;
});
