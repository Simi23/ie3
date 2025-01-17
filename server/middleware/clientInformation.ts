declare module "h3" {
  interface H3EventContext {
    realIp: string;
    userAgent: string;
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const ip =
    getRequestIP(event, {
      xForwardedFor: config.trustProxy == "1",
    }) ?? "unknown-ip";

  const userAgent =
    getRequestHeader(event, "User-Agent") ?? "unknown-user-agent";

  event.context.realIp = ip;
  event.context.userAgent = userAgent;
});
