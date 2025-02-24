<template>
  <UCard class="dark:bg-opacity-90">
    <template #header>
      <div class="flex flex-row flex-nowrap items-center justify-between">
        <h1 class="text-xl">
          <span class="font-bold">Ülőhely</span>
          <span class="ml-2 font-light">
            {{ userData?.seat.name }}
          </span>
        </h1>
        <UButton
          v-if="adminMode"
          label="Átültetés"
          icon="i-heroicons-map-pin"
          color="cyan"
          variant="soft"
        />
      </div>
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
  adminMode?: boolean;
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
