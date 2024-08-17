import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
  const username = ref<String>("");
  const loggedIn = ref<Boolean>(false);
  const adminClass = ref<Number>(0);

  function logout() {
    username.value = "";
    loggedIn.value = false;
    adminClass.value = 0;
  }

  return { username, loggedIn, adminClass, logout };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
