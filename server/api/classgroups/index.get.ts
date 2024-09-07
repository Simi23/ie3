import { prisma } from "~/db/prismaClient";

export default defineEventHandler(async (event) => {
  const classGroups = await prisma.classGroup.findMany({
    select: {
      id: true,
      name: true,
      year: true,
      hidden: true,
    },
    orderBy: {
      year: "asc",
    },
  });

  return classGroups;
});
