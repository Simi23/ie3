<template>
  <div>
    Iskolai PC-k száma Regisztrációs állapot (elkelt helyek/elérhető helyek)
    E-mail
    <h2>Osztályok</h2>
    <ClassSelect show-hidden="1"> </ClassSelect>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});
</script>

<style></style>
