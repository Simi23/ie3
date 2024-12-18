import { prisma } from "~/db/prismaClient";

export default defineEventHandler(async (event) => {
  deleteCookie(event, "ie-session");

  if (!event.context.loggedIn || event.context.sessionId === undefined) {
    return;
  }

  await prisma.session.update({
    where: {
      id: event.context.sessionId,
    },
    data: {
      valid: false,
    },
  });

  return;
});
