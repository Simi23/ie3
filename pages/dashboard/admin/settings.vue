<template>
  <div>
    <UCard class="mx-10 my-10">
      <template #header>
        <h1 class="text-xl font-bold">Beállítások</h1>
      </template>

      <h2 class="text-md mb-2 font-semibold">Regisztrációs állapot</h2>
      Állítás, státusz, (elkelt helyek, elérhető helyek)
      <h2 class="text-md mb-2 mt-4 font-semibold">Iskolai PC-k</h2>
      Állítás, elkelt / elérhető
    </UCard>

    <UCard class="mx-10 my-10">
      <template #header>
        <h1 class="text-xl font-bold">Email beállítások</h1>
      </template>

      <h2 class="text-md mb-2 font-semibold">Opciók</h2>
    </UCard>

    <UCard class="mx-10 my-10">
      <template #header>
        <h1 class="text-xl font-bold">Osztályok</h1>
      </template>

      <div class="flex w-full">
        <div class="w-80 rounded-lg border border-gray-700 bg-gray-950 p-4">
          <h2 class="text-md mb-2 font-semibold">Próba választó</h2>
          <TextToggle
            class="mb-1"
            label="Rejtett osztályok mutatása"
            v-model="hiddenToggle"
          />
          <ClassSelect :show-hidden="hiddenToggle ? '1' : '0'" />
        </div>

        <div
          class="mx-6 w-96 rounded-lg border border-gray-700 bg-gray-950 p-4"
        >
          <h2 class="text-md mb-2 font-semibold">Évfolyam hozzáadása</h2>
          <ClassGroupAdd class="mx-2" />
        </div>

        <div class="w-96 rounded-lg border border-gray-700 bg-gray-950 p-4">
          <h2 class="text-md mb-2 font-semibold">Osztályok hozzáadása</h2>
          <ClassAdd class="mx-2" />
        </div>
      </div>

      <UDivider size="sm" class="my-6"></UDivider>

      <div class="rounded-lg border border-gray-700 bg-gray-950 p-4">
        <h2 class="text-md mb-2 font-semibold">Évfolyamok</h2>
        <ClassGroupTable />
      </div>

      <UDivider size="sm" class="my-6"></UDivider>

      <div class="rounded-lg border border-gray-700 bg-gray-950 p-4">
        <h2 class="text-md mb-2 font-semibold">Osztályok</h2>
        <ClassTable />
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const hiddenToggle = ref(true);
</script>

<style></style>
