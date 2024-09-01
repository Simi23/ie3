import { prisma } from "~/db/prismaClient";

interface Class {
  name: string;
  group: string;
  hidden: boolean;
}

export default defineEventHandler(async (event) => {
  const showHidden = getQuery(event).showhidden == "1";

  const classes = await prisma.classGroup.findMany({});

  if (classes === null) {
    return [] as Class[];
  }
});
