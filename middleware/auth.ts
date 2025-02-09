const userStore = useUserStore();
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.client) {
    if (userStore.loggedIn) return;

    try {
      const session = await $fetchNotification("/api/user/session");
      userStore.adminClass = session.adminClass;
      userStore.username = session.username;
      userStore.loggedIn = true;
      if (session.id) {
        userStore.userId = session.id;
      }
    } catch {
      return navigateTo("/logout");
    }
  }
});
