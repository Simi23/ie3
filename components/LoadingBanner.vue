<template>
  <div
    v-if="spinnerVisible"
    id="spinnerTopContainer"
    class="absolute left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-gray-900 bg-opacity-60"
    :style="{ opacity: spinnerOpacity }"
  >
    <Spinner />
  </div>
</template>

<script lang="ts" setup>
const spinnerState = useLoadingSpinner();

const spinnerVisible = ref(spinnerState.value);
const spinnerOpacity = ref(0);

watch(spinnerState, async (newState) => {
  if (newState === true) {
    spinnerOpacity.value = 0;
    spinnerVisible.value = true;
    await sleep(100);
    spinnerOpacity.value = 1;
    await sleep(210);
  } else {
    spinnerOpacity.value = 0;
    await sleep(210);
    spinnerVisible.value = false;
  }
});
</script>

<style>
#spinnerTopContainer {
  transition: opacity 0.2s;
  user-select: none;
}
</style>
