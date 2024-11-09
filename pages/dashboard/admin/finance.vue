<template>
  <div class="p-2">
    <UTable
      class="rounded-sm bg-gray-800 bg-opacity-65"
      :columns="tableCols"
      :rows="tableRows"
      :loading="status === 'pending'"
      :loading-state="{
        icon: 'i-heroicons-arrow-path-20-solid',
        label: 'Betöltés...',
      }"
      :empty-state="{
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'Nincs megjeleníthető adat',
      }"
    >
      <template #state-data="{ row }">
        <UBadge
          size="xs"
          variant="soft"
          :label="row.paid ? 'Fizetett' : 'Nem fizetett'"
          :color="row.paid ? 'emerald' : 'red'"
        />
      </template>
      <template #action-data="{ row }">
        <UButton
          v-if="!row.paid"
          size="xs"
          label="Befizetés"
          @click="setPaid(row.id, true)"
        />
        <UButton
          v-else
          color="red"
          size="xs"
          label="Befizetés visszavonása"
          @click="setPaid(row.id, false)"
        />
      </template>
    </UTable>
  </div>
</template>

<script lang="ts" setup>
const csrf = useCsrf();
const loadingSpinner = useLoadingSpinner();

definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const {
  data: tableRows,
  status,
  refresh: refreshTable,
} = await useFetchNotification<any>("/api/finance", {
  lazy: true,
  default: () => {
    return [] as any;
  },
});

const tableCols = [
  {
    label: "Név",
    key: "fullname",
    sortable: true,
  },
  {
    label: "Osztály",
    key: "class",
    sortable: true,
  },
  {
    label: "Állapot",
    key: "state",
    sortable: true,
  },
  {
    label: "Művelet",
    key: "action",
    sortable: false,
  },
];

async function setPaid(id: string, state: boolean) {
  loadingSpinner.value = true;
  await $fetchNotification("/api/finance", {
    method: "POST",
    headers: {
      "csrf-token": csrf.csrf,
    },
    body: {
      id: id,
      paid: state,
    },
  }).catch(() => {
    loadingSpinner.value = false;
  });
  await refreshTable();
  loadingSpinner.value = false;
}
</script>

<style></style>
