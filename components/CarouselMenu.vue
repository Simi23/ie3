<template>
  <div>
    <slot v-for="i in pagecount" :key="i" :name="'page' + i"></slot>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  pagecount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  pagecount: 1,
});
</script>

<style></style>
