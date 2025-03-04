<template>
  <USlideover>
    <div class="flex flex-row flex-nowrap justify-end p-2">
      <UButton
        icon="i-heroicons-x-mark-solid"
        variant="ghost"
        color="gray"
        size="xl"
        @click="slideover.close"
      />
    </div>
    <div class="p-4">
      <UVerticalNavigation :links="links" class="mr-4 w-full" />
      <div v-if="userStore.adminClass > 0" class="mt-8">
        <UDivider label="Adminisztráció" class="my-4 select-none" />
        <UVerticalNavigation :links="adminLinks" class="mr-4 w-full" />
      </div>
    </div>
  </USlideover>
</template>

<script lang="ts" setup>
const userStore = useUserStore();
const route = useRoute();
const slideover = useSlideover();

const links = ref(mainMenuBase);

const adminLinks = computed(() => {
  const l = [adminMenuBase];

  if (userStore.adminClass.valueOf() >= 2) {
    l.push(...adminMenuLevel2);
  }

  if (userStore.adminClass.valueOf() >= 1) {
    l.push(adminMenuLevel1);
  }

  return l;
});

watch(
  () => route.path,
  () => {
    slideover.close();
  },
);
</script>

<style></style>
