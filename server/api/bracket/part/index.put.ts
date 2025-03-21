import { brotliDecompressSync } from "zlib";
import { z } from "zod";
import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";

const schema = z.object({
  started: z.boolean(),
  ended: z.boolean(),
  upper: z.object({
    id: z.string().cuid(),
    won: z.boolean(),
    points: z.array(z.number()),
  }),
  lower: z.object({
    id: z.string().cuid(),
    won: z.boolean(),
    points: z.array(z.number()),
  }),
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
      prisma.bracketPart.update({
        where: {
          id: body.data.upper.id,
        },
        data: {
          started: body.data.started,
          ended: body.data.ended,
          won: body.data.upper.won,
          points: body.data.upper.points,
        },
      }),
      prisma.bracketPart.update({
        where: {
          id: body.data.lower.id,
        },
        data: {
          started: body.data.started,
          ended: body.data.ended,
          won: body.data.lower.won,
          points: body.data.lower.points,
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
    notification: createNotification("SUCCESS", {
      message: "Keret frissítve.",
    }),
  };
});
