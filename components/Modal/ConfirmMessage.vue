<script lang="ts" setup>
interface Props {
  title?: string;
  confirmText?: string;
  description?: string;
  longDescription?: string[];
  timer?: number;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Megerősítés",
  confirmText: "Megerősít",
  cancelText: "Mégse",
  danger: false,
});

const emit = defineEmits(["success"]);
const countDown = ref<number | undefined>();
const countDownTimeout = ref<NodeJS.Timeout>();
const countDownGoing = computed(() => {
  return (
    props.timer !== undefined &&
    countDown.value !== undefined &&
    countDown.value > 0
  );
});

function onSuccess() {
  emit("success");
}

onMounted(() => {
  if (props.timer) {
    countDown.value = props.timer;

    countDownTimeout.value = setInterval(() => {
      if (!countDown.value) {
        return;
      }
      countDown.value -= 1;
      if (countDown.value < 0) {
        clearInterval(countDownTimeout.value);
      }
    }, 1000);
  }
});
</script>

<template>
  <UModal>
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">{{ props.title }}</h1>
      </template>

      <div v-if="props.description !== undefined">
        <p>{{ props.description }}</p>
      </div>

      <div v-if="props.longDescription !== undefined">
        <p class="my-1" v-for="line in props.longDescription">
          {{ line }}
        </p>
      </div>

      <template #footer>
        <div class="float-right">
          <UButton
            @click="onSuccess"
            color="emerald"
            :disabled="countDownGoing"
            >{{ countDownGoing ? countDown : props.confirmText }}</UButton
          >
        </div>
        <div class="clear-both"></div>
      </template>
    </UCard>
  </UModal>
</template>
