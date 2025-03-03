<template>
  <div
    id="spinnerContainer"
    class="m-0 mb-16 p-0"
    :style="{ width: props.size }"
  >
    <NuxtImg
      id="loadingspinner"
      src="/logo-multiline-sm.png"
      class="mb-6 h-full w-full"
      draggable="false"
      :style="{
        opacity: display ? '1' : '0',
        transform: display ? 'scale(1)' : 'scale(2)',
      }"
    />
    <UProgress animation="carousel" />
  </div>
</template>

<script lang="ts" setup>
const display = useLoadingSpinner();

interface Props {
  size?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "30rem",
});
</script>

<style scoped>
#loadingspinner {
  transition:
    opacity ease-in-out 0.15s,
    transform ease-in-out 0.2s;
}

#spinnerContainer {
  max-width: 90vw;
}

@keyframes scaleAnimation {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.95);
  }

  100% {
    transform: scale(1);
  }
}
</style>
