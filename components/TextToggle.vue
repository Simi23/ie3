<template>
  <div>
    <UToggle size="sm" v-model="toggled" />
    <span
      class="ml-2 cursor-pointer select-none"
      @click="
        () => {
          toggled = !toggled;
        }
      "
      >{{ label }}</span
    >
  </div>
</template>

<script lang="ts" setup>
const toggled = defineModel<boolean>();

const props = defineProps<{
  label?: string;
}>();
</script>

<style></style>
