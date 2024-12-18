<template>
  <UCard class="mx-10 my-10 dark:bg-opacity-90">
    <template #header>
      <h1 class="text-xl font-bold">Térkép1</h1>
    </template>
    <div class="grid grid-cols-2">
      <SeatMap class="w-full p-2" />
      <div class="p-2">AADF</div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});
</script>

<style></style>
