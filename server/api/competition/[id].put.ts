import { prisma } from "~/db/prismaClient";
import { competitionSchema } from "~/schemas/competitionSchema";
import adminCheck from "~/utils/adminCheck";
import { catchError } from "~/utils/catchError";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

export default defineEventHandler(async (event) => {
  adminCheck(event, 2);

  const id = getRouterParam(event, "id");
  const body = await readValidatedBody(event, (body) =>
    competitionSchema.safeParse(body),
  );

  if (id === undefined || !body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  const [error, updatedData] = await catchError(
    prisma.competition.update({
      where: {
        id: id,
      },
      data: {
        title: body.data.title,
        description: body.data.description,
        image: {
          connect: {
            id: body.data.image,
          },
        },
        teamCompetition: body.data.teamCompetition,
        teamLimit: body.data.teamLimit,
      },
    }),
  );

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "unknown-error",
    });
  }

  logEventAction(event, {
    category: "COMPETITION",
    severity: "INFO",
    message: `User ${event.context.user?.username} updated competition ${updatedData.id}.`,
  });

  return {
    notification: createNotification("SUCCESS", {
      message: "Verseny szerkesztése sikeres!",
    }),
  };
});
