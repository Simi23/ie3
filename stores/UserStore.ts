import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
  const name = ref<String>("");
  const loggedIn = ref<Boolean>(false);

  return { name, loggedIn };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
