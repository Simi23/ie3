<template>
  <div class="p-5 md:p-7 lg:p-10">
    <UCard class="dark:bg-opacity-90">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold">Versenyek</h1>
          <UButton
            icon="i-heroicons-plus"
            label="Új verseny"
            @click="newCompetitionModal"
          />
        </div>
      </template>

      <UTable
        :columns="cols"
        :rows="competitionRows"
        :loading="status === 'pending'"
        :loading-state="{
          icon: 'i-heroicons-arrow-path-20-solid',
          label: 'Betöltés...',
        }"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'Nincs megjeleníthető adat',
        }"
      >
        <template #teamLimit-data="{ row }">
          <UBadge
            v-if="row.teamCompetition"
            :label="row.teamLimit"
            class="mr-2"
          />
          <UBadge
            :label="row.teamCompetition ? 'Csapatos' : 'Egyéni'"
            :color="row.teamCompetition ? 'cyan' : 'fuchsia'"
            :icon="
              row.teamCompetition
                ? 'i-heroicons-user-group-solid'
                : 'i-heroicons-user-solid'
            "
            variant="soft"
            class="align-bottom"
          />
        </template>
        <template #action-data="{ row }">
          <UTooltip text="Szerkesztés">
            <UButton
              color="indigo"
              icon="i-heroicons-pencil-square-solid"
              :square="true"
              @click="editCompetitionModal(row.id)"
            />
          </UTooltip>
          <UButton
            color="cyan"
            icon="i-heroicons-list-bullet"
            label="Részletek"
            class="mx-3"
            variant="soft"
            :to="`/dashboard/admin/competition/${row.id}`"
          />
          <UButton
            label="Törlés"
            icon="i-heroicons-trash-solid"
            variant="soft"
            color="red"
            @click="deleteCompetitionModal(row.id)"
          />
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { type CompetitionSchema } from "~/schemas/competitionSchema";
import ModalCompetitionEdit from "~/components/Modal/CompetitionEdit.vue";
import ModalConfirmAction from "~/components/Modal/ConfirmAction.vue";

const modal = useModal();
const loadingSpinner = useLoadingSpinner();

definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const cols = [
  {
    key: "title",
    label: "Név",
  },
  {
    key: "teamLimit",
    label: "Csapat limit",
  },
  {
    key: "teamCount",
    label: "Csapatok száma",
  },
  {
    key: "action",
    label: "Műveletek",
  },
];

const {
  data: competitionRows,
  refresh: refreshCompetitions,
  status,
} = useFetch("/api/competition", {
  default: () => [],
});

async function newCompetition(competitionData: CompetitionSchema) {
  loadingSpinner.value = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>("/api/competition", {
      method: "POST",
      body: {
        title: competitionData.title,
        description: competitionData.description,
        image: competitionData.image,
        teamCompetition: competitionData.teamCompetition,
        teamLimit: competitionData.teamLimit,
      },
    }),
  );

  await refreshCompetitions();
  loadingSpinner.value = false;

  if (error === undefined) {
    modal.close();
  }
}

async function newCompetitionModal() {
  modal.open(ModalCompetitionEdit, {
    title: "Új verseny",
    onSuccess: (comp) => {
      newCompetition(comp);
    },
  });
}

async function editCompetition(
  competitionId: string,
  competition: CompetitionSchema,
) {
  loadingSpinner.value = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>(
      `/api/competition/${competitionId}`,
      {
        method: "PUT",
        body: {
          ...competition,
        },
      },
    ),
  );
  await refreshCompetitions();
  loadingSpinner.value = false;
  if (error === undefined) {
    modal.close();
  }
}

async function editCompetitionModal(competitionId: string) {
  const currentCompetition = competitionRows.value.find(
    (c) => c.id == competitionId,
  );
  if (currentCompetition === undefined) return;

  modal.open(ModalCompetitionEdit, {
    title: "Verseny szerkesztése",
    defaultTitle: currentCompetition.title,
    defaultDescription: currentCompetition.description,
    defaultImage: currentCompetition.imageId,
    defaultTeamCompetition: currentCompetition.teamCompetition,
    defaultTeamLimit: currentCompetition.teamLimit,
    onSuccess: (comp) => {
      editCompetition(competitionId, comp);
    },
  });
}

async function deleteCompetition(competitionId: string) {
  loadingSpinner.value = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>(
      `/api/competition/${competitionId}`,
      {
        method: "DELETE",
      },
    ),
  );

  await refreshCompetitions();
  loadingSpinner.value = false;
}

async function deleteCompetitionModal(competitionId: string) {
  const currentCompetition = competitionRows.value.find(
    (c) => c.id == competitionId,
  );
  if (currentCompetition === undefined) return;

  modal.open(ModalConfirmAction, {
    title: "Verseny törlése",
    longDescription: [
      "Biztosan törli a következő versenyt:",
      `${currentCompetition.title}?`,
    ],
    confirmText: "Igen",
    cancelText: "Nem",
    onSuccess: () => {
      modal.close();
      deleteCompetition(competitionId);
    },
  });
}
</script>

<style></style>
