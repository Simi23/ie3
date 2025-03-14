<template>
  <UCard>
    <template #header>
      <h1 class="text-xl font-bold">Csapattérkép</h1>
    </template>
    <div>
      <ClientOnly>
        <SeatMap
          class="w-80 sm:w-96"
          ref="competition"
          svg-id="competition"
          arrow-stroke="#ffffff"
          seat-stroke="#222222"
          letter-stroke="#ffffff"
          @chosen-seat="chosenSeat"
        ></SeatMap>
      </ClientOnly>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import SeatMap from "~/components/SeatMap.vue";

type Props = {
  competitionId: string;
};

const props = defineProps<Props>();
const seatMap = useTemplateRef<InstanceType<typeof SeatMap>>("competition");
const selectedTeam = ref("");
const eventBus = useMittBus();

const { data: competition, refresh } = useFetch(
  `/api/competition/${props.competitionId}`,
  {
    server: false,
    lazy: true,
  },
);

eventBus.on("refresh-team-map", () => {
  refresh();
});

const mapColors = computed(() => {
  const colorSeats: {
    seatName: string;
    color: string;
    teamId: string;
  }[] = [];

  if (competition.value === null || competition.value === undefined) return [];

  let teamCount = competition.value.teams?.length ?? 0;
  for (let i = 0; i < teamCount; i++) {
    const team = competition.value.teams[i];
    const hue = Math.round((360 / teamCount) * i);

    // teamColors.value["team-" + team.id] = `hsl(${hue + 60} 80% 40%)`;
    for (let j = 0; j < team.users.length; j++) {
      const user = team.users[j].user;
      colorSeats.push({
        seatName: user.seat.name,
        color: `hsl(${hue + 60} 60% 40%)`,
        teamId: team.id,
      });
    }
  }

  return colorSeats;
});

function recolorMap() {
  if (seatMap.value == null) return;

  seatMap.value.changeSeatColour("all", "#374151");

  for (let i = 0; i < mapColors.value.length; i++) {
    const row = mapColors.value[i];

    seatMap.value.changeSeatColour(row.seatName, row.color);
    seatMap.value.assignSeat(row.seatName, row.teamId);
  }
}

function chosenSeat(teamId: string) {
  if (seatMap.value == null) return;

  seatMap.value.cancelHighlight();
  eventBus.emit("selected-team", { teamId: teamId });

  if (teamId === selectedTeam.value) {
    selectedTeam.value = "";
    return;
  }

  selectedTeam.value = teamId;

  mapColors.value
    .filter((m) => m.teamId == teamId)
    .forEach((s) => {
      seatMap.value?.highlightSeat(s.seatName, false, true);
      console.log(s.seatName);
    });
}

watch(
  mapColors,
  () => {
    recolorMap();
  },
  { deep: true },
);

onMounted(async () => {
  await nextTick();
  refresh();
});
</script>

<style></style>
