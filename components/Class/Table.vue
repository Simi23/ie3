<template>
  <div>
    <UTable
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
          :label="row.hidden ? 'Rejtett' : 'Nyilvános'"
          :color="row.hidden ? 'gray' : 'emerald'"
        />
      </template>
      <template #action-data="{ row }">
        <UButton
          size="xs"
          label="Törlés"
          color="red"
          @click="deleteClass(row.id)"
        />
      </template>
    </UTable>
  </div>
</template>

<script lang="ts" setup>
const csrf = useCsrf();
const loadingSpinner = useLoadingSpinner();
const eventBus = useMittBus();

const {
  data: tableRows,
  status,
  refresh: refreshTable,
} = await useFetchNotification<any>("/api/classes/list", {
  lazy: true,
  default: () => {
    return [] as any;
  },
});

const tableCols = [
  {
    label: "Név",
    key: "name",
    sortable: true,
  },
  {
    label: "Évfolyam",
    key: "group",
    sortable: true,
  },
  {
    label: "Láthatóság",
    key: "state",
    sortable: true,
  },
  {
    label: "Művelet",
    key: "action",
    sortable: false,
  },
];

async function deleteClass(id: string) {
  loadingSpinner.value = true;
  await $fetchNotification(`/api/classes/${id}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf.csrf,
    },
  }).catch(() => {
    loadingSpinner.value = false;
  });

  eventBus.emit("update-class");

  loadingSpinner.value = false;
}

eventBus.on("update-class", () => {
  refreshTable();
});
</script>

<style></style>
