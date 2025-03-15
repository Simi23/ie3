import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
  const username = ref<string>("");
  const loggedIn = ref<boolean>(false);
  const userId = ref<string>("");
  const adminClass = ref<number>(0);

  function logout() {
    username.value = "";
    loggedIn.value = false;
    userId.value = "";
    adminClass.value = 0;
  }

  return { username, loggedIn, userId, adminClass, logout };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
