<template>
  <div>
    Iskolai PC-k száma Regisztrációs állapot (elkelt helyek/elérhető helyek)
    E-mail
    <h2>Osztályok</h2>
    <USelectMenu v-model="currentClass" :options="classes" />
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
  },
  {
    label: "World",
  },
];

const currentClass = ref(classes[0]);
</script>

<style></style>
