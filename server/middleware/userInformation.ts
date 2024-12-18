import { prisma } from "~/db/prismaClient";
import { sha256 } from "~/utils/hash";

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
    sessionId?: string;
  }
}

export default defineEventHandler(async (event) => {
  // TODO: Speed up by redis
  const sessionTokenString = getCookie(event, "ie-session");

  if (sessionTokenString === undefined) {
    event.context.loggedIn = false;
    return;
  }

  const tokenHash = sha256(sessionTokenString);

  const session = await prisma.session.findUnique({
    where: {
      token: tokenHash,
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
  event.context.sessionId = session.id;
});
