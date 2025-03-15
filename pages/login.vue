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
          initialheight="264px"
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
                  autocomplete="username"
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
            <UDivider label="VAGY" class="my-8" />
            <div>
              <UButton
                block
                label="Belépés Discorddal"
                icon="i-fa6-brands-discord"
                color="discord"
                :ui="{
                  variant: {
                    solid:
                      'text-gray-50 dark:text-gray-50 dark:hover:bg-discord-600 hover:bg-discord-600',
                  },
                }"
                @click="discordLogin"
              />
            </div>
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

              <UFormGroup name="password" label="Jelszó" class="mx-1 mt-2 h-20">
                <UInput
                  id="stage-2-password"
                  v-model="loginStage2State.password"
                  class="inputField"
                  type="password"
                  placeholder="Jelszó"
                  autocomplete="password"
                />
              </UFormGroup>

              <UButton
                label="Elfelejtett jelszó"
                variant="link"
                to="/startrecover"
              />

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
const cfg = useRuntimeConfig();
const route = useRoute();

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
    userStore.userId = response.user.id;
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

function discordLogin() {
  const redirect_uri_base = encodeURIComponent(
    `${cfg.public.siteName}/api/discord/logincallback`,
  );
  const redirect_uri = `https://discord.com/oauth2/authorize?client_id=1338156490137141270&response_type=code&redirect_uri=${redirect_uri_base}&scope=identify&prompt=none`;

  return navigateTo(redirect_uri, {
    external: true,
  });
}

onMounted(async () => {
  await nextTick();
  if (route.query.notification == "notlinked") {
    toast.add({
      title: "Hiba",
      description: "Ehhez a Discord fiókhoz nem tartozik felhasználó!",
      icon: "i-heroicons-x-mark-20-solid",
      color: "amber",
    });
  }
});
</script>

<style>
.inputField ~ p {
  user-select: none;
  margin-top: 0;
}
</style>
