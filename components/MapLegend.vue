<template>
  <span class="mr-3">
    <span :class="color" class="mr-1">■</span>
    <slot></slot>
  </span>
</template>

<script lang="ts" setup>
const props = defineProps<{
  color: string;
}>();
</script>
