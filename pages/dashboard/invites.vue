<template>
  <div class="p-5 md:p-7 lg:p-10">
    <UCard class="dark:bg-opacity-90">
      <template #header>
        <h1 class="text-xl font-bold">
          Meghívók ({{ invites?.length ?? "0" }} db)
        </h1>
      </template>
      <h2
        v-if="invites == null || invites.length == 0"
        class="text-center text-lg"
      >
        <UIcon name="i-heroicons-envelope-open" />
        Jelenleg nincs meghívód
      </h2>
      <div v-else>
        <div
          v-for="inv in invites"
          :key="inv.id"
          class="my-4 flex w-full flex-row flex-nowrap items-center justify-between md:my-6 lg:my-8"
        >
          <div class="flex-grow">
            <h2 class="text-xl font-extrabold">{{ inv.teamName }}</h2>
            <h3 class="text-lg font-bold text-gray-500">
              {{ inv.competitionTitle }}
            </h3>
          </div>
          <div
            class="flex w-24 flex-row flex-wrap justify-evenly gap-2 sm:w-fit"
          >
            <UButton
              color="red"
              label="Elutasít"
              icon="i-heroicons-x-mark"
              variant="soft"
              @click="declineInvite(inv.id)"
            />
            <UButton
              color="emerald"
              label="Elfogad"
              icon="i-heroicons-check"
              @click="acceptInvite(inv.id)"
            />
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const loadingSpinner = useLoadingSpinner();

const { data: invites, refresh } = useFetch("/api/invite", {
  lazy: true,
});

async function acceptInvite(id: string) {
  loadingSpinner.value = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>(`/api/invite/accept/${id}`, {
      method: "POST",
    }),
  );

  await refresh();

  loadingSpinner.value = false;
}

async function declineInvite(id: string) {
  loadingSpinner.value = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>(`/api/invite/${id}`, {
      method: "DELETE",
    }),
  );

  await refresh();

  loadingSpinner.value = false;
}
</script>

<style></style>
