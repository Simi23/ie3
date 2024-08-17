<template>
  <div class="bg-gray-100 dark:bg-gray-950">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <LoadingBanner />
    <UNotifications />
  </div>
</template>

<script lang="ts" setup>
import "~/utils/zodDefaults.js";
</script>
