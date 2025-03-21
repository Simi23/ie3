import { z } from "zod";
import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";

const schema = z.object({
  bracketPartIdUpper: z.string().cuid(),
  bracketPartIdLower: z.string().cuid(),
});

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const body = await readValidatedBody(event, schema.safeParse);

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  const [error, data] = await catchError(
    prisma.$transaction([
      prisma.bracketPart.updateMany({
        where: {
          isTracked: true,
        },
        data: {
          isTracked: false,
        },
      }),
      prisma.bracketPart.update({
        where: {
          id: body.data.bracketPartIdUpper,
        },
        data: {
          isTracked: true,
        },
      }),
      prisma.bracketPart.update({
        where: {
          id: body.data.bracketPartIdLower,
        },
        data: {
          isTracked: true,
        },
      }),
    ]),
  );

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "error-in-process",
    });
  }

  return {
    notification: createNotification("INFO", {
      message: "Esemény megfigyeltnek jelölve.",
    }),
  };
});
