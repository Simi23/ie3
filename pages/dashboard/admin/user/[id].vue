<template>
  <div>
    <UCard class="mx-10 my-10 dark:bg-opacity-90">
      <template #header>
        <h1 class="text-xl font-bold">
          {{ userData?.fullname }} - {{ userData?.username }}
        </h1>
      </template>
      <p><b>Osztály:</b> {{ userData?.class.name }}</p>
      <p><b>Email cím:</b> {{ userData?.email }}</p>
      <p>
        <b>Regisztráció ideje:</b>
        {{ registrationDate.toLocaleString("hu") }}
      </p>
      <p><b>Jogosultság: </b>{{ roles[userData?.adminClass ?? 0] }}</p>
    </UCard>
    <UCard class="mx-10 my-10 dark:bg-opacity-90">
      <template #header>
        <h2 class="text-lg font-bold">Munkamenetek</h2>
      </template>

      <h2 class="text-md font-bold">Aktív munkamenetek</h2>
      <p v-for="session in activeSessions" :key="session.id">
        Munkamenet {{ session.address }}
        <UBadge
          v-for="badge in session.userAgent.icons"
          :label="badge.name"
          :color="badge.color"
          :icon="badge.icon"
        />
      </p>

      <h2 class="text-md font-bold">Lejárt munkamenetek</h2>
      <p v-for="session in oldSessions" :key="session.id">
        Munkamenet {{ session.address }}
        <UBadge
          v-for="badge in session.userAgent.icons"
          :label="badge.name"
          :color="badge.color"
          :icon="badge.icon"
        />
      </p>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import userAgent from "~/utils/userAgent";

definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const route = useRoute();

const roles = ["Felhasználó", "Pénzügy", "Admin"];

type UserData = {
  id: string;
  createdAt: Date;
  email: string;
  username: string;
  fullname: string;
  class: {
    name: string;
  };
  adminClass: number;
  sessions: {
    id: string;
    createdAt: Date;
    expiresAt: Date;
    valid: boolean;
    address: string;
    userAgent: string;
  }[];
  ownPc: boolean;
  ethernetPort: boolean;
  ownChair: boolean;
  teams: {
    isLeader: boolean;
    isPending: boolean;
    team: {
      name: string;
      competition: {
        id: string;
        title: string;
        teamCompetition: boolean;
      };
    };
  }[];
  competitions: {
    id: string;
    title: string;
  }[];
  seat: {
    name: string;
    public: boolean;
  };
  paid: boolean;
};

const {
  data: userData,
  refresh,
  status,
} = useFetch<UserData>(`/api/user/${route.params.id}`);

const registrationDate = computed(
  () => new Date(userData.value?.createdAt ?? Date()),
);

const extendedSessions = computed(() => {
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
</script>

<style></style>
