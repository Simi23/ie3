<template>
  <UCard class="grow">
    <template #header>
      <h1 class="text-xl font-bold">{{ competition?.title }}</h1>
    </template>
    <div class="flex flex-col flex-nowrap">
      <div>
        <span>Típus: </span>
        <UBadge
          :label="competition?.teamCompetition ? 'Csapatos' : 'Egyéni'"
          :color="competition?.teamCompetition ? 'cyan' : 'fuchsia'"
          :icon="
            competition?.teamCompetition
              ? 'i-heroicons-user-group-solid'
              : 'i-heroicons-user-solid'
          "
          variant="soft"
          class="align-bottom"
        />
      </div>
      <div v-if="competition?.teamCompetition">
        <span>Csapatlétszám: </span>
        <span class="text-cyan-400">{{ competition.teamLimit }} fő</span>
      </div>
      <div>
        <span
          >Jelentkezett
          {{ competition?.teamCompetition ? "csapatok" : "versenyzők" }} száma:
        </span>
        <span class="text-emerald-400">
          {{ competition?.teams.length }} db
        </span>
      </div>
      <div class="mt-6 space-x-2">
        <UButton
          label="Szerkesztés"
          icon="i-heroicons-pencil"
          @click="editCompetitionModal"
        />
        <UButton
          label="Törlés"
          icon="i-heroicons-trash"
          color="red"
          @click="deleteCompetitionModal"
        />
      </div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import { type CompetitionSchema } from "~/schemas/competitionSchema";
import ModalCompetitionEdit from "~/components/Modal/CompetitionEdit.vue";
import ModalConfirmAction from "~/components/Modal/ConfirmAction.vue";

type Props = {
  competitionId: string;
};

const props = defineProps<Props>();
const modal = useModal();
const loadingSpinner = useLoadingSpinner();

const { data: competition, refresh: refreshCompetitions } = useFetch(
  `/api/competition/${props.competitionId}`,
);

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

async function editCompetitionModal() {
  if (!competition.value) return;

  modal.open(ModalCompetitionEdit, {
    title: "Verseny szerkesztése",
    defaultTitle: competition.value.title,
    defaultDescription: competition.value.description,
    defaultImage: competition.value.imageId,
    defaultTeamCompetition: competition.value.teamCompetition,
    defaultTeamLimit: competition.value.teamLimit,
    onSuccess: (comp) => {
      editCompetition(props.competitionId, comp);
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

async function deleteCompetitionModal() {
  if (!competition.value) return;

  modal.open(ModalConfirmAction, {
    title: "Verseny törlése",
    longDescription: [
      "Biztosan törli a következő versenyt:",
      `${competition.value.title}?`,
    ],
    confirmText: "Igen",
    cancelText: "Nem",
    onSuccess: () => {
      modal.close();
      deleteCompetition(props.competitionId);
    },
  });
}
</script>

<style></style>
