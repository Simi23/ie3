import bcrypt from "bcrypt";
import { prisma } from "~/db/prismaClient";
import { loginStage2Schema } from "~/schemas/loginSchemas";
import createNotification from "~/utils/createNotification";
import { logEventAction } from "~/utils/logger";

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event);
  const body = loginStage2Schema.safeParse(rawBody);

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "form-invalid",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      username: body.data.username,
    },
  });
  // Validate if user exists
  if (user === null) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "user-invalid",
    });
  }

  const pw = await bcrypt.compare(body.data.password, user.passwordHash);
  // Check if password matches
  if (pw === false) {
    // Log unsuccessful login attempt
    logEventAction(event, {
      category: "AUTH",
      severity: "WARN",
      message: `An unsuccessful login attempt was made to user "${user.username}" (ID: ${user.id}).`,
    });

    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "user-invalid",
    });
  }

  // Create session
  const session = await prisma.session.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      address: event.context.realIp,
      userAgent: event.context.userAgent,
    },
  });

  // Log successful login attempt
  logEventAction(event, {
    category: "AUTH",
    severity: "INFO",
    message: `User "${user.username}" (ID: ${user.id}) successfully logged in. Session ID: "${session.id}"`,
  });

  // Set session cookie
  setCookie(event, "ie-session", session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  // Send success message
  return {
    notification: createNotification("SUCCESS", {
      message: "Belépés sikeres!",
    }),
  };
});
