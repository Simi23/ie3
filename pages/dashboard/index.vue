<template>
  <div>
    <div v-for="alert in page?.notifications" class="mx-8 my-3">
      <UAlert
        :color="colorMappings[alert.severity]"
        variant="soft"
        :title="alert.message"
        icon="i-heroicons-exclamation-triangle"
        :ui="{
          variant: {
            soft: 'bg-{color}-50 dark:bg-{color}-400 dark:bg-opacity-20 text-{color}-500 dark:text-{color}-400',
          },
        }"
      />
    </div>
    <div v-if="page && page.contentId" class="mx-8 my-4">
      <UCard
        class="dark:bg-opacity-90"
        :ui="{ body: { padding: 'px-6 py-6 sm:p-6 sm:py-6' } }"
      >
        <ContentDisplay :content-id="page.contentId" />
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Color from "#ui-colors";

const { data: page } = useFetch("/api/dashboard");

const colorMappings = ref<
  Record<"INFO" | "WARN" | "ERROR", (typeof Color)[number]>
>({
  INFO: "cyan",
  WARN: "orange",
  ERROR: "red",
});

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>

<style></style>
