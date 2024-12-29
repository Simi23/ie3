import { prisma } from "~/db/prismaClient";

export default defineEventHandler(async (event) => {
  const media = await prisma.media.findMany();

  return media;
});
