import { $Enums, Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";

const schema = z.object({
  contents: z.array(
    z.object({
      id: z.string().cuid(),
      order: z.number(),
      name: z.string(),
      displayTimeMs: z.number(),
      showProgress: z.boolean(),
      type: z.enum([
        "ShortText",
        "FormattedText",
        "Bracket",
        "Media",
        "TopList",
      ]),
      content: z.string(),
    }),
  ),
});

type Schema = z.output<typeof schema>;

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const body = await readValidatedBody(event, schema.safeParse);

  if (body.error || !body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "error-in-process",
    });
  }

  const updates = buildPromises(body.data);

  const [error, data] = await catchError(prisma.$transaction(updates));

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "error-in-process",
    });
  }

  return {
    notification: createNotification("SUCCESS", {
      message: "Kijelző frissítése sikeres!",
    }),
  };
});

function buildPromises(data: Schema) {
  const updates: Prisma.PrismaPromise<any>[] = [];

  for (const c of data.contents) {
    switch (c.type) {
      case "Bracket":
        updates.push(
          prisma.displayContent.update({
            where: {
              id: c.id,
            },
            data: {
              order: c.order,
              name: c.name,
              displayTimeMs: c.displayTimeMs,
              showProgress: c.showProgress,
              type: "Bracket",
              bracket: {
                connect: {
                  id: c.content,
                },
              },
            },
          }),
        );
        break;
      case "FormattedText":
        updates.push(
          prisma.displayContent.update({
            where: {
              id: c.id,
            },
            data: {
              order: c.order,
              name: c.name,
              displayTimeMs: c.displayTimeMs,
              showProgress: c.showProgress,
              type: "FormattedText",
              formattedText: {
                connect: {
                  id: c.content,
                },
              },
            },
          }),
        );
        break;
      case "Media":
        updates.push(
          prisma.displayContent.update({
            where: {
              id: c.id,
            },
            data: {
              order: c.order,
              name: c.name,
              displayTimeMs: c.displayTimeMs,
              showProgress: c.showProgress,
              type: "Media",
              media: {
                connect: {
                  id: c.content,
                },
              },
            },
          }),
        );
        break;
      case "ShortText":
        updates.push(
          prisma.displayContent.update({
            where: {
              id: c.id,
            },
            data: {
              order: c.order,
              name: c.name,
              displayTimeMs: c.displayTimeMs,
              showProgress: c.showProgress,
              type: "ShortText",
              shortText: c.content,
            },
          }),
        );
        break;
      case "TopList":
        updates.push(
          prisma.displayContent.update({
            where: {
              id: c.id,
            },
            data: {
              order: c.order,
              name: c.name,
              displayTimeMs: c.displayTimeMs,
              showProgress: c.showProgress,
              type: "TopList",
              topList: {
                connect: {
                  id: c.content,
                },
              },
            },
          }),
        );
        break;

      default:
        break;
    }
  }

  return updates;
}
