export default defineEventHandler(async (event) => {
  if (event.context.user === undefined || event.context.loggedIn === false) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resource Not Found",
      message: "session-not-found",
    });
  }

  const { adminClass, username } = event.context.user;

  return {
    adminClass: adminClass,
    username: username,
  };
});
