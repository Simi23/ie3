<template>
  <div
    class="absolute left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-gray-900 bg-opacity-60"
    id="spinnerTopContainer"
    :style="{ opacity: spinnerOpacity }"
    v-if="spinnerVisible"
  >
    <div class="m-0 h-40 w-40 p-0" id="spinnerContainer">
      <NuxtImg
        id="loadingSpinner"
        src="/ie2logot.png"
        class="h-full w-full"
        draggable="false"
      ></NuxtImg>
    </div>
  </div>
</template>

<script lang="ts" setup>
const spinnerState = useLoadingSpinner();

const spinnerVisible = ref(spinnerState.value);
const spinnerOpacity = ref(0);

watch(spinnerState, async (newState, oldState) => {
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
#loadingSpinner {
  animation: spinAnimation 0.8s ease-in-out 0s infinite normal forwards;
}

#spinnerContainer {
  animation: scaleAnimation 0.8s ease-in-out 0s infinite normal forwards;
}

#spinnerTopContainer {
  transition: opacity 0.2s;
  user-select: none;
}

@keyframes spinAnimation {
  0% {
    transform: rotate(0deg) scale(1);
  }

  100% {
    transform: rotate(360deg) scale(1);
  }
}

@keyframes scaleAnimation {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.8);
  }

  100% {
    transform: scale(1);
  }
}
</style>
