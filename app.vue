<template>
  <div class="bg-gray-100 bg-cover bg-fixed dark:bg-web-bg">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UModals />
    <USlideovers />
    <LoadingBanner class="z-[1000]" />
    <UNotifications />
  </div>
</template>

<script lang="ts" setup>
import "~/utils/zodDefaults.js";
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
body {
  height: 100%;
}
</style>
