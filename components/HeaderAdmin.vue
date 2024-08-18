<template>
  <div class="w-fit">
    <UVerticalNavigation
      :links="links"
      class="w-fit border-t border-t-gray-700 px-2 py-4 dark:bg-gray-900"
      id="admin-navigation"
    ></UVerticalNavigation>
  </div>
</template>

<script lang="ts" setup>
const userStore = useUserStore();

const links = ref([
  [
    {
      label: "Áttekintés",
      to: "/dashboard/admin",
      icon: "i-heroicons-home-solid",
    },
  ],
]);

const l1links = [
  {
    label: "Pénzügyek",
    to: "/dashboard/admin/finance",
    icon: "i-heroicons-banknotes-solid",
  },
];

const l2links = [
  {
    label: "Oldalbeállítások",
    to: "/dashboard/admin/settings",
    icon: "i-heroicons-cog-8-tooth-solid",
  },
];

if (userStore.adminClass.valueOf() >= 2) {
  links.value.push(l2links);
}

if (userStore.adminClass.valueOf() >= 1) {
  links.value.push(l1links);
}
</script>

<style scoped>
#admin-navigation {
  min-height: calc(100vh - 3rem);
  height: 100%;
}
</style>
