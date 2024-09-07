<template>
  <div>
    <UForm
      ref="form"
      :schema="classGroupSchema"
      :state="classGroupState"
      @submit.prevent="classGroupAddSubmit"
    >
      <UFormGroup name="name" label="Évfolyam neve" class="mx-1 my-2 h-20">
        <UInput v-model="classGroupState.name" type="text" class="inputField" />
      </UFormGroup>

      <UFormGroup
        name="year"
        label="Évfolyam száma (rendezéshez)"
        class="mx-1 my-2 h-20"
      >
        <UInput
          v-model="classGroupState.year"
          type="number"
          class="inputField"
        />
      </UFormGroup>
      <TextToggle label="Rejtett évfolyam" v-model="classGroupState.hidden" />

      <UButton
        class="ml-auto mr-2 mt-5 block"
        size="md"
        label="Hozzáadás"
        type="submit"
      />
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import { classGroupSchema } from "~/schemas/classGroupSchema";
import type { ClassGroupSchema } from "~/schemas/classGroupSchema";

const eventBus = useMittBus();
const loadingSpinner = useLoadingSpinner();
const csrf = useCsrf();

const classGroupState = ref({
  name: undefined,
  year: undefined,
  hidden: false,
});

async function classGroupAddSubmit() {
  loadingSpinner.value = true;
  await $fetchNotification("/api/classgroups", {
    method: "POST",
    headers: {
      "csrf-token": csrf.csrf,
    },
    body: {
      name: classGroupState.value.name,
      year: classGroupState.value.year,
      hidden: classGroupState.value.hidden,
    },
  }).catch(() => {
    loadingSpinner.value = false;
  });

  classGroupState.value.name = undefined;
  classGroupState.value.year = undefined;

  eventBus.emit("update-class-group");

  loadingSpinner.value = false;
}
</script>

<style></style>
