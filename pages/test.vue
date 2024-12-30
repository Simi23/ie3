<template>
  <div>
    <UContainer class="flex min-h-screen w-fit items-center">
      <UCard class="h-fit">
        <template #header>
          <h1 class="text-center text-2xl font-bold">Inicializáció</h1>
          <h2 class="text-center text-lg font-semibold">
            Adminisztrátori fiók létrehozása
          </h2>
        </template>
        <UButton @click="carouselmenu?.jumpTo(1)">1</UButton>
        <UButton @click="carouselmenu?.jumpTo(2)">2</UButton>
        <UButton @click="carouselmenu?.jumpTo(3)">3</UButton>
        <CarouselMenu
          ref="carouselmenu"
          :pagecount="3"
          initialheight="10rem"
          name="test"
        >
          <template #page1>
            <USelectMenu :options="options" />
            <div class="h-40 w-24 dark:bg-blue-400" />
          </template>
          <template #page2>
            <div class="h-80 w-40 dark:bg-yellow-400" />
          </template>
          <template #page3>
            <div class="h-60 w-80 dark:bg-emerald-400" />
          </template>
        </CarouselMenu>
      </UCard>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
// TODO: Remove this whole page
import type CarouselMenu from "~/components/CarouselMenu.vue";
const carouselmenu = ref<InstanceType<typeof CarouselMenu> | null>(null);

// const loadingSpinner = useLoadingSpinner();
// const toast = useToast();
const options = ref([
  "asdf1",
  "asdf1",
  "asdf1",
  "asdf1",
  "asdf1",
  "asdf1",
  "asdf1",
  "asdf1",
  "asdf1",
  "asdf1",
  "asdf1",
  "asdf1",
  "asdf1",
  "asdf1",
]);
</script>

<style></style>
