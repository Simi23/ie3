<template>
  <div>
    <div
      class="flex flex-row flex-wrap justify-evenly gap-5 p-5 md:p-7 lg:p-10"
    >
      <CompetitionAdminCard :competition-id="$route.params.id.toString()" />
      <CompetitionMapCard :competition-id="$route.params.id.toString()" />
    </div>
    <div class="p-5 md:p-7 lg:p-10">
      <UTable
        :columns="cols"
        :rows="teamRows"
        class="rounded-md bg-gray-900/90"
      >
      </UTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const cols = ref([
  {
    label: "Szín",
    key: "color",
  },
  {
    label: "Név",
    key: "name",
    sortable: true,
  },
  {
    label: "Létszám",
    key: "count",
  },
  {
    label: "Művelet",
    key: "action",
  },
]);

const { data: competition, refresh } = useFetch(
  `/api/competition/${useRoute().params.id}`,
);

const teamRows = computed(() => {
  const rows: {
    teamId: string;
    color: string;
    name: string;
    count: number;
    users: {
      id: string;
      fullname: string;
      leader: boolean;
    }[];
  }[] = [];

  if (competition.value === null || competition.value === undefined) return [];

  let teamCount = competition.value.teams?.length ?? 0;
  for (let i = 0; i < teamCount; i++) {
    const team = competition.value.teams[i];
    const hue = Math.round((360 / teamCount) * i);

    // teamColors.value["team-" + team.id] = `hsl(${hue + 60} 80% 40%)`;
    rows.push({
      teamId: team.id,
      color: `hsl(${hue + 60} 60% 40%)`,
      name: team.name,
      count: team.users.length,
      users: team.users.map((u) => {
        return {
          id: u.user.id,
          fullname: u.user.fullname,
          leader: u.isLeader,
        };
      }),
    });
  }

  return rows;
});
</script>

<style></style>
