<template>
  <UCard
    class="dark:bg-opacity-90"
    :ui="{
      header: { padding: 'p-0 sm:p-0' },
      base: 'flex flex-col flex-nowrap',
      body: { base: 'flex-grow' },
    }"
  >
    <!-- h-[216px] -->
    <template #header>
      <NuxtImg
        :src="competition?.imageUrl"
        class="w-80 rounded-t-lg sm:w-96"
        draggable="false"
      />
    </template>

    <h1 class="mb-1 text-2xl font-extrabold">
      {{ competition?.title }}
    </h1>
    <UBadge
      v-if="competition?.participation"
      label="Jelentkeztél"
      variant="subtle"
      color="emerald"
      icon="i-heroicons-check-circle-16-solid"
      size="sm"
      class="mr-1"
      :ui="{ rounded: 'rounded-full' }"
    />
    <UBadge
      v-if="competition?.invited"
      label="Meghívó vár"
      variant="subtle"
      color="indigo"
      icon="i-heroicons-envelope"
      size="sm"
      :ui="{ rounded: 'rounded-full' }"
    />

    <template #footer>
      <div class="w-full">
        <UButton
          v-if="competition?.invited"
          block
          label="Meghívó megtekintése"
          variant="soft"
          color="fuchsia"
          class="mb-2"
          icon="i-heroicons-envelope-open"
          to="/dashboard/invites"
        />
        <UButton
          v-if="!competition?.participation"
          :label="
            competition?.teamCompetition ? 'Csapat létrehozása' : 'Jelentkezés'
          "
          block
          icon="i-heroicons-user-plus-solid"
          :loading="buttonLoad.join"
          :disabled="buttonLoad.join"
          @click="joinCompetition"
        />
        <UButton
          v-else-if="competition?.teamCompetition"
          label="Csapat megtekintése"
          block
          icon="i-heroicons-user-group-solid"
          color="indigo"
          variant="soft"
          @click="viewCompetition"
        />
        <UButton
          v-else
          label="Jelentkezés visszavonása"
          block
          icon="i-heroicons-user-minus-solid"
          color="red"
          variant="ghost"
          :loading="buttonLoad.leave"
          :disabled="buttonLoad.leave"
          @click="leaveCompetition"
        />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import ModalTeamEdit from "~/components/Modal/TeamEdit.vue";

interface Props {
  cId: string;
}

const props = defineProps<Props>();
const modal = useModal();

const { data: competition, refresh } = useFetch(
  `/api/competition/user/${props.cId}`,
  {
    lazy: true,
    server: false,
  },
);

const buttonLoad = ref({
  join: false,
  leave: false,
});

async function joinCompetition() {
  buttonLoad.value.join = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>(
      `/api/competition/join/${props.cId}`,
      {
        method: "POST",
      },
    ),
  );

  await refresh();

  buttonLoad.value.join = false;
}

async function viewCompetition() {
  modal.open(ModalTeamEdit, {
    teamId: competition.value?.teamId ?? "",
    onFinish: (refreshComp) => {
      if (refreshComp) {
        refresh();
      }
      modal.close();
    },
  });
}

async function leaveCompetition() {
  buttonLoad.value.leave = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>(
      `/api/competition/leave/${props.cId}`,
      {
        method: "POST",
      },
    ),
  );

  await refresh();

  buttonLoad.value.leave = false;
}
</script>

<style></style>
