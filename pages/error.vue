<template>
  <div>
    <UButton @click="test">Press me</UButton>
  </div>
</template>

<script lang="ts" setup>
// TODO: Remove this page

const { data, error } = await useFetchNotification("/api/error");

async function test() {
  try {
    const resp = await $fetchNotification("/api/error");
  } catch (e: any) {
    console.log("ERROR ENCOUNTERED");
  }
}
</script>

<style></style>
