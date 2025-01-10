<template>
  <div class="p-2">
    <div
      class="mb-1 flex justify-between bg-gray-800 bg-opacity-35 px-3 py-3.5"
    >
      <UInput v-model="query" placeholder="Keresés..." />
      <div class="ml-4 flex select-none">
        <UIcon name="i-heroicons-funnel-solid" class="h-7 w-6" />
        <UCheckbox
          label="Fizetett"
          class="ml-4 mt-1"
          color="indigo"
          v-model="filterPaid"
        />
        <UCheckbox
          label="Nem fizetett"
          class="ml-4 mt-1"
          color="indigo"
          v-model="filterNotPaid"
        />
      </div>
    </div>
    <UTable
      class="rounded-sm bg-gray-800 bg-opacity-65"
      :columns="tableCols"
      :rows="filteredRows"
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
          :loading="loadingButton == row.id"
        />
        <UButton
          v-else
          color="red"
          size="xs"
          label="Befizetés visszavonása"
          @click="setPaid(row.id, false)"
          :loading="loadingButton == row.id"
          :class="{ 'mr-6': loadingButton != row.id }"
        />
      </template>
    </UTable>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const loadingButton = ref<string>("");

const query = ref("");
const filterPaid = ref<boolean>(true);
const filterNotPaid = ref<boolean>(true);

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

const queriedRows = computed(() => {
  if (!query.value || query.value == "") return tableRows.value;

  return tableRows.value.filter((person: any) => {
    return Object.values(person).some((value: any) => {
      return String(value).toLowerCase().includes(query.value.toLowerCase());
    });
  });
});

const filteredRows = computed(() => {
  return queriedRows.value.filter((row: any) => {
    return (
      (row.paid === true && filterPaid.value === true) ||
      (row.paid === false && filterNotPaid.value === true)
    );
  });
});

async function setPaid(id: string, state: boolean) {
  loadingButton.value = id;

  await catchError(
    $fetchCsrfNotification<null>("/api/finance", {
      method: "post",
      body: {
        id: id,
        paid: state,
      },
    }),
  );

  await refreshTable();
  loadingButton.value = "";
}
</script>

<style></style>
