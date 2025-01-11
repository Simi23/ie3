<script lang="ts" setup>
interface Props {
  title?: string;

  actionTextConfirm?: string;
  actionTextCancel?: string;

  titleInputTitle?: string;
  titleInputPlaceholder?: string;

  textInputTitle?: string;
  textInputPlaceholder?: string;

  initValueTitle?: string;
  initValueText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Tartalom szerkesztése",
  actionTextConfirm: "Mentés",
  actionTextCancel: "Mégse",
  titleInputTitle: "Név",
  titleInputPlaceholder: "Név...",
  textInputTitle: "Tartalom",
  textInputPlaceholder: "Tartalom...",
});

const inputTitle = ref("");
const inputText = ref("");

onMounted(async () => {
  await nextTick();
  if (props.initValueTitle) inputTitle.value = props.initValueTitle;
  if (props.initValueText) inputText.value = props.initValueText;
});

const modal = useModal();

const emit = defineEmits<{
  success: [title: string, text: string];
}>();

function onSuccess() {
  if (inputText.value == "") return;
  emit("success", inputTitle.value, inputText.value);
}
</script>

<template>
  <UModal>
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">{{ props.title }}</h1>
      </template>

      <UFormGroup :label="titleInputTitle">
        <UInput v-model="inputTitle" :placeholder="titleInputPlaceholder" />
      </UFormGroup>

      <UFormGroup :label="textInputTitle" class="mt-3">
        <UTextarea
          v-model="inputText"
          :placeholder="textInputPlaceholder"
          :rows="8"
        />
      </UFormGroup>

      <template #footer>
        <div class="float-right">
          <UButton
            @click="modal.close"
            color="red"
            :label="props.actionTextCancel"
          />
          <UButton
            @click="onSuccess"
            color="emerald"
            class="mx-2"
            :label="props.actionTextConfirm"
          />
        </div>
        <div class="clear-both"></div>
      </template>
    </UCard>
  </UModal>
</template>
