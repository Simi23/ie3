import createNotification from "~/utils/createNotification";
import { testMail, lastCallMail } from "~/mail/mail";
import { z } from "zod";
import adminCheck from "~/utils/adminCheck";
import { prisma } from "~/db/prismaClient";
import { mailLimiter } from "~/utils/limiter";

const schema = z.object({
  openTime: z.string().min(1),
  startTime: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const body = await readValidatedBody(event, (uvbody) => {
    return schema.safeParse(uvbody);
  });

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "validation-failed",
    });
  }

  const users = await prisma.user.findMany({
    select: {
      email: true,
      seat: {
        select: {
          name: true,
        },
      },
    },
  });

  console.log(`Sending email to ${users.length} users...`);
  sendAllMails(users, body.data.openTime, body.data.startTime);

  return {
    notification: createNotification("SUCCESS", {
      message: "Email elküldve!",
    }),
  };
});

type UserList = {
  seat: {
    name: string;
  };
  email: string;
}[];

async function sendAllMails(
  users: UserList,
  openTime: string,
  startTime: string,
) {
  for (const user of users) {
    await mailLimiter.removeTokens(1);
    await lastCallMail(user.email, user.seat.name, openTime, startTime);
  }
}
