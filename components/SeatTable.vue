<template>
  <div>
    <UTable
      :columns="columns"
      :rows="seatList"
      :loading-state="{
        icon: 'i-heroicons-arrow-path-20-solid',
        label: 'Betöltés...',
      }"
      :empty-state="{
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'Nincs megjeleníthető adat',
      }"
      :loading="seatList === undefined"
    >
      <template #action-data="{ row }">
        <div v-if="row.ownerId != ''">
          <UButton
            label="Felhasználó megtekintése"
            icon="i-heroicons-eye"
            :to="`/dashboard/admin/user/${row.ownerId}`"
            size="xs"
          />
        </div>
      </template>
      <template #options-data="{ row }">
        <div v-if="row.ownPc !== undefined" class="space-x-2">
          <UBadge
            :label="row.ownPc ? 'Saját PC' : 'Iskolai PC'"
            icon="i-heroicons-computer-desktop-solid"
            size="xs"
            :color="row.ownPc ? 'cyan' : 'amber'"
            variant="subtle"
          />
          <UBadge
            :label="row.ethernetPort ? 'RJ45' : 'Wifi'"
            icon="i-heroicons-chart-bar-solid"
            size="xs"
            :color="row.ethernetPort ? 'cyan' : 'amber'"
            variant="subtle"
          />
          <UBadge
            :label="row.ownChair ? 'Saját szék' : 'Iskolai szék'"
            icon="i-heroicons-map-pin-solid"
            size="xs"
            :color="row.ownChair ? 'cyan' : 'amber'"
            variant="subtle"
          />
        </div>
      </template>
    </UTable>
  </div>
</template>

<script lang="ts" setup>
type TableType = {
  name: string;
  ownerName: string;
  ownerId: string;
  className: string;
  ownPc: boolean | undefined;
  ethernetPort: boolean | undefined;
  ownChair: boolean | undefined;
}[];

interface Props {
  seatList: TableType | undefined;
}

const props = defineProps<Props>();

const columns = [
  {
    key: "name",
    label: "Ülőhely",
  },
  {
    key: "ownerName",
    label: "Név",
  },
  {
    key: "className",
    label: "Osztály",
  },
  {
    key: "options",
    label: "Opciók",
  },
  {
    key: "action",
    label: "Művelet",
  },
];
</script>

<style></style>
