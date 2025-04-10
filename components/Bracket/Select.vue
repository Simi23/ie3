<template>
  <div>
    <USelectMenu
      :options="data"
      v-model="model"
      value-attribute="id"
      option-attribute="title"
    />
  </div>
</template>

<script lang="ts" setup>
const model = defineModel<string>();

const { data } = useFetch("/api/bracket", {
  default: () => [],
});
</script>

<style></style>
