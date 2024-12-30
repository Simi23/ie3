<template>
  <UModal>
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">{{ title }}</h1>
      </template>
      <NuxtImg :src="path"></NuxtImg>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
interface Props {
  path: string;
  title: string;
}
defineProps<Props>();
</script>

<style></style>
