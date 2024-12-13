<template>
  <div>
    {{ $route.params.id }}
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});
</script>

<style></style>
