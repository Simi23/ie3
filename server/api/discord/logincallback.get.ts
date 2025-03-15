import { prisma } from "~/db/prismaClient";
import { catchError } from "~/utils/catchError";
import { logEventAction } from "~/utils/logger";
import { randomBytes } from "crypto";
import { sha256 } from "~/utils/hash";

export default defineEventHandler(async (event) => {
  const q = getQuery(event);
  const cfg = useRuntimeConfig(event);

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
    redirect_uri: `${cfg.public.siteName}/api/discord/logincallback`,
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

  // Check if ID is linked to account
  const [dcGetError, dcGet] = await catchError(
    prisma.user.findFirst({
      where: {
        dcId: userData.id,
      },
    }),
  );

  if (dcGetError || dcGet === null) {
    return sendRedirect(
      event,
      `${cfg.public.siteName}/login?notification=notlinked`,
    );
  }

  const tokenBytes = randomBytes(16);
  const tokenString = tokenBytes.toString("hex");
  const tokenHash = sha256(tokenString);

  // Create session
  const session = await prisma.session.create({
    data: {
      user: {
        connect: {
          id: dcGet.id,
        },
      },
      address: event.context.realIp,
      userAgent: event.context.userAgent,
      token: tokenHash,
    },
  });

  // Log successful login attempt
  logEventAction(event, {
    category: "AUTH",
    severity: "INFO",
    message: `User "${dcGet.username}" (ID: ${dcGet.id}) successfully logged in with Discord. Session ID: "${session.id}"`,
  });

  // Set session cookie
  setCookie(event, "ie-session", tokenString, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return sendRedirect(event, `${cfg.public.siteName}/dashboard`);
});
