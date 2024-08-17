import { prisma } from "~/db/prismaClient";

interface UserData {
  id: string;
  email: string;
  adminClass: number;
  username: string;
}

declare module "h3" {
  interface H3EventContext {
    loggedIn: boolean;
    user?: UserData;
  }
}

export default defineEventHandler(async (event) => {
  // TODO: Speed up by redis
  const sessionCookie = getCookie(event, "ie-session");

  if (sessionCookie === undefined) {
    event.context.loggedIn = false;
    return;
  }

  const session = await prisma.session.findUnique({
    where: {
      id: sessionCookie,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
          adminClass: true,
        },
      },
    },
  });

  const now = new Date(Date.now());

  // If session doesn't exist or is invalid or expired
  if (session === null || session.valid === false || now > session.expiresAt) {
    event.context.loggedIn = false;
    return;
  }

  event.context.loggedIn = true;
  event.context.user = session.user;
});
