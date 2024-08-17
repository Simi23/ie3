<template>
  <div>
    <div class="flex justify-between dark:bg-gray-900">
      <h1
        class="flex h-12 w-48 select-none content-center justify-center text-xl font-bold"
      >
        Infósok Éjszakája
      </h1>
      <UHorizontalNavigation
        :links="links"
        class="mr-4 w-fit"
      ></UHorizontalNavigation>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
const userStore = useUserStore();

const links = [
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
    label: "Beállítások",
    to: "/dashboard/settings",
    icon: "i-heroicons-cog-8-tooth-solid",
  },
  {
    label: "Kilépés",
    to: "/logout",
    icon: "i-heroicons-arrow-right-on-rectangle-solid",
  },
];

if (userStore.adminClass.valueOf() > 0) {
  links.splice(4, 0, {
    label: "Adminisztráció",
    to: "/dashboard/admin",
    icon: "i-heroicons-users-solid",
  });
}
</script>

<style scoped>
h1 {
  line-height: 48px;
}
</style>
