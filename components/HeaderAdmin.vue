<template>
  <div class="w-fit">
    <UVerticalNavigation
      id="admin-navigation"
      :links="links"
      class="w-fit border-t border-t-gray-700 px-2 py-4 dark:bg-gray-900"
    />
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
  [
    {
      label: "Oldalbeállítások",
      to: "/dashboard/admin/settings",
      icon: "i-heroicons-cog-8-tooth-solid",
    },
    {
      label: "Felhasználók",
      to: "/dashboard/admin/users",
      icon: "i-heroicons-users-solid",
    },
    {
      label: "Kijelző",
      to: "/dashboard/admin/screen",
      icon: "i-heroicons-window-solid",
    },
    {
      label: "Ülőhelyek",
      to: "/dashboard/admin/seats",
      icon: "i-heroicons-map-pin-solid",
    },
    {
      label: "Térképek",
      to: "/dashboard/admin/maps",
      icon: "i-heroicons-map-solid",
    },
  ],
  [
    {
      label: "Média",
      to: "/dashboard/admin/media",
      icon: "i-heroicons-photo-solid",
    },
  ],
  [
    {
      label: "Versenyek",
      to: "/dashboard/admin/competitions",
      icon: "i-heroicons-trophy-solid",
    },
    {
      label: "Keretek",
      to: "/dashboard/admin/brackets",
      icon: "i-heroicons-table-cells-solid",
    },
  ],
];

if (userStore.adminClass.valueOf() >= 2) {
  links.value.push(...l2links);
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
