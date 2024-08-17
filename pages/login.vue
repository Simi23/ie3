<template>
  <div>
    <UContainer class="flex min-h-screen w-fit items-center">
      <UCard class="h-fit min-w-64">
        <template #header>
          <h1 class="text-center text-2xl font-bold">Bejelentkezés</h1>
        </template>

        <CarouselMenu :pagecount="2" ref="logincarousel">
          <template #page1>
            <UForm
              :schema="loginStage1Schema"
              :state="loginStage1State"
              @error="loginError"
              @submit.prevent="loginStage1Submit"
              ref="loginform1"
            >
              <UFormGroup
                name="username"
                label="Felhasználónév"
                class="mx-1 my-2 h-20"
              >
                <UInput
                  v-model="loginStage1State.username"
                  class="inputField"
                  placeholder="Felhasználónév"
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
          </template>
          <template #page2>
            <UForm
              :schema="loginStage2Schema"
              :state="loginStage2State"
              @error="loginError"
              @submit.prevent="loginStage2Submit"
              ref="loginform2"
            >
              <UFormGroup
                name="username"
                label="Felhasználónév"
                class="mx-1 my-2 h-20"
              >
                <UInput
                  v-model="loginStage2State.username"
                  class="inputField"
                  placeholder="Felhasználónév"
                  disabled
                ></UInput>
              </UFormGroup>

              <UFormGroup name="password" label="Jelszó" class="mx-1 my-2 h-20">
                <UInput
                  v-model="loginStage2State.password"
                  class="inputField"
                  type="password"
                  placeholder="Jelszó"
                  id="stage-2-password"
                ></UInput>
              </UFormGroup>

              <div class="mt-4 flex justify-end">
                <UButton
                  variant="ghost"
                  size="md"
                  label="Vissza"
                  icon="i-heroicons-arrow-small-left"
                  @click="logincarousel?.jumpTo(1)"
                >
                </UButton>
                <UButton class="ml-2" size="md" label="Belépés" type="submit">
                </UButton>
              </div>
            </UForm>
            <UDivider v-if="allowWebauthn" label="VAGY" class="my-6"></UDivider>
            <div v-if="allowWebauthn">
              <h1 class="text-md text-center font-bold text-gray-400">
                Belépés WebAuthn használatával...
              </h1>
            </div>
          </template>
        </CarouselMenu>
      </UCard>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
import {
  loginStage1Schema,
  loginStage2Schema,
  type LoginStage1Schema,
  type LoginStage2Schema,
} from "~/schemas/loginSchemas";
import type { FormSubmitEvent, FormErrorEvent } from "#ui/types";
import type CarouselMenu from "~/components/CarouselMenu.vue";

const toast = useToast();
const loadingSpinner = useLoadingSpinner();
const { csrf } = useCsrf();
const userStore = useUserStore();

const allowWebauthn = ref(true);

const logincarousel = ref<InstanceType<typeof CarouselMenu> | null>(null);

const loginStage1State = ref({
  username: "",
});

const loginStage2State = ref({
  username: "",
  password: "",
});

async function loginStage1Submit(event: FormSubmitEvent<LoginStage1Schema>) {
  // TODO: Check username for WebAuthn availability
  loginStage2State.value.username = event.data.username;
  await logincarousel.value?.jumpTo(2);
  document.getElementById("stage-2-password")?.focus();
}

async function loginStage2Submit(event: FormSubmitEvent<LoginStage2Schema>) {
  loadingSpinner.value = true;
  try {
    const response = await $fetchNotification("/api/user/login", {
      method: "POST",
      body: event.data,
      headers: {
        "csrf-token": csrf,
      },
    });
    userStore.adminClass = response.user.adminClass;
    userStore.username = response.user.username;
    userStore.loggedIn = true;
  } catch (e: any) {
    loadingSpinner.value = false;
    return;
  }
  await navigateTo("/dashboard");
  loadingSpinner.value = false;
}

function loginError(event: FormErrorEvent) {
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
