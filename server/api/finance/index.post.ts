import { prisma } from "~/db/prismaClient";
import { logEventAction } from "~/utils/logger";
import { financeUpdateSchema } from "~/schemas/financeUpdateSchema";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, financeUpdateSchema.safeParse);

  if (Number(event.context.user?.adminClass ?? 0) < 1) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "access-denied",
    });
  }

  if (body.success === false) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "validation-failed",
    });
  }

  const response = await prisma.user.update({
    where: {
      id: body.data.id,
    },
    data: {
      paid: body.data.paid,
    },
  });

  logEventAction(event, {
    category: "FINANCE",
    severity: "INFO",
    message: `Paid status for "${response.username}" (ID: ${response.id}) set to ${response.paid} by "${event.context.user?.username ?? "NOBODY"}" (ID: ${event.context.user?.id ?? "NO ID"})`,
  });

  return null;
});
