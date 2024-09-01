<template>
  <div>
    <USelectMenu
      v-model="currentClass"
      :options="classes"
      class="w-fit"
      placeholder="Válassz osztályt..."
    />
  </div>
</template>

<script lang="ts" setup>
const classes = [
  {
    label: "Helló",
    disabled: true,
  },
  {
    label: "World",
  },
];

const currentClass = ref();
</script>

<style></style>
