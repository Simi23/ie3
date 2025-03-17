import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const rulesContent = await prisma.option.findUnique({
    where: {
      name: "rulesContent",
    },
  });

  if (rulesContent === null) {
    return "";
  }

  return rulesContent.value as string;
});
