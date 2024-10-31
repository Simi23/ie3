import createNotification from "~/utils/createNotification";
import { testMail } from "~/mail/mail";

export default defineEventHandler(async (event) => {
  if (Number(event.context.user?.adminClass ?? 0) < 2) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "access-denied",
    });
  }

  await testMail(event.context.user?.email ?? "");

  // logEventAction(event, {
  //   category: "OPTION",
  //   severity: "INFO",
  //   message: `User "${event.context.user?.username}" changed email settings.`,
  // });

  return {
    notification: createNotification("SUCCESS", {
      message: "Email elküldve!",
    }),
  };
});
