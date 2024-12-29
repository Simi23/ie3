<template>
  <div>
    <div class="mx-10 my-10 flex flex-row flex-wrap justify-between">
      <UCard class="mr-5 grow dark:bg-opacity-90">
        <template #header>
          <h1 class="text-2xl font-bold">
            {{ userData?.fullname }} - {{ userData?.username }}
          </h1>
          <UBadge
            size="xs"
            variant="soft"
            :label="userData?.paid ? 'Fizetett' : 'Nem fizetett'"
            :color="userData?.paid ? 'emerald' : 'red'"
          />
        </template>
        <p><b>Osztály:</b> {{ userData?.class.name }}</p>
        <p><b>Email cím:</b> {{ userData?.email }}</p>
        <p>
          <b>Regisztráció ideje:</b>
          {{ registrationDate.toLocaleString("hu") }}
        </p>

        <p class="mt-4">
          <b>Jogosultság: </b>
          <UBadge
            :icon="roleDisplay.icon"
            :color="roleDisplay.color"
            :label="roleDisplay.name"
            size="xs"
            class="align-text-bottom"
          />
        </p>

        <p class="mt-4">
          <b>Számítógép:</b>
          <span v-if="userData?.ownPc" class="text-emerald-400"> Saját </span>
          <span v-else class="text-yellow-400"> Iskolai </span>
        </p>
        <p>
          <b>RJ45 aljzat:</b>
          <span v-if="userData?.ethernetPort" class="text-emerald-400">
            Van
          </span>
          <span v-else class="text-red-400"> Nincs </span>
        </p>
        <p>
          <b>Szék:</b>
          <span v-if="userData?.ownChair" class="text-emerald-400">
            Saját
          </span>
          <span v-else class="text-yellow-400"> Iskolai </span>
        </p>
      </UCard>

      <UCard class="dark:bg-opacity-90">
        <template #header>
          <h1 class="text-xl font-bold">Ülőhely - {{ userData?.seat.name }}</h1>
        </template>
        <ClientOnly>
          <SeatMap
            class="w-96"
            ref="userlocation"
            svg-id="user-location"
            arrow-stroke="#ffffff"
            seat-stroke="#222222"
            letter-stroke="#ffffff"
          ></SeatMap>
        </ClientOnly>
      </UCard>
    </div>
    <UCard class="mx-10 my-10 dark:bg-opacity-90">
      <template #header>
        <h2 class="text-xl font-bold">Munkamenetek</h2>
      </template>

      <h2 class="text-lg font-bold">Aktív munkamenetek</h2>
      <SessionTable :session-list="activeSessions" />

      <UDivider class="my-6" size="lg" />

      <h2 class="text-lg font-bold">Lejárt munkamenetek</h2>
      <SessionTable :session-list="oldSessions" />
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import userAgent from "~/utils/userAgent";
import type { Badge, ExtendedSession, UserData } from "~/utils/types";
import SeatMap from "~/components/SeatMap.vue";

definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const seatMap = useTemplateRef<InstanceType<typeof SeatMap>>("userlocation");

const route = useRoute();
const {
  data: userData,
  refresh,
  status,
} = useFetch<UserData>(`/api/user/${route.params.id}`, {
  onResponse: () => {
    colorMap();
  },
});

const registrationDate = computed(
  () => new Date(userData.value?.createdAt ?? Date()),
);

const roles: Badge[] = [
  { name: "Felhasználó", color: "sky", icon: "i-heroicons-user-solid" },
  { name: "Pénzügy", color: "emerald", icon: "i-heroicons-banknotes-solid" },
  { name: "Admin", color: "orange", icon: "i-heroicons-users-solid" },
];
const roleDisplay = computed(() => {
  return roles[userData?.value?.adminClass ?? 0];
});

const extendedSessions = computed<ExtendedSession[]>(() => {
  return (
    userData?.value?.sessions.map((session) => {
      return {
        id: session.id,
        createdAt: new Date(session.createdAt),
        expiresAt: new Date(session.expiresAt),
        valid: session.valid,
        address: session.address,
        userAgent: userAgent(session.userAgent),
      };
    }) ?? []
  );
});

const activeSessions = computed(() => {
  return extendedSessions.value.filter((session) => {
    return session.valid && session.expiresAt > new Date(Date.now());
  });
});

const oldSessions = computed(() => {
  return extendedSessions.value.filter((session) => {
    return !session.valid || session.expiresAt < new Date(Date.now());
  });
});

function colorMap() {
  console.log("Setting map...");
  seatMap.value?.changeSeatColour("all", "#374151");
  seatMap.value?.changeSeatColour(userData?.value?.seat.name ?? "", "green");
}
watch(userData, (newData, oldData) => {
  colorMap();
});

onMounted(async () => {
  await nextTick();
  colorMap();
});
</script>

<style></style>
