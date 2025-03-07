<template>
  <div class="p-5 md:p-7 lg:p-10">
    <UCard class="dark:bg-opacity-90">
      <template #header>
        <h1 class="text-xl font-bold">Áttekintés</h1>
      </template>
      <div class="space-y-6">
        <MeterRegistrationStatus />
        <MeterSeatStats />
        <MeterSchoolPcs />
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});
</script>

<style></style>
