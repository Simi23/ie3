import { prisma } from "~/db/prismaClient";
import type { H3Event, EventHandlerRequest } from "h3";

interface LogParameters {
  clientAddress: string;
  clientUserAgent: string;

  severity: "INFO" | "WARN" | "ERROR";

  category:
    | "INIT"
    | "AUTH"
    | "REGISTRATION"
    | "COMPETITION"
    | "FINANCE"
    | "OPTION"
    | "UPLOAD"
    | "MEDIA"
    | "CONTENT"
    | "TEAM"
    | "INVITE";
  message: string;
}

export async function logAction(params: LogParameters) {
  await prisma.auditLog.create({
    data: {
      ...params,
    },
  });
}

export async function logEventAction(
  event: H3Event<EventHandlerRequest>,
  params: Omit<LogParameters, "clientAddress" | "clientUserAgent">,
) {
  await logAction({
    clientAddress: event.context.realIp,
    clientUserAgent: event.context.userAgent,
    ...params,
  });
}
