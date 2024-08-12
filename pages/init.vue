<template>
  <div>
    <UContainer class="flex min-h-screen w-fit items-center">
      <UCard class="h-fit">
        <template #header>
          <h1 class="text-center text-2xl font-bold">Inicializáció</h1>
          <h2 class="text-center text-lg font-semibold">
            Adminisztrátori fiók létrehozása
          </h2>
        </template>

        <div v-if="initDone === true">
          A szerveren már megtörtént az inicializáció.
        </div>
        <div v-else>
          <UForm
            :schema="initSchema"
            :state="initState"
            @error="initError"
            @submit.prevent="initSubmit"
            ref="form"
          >
            <UFormGroup
              name="username"
              label="Felhasználónév"
              class="mx-1 my-2 h-20"
            >
              <UInput v-model="initState.username" class="inputField"></UInput>
            </UFormGroup>
            <UFormGroup name="email" label="Email cím" class="mx-1 my-2 h-20">
              <UInput v-model="initState.email" class="inputField"></UInput>
            </UFormGroup>
            <UFormGroup name="password" label="Jelszó" class="mx-1 my-2 h-20">
              <UInput
                v-model="initState.password"
                type="password"
                class="inputField"
              ></UInput>
            </UFormGroup>
            <UFormGroup
              name="confirmPassword"
              label="Jelszó ismét"
              class="mx-1 my-2 h-20"
            >
              <UInput
                v-model="initState.confirmPassword"
                type="password"
                class="inputField"
              ></UInput>
            </UFormGroup>

            <UButton
              class="ml-auto mr-2 mt-5 block"
              size="md"
              label="Tovább"
              type="submit"
            >
            </UButton>
          </UForm>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
import { initSchema } from "~/schemas/initSchema";
import type { InitSchema } from "~/schemas/initSchema";
import type { FormSubmitEvent, FormErrorEvent } from "#ui/types";
import type { UForm } from "#build/components";

const loadingSpinner = useLoadingSpinner();
const toast = useToast();
const { csrf } = useCsrf();

const form = ref<InstanceType<typeof UForm> | null>(null);

const { data: initDone } = await useFetchNotification("/api/init");

const initState = ref({
  username: undefined,
  email: undefined,
  password: undefined,
  confirmPassword: undefined,
});

async function initSubmit(event: FormSubmitEvent<InitSchema>) {
  loadingSpinner.value = true;
  const resp = await $fetchNotification("/api/init", {
    method: "POST",
    body: event.data,
    headers: {
      "csrf-token": csrf,
    },
  });
  loadingSpinner.value = false;
}

function initError(event: FormErrorEvent) {
  toast.add({
    title: "Hiba",
    description:
      "Nem megfelelő az űrlap kitöltése. Ellenőrizd a megadott adatokat!",
    icon: "i-heroicons-x-mark-20-solid",
    color: "red",
  });
}
</script>

<style>
.inputField ~ p {
  user-select: none;
  margin-top: 0;
}
</style>
