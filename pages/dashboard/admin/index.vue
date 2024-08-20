<template>
  <div class="p-10">
    <USkeleton class="h-screen w-full" />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});
</script>

<style></style>
