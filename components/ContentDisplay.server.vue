<template>
  <article class="prose lg:prose-lg dark:prose-invert prose-headings:mt-3">
    <MDCRenderer v-if="data" :body="data.body" :data="data.data" />
  </article>
</template>

<script lang="ts" setup>
import type { MDCParserResult } from "@nuxtjs/mdc";

interface Props {
  contentId: string;
}
const props = defineProps<Props>();

const { data } = await useFetch<MDCParserResult>(
  `/api/content/${props.contentId}`,
);
</script>

<style></style>
