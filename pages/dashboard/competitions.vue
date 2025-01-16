<template>
  <div>
    <div
      class="flex w-full flex-row flex-wrap items-stretch justify-evenly p-4"
    >
      <CompetitionDisplay
        v-for="competition in competitions"
        :key="competition.id"
        :c-id="competition.id"
        class="mx-6 my-10 w-96"
      />
    </div>
    <div class="h-1 w-1"></div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const { data: competitions, refresh } = await useFetch("/api/competition", {
  default: () => [],
});
</script>

<style></style>
