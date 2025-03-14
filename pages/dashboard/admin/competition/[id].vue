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
        v-model:expand="expand"
      >
        <template #color-data="{ row }">
          <div
            class="h-3 w-5 rounded-sm"
            :style="{ 'background-color': row.color }"
          ></div>
        </template>
        <template #count-data="{ row }">
          <UBadge
            :label="`${row.count} fő`"
            :color="row.count == competition?.teamLimit ? 'green' : 'yellow'"
            variant="soft"
          />
        </template>
        <template #chosen-data="{ row }">
          <div class="w-20">
            <UBadge v-if="row.chosen" label="Kiválasztva" color="white" />
          </div>
        </template>
        <template #expand="{ row }">
          <div class="p-8">
            <h2 class="text-lg font-bold">Csapattagok</h2>
            <ul class="ml-2 list-inside list-disc">
              <li v-for="member in row.users" :key="member.id" class="my-1">
                <span class="text-lg">{{ member.fullname }}</span>

                <UTooltip text="Kirúgás" class="ml-3 align-bottom">
                  <UButton
                    v-if="member.leader"
                    icon="i-heroicons-x-mark"
                    color="red"
                    variant="soft"
                    size="xs"
                    @click="showConfirm('delTeam', member.id, row.teamId)"
                  />
                  <UButton
                    v-else
                    icon="i-heroicons-x-mark"
                    color="red"
                    variant="soft"
                    size="xs"
                    @click="showConfirm('kick', member.id, row.teamId)"
                  />
                </UTooltip>

                <UBadge
                  v-if="member.leader"
                  class="ml-3 align-text-bottom"
                  icon="i-heroicons-chevron-double-up-16-solid"
                  label="Csapatvezető"
                  variant="subtle"
                  color="amber"
                  size="xs"
                  :ui="{ rounded: 'rounded-full' }"
                />
              </li>
            </ul>
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ModalConfirmAction from "~/components/Modal/ConfirmAction.vue";

const modal = useModal();
const eventBus = useMittBus();

const chosenTeamId = ref("");

definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const expand = ref({
  openedRows: [],
  row: {},
});

const cols = ref([
  {
    label: "Szín",
    key: "color",
  },
  {
    label: "Térkép",
    key: "chosen",
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
]);

eventBus.on("selected-team", (e: any) => {
  if (e.teamId === chosenTeamId.value) {
    chosenTeamId.value = "";
  } else {
    chosenTeamId.value = e.teamId;
  }
});

const { data: competition, refresh } = useFetch(
  `/api/competition/${useRoute().params.id}`,
);

const teamRows = computed(() => {
  const rows: {
    teamId: string;
    color: string;
    name: string;
    chosen: boolean;
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
      name: competition.value.teamCompetition
        ? team.name
        : team.users[0].user.fullname,
      count: team.users.length,
      chosen: team.id === chosenTeamId.value,
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

async function showConfirm(
  action: "delTeam" | "kick",
  userId: string,
  teamId: string,
) {
  const teamName = teamRows.value.find((r) => r.teamId == teamId)?.name;
  const userName = teamRows.value
    .find((r) => r.users.some((u) => u.id == userId))
    ?.users.find((u) => u.id == userId)?.fullname;

  modal.open(ModalConfirmAction, {
    danger: true,
    title: action == "delTeam" ? "Csapat törlése" : "Csapattag kirúgása",
    description:
      action == "delTeam"
        ? `Biztosan törlöd '${teamName}' csapatot?`
        : `Biztosan kirúgod '${userName}' felhasználót?`,
    confirmText: action == "delTeam" ? "Törlés" : "Kirúgás",
    onSuccess: async () => {
      const [error, resp] = await catchError(
        $fetchCsrfNotification<NotificationResponse>("/api/team/kick", {
          method: "POST",
          body: {
            teamId: teamId,
            kickId: userId,
            invite: false,
          },
        }),
      );

      eventBus.emit("refresh-team-map");
      refresh();

      if (error === undefined) {
        modal.close();
      }
    },
  });
}
</script>

<style></style>
