<template>
  <UModal>
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">{{ username }} átültetése</h1>
      </template>
      <SeatMap
        ref="seatswap-map"
        svg-id="seatswap-map"
        arrow-stroke="#ffffff"
        seat-stroke="#222222"
        letter-stroke="#ffffff"
        class="w-[480px]"
        @chosen-seat="seatEvent"
      />
      <MapLegend color="text-[#b6b91c]">Jelenlegi hely</MapLegend>
      <MapLegend color="text-[#059669]">Szabad helyek</MapLegend>
      <MapLegend color="text-[#b91c1c]">Foglalt helyek</MapLegend>

      <div class="my-2">
        <p>Vagy válassz a rejtett ülésekből:</p>
        <USelectMenu :options="hiddenSeats" v-model="selectedHiddenSeat" />
      </div>

      <div class="text-md">
        <p class="text-xl font-bold">Kiválasztott művelet:</p>
        <p v-if="seatTaken">
          Helycsere <span class="font-bold">{{ otherOwner }}</span> (<span
            class="font-bold"
            >{{ selectedSeat }}</span
          >) felhasználóval
        </p>
        <p v-else>
          Átültetés <span class="font-bold">{{ selectedSeat }}</span> helyre
        </p>
      </div>

      <template #footer>
        <div class="flex flex-row flex-nowrap justify-end">
          <div class="space-x-2">
            <UButton label="Mégse" color="indigo" @click="emit('success')" />
            <UButton label="Megerősít" color="emerald" @click="handleSwap" />
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import SeatMapComponent from "~/components/SeatMap.vue";

type t_SeatMap = InstanceType<typeof SeatMapComponent>;
const rSeatMap = useTemplateRef<t_SeatMap>("seatswap-map");

type Props = {
  userId: string;
  username: string;
  originalSeat: string;
};

const props = defineProps<Props>();
const emit = defineEmits<{
  success: [];
}>();

const { data: seatData, refresh } = useFetch("/api/seat");

const selectedSeat = ref("");
const seatTaken = computed(() => {
  const owner = seatData.value?.find(
    (s) => s.name == selectedSeat.value,
  )?.owner;
  return owner !== null && owner !== undefined;
});
const otherOwner = computed(() => {
  const owner = seatData.value?.find(
    (s) => s.name == selectedSeat.value,
  )?.owner;
  return owner?.fullname;
});

const selectedHiddenSeat = ref("");
watch(selectedHiddenSeat, (v1, v0) => (selectedSeat.value = v1));

const hiddenSeats = computed(() => {
  return seatData.value
    ?.filter((s) => !s.public && s.name != "SWAP")
    .sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    })
    .map((s) => s.name);
});

watch(seatData, resetSeats);

function resetSeats() {
  if (rSeatMap.value === null) return;

  rSeatMap.value.clearSeatEvents();
  rSeatMap.value.changeSeatColour("all", "#b91c1c");
  if (seatData === null || seatData.value === null) return;
  for (let i = 0; i < seatData.value.length; i++) {
    const curSeat = seatData.value[i];
    if (curSeat.owner === null) {
      rSeatMap.value.changeSeatColour(curSeat.name, "#059669");
    } else {
      rSeatMap.value.changeSeatColour(curSeat.name, "#b91c1c");
    }
    if (curSeat.name !== props.originalSeat) {
      rSeatMap.value.assignSeat(curSeat.name);
    }
  }
  rSeatMap.value.changeSeatColour(props.originalSeat, "#b6b91c");
}

function seatEvent(seatName: string) {
  if (rSeatMap.value === null) return;
  rSeatMap.value.cancelHighlight();
  rSeatMap.value.highlightSeat(seatName, false);
  selectedSeat.value = seatName;
}

async function handleSwap() {
  const [error, response] = await catchError(
    $fetchCsrfNotification<NotificationResponse>("/api/seat/swap", {
      method: "POST",
      body: {
        userId: props.userId,
        newSeatName: selectedSeat.value,
      },
    }),
  );
  if (error === undefined) {
    emit("success");
  }
}
</script>

<style></style>
