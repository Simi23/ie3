<template>
  <div>
    <UTable
      :columns="columns"
      :rows="sessionList"
      :loading-state="{
        icon: 'i-heroicons-arrow-path-20-solid',
        label: 'Betöltés...',
      }"
      :empty-state="{
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'Nincs megjeleníthető adat',
      }"
    >
      <template #valid-header>
        Érvényes
        <UTooltip
          text="nem, ha kiléptek kézzel, vagy kiléptették manuálisan"
          class="cursor-help align-text-bottom"
        >
          <UIcon
            name="i-heroicons-question-mark-circle-16-solid"
            class="h-4 w-4 align-text-bottom"
          />
        </UTooltip>
      </template>
      <template #createdAt-data="{ row }">
        {{ row.createdAt.toLocaleString("hu") }}
      </template>
      <template #expiresAt-data="{ row }">
        {{ row.createdAt.toLocaleString("hu") }}
      </template>
      <template #valid-data="{ row }">
        <UBadge
          :label="row.valid ? 'Igen' : 'Nem'"
          :color="row.valid ? 'emerald' : 'red'"
          size="xs"
          :icon="row.valid ? 'i-heroicons-check' : 'i-heroicons-x-mark'"
        />
      </template>
      <template #userAgent-data="{ row }">
        <UBadge
          v-for="badge in row.userAgent.icons"
          :label="badge.name"
          :color="badge.color"
          :icon="badge.icon"
          class="mr-2"
        />
      </template>
    </UTable>
  </div>
</template>

<script lang="ts" setup>
import type { ExtendedSession } from "~/utils/types";

interface Props {
  sessionList: ExtendedSession[];
}
const props = defineProps<Props>();

const columns = [
  {
    key: "createdAt",
    label: "Létrehozva",
  },
  {
    key: "expiresAt",
    label: "Lejárat",
  },
  {
    key: "valid",
    label: "Érvényes",
  },
  {
    key: "address",
    label: "IP cím",
  },
  {
    key: "userAgent",
    label: "User Agent",
  },
];
</script>

<style></style>
