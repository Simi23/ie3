<template>
  <div>
    <UCard class="mx-10 my-10 dark:bg-opacity-90">
      <template #header>
        <h1 class="text-xl font-bold">Beállítások</h1>
      </template>

      <h2 class="mb-2 text-lg font-semibold">Regisztrációs állapot</h2>
      <p>
        Regisztráció állapota:
        <span :class="dRegOptions[regOption].color">{{
          dRegOptions[regOption].text
        }}</span>
      </p>

      <URadioGroup v-model="regOptionSelection" :options="regOptions" />
      <UButton
        class="mr-2 mt-2 block"
        size="xs"
        label="Státusz mentése"
        @click.prevent="updateRegStatus"
      />

      <h2 class="mb-2 mt-4 text-lg font-semibold">Helyek</h2>
      <UMeter
        :value="seatStats.occupiedSeats"
        :max="seatStats.totalSeats"
        color="amber"
        size="lg"
        class="my-2 w-1/3 min-w-64"
      >
      </UMeter>
      <p>
        Összes: <span class="text-gray-200">{{ seatStats.totalSeats }}</span>
      </p>
      <p>
        Foglalt:
        <span class="text-amber-400">{{ seatStats.occupiedSeats }}</span>
      </p>
      <p>
        Szabad: <span class="text-emerald-500">{{ seatStats.freeSeats }}</span>
      </p>

      <h2 class="mb-2 mt-4 text-lg font-semibold">Iskolai PC-k</h2>
      <UMeter
        :value="pcStats.occupiedPcs"
        :max="pcStats.totalPcs"
        color="amber"
        size="lg"
        class="my-2 w-1/3 min-w-64"
      >
      </UMeter>
      <p>
        Összes: <span class="text-gray-200">{{ pcStats.totalPcs }}</span>
      </p>
      <p>
        Foglalt:
        <span class="text-amber-400">{{ pcStats.occupiedPcs }}</span>
      </p>
      <p>
        Szabad: <span class="text-emerald-500">{{ pcStats.freePcs }}</span>
      </p>
      <UFormGroup name="maxpc" label="Iskolai PC-k száma" class="my-2 h-20">
        <UInput
          type="number"
          class="inputField inline-block w-20"
          v-model="maxPcInput"
        />
        <UButton
          size="xs"
          label="Mentés"
          class="ml-2 inline-block"
          @click.prevent="updateSchoolPc"
        />
      </UFormGroup>

      <UFormGroup
        name="indexcontent"
        label="Kezdőlap tartalma"
        class="my-2 h-20"
      >
        <div class="flex flex-row flex-nowrap">
          <div class="w-48">
            <ContentSelect v-model="indexContent" />
          </div>
          <UButton
            size="xs"
            label="Mentés"
            class="ml-2"
            @click.prevent="updateIndexContent"
          />
        </div>
      </UFormGroup>
    </UCard>

    <UCard class="mx-10 my-10 dark:bg-opacity-90">
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
          @click.prevent="testMail"
        />
        <div class="clear-both"></div>
      </UForm>
    </UCard>

    <UCard class="mx-10 my-10 dark:bg-opacity-90">
      <template #header>
        <h1 class="text-xl font-bold">Osztályok</h1>
      </template>

      <div class="flex w-full">
        <div
          class="w-80 rounded-lg border border-gray-700 bg-gray-800 bg-opacity-25 p-4"
        >
          <h2 class="text-md mb-2 font-semibold">Próba választó</h2>
          <TextToggle
            class="mb-1"
            label="Rejtett osztályok mutatása"
            v-model="hiddenToggle"
          />
          <ClassSelect :show-hidden="hiddenToggle ? '1' : '0'" />
        </div>

        <div
          class="mx-6 w-96 rounded-lg border border-gray-700 bg-gray-800 bg-opacity-25 p-4"
        >
          <h2 class="text-md mb-2 font-semibold">Évfolyam hozzáadása</h2>
          <ClassGroupAdd class="mx-2" />
        </div>

        <div
          class="w-96 rounded-lg border border-gray-700 bg-gray-800 bg-opacity-25 p-4"
        >
          <h2 class="text-md mb-2 font-semibold">Osztályok hozzáadása</h2>
          <ClassAdd class="mx-2" />
        </div>
      </div>

      <UDivider size="sm" class="my-6"></UDivider>

      <div
        class="rounded-lg border border-gray-700 bg-gray-800 bg-opacity-25 p-4"
      >
        <h2 class="text-md mb-2 font-semibold">Évfolyamok</h2>
        <ClassGroupTable />
      </div>

      <UDivider size="sm" class="my-6"></UDivider>

      <div
        class="rounded-lg border border-gray-700 bg-gray-800 bg-opacity-25 p-4"
      >
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

