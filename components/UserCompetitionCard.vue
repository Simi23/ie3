<template>
  <UCard class="dark:bg-opacity-90">
    <template #header>
      <h1 class="text-xl font-bold">Versenyek</h1>
    </template>
    <div v-if="status === 'pending'">
      <USkeleton class="h-6 w-24"></USkeleton>
    </div>
    <div v-else-if="status === 'success'">
      <ul class="ml-2 list-inside list-disc">
        <li v-for="team in userData?.teams">
          <span class="underline underline-offset-4">
            <NuxtLink
              :to="`/dashboard/admin/competition/${team.team.competition.id}`"
              >{{ team.team.competition.title }}</NuxtLink
            >
          </span>

          <span v-if="team.team.competition.teamCompetition">
            - {{ team.team.name }}
          </span>
        </li>
      </ul>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
type Props = {
  userId: string;
};
const props = defineProps<Props>();

const { data: userData, status } = useFetch<UserData>(
  `/api/user/${props.userId}`,
);
</script>

<style></style>
