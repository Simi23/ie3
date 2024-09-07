const userStore = useUserStore();
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.client) {
    if (userStore.loggedIn) return navigateTo("/dashboard");

    try {
      const session = await $fetch("/api/user/session");
      userStore.adminClass = session.adminClass;
      userStore.username = session.username;
      userStore.loggedIn = true;

      if (to.path == "/") {
        return navigateTo("/dashboard");
      }
    } catch {
      return navigateTo("/logout");
    }
  }
});