const regOption = ref(0);
const regOptionSelection = ref(0);
const regOptions = [
  {
    label: "Még nem indult el",
    value: 0,
  },
  {
    label: "Nyitva",
    value: 1,
  },
  {
    label: "Lezárult",
    value: 2,
  },
];
const dRegOptions = [
  { text: "Még nem indult el", color: "text-amber-400" },
  { text: "Nyitva", color: "text-emerald-500" },
  { text: "Lezárult", color: "text-red-500" },
];

const { refresh: refreshMailSetting } = useFetch("/api/mail/setting", {
  method: "get",
  onResponse: (r) => {
    mailSettingState.value = r.response._data;
  },
  lazy: true,
});

const { refresh: refreshRegOption } = useFetch("/api/admin/regstatus", {
  lazy: true,
  onResponse: (r) => {
    regOption.value = Number(r.response._data);
  },
});

const { data: seatStats, refresh: refreshSeatStats } = useFetch(
  "/api/stat/seats",
  {
    lazy: true,
    default: () => {
      return {
        totalSeats: 0,
        freeSeats: 0,
        occupiedSeats: 0,
        hiddenSeats: 0,
      };
    },
  },
);

const maxPcInput = ref(0);

const { data: pcStats, refresh: refreshPcStats } = useFetch(
  "/api/stat/schoolpc",
  {
    lazy: true,
    default: () => {
      return {
        totalPcs: 0,
        freePcs: 0,
        occupiedPcs: 0,
      };
    },
    onResponse: (res) => {
      maxPcInput.value = res.response._data.totalPcs ?? 0;
    },
  },
);

const indexContent = ref<string>("");

const { refresh: refreshIndexContent } = useFetch("/api/admin/indexcontent", {
  lazy: true,
  onResponse: (res) => {
    indexContent.value = res.response._data;
  },
});

async function updateIndexContent() {
  loadingSpinner.value = true;
  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>("/api/admin/indexcontent", {
      method: "POST",
      body: {
        id: indexContent.value,
      },
    }),
  );
  await refreshIndexContent();
  loadingSpinner.value = false;
}

async function updateMailSetting() {
  loadingSpinner.value = true;
  await $fetchCsrfNotification("/api/mail/setting", {
    method: "POST",
    body: {
      host: mailSettingState.value.host,
      port: mailSettingState.value.port,
      secure: mailSettingState.value.secure,
      user: mailSettingState.value.user,
      password: mailSettingState.value.password,
      from: encodeURIComponent(mailSettingState.value.from),
    },
  }).catch();
  await refreshMailSetting();
  loadingSpinner.value = false;
}

async function testMail() {
  loadingSpinner.value = true;
  await $fetchCsrfNotification("/api/mail/test", {
    method: "POST",
  }).catch();
  loadingSpinner.value = false;
}

async function updateRegStatus() {
  loadingSpinner.value = true;
  await $fetchCsrfNotification("/api/admin/regstatus", {
    method: "POST",
    body: {
      registrationStatus: regOptionSelection.value,
    },
  }).catch();
  loadingSpinner.value = false;
  refreshRegOption();
}

async function updateSchoolPc() {
  loadingSpinner.value = true;
  await $fetchCsrfNotification("/api/admin/schoolpc", {
    method: "POST",
    body: {
      schoolpc: maxPcInput.value,
    },
  }).catch();
  loadingSpinner.value = false;
  refreshPcStats();
}
</script>

<style></style>
