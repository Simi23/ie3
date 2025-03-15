<template>
  <div
    class="flex flex-col flex-nowrap gap-5 py-5 md:gap-7 md:py-7 lg:gap-10 lg:py-10"
  >
    <div
      class="flex flex-row flex-wrap justify-evenly gap-5 px-5 md:px-7 lg:px-10"
    >
      <UserCard :user-id="userStore.userId" />
      <UserMapCard :user-id="userStore.userId" />
    </div>

    <div class="px-5 md:px-7 lg:px-10">
      <DiscordAuthCard />
    </div>

    <div class="px-5 md:px-7 lg:px-10">
      <UserSessionCard :user-id="userStore.userId" />
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const toast = useToast();
const route = useRoute();
const userStore = useUserStore();

onMounted(async () => {
  await nextTick();
  if (route.query.notification == "alreadylinked") {
    toast.add({
      title: "Hiba",
      description:
        "Ez a Discord fiók már egy másik felhasználóhoz lett csatolva!",
      icon: "i-heroicons-x-mark-20-solid",
      color: "amber",
    });
  } else if (route.query.notification == "linkerror") {
    toast.add({
      title: "Hiba",
      description: "Összekapcsolás sikertelen!",
      icon: "i-heroicons-x-mark-20-solid",
      color: "amber",
    });
  }
});
</script>

<style></style>
