<template>
  <div>
    <UCard class="mx-10 my-10">
      <template #header>
        <h1 class="text-xl font-bold">Beállítások</h1>
      </template>

      <h2 class="text-md mb-2 font-semibold">Regisztrációs állapot</h2>
      Állítás, státusz, (elkelt helyek, elérhető helyek)
      <h2 class="text-md mb-2 mt-4 font-semibold">Iskolai PC-k</h2>
      Állítás, elkelt / elérhető
    </UCard>

    <UCard class="mx-10 my-10">
      <template #header>
        <h1 class="text-xl font-bold">Email beállítások</h1>
      </template>

      <!-- Host port forcessl user password from Sender "<sender@email.com>" -->
      <UForm
        :schema="mailSettingSchema"
        :state="mailSettingState"
        @submit.prevent="updateMailSetting"
        class="w-1/3 min-w-60"
      >
        <UFormGroup name="host" label="Hoszt" class="mx-1 my-2 h-20">
          <UInput
            v-model="mailSettingState.host"
            type="text"
            class="inputField"
          />
        </UFormGroup>
        <UFormGroup name="port" label="Port" class="mx-1 my-2 h-20">
          <UInput
            v-model="mailSettingState.port"
            type="number"
            class="inputField"
          />
        </UFormGroup>

        <TextToggle label="SSL (Force SSL)" v-model="mailSettingState.secure" />

        <UFormGroup name="user" label="Felhasználónév" class="mx-1 my-2 h-20">
          <UInput
            v-model="mailSettingState.user"
            type="text"
            class="inputField"
          />
        </UFormGroup>
        <UFormGroup name="password" label="Jelszó" class="mx-1 my-2 h-20">
          <UInput
            v-model="mailSettingState.password"
            type="password"
            class="inputField"
          />
        </UFormGroup>
        <UFormGroup
          name="from"
          label='Küldő (Példa Küldő "<pelda@kuldo.hu>")'
          class="mx-1 my-2 h-20"
        >
          <UInput
            v-model="mailSettingState.from"
            type="text"
            class="inputField"
          />
        </UFormGroup>

        <UButton
          class="float-left ml-auto mr-2 mt-5 block"
          size="md"
          label="Mentés"
          type="submit"
        />
        <UButton
          class="float-left ml-auto mr-2 mt-5 block"
          size="md"
          label="Teszt"
          color="emerald"
          @submit.prevent="testMail"
        />
        <div class="clear-both"></div>
      </UForm>
    </UCard>

    <UCard class="mx-10 my-10">
      <template #header>
        <h1 class="text-xl font-bold">Osztályok</h1>
      </template>

      <div class="flex w-full">
        <div class="w-80 rounded-lg border border-gray-700 bg-gray-950 p-4">
          <h2 class="text-md mb-2 font-semibold">Próba választó</h2>
          <TextToggle
            class="mb-1"
            label="Rejtett osztályok mutatása"
            v-model="hiddenToggle"
          />
          <ClassSelect :show-hidden="hiddenToggle ? '1' : '0'" />
        </div>

        <div
          class="mx-6 w-96 rounded-lg border border-gray-700 bg-gray-950 p-4"
        >
          <h2 class="text-md mb-2 font-semibold">Évfolyam hozzáadása</h2>
          <ClassGroupAdd class="mx-2" />
        </div>

        <div class="w-96 rounded-lg border border-gray-700 bg-gray-950 p-4">
          <h2 class="text-md mb-2 font-semibold">Osztályok hozzáadása</h2>
          <ClassAdd class="mx-2" />
        </div>
      </div>

      <UDivider size="sm" class="my-6"></UDivider>

      <div class="rounded-lg border border-gray-700 bg-gray-950 p-4">
        <h2 class="text-md mb-2 font-semibold">Évfolyamok</h2>
        <ClassGroupTable />
      </div>

      <UDivider size="sm" class="my-6"></UDivider>

      <div class="rounded-lg border border-gray-700 bg-gray-950 p-4">
        <h2 class="text-md mb-2 font-semibold">Osztályok</h2>
        <ClassTable />
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import {
  mailSettingSchema,
  type MailSettingSchema,
} from "~/schemas/mailSettingSchema";

definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const { csrf } = useCsrf();
const loadingSpinner = useLoadingSpinner();

const hiddenToggle = ref(true);

const mailSettingState = ref({
  host: "",
  port: 1,
  secure: false,
  user: "",
  password: "",
  from: "",
});

const { refresh: refreshMailSetting } = useFetch("/api/mail/setting", {
  method: "get",
  onResponse: (r) => {
    mailSettingState.value = r.response._data;
  },
  lazy: true,
});

async function updateMailSetting() {
  loadingSpinner.value = true;
  await $fetchNotification("/api/mail/setting", {
    method: "POST",
    headers: {
      "csrf-token": csrf,
    },
    body: {
      host: mailSettingState.value.host,
      port: mailSettingState.value.port,
      secure: mailSettingState.value.secure,
      user: mailSettingState.value.user,
      password: mailSettingState.value.password,
      from: encodeURIComponent(mailSettingState.value.from),
    },
  }).catch(() => {
    loadingSpinner.value = false;
  });
  await refreshMailSetting();
  loadingSpinner.value = false;
}

async function testMail() {}
</script>

<style></style>
