<template>
  <div class="flex justify-between dark:bg-gray-900">
    <NuxtImg
      src="/logowide.png"
      draggable="false"
      class="ml-3 h-12 select-none pb-3 pt-2"
    />

    <UHorizontalNavigation :links="links" class="mr-4 w-fit" />
  </div>
</template>

<script lang="ts" setup>
const userStore = useUserStore();
const requestUrl = useRequestURL();

const links = ref<any[]>([
  {
    label: "Kezdőlap",
    to: "/dashboard",
    icon: "i-heroicons-home-solid",
  },
  {
    label: "Versenyek",
    to: "/dashboard/competitions",
    icon: "i-heroicons-trophy-solid",
  },
  {
    label: "Meghívók",
    to: "/dashboard/invites",
    icon: "i-heroicons-envelope-solid",
  },
  {
    label: "Fiókom",
    to: "/dashboard/settings",
    icon: "i-heroicons-user-solid",
  },
  {
    label: "Kilépés",
    to: "/logout",
    icon: "i-heroicons-arrow-right-on-rectangle-solid",
  },
]);

if (userStore.adminClass.valueOf() > 0) {
  links.value.splice(4, 0, {
    label: "Adminisztráció",
    to: "/dashboard/admin",
    icon: "i-heroicons-users-solid",
    active: requestUrl.pathname.startsWith("/dashboard/admin"),
  });
}
</script>

<style scoped>
h1 {
  line-height: 48px;
}
</style>
