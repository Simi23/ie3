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

      <h2 class="text-md mb-2 font-semibold">Próba választó</h2>
      <TextToggle
        class="mb-1"
        label="Rejtett osztályok mutatása"
        v-model="hiddenToggle"
      />
      <ClassSelect :show-hidden="hiddenToggle ? '1' : '0'" />

      <UDivider size="sm" class="my-6"></UDivider>

      <h2 class="text-md mb-2 mt-4 font-semibold">Évfolyamok</h2>
      <ClassGroupTable />

      <UDivider size="sm" class="my-6"></UDivider>

      <h2 class="text-md mb-2 mt-4 font-semibold">Évfolyam hozzáadása</h2>
      <ClassGroupAdd class="mx-6" />

      <UDivider size="sm" class="my-6"></UDivider>

      <h2 class="text-md mb-2 mt-4 font-semibold">Osztályok</h2>
      <ClassTable />

      <UDivider size="sm" class="my-6"></UDivider>

      <h2 class="text-md mb-2 mt-4 font-semibold">Osztályok hozzáadása</h2>
      <ClassAdd class="mx-6" />
    </UCard>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const hiddenToggle = ref(true);

const classselect = ref<any>(undefined);
const classgrouptable = ref<any>(undefined);
</script>

<style></style>
