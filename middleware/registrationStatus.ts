export default defineNuxtRouteMiddleware(async (to, from) => {
  const result = await $fetch("/api/stat/registration");

  if (result != 1 && to.path == "/register") {
    return navigateTo(`/regclosed?r=${result}`);
  } else if (to.path.startsWith("/regclosed")) {
  }
});
