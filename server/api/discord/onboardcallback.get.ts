import { prisma } from "~/db/prismaClient";
import { catchError } from "~/utils/catchError";

export default defineEventHandler(async (event) => {
  const q = getQuery(event);
  const cfg = useRuntimeConfig(event);

  if (event.context.user === undefined) {
    return sendRedirect(event, `${cfg.public.siteName}`);
  }

  if (!q.code) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "request-body-invalid",
    });
  }

  const auth = Buffer.from(
    cfg.discord.clientId + ":" + cfg.discord.clientSecret,
  ).toString("base64");

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept-Encoding": "application/x-www-form-urlencoded",
    Authorization: `Basic ${auth}`,
  };

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code: String(q.code),
    redirect_uri: `${cfg.public.siteName}/api/discord/onboardcallback`,
  });

  const [error, response] = await catchError(
    $fetch<Record<string, string>>("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: headers,
      body: params,
    }),
  );

  if (error) {
    console.error(error);
    return;
  }

  const access_token = response["access_token"];

  const [userError, userData] = await catchError(
    $fetch<Record<string, string>>("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }),
  );

  if (userError) {
    console.error(error);
    return;
  }

  // id, global_name, avatar

  // Check if ID is already linked to Discord account
  const [dcGetError, dcGet] = await catchError(
    prisma.user.findFirst({
      where: {
        dcId: userData.id,
      },
    }),
  );

  if (dcGetError || dcGet) {
    return sendRedirect(
      event,
      `${cfg.public.siteName}/dashboard/settings?notification=alreadylinked`,
    );
  }

  const [linkError, linkResult] = await catchError(
    prisma.user.update({
      where: {
        id: event.context.user.id,
      },
      data: {
        dcConnected: true,
        dcId: userData.id,
        dcAvatar: userData.avatar,
        dcGlobalName: userData.global_name,
      },
    }),
  );

  if (linkError) {
    return sendRedirect(
      event,
      `${cfg.public.siteName}/dashboard/settings?notification=linkerror`,
    );
  }

  return sendRedirect(event, `${cfg.public.siteName}/dashboard/settings`);
});
