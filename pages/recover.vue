<template>
  <UContainer class="flex min-h-screen w-fit items-center">
    <UCard class="h-fit min-w-72">
      <template #header>
        <h1 class="text-center text-2xl font-bold">Jelszó helyreállítása</h1>
      </template>
      <UForm :state="state" :schema="schema" @submit.prevent="sendRecover">
        <div class="mt-2 text-center">
          <UFormGroup label="Jelszó" name="password" class="mx-1 my-2 h-20">
            <UInput
              v-model="state.password"
              placeholder="Jelszó"
              type="password"
            ></UInput>
          </UFormGroup>
          <UFormGroup
            label="Jelszó megerősítése"
            name="passwordVerify"
            class="mx-1 my-2 h-20"
          >
            <UInput
              v-model="state.passwordVerify"
              placeholder="Jelszó újra"
              type="password"
            ></UInput>
          </UFormGroup>
          <UButton label="Jelszó helyreállítása" type="submit" />
        </div>
      </UForm>
      <div class="mt-2 text-center">
        <UButton label="Tovább a bejelentkezéshez" variant="link" to="/login" />
      </div>
    </UCard>
  </UContainer>
</template>

<script lang="ts" setup>
import { z } from "zod";

const { token } = useRoute().query;
const loadingSpinner = useLoadingSpinner();

const state = ref({
  password: "",
  passwordVerify: "",
});

const schema = z
  .object({
    password: z.string().min(8, "Legalább 8 karakternek kell lennie!"),
    passwordVerify: z.string().min(8, "Legalább 8 karakternek kell lennie!"),
  })
  .refine((data) => data.password == data.passwordVerify, {
    message: "Nem egyeznek a jelszavak!",
    path: ["passwordVerify"],
  });

async function sendRecover() {
  loadingSpinner.value = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>("/api/user/recoverpassword", {
      method: "POST",
      body: {
        token: token,
        newPassword: state.value.password,
      },
    }),
  );

  loadingSpinner.value = false;
}
</script>

<style></style>
