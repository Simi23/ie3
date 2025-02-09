<template>
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
      <span v-if="userData?.ethernetPort" class="text-emerald-400"> Van </span>
      <span v-else class="text-red-400"> Nincs </span>
    </p>
    <p>
      <b>Szék:</b>
      <span v-if="userData?.ownChair" class="text-emerald-400"> Saját </span>
      <span v-else class="text-yellow-400"> Iskolai </span>
    </p>
  </UCard>
</template>

<script lang="ts" setup>
import type { Badge, UserData } from "~/utils/types";

type Props = {
  userId: string;
};
const props = defineProps<Props>();

const { data: userData } = useFetch<UserData>(`/api/user/${props.userId}`);

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
</script>

<style></style>
