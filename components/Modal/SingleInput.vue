<script lang="ts" setup>
interface Props {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  fieldText: string;
  placeHolder?: string;
  isPassword?: boolean;
}

const modal = useModal();
const inputText = ref("");

const props = withDefaults(defineProps<Props>(), {
  title: "Új érték",
  confirmText: "Megerősít",
  cancelText: "Mégse",
  placeHolder: "Új név...",
  isPassword: false,
});

const emit = defineEmits<{
  success: [answer: string];
}>();

function onSuccess() {
  if (inputText.value == "") return;
  emit("success", inputText.value);
}
</script>

<template>
  <UModal>
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">{{ props.title }}</h1>
      </template>

      <UFormGroup :label="fieldText">
        <UInput
          v-model="inputText"
          :placeholder="placeHolder"
          :type="isPassword ? 'password' : 'text'"
        ></UInput>
      </UFormGroup>

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
