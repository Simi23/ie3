import { prisma } from "~/db/prismaClient";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const id = getRouterParam(event, "id");

  if (id === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  const [error, data] = await catchError(
    prisma.bracket.findFirst({
      where: {
        id: id,
      },
      include: {
        competition: true,
        parts: {
          include: {
            team: true,
          },
        },
      },
    }),
  );

  if (error || data === null) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "error-in-process",
    });
  }

  return data;
});
