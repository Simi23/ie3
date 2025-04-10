<template>
  <div>
    <USelectMenu
      :options="options"
      v-model="model"
      value-attribute="id"
      option-attribute="title"
    />
  </div>
</template>

<script lang="ts" setup>
const model = defineModel<string>();

const options = [
  { id: "ShortText", title: "Rövid szöveg" },
  { id: "FormattedText", title: "Tartalom" },
  { id: "Media", title: "Média" },
  { id: "Bracket", title: "Keret" },
  { id: "TopList", title: "Rangsor" },
];
</script>

<style></style>
