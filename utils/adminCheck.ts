import type { H3Event, EventHandlerRequest } from "h3";

export default function (
  event: H3Event<EventHandlerRequest>,
  minLevel: number,
  passThru?: boolean,
) {
  if (event.context.user === undefined) {
    if (passThru) return false;
    logEventAction(event, {
      category: "AUTH",
      severity: "WARN",
      message: `Client ${event.context.clientAddress ?? "unknown-ip"} tried to access endpoint ${event.path}`,
    });
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "access-denied",
    });
  }

  if (Number(event.context.user.adminClass ?? 0) < minLevel) {
    if (passThru) return false;
    logEventAction(event, {
      category: "AUTH",
      severity: "WARN",
      message: `Unauthenticated user ${event.context.user.username} tried to access endpoint ${event.path}`,
    });
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "access-denied",
    });
  }

  if (passThru) return true;
}
