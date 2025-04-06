<template>
  <div
    class="flex flex-col flex-nowrap gap-5 p-5 md:gap-7 md:p-7 lg:gap-10 lg:p-10"
  >
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
    <!-- <UCard class="dark:bg-opacity-90">
      <template #header>
        <h1 class="text-xl font-bold">Teszt</h1>
      </template>
      <div class="space-y-6">
        <BracketPart :cell-data="cellData" />
      </div>
    </UCard> -->
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});
</script>

<style></style>
