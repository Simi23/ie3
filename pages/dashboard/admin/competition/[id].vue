<template>
  <div
    class="flex flex-col flex-nowrap gap-5 p-5 md:gap-7 md:p-7 lg:gap-10 lg:p-10"
  >
    <div
      class="flex flex-row flex-wrap justify-evenly gap-5 md:gap-7 lg:gap-10"
    >
      <CompetitionAdminCard :competition-id="$route.params.id.toString()" />
      <CompetitionMapCard :competition-id="$route.params.id.toString()" />
    </div>
    <div>
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
        <template #action-data="{ row }">
          <UButton
            label="Átnevezés"
            icon="i-heroicons-pencil-solid"
            @click="renameModal(row.teamId, row.name)"
          />
        </template>
        <template #expand="{ row }">
          <div class="p-8">
            <h2 class="text-lg font-bold">Csapattagok</h2>
            <ul class="ml-2 list-inside list-disc">
              <li v-for="member in row.users" :key="member.id" class="my-1">
                <NuxtLink
                  :text="member.fullname"
                  class="text-lg font-bold underline underline-offset-4"
                  :to="`/dashboard/admin/user/${member.id}`"
                />
                <!-- <span class="text-lg font-bold">{{ member.fullname }}</span> -->
                <span class="ml-2 text-lg font-light">{{
                  member.username
                }}</span>
                <span class="ml-2 text-lg font-normal">{{
                  member.seatName
                }}</span>

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
import ModalSingleInput from "~/components/Modal/SingleInput.vue";

const modal = useModal();
const eventBus = useMittBus();
const loadingSpinner = useLoadingSpinner();

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
  {
    label: "Művelet",
    key: "action",
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
      username: string;
      seatName: string;
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
          username: u.user.username,
          seatName: u.user.seat.name,
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

async function renameModal(teamId: string, origName: string) {
  modal.open(ModalSingleInput, {
    title: "Csapat átnevezése",
    confirmText: "Mentés",
    fieldText: "Csapatnév",
    defaultValue: origName,
    onSuccess: async (newName) => {
      loadingSpinner.value = true;
      const [error, data] = await catchError(
        $fetchCsrfNotification<NotificationResponse>(`/api/team/${teamId}`, {
          method: "PUT",
          body: {
            newName: newName,
          },
        }),
      );
      if (error === undefined) {
        await refresh();
        modal.close();
      }
      loadingSpinner.value = false;
    },
  });
}
</script>

<style></style>
