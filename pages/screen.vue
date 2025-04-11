<template>
  <div class="h-screen w-screen overflow-hidden">
    <CarouselMenu
      v-if="data"
      :pagecount="data.rows.length"
      initialwidth="100vw"
      initialheight="100vh"
      name="screencarousel"
      ref="screencarousel"
    >
      <template v-for="row in data.rows" #[`page${row.order}`]>
        <div class="h-screen w-screen">
          <DisplayContent
            :display-content-id="row.id"
            :ref="(el) => (refs[row.order - 1] = el)"
          />
        </div>
      </template>
    </CarouselMenu>
  </div>
</template>

<script lang="ts" setup>
import type CarouselMenu from "~/components/CarouselMenu.vue";

const { data, refresh } = useFetch("/api/display");

const refs = ref<any[]>([]);

let navigationTimeout: NodeJS.Timeout | null = null;
const screencarousel = ref<InstanceType<typeof CarouselMenu> | null>(null);

async function navigation(order: number) {
  refs?.value[order - 1]?.refreshContent();
  await screencarousel.value?.jumpTo(order);
  const time = data.value?.rows[order - 1].displayTimeMs ?? 5000;
  const nextOrder = (order % (data.value?.rows.length ?? 1)) + 1;
  navigationTimeout = setTimeout(() => {
    console.log(`Navigating to ${nextOrder} in ${time}ms`);
    navigation(nextOrder);
  }, time);
}

watch(data, (newData, oldData) => {
  if (navigationTimeout !== null) {
    clearTimeout(navigationTimeout);
  }
  navigation(1);
});

async function checkForUpdate() {
  const newData = await $fetch("/api/display");

  if (data.value == null) return;

  if (newData.serial > data.value.serial) {
    refresh();
  }
}

onMounted(() => {
  setInterval(checkForUpdate, 5000);
  if (navigationTimeout !== null) {
    clearTimeout(navigationTimeout);
  }
  navigation(1);
});
</script>

<style></style>
