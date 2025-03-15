import { z } from "zod";
import { prisma } from "~/db/prismaClient";
import { newSeatMail } from "~/mail/mail";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

const schema = z.object({
  userId: z.string().cuid(),
  newSeatName: z.string(),
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

  const notifications: {
    email: string;
    newSeat: string;
  }[] = [];

  // Check if current new seat is currently occupied
  const newSeat = await prisma.seat.findUnique({
    where: {
      name: body.data.newSeatName,
    },
    include: {
      owner: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  // Get the current seat of the user
  const currentSeat = await prisma.seat.findFirst({
    where: {
      owner: {
        id: body.data.userId,
      },
    },
    include: {
      owner: {
        select: {
          email: true,
        },
      },
    },
  });

  if (currentSeat == null || newSeat == null) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "validation-failed",
    });
  }

  if (newSeat.owner !== null) {
    const [error, data] = await catchError(
      handleFullSwap(
        body.data.userId,
        newSeat.owner.id,
        currentSeat.id,
        newSeat.id,
      ),
    );

    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "modification-failed",
      });
    }

    notifications.push({
      email: currentSeat.owner?.email ?? "",
      newSeat: newSeat.name,
    });
    notifications.push({
      email: newSeat.owner.email,
      newSeat: currentSeat.name,
    });

    sendSeatMails(notifications);

    logEventAction(event, {
      category: "ADMIN",
      severity: "INFO",
      message: `${event.context.user?.username} swapped users ${body.data.userId} (${currentSeat.name}) <=> ${newSeat.owner.id} (${body.data.newSeatName}).`,
    });

    return {
      notification: createNotification("SUCCESS", {
        message: "Felhasználók cseréje sikeres!",
      }),
    };
  } else {
    const [error, data] = await catchError(
      prisma.user.update({
        where: {
          id: body.data.userId,
        },
        data: {
          seat: {
            connect: {
              id: newSeat.id,
            },
          },
        },
        include: {
          seat: {
            select: {
              name: true,
            },
          },
        },
      }),
    );

    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "modification-failed",
      });
    }

    notifications.push({
      email: data.email,
      newSeat: data.seat.name,
    });
    sendSeatMails(notifications);

    logEventAction(event, {
      category: "ADMIN",
      severity: "INFO",
      message: `${event.context.user?.username} moved user ${body.data.userId} to ${body.data.newSeatName}.`,
    });

    return {
      notification: createNotification("SUCCESS", {
        message: "Felhasználó átültetése sikeres!",
      }),
    };
  }
});

async function handleFullSwap(
  user1: string,
  user2: string,
  seat1: string,
  seat2: string,
) {
  const [r1, r2, r3] = await prisma.$transaction([
    prisma.user.update({
      where: { id: user1 },
      data: { seat: { connect: { name: "SWAP" } } },
    }),
    prisma.user.update({
      where: { id: user2 },
      data: { seat: { connect: { id: seat1 } } },
    }),
    prisma.user.update({
      where: { id: user1 },
      data: { seat: { connect: { id: seat2 } } },
    }),
  ]);
}

async function sendSeatMails(
  notifications: { email: string; newSeat: string }[],
) {
  for (const user of notifications) {
    await newSeatMail(user.email, user.newSeat);
  }
}
