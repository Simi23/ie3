<template>
  <div class="p-5 md:p-7 lg:p-10">
    <UCard class="dark:bg-opacity-90">
      <template #header>
        <h1 class="text-xl font-bold">Üzenetküldés</h1>
      </template>
      <h2 class="mb-3 text-lg font-medium">Előtti napi információk</h2>
      <UForm
        :state="messageState"
        class="w-96 max-w-96 space-y-6"
        @submit.prevent="sendConfirm"
      >
        <UFormGroup name="openTime" label="Nyitási idő (pl. '16:00')">
          <UInput v-model="messageState.openTime" />
        </UFormGroup>
        <UFormGroup name="startTime" label="Kezdési idő (pl. '17:00')">
          <UInput v-model="messageState.startTime" />
        </UFormGroup>
        <UButton type="submit" label="Email küldése" />
      </UForm>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import ModalConfirmAction from "~/components/Modal/ConfirmAction.vue";

const modal = useModal();
const loadingSpinner = useLoadingSpinner();

definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const messageState = ref({
  openTime: "",
  startTime: "",
});

async function sendConfirm() {
  modal.open(ModalConfirmAction, {
    title: "Küldés megerősítése",
    description: "Biztosan elküldöd az emailt az összes felhasználónak?",
    confirmText: "Igen",
    cancelText: "Nem",
    onSuccess: () => {
      sendMail();
      modal.close();
    },
  });
}

async function sendMail() {
  loadingSpinner.value = true;

  const [error, resp] = await catchError(
    $fetchCsrfNotification<NotificationResponse>("/api/mail/mailbefore", {
      method: "POST",
      body: {
        openTime: messageState.value.openTime,
        startTime: messageState.value.startTime,
      },
    }),
  );

  loadingSpinner.value = false;
}
</script>

<style></style>
