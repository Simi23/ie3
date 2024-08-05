<template>
  <div>
    <UButton @click="test">Press me</UButton>
  </div>
</template>

<script lang="ts" setup>
const toast = useToast();

const { data, error } = await useFetch("/api/init", {
  onResponseError({ request, response, error }) {
    toast.add({
      title: "Hiba",
      description: response?._data?.message ?? "Ismeretlen hiba",
      icon: "i-heroicons-x-mark-20-solid",
      color: "red",
    });
  },
});

async function test() {
  try {
    const resp = await $fetch("/api/init");
  } catch (e: any) {
    toast.add({
      title: "Hiba",
      description: e.data.message ?? "Ismeretlen hiba",
      icon: "i-heroicons-x-mark-20-solid",
      color: "red",
    });
  }
}
</script>

<style></style>
