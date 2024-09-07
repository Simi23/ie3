<template>
  <div>
    <UForm
      ref="form"
      :schema="classSchema"
      :state="classState"
      @submit.prevent="classAddSubmit"
    >
      <UFormGroup name="name" label="Osztály neve" class="mx-1 my-2 h-20">
        <UInput v-model="classState.name" type="text" class="inputField" />
      </UFormGroup>

      <UFormGroup name="groupId" label="Évfolyam" class="mx-1 my-2 h-20">
        <USelectMenu
          v-model="classState.groupId"
          :options="classGroups"
          placeholder="Évfolyam kiválasztása..."
          value-attribute="id"
          option-attribute="name"
          class="inputField"
        />
      </UFormGroup>

      <TextToggle label="Rejtett osztály" v-model="classState.hidden" />

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
import { classSchema } from "~/schemas/classSchema";

const eventBus = useMittBus();
const loadingSpinner = useLoadingSpinner();
const csrf = useCsrf();

const { data: classGroups, refresh: refreshClassGroups } = useFetch<any[]>(
  "/api/classgroups",
  {
    default: () => {
      return [];
    },
  },
);

const classState = ref({
  name: undefined,
  groupId: undefined,
  hidden: false,
});

async function classAddSubmit() {
  loadingSpinner.value = true;
  await $fetchNotification("/api/classes", {
    method: "POST",
    headers: {
      "csrf-token": csrf.csrf,
    },
    body: {
      name: classState.value.name,
      groupId: classState.value.groupId,
      hidden: classState.value.hidden,
    },
  }).catch(() => {
    loadingSpinner.value = false;
  });

  classState.value.name = undefined;

  eventBus.emit("update-class");

  loadingSpinner.value = false;
}

eventBus.on("update-class-group", () => {
  refreshClassGroups();
});
</script>

<style></style>
