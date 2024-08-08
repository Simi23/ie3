export default defineEventHandler(async (event) => {
  throw createError({
    statusCode: 400,
    statusMessage: "Bad request",
    message: "unknown-error",
  });
});
