import type { H3Event, EventHandlerRequest } from "h3";

export default function (
  event: H3Event<EventHandlerRequest>,
  minLevel: number,
) {
  if (Number(event.context.user?.adminClass ?? 0) < minLevel) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "access-denied",
    });
  }
}
