import { prisma } from "~/db/prismaClient";

export default defineEventHandler(async (event) => {
  const showHidden = getQuery(event).showhidden == "1";

  if (showHidden) {
    const classGroups = await prisma.classGroup.findMany({
      select: {
        id: true,
        name: true,
        year: true,
        hidden: true,
        classes: {
          select: {
            id: true,
            name: true,
            hidden: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
      orderBy: {
        year: "asc",
      },
    });

    return classGroups;
  }

  const classGroups = await prisma.classGroup.findMany({
    select: {
      id: true,
      name: true,
      year: true,
      hidden: true,
      classes: {
        select: {
          id: true,
          name: true,
          hidden: true,
        },
        orderBy: {
          name: "asc",
        },
        where: {
          hidden: false,
        },
      },
    },
    where: {
      hidden: false,
    },
    orderBy: {
      year: "asc",
    },
  });

  return classGroups;
});
