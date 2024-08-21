<template>
  <div>
    Iskolai PC-k száma Regisztrációs állapot (elkelt helyek/elérhető helyek)
    E-mail
    <h2>Osztályok</h2>
    <USelectMenu
      v-model="currentClass"
      :options="classes"
      class="w-fit"
      placeholder="Válassz osztályt..."
    />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const classes = [
  {
    label: "Helló",
    disabled: true,
  },
  {
    label: "World",
  },
];

const currentClass = ref();
</script>

<style></style>
