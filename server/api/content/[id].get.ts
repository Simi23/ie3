import { prisma } from "~/db/prismaClient";
import { catchError } from "~/utils/catchError";
import { parseMarkdown } from "@nuxtjs/mdc/runtime";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (id === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  const [error, data] = await catchError(
    prisma.mdContent.findFirst({
      where: {
        id: id,
      },
    }),
  );

  if (error !== undefined || data === null) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "content-not-found",
    });
  }

  const md = await parseMarkdown(data.content);

  return md;
});
