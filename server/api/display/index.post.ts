import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const [countError, count] = await catchError(prisma.displayContent.count());

  if (countError) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "error-in-process",
    });
  }

  const [error, data] = await catchError(
    prisma.displayContent.create({
      data: {
        order: count + 1,
        type: "ShortText",
        name: "Új oldal",
        displayTimeMs: 5000,
        showProgress: false,
        shortText: "",
      },
    }),
  );

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "error-in-process",
    });
  }

  return {
    notification: createNotification("SUCCESS", {
      message: "Oldal létrehozása sikeres!",
    }),
  };
});
