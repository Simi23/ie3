<template>
  <UCard class="dark:bg-opacity-90">
    <template #header>
      <h2 class="text-xl font-bold">Munkamenetek</h2>
    </template>

    <h2 class="text-lg font-bold">Aktív munkamenetek</h2>
    <SessionTable :session-list="activeSessions" />

    <UDivider class="my-6" size="lg" />

    <h2 class="text-lg font-bold">Lejárt munkamenetek</h2>
    <SessionTable :session-list="oldSessions" />
  </UCard>
</template>

<script lang="ts" setup>
type Props = {
  userId: string;
};
const props = defineProps<Props>();

const { data: userData } = useFetch<UserData>(`/api/user/${props.userId}`);

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
</script>

<style></style>
