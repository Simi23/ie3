<template>
  <div class="space-y-5 p-5 md:space-y-7 md:p-7 lg:space-y-10 lg:p-10">
    <UCard class="dark:bg-opacity-90">
      <template #header>
        <h1 class="text-xl font-bold">Ülőhelyek</h1>
      </template>
      <p>
        Publikus ülőhelyek:
        <span class="text-emerald-400">{{ seatStats.totalSeats }}</span>
      </p>
      <p>
        Rejtett ülőhelyek:
        <span class="text-emerald-400">{{ seatStats.hiddenSeats }}</span>
      </p>
      <UButton
        class="mr-2 mt-2"
        label="Generálás indítása"
        icon="i-heroicons-arrow-path-rounded-square"
        color="cyan"
        size="xs"
        @click="generateAsk"
      />
      <UButton
        class="mr-2 mt-2"
        label="Használatlan helyek törlése"
        icon="i-heroicons-trash"
        color="red"
        size="xs"
        @click="deleteAsk"
      />
    </UCard>
    <UCard class="dark:bg-opacity-90">
      <SeatTable :seat-list="modifiedSeatData" />
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import ModalConfirmAction from "~/components/Modal/ConfirmAction.vue";

definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const modal = useModal();
const loadingSpinner = useLoadingSpinner();

const { data: seatStats, refresh: refreshSeatStats } = useFetch(
  "/api/stat/seats",
  {
    lazy: true,
    default: () => {
      return {
        totalSeats: 0,
        freeSeats: 0,
        occupiedSeats: 0,
        hiddenSeats: 0,
      };
    },
  },
);

const { data: seatData, refresh: refreshSeatData } = useFetch("/api/seat");
const modifiedSeatData = computed(() => {
  return seatData.value?.map((s) => {
    return {
      name: s.name,
      ownerName: s.owner?.fullname ?? "",
      ownerId: s.owner?.id ?? "",
      className: s.owner?.class.name ?? "",
      ownPc: s.owner?.ownPc,
      ownChair: s.owner?.ownChair,
      ethernetPort: s.owner?.ethernetPort,
    };
  });
});

function generateAsk() {
  modal.open(ModalConfirmAction, {
    longDescription: [
      "A művelet a következő helyeket fogja létrehozni:",
      "A-01 - E-18, HIDDEN-01 - HIDDEN-18, SWAP",
      "Folytatja?",
    ],
    title: "Ülőhelyek generálása",
    confirmText: "Igen",
    cancelText: "Nem",
    onSuccess() {
      modal.close();
      generateSeats();
    },
  });
}

async function generateSeats() {
  loadingSpinner.value = true;

  await $fetchCsrfNotification("/api/seat/generate", {
    method: "POST",
  }).catch();

  await refreshSeatStats();
  loadingSpinner.value = false;
}

function deleteAsk() {
  modal.open(ModalConfirmAction, {
    description: "Valóban ki akarja törölni a szabad ülőhelyeket?",
    title: "Ülőhelyek törlése",
    confirmText: "Igen",
    cancelText: "Nem",
    onSuccess() {
      modal.close();
      deleteSeats();
    },
  });
}

async function deleteSeats() {
  loadingSpinner.value = true;
  $fetchCsrfNotification("/api/seat/prune", {
    method: "DELETE",
  }).catch();
  await refreshSeatStats();
  loadingSpinner.value = false;
}
</script>

<style></style>
