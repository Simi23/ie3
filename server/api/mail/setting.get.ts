import { prisma } from "~/db/prismaClient";
import type { MailSettingSchema } from "~/schemas/mailSettingSchema";

export default defineEventHandler(async (event) => {
  if (Number(event.context.user?.adminClass ?? 0) < 2) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "access-denied",
    });
  }

  const setting = await prisma.option.findFirst({
    where: {
      name: "email",
    },
  });

  if (setting == null) {
    return {
      host: "",
      port: 1,
      secure: false,
      user: "",
      password: "",
      from: "",
    } as MailSettingSchema;
  }

  let result = setting.value as MailSettingSchema;
  result.password = "";

  return result;
});
