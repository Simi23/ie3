<template>
  <div>
    {{ data }}
  </div>
</template>

<script lang="ts" setup>
const { data } = await useFetch("/api/init", {
  lazy: true,
});

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>

<style></style>
