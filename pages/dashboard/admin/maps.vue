<template>
  <div class="flex flex-row flex-wrap justify-evenly">
    <UCard class="mx-5 my-5 dark:bg-opacity-90">
      <template #header>
        <h1 class="text-xl font-bold">Számítógépek</h1>
      </template>
      <SeatMap
        class="w-[512px] p-2"
        svg-id="statmap-pc"
        ref="map-pc"
        arrow-stroke="#ffffff"
        seat-stroke="#222222"
        letter-stroke="#ffffff"
        @chosen-seat="onSelectPc"
      />
      <MapLegend color="text-cyan-600">Saját gép</MapLegend>
      <MapLegend color="text-fuchsia-600">Iskolai gép</MapLegend>
      <MapLegend color="text-[#374151]">Üres hely</MapLegend>
      <div class="pl-3 pt-3">
        <span class="mr-2 font-bold">Kiválasztott felhasználó:</span>
        <UButton
          :label="selectPc ? selectPc.name : 'Nincs'"
          :to="`/dashboard/admin/user/${selectPc?.id}`"
          :disabled="!selectPc"
        />
      </div>
    </UCard>

    <UCard class="mx-5 my-5 dark:bg-opacity-90">
      <template #header>
        <h1 class="text-xl font-bold">Székek</h1>
      </template>
      <div>
        <SeatMap
          class="w-[512px] p-2"
          svg-id="statmap-chair"
          ref="map-chair"
          arrow-stroke="#ffffff"
          seat-stroke="#222222"
          letter-stroke="#ffffff"
          @chosen-seat="onSelectChair"
        />
        <MapLegend color="text-cyan-600">Saját szék</MapLegend>
        <MapLegend color="text-fuchsia-600">Iskolai szék</MapLegend>
        <MapLegend color="text-[#374151]">Üres hely</MapLegend>
      </div>
      <div class="p-4">
        <span class="mr-2 font-bold">Kiválasztott felhasználó:</span>
        <UButton
          :label="selectChair ? selectChair.name : 'Nincs'"
          :to="`/dashboard/admin/user/${selectChair?.id}`"
          :disabled="!selectChair"
        />
      </div>
    </UCard>

    <UCard class="mx-5 my-5 dark:bg-opacity-90">
      <template #header>
        <h1 class="text-xl font-bold">Csatlakozás</h1>
      </template>
      <div>
        <SeatMap
          class="w-[512px] p-2"
          svg-id="statmap-connectivity"
          ref="map-ethernet"
          arrow-stroke="#ffffff"
          seat-stroke="#222222"
          letter-stroke="#ffffff"
          @chosen-seat="onSelectEthernet"
        />
        <MapLegend color="text-cyan-600">RJ45</MapLegend>
        <MapLegend color="text-fuchsia-600">WiFi</MapLegend>
        <MapLegend color="text-[#374151]">Üres hely</MapLegend>
      </div>
      <div class="p-4">
        <span class="mr-2 font-bold">Kiválasztott felhasználó:</span>
        <UButton
          :label="selectEthernet ? selectEthernet.name : 'Nincs'"
          :to="`/dashboard/admin/user/${selectEthernet?.id}`"
          :disabled="!selectEthernet"
        />
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import SeatMap from "~/components/SeatMap.vue";

definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const mapPc = useTemplateRef<InstanceType<typeof SeatMap>>("map-pc");
const mapChair = useTemplateRef<InstanceType<typeof SeatMap>>("map-chair");
const mapEthernet =
  useTemplateRef<InstanceType<typeof SeatMap>>("map-ethernet");

const { data: pcData, refresh: refreshPc } = await useFetch(
  "/api/stat/map/pc",
  {
    onResponse: (r) => {
      setSeats(mapPc, r.response._data);
    },
    server: false,
    lazy: true,
  },
);

const { data: chairData, refresh: refreshChair } = await useFetch(
  "/api/stat/map/chair",
  {
    onResponse: (r) => {
      setSeats(mapChair, r.response._data);
    },
    server: false,
    lazy: true,
  },
);
const { data: ethernetData, refresh: refreshEthernet } = await useFetch(
  "/api/stat/map/ethernet",
  {
    onResponse: (r) => {
      setSeats(mapEthernet, r.response._data);
    },
    server: false,
    lazy: true,
  },
);

type Data = {
  name: string;
  owner: {
    id: string;
    fullname: string;
    classname: string;
  };
  stat: boolean;
}[];

type MapType = typeof mapPc;

function setSeats(map: MapType, data: Data) {
  map.value?.clearSeatEvents();
  map.value?.changeSeatColour("all", "#374151");
  data.forEach((d) => {
    map.value?.changeSeatColour(d.name, d.stat ? "#1381b6" : "#bc2fab");
    map.value?.assignSeat(d.name);
  });
}

// Selection of positions

type SelectType = {
  id: string;
  name: string;
};
const selectPc = ref<SelectType>();
const selectChair = ref<SelectType>();
const selectEthernet = ref<SelectType>();

function onSelectPc(seatName: string) {
  const seat = pcData.value?.find((d) => d.name == seatName);
  if (seat === undefined) return;

  if (selectPc.value?.id === seat.owner.id) {
    mapPc.value?.cancelHighlight();
    selectPc.value = undefined;
    return;
  }

  mapPc.value?.highlightSeat(seat.name, true);

  selectPc.value = {
    id: seat.owner.id,
    name: `${seat.owner.fullname} (${seat.owner.classname})`,
  };
}
function onSelectChair(seatName: string) {
  const seat = chairData.value?.find((d) => d.name == seatName);
  if (seat === undefined) return;

  if (selectChair.value?.id === seat.owner.id) {
    mapChair.value?.cancelHighlight();
    selectChair.value = undefined;
    return;
  }

  mapChair.value?.highlightSeat(seat.name, true);

  selectChair.value = {
    id: seat.owner.id,
    name: `${seat.owner.fullname} (${seat.owner.classname})`,
  };
}
function onSelectEthernet(seatName: string) {
  const seat = ethernetData.value?.find((d) => d.name == seatName);
  if (seat === undefined) return;

  if (selectEthernet.value?.id === seat.owner.id) {
    mapEthernet.value?.cancelHighlight();
    selectEthernet.value = undefined;
    return;
  }

  mapEthernet.value?.highlightSeat(seat.name, true);

  selectEthernet.value = {
    id: seat.owner.id,
    name: `${seat.owner.fullname} (${seat.owner.classname})`,
  };
}

onMounted(async () => {
  await nextTick();
  refreshChair();
  refreshEthernet();
  refreshPc();
});
</script>

<style></style>
