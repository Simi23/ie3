<template>
  <UModal :ui="{ background: 'bg-transparent dark:bg-transparent' }">
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold">Új keret</h1>
      </template>
      <UForm
        :state="formState"
        :schema="bracketCreateSchema"
        @submit.prevent="createBracket"
      >
        <div class="space-y-4">
          <UFormGroup label="Megjelenítési név" name="title">
            <UInput v-model="formState.title" />
          </UFormGroup>
          <UFormGroup label="Adminisztratív név" name="administrativeTitle">
            <UInput v-model="formState.administrativeTitle" />
          </UFormGroup>
          <UFormGroup label="Verseny" name="competitionId">
            <CompetitionSelect v-model="formState.competitionId" />
          </UFormGroup>
          <UFormGroup label="Versenyzők száma" name="numberOfCompetitors">
            <UInput type="number" v-model="formState.numberOfCompetitors" />
          </UFormGroup>
          <div class="flex flex-row flex-nowrap justify-end">
            <UButton
              class="mt-6"
              type="submit"
              label="Létrehozás"
              icon="i-heroicons-plus"
            />
          </div>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import { bracketCreateSchema } from "~/schemas/bracket";

const loadingSpinner = useLoadingSpinner();

const emit = defineEmits<{
  success: [];
}>();

const formState = ref({
  title: "",
  administrativeTitle: "",
  numberOfCompetitors: 0,
  competitionId: "",
});

async function createBracket() {
  loadingSpinner.value = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>("/api/bracket", {
      method: "POST",
      body: formState.value,
    }),
  );

  loadingSpinner.value = false;

  if (!error) {
    emit("success");
  }
}
</script>

<style></style>
