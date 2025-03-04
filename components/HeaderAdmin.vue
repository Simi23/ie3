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

const links = computed(() => {
  const l = [adminMenuBase];

  if (userStore.adminClass.valueOf() >= 2) {
    l.push(...adminMenuLevel2);
  }

  if (userStore.adminClass.valueOf() >= 1) {
    l.push(adminMenuLevel1);
  }

  return l;
});
</script>

<style scoped>
#admin-navigation {
  min-height: calc(100vh - 3rem);
  height: 100%;
}
</style>
