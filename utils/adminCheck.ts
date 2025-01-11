import type { H3Event, EventHandlerRequest } from "h3";

export default function (
  event: H3Event<EventHandlerRequest>,
  minLevel: number,
) {
  if (event.context.user === undefined) {
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
}
