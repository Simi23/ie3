import { prisma } from "~/db/prismaClient";

export default defineEventHandler(async (event) => {
  const classes = await prisma.class.findMany({
    select: {
      id: true,
      name: true,
      hidden: true,
      group: {
        select: {
          name: true,
        },
      },
    },
  });

  return classes.map((c) => {
    return {
      id: c.id,
      name: c.name,
      hidden: c.hidden,
      group: c.group.name,
    };
  });
});
