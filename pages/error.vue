<template>
  <div>
    <UButton @click="test">Press me</UButton>
  </div>
</template>

<script lang="ts" setup>
// TODO: Remove this page

await useFetchNotification("/api/error");

async function test() {
  try {
    await $fetchNotification("/api/error");
  } catch {
    console.log("ERROR ENCOUNTERED");
  }
}
</script>

<style></style>
