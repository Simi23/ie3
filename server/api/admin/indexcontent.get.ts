import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const indexContent = await prisma.option.findUnique({
    where: {
      name: "indexContent",
    },
  });

  if (indexContent === null) {
    return "";
  }

  return indexContent.value as string;
});
