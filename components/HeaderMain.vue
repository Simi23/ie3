<template>
  <div class="flex justify-between dark:bg-gray-900">
    <NuxtImg
      src="/logowide.png"
      draggable="false"
      class="ml-2 h-12 select-none pb-4 pt-3 sm:ml-2 sm:pb-3 sm:pt-2"
    />

    <UButton
      icon="i-heroicons-bars-3-16-solid"
      variant="ghost"
      class="lg:hidden"
      color="gray"
      square
      size="xl"
      @click="openSlideover"
    />
    <UHorizontalNavigation :links="links" class="mr-4 hidden w-fit lg:block" />
  </div>
</template>

<script lang="ts" setup>
import SlideoverMenu from "~/components/Slideover/Menu.vue";

const slideover = useSlideover();

const userStore = useUserStore();
const route = useRoute();

const links = computed(() => {
  const l = [...mainMenuBase];

  if (userStore.adminClass.valueOf() > 0) {
    l.splice(4, 0, {
      label: "Adminisztráció",
      to: "/dashboard/admin",
      icon: "i-heroicons-users-solid",
      active: route.path.startsWith("/dashboard/admin"),
    });
  }

  return l;
});

function openSlideover() {
  slideover.open(SlideoverMenu);
}
</script>

<style scoped>
h1 {
  line-height: 48px;
}
</style>
