<template>
  <UCard class="dark:bg-opacity-90">
    <template #header>
      <h1 class="text-xl font-bold">Ülőhely - {{ userData?.seat.name }}</h1>
    </template>
    <ClientOnly>
      <SeatMap
        class="w-96"
        ref="userlocation"
        svg-id="user-location"
        arrow-stroke="#ffffff"
        seat-stroke="#222222"
        letter-stroke="#ffffff"
      ></SeatMap>
    </ClientOnly>
  </UCard>
</template>

<script lang="ts" setup>
import type { UserData } from "~/utils/types";
import SeatMap from "~/components/SeatMap.vue";

type Props = {
  userId: string;
};
const props = defineProps<Props>();

const seatMap = useTemplateRef<InstanceType<typeof SeatMap>>("userlocation");

const { data: userData } = useFetch<UserData>(`/api/user/${props.userId}`, {
  onResponse: () => {
    colorMap();
  },
});

function colorMap() {
  seatMap.value?.changeSeatColour("all", "#374151");
  seatMap.value?.changeSeatColour(userData?.value?.seat.name ?? "", "green");
}

watch(userData, (newData, oldData) => {
  colorMap();
});

onMounted(async () => {
  await nextTick();
  colorMap();
});
</script>

<style></style>
