export default defineEventHandler(async () => {
  throw createError({
    statusCode: 400,
    statusMessage: "Bad request",
    message: "unknown-error",
  });
});
