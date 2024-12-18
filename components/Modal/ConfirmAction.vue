<script lang="ts" setup>
interface Props {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  description?: string;
  longDescription?: string[];
}

const modal = useModal();

const props = withDefaults(defineProps<Props>(), {
  title: "Megerősítés",
  confirmText: "Megerősít",
  cancelText: "Mégse",
});

const emit = defineEmits(["success"]);

function onSuccess() {
  emit("success");
}
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
          <UButton @click="modal.close" color="red">{{
            props.cancelText
          }}</UButton>
          <UButton @click="onSuccess" color="emerald" class="mx-2">{{
            props.confirmText
          }}</UButton>
        </div>
        <div class="clear-both"></div>
      </template>
    </UCard>
  </UModal>
</template>
