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
        <UButton label="Szerkesztés" icon="i-heroicons-pencil" />
        <UButton label="Törlés" icon="i-heroicons-trash" color="red" />
      </div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
type Props = {
  competitionId: string;
};
const props = defineProps<Props>();

const { data: competition } = useFetch(
  `/api/competition/${props.competitionId}`,
);
</script>

<style></style>
