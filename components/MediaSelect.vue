<template>
  <USelectMenu
    v-model="modelValue"
    :options="media"
    value-attribute="id"
    option-attribute="name"
    placeholder="Kép kiválasztása"
  />
</template>

<script lang="ts" setup>
const modelValue = defineModel<string>();

const { data: media } = useFetch("/api/media", {
  default: () => [],
  lazy: true,
});
</script>

<style></style>
