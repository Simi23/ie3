<template>
  <div>
    <UContainer class="flex min-h-screen w-fit items-center">
      <UCard class="h-fit min-w-72">
        <template #header>
          <h1 class="text-center text-2xl font-bold">Bejelentkezés</h1>
        </template>

        <CarouselMenu
          ref="logincarousel"
          :pagecount="2"
          initialheight="9rem"
          name="login"
        >
          <template #page1>
            <UForm
              ref="loginform1"
              :schema="loginStage1Schema"
              :state="loginStage1State"
              @error="loginError"
              @submit.prevent="loginStage1Submit"
              class="w-[280px]"
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
                />
              </UFormGroup>

              <div class="float-right mt-5">
                <UButton
                  size="sm"
                  label="Regisztráció"
                  to="/register"
                  variant="ghost"
                  icon="i-heroicons-user-plus"
                  class="h-full align-middle"
                />
                <UButton
                  class="ml-2 align-middle"
                  size="sm"
                  label="Tovább"
                  type="submit"
                />
              </div>
              <div class="clear-both"></div>
            </UForm>
          </template>
          <template #page2>
            <UForm
              ref="loginform2"
              :schema="loginStage2Schema"
              :state="loginStage2State"
              @error="loginError"
              @submit.prevent="loginStage2Submit"
              class="w-[280px]"
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
                />
              </UFormGroup>

              <UFormGroup name="password" label="Jelszó" class="mx-1 my-2 h-20">
                <UInput
                  id="stage-2-password"
                  v-model="loginStage2State.password"
                  class="inputField"
                  type="password"
                  placeholder="Jelszó"
                />
              </UFormGroup>

              <div class="mt-4 flex justify-end">
                <UButton
                  variant="ghost"
                  size="md"
                  label="Vissza"
                  icon="i-heroicons-arrow-small-left"
                  @click="logincarousel?.jumpTo(1)"
                />
                <UButton class="ml-2" size="md" label="Belépés" type="submit" />
              </div>
            </UForm>
            <UDivider v-if="allowWebauthn" label="VAGY" class="my-6" />
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
import type { FormSubmitEvent } from "#ui/types";
import type CarouselMenu from "~/components/CarouselMenu.vue";

const toast = useToast();
const loadingSpinner = useLoadingSpinner();
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
    const response = await $fetchCsrfNotification("/api/user/login", {
      method: "POST",
      body: event.data,
    });
    userStore.adminClass = response.user.adminClass;
    userStore.username = response.user.username;
    userStore.loggedIn = true;
  } catch {
    loadingSpinner.value = false;
    return;
  }
  await navigateTo("/dashboard");
  loadingSpinner.value = false;
}

function loginError() {
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
