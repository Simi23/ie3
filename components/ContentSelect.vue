<template>
  <div>
    <USelectMenu
      :options="data"
      v-model="model"
      value-attribute="id"
      option-attribute="name"
    />
  </div>
</template>

<script lang="ts" setup>
const model = defineModel<string>();

const { data } = useFetch("/api/content", {
  default: () => [],
});
</script>

<style></style>
