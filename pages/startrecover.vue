<template>
  <UContainer class="flex min-h-screen w-fit items-center">
    <UCard class="h-fit min-w-72">
      <template #header>
        <h1 class="text-center text-2xl font-bold">Jelszó helyreállítása</h1>
      </template>

      <p>
        A jelszavad visszaállításához add meg az email címedet, amivel
        regisztráltál!
      </p>

      <UForm :state="state" :schema="schema" @submit.prevent="sendRecoveryMail">
        <div class="mt-2">
          <UFormGroup label="Email cím" name="email" class="mx-1 my-2 h-20">
            <UInput
              v-model="state.email"
              placeholder="Email cím"
              type="text"
            ></UInput>
          </UFormGroup>
          <div class="mt-1 text-center">
            <UButton label="Email küldése" type="submit" />
          </div>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>

<script lang="ts" setup>
import { z } from "zod";

const loadingSpinner = useLoadingSpinner();

const state = ref({
  email: "",
});

const schema = z.object({
  email: z.string().email("Érvénytelen email cím"),
});

async function sendRecoveryMail() {
  loadingSpinner.value = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>("/api/admin/mailrecover", {
      method: "POST",
      body: {
        email: state.value.email,
      },
    }),
  );

  loadingSpinner.value = false;
}
</script>

<style></style>
