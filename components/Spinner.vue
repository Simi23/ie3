<template>
  <div
    id="spinnerContainer"
    class="m-0 p-0"
    :style="{ height: props.size, width: props.size }"
  >
    <NuxtImg
      id="loadingSpinner"
      src="/ie2logot.png"
      class="h-full w-full"
      draggable="false"
    />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  size?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "10rem",
});
</script>

<style>
#loadingSpinner {
  animation: spinAnimation 0.8s ease-in-out 0s infinite normal forwards;
}

#spinnerContainer {
  animation: scaleAnimation 0.8s ease-in-out 0s infinite normal forwards;
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
