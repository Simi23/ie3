export default defineEventHandler(async (event) => {
  deleteCookie(event, "ie-session");
  return;
});
