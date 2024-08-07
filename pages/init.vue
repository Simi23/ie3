<template>
  <div>
    <UButton @click="test">Press me</UButton>
  </div>
</template>

<script lang="ts" setup>
const { data, error } = await useFetchNotification("/api/init");

async function test() {
  const resp = await $fetchNotification("/api/init");
}
</script>

<style></style>
