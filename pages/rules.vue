<template>
  <div class="min-h-screen w-screen p-5 md:p-7 lg:p-10">
    <UCard class="h-full w-full bg-opacity-90 dark:bg-opacity-90">
      <ContentDisplay v-if="rules" :content-id="rules.contentId" />
    </UCard>
  </div>
</template>

<script lang="ts" setup>
const { data: rules } = useFetch("/api/rules");
</script>

<style></style>
