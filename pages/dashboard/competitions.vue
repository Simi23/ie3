<template>
  <div>
    <div
      class="flex w-full flex-row flex-wrap items-stretch justify-evenly gap-5 p-2 sm:p-4 md:gap-10 md:p-7 lg:p-10"
    >
      <CompetitionDisplay
        v-for="competition in competitions"
        :key="competition.id"
        :c-id="competition.id"
        class="w-80 sm:w-96"
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
