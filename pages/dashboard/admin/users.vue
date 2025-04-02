<template>
  <div class="p-2">
    <div
      class="mb-1 flex flex-row flex-nowrap justify-between bg-gray-800 bg-opacity-35 px-3 py-3.5"
    >
      <UInput v-model="query" placeholder="Keresés..." />
      <UButton
        label="Új felhasználó"
        icon="i-heroicons-user-plus-solid"
        @click="userCreateModal"
      />
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
      <template #discord-data="{ row }">
        <DiscordUserBadge
          v-if="row.dcConnected"
          :dc-data="{
            avatar: row.dcAvatar,
            id: row.dcId,
            globalName: row.dcGlobalName,
          }"
        />
      </template>
      <template #action-data="{ row }">
        <UButton
          size="xs"
          label="Megtekintés"
          color="cyan"
          icon="i-heroicons-eye"
          :to="`/dashboard/admin/user/${row.id}`"
        />
      </template>
    </UTable>
  </div>
</template>

<script lang="ts" setup>
import ModalUserCreate from "~/components/Modal/UserCreate.vue";

definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const modal = useModal();

const {
  data: tableRows,
  status,
  refresh: refreshTable,
} = await useFetchNotification<any>("/api/user", {
  lazy: true,
  default: () => {
    return [] as any;
  },
});

const tableCols = [
  {
    label: "Felhasználónév",
    key: "username",
    sortable: true,
  },
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
    label: "Szék",
    key: "seat",
    sortable: true,
  },
  {
    label: "Discord",
    key: "discord",
    sortable: false,
  },
  {
    label: "Művelet",
    key: "action",
    sortable: false,
  },
];

const query = ref("");
const filteredRows = computed(() => {
  if (!query.value || query.value == "") return tableRows.value;

  return tableRows.value.filter((person: any) => {
    return Object.values(person).some((value: any) => {
      return String(value).toLowerCase().includes(query.value.toLowerCase());
    });
  });
});

function userCreateModal() {
  modal.open(ModalUserCreate, {
    onSuccess: () => {
      refreshTable();
      modal.close();
    },
  });
}
</script>

<style></style>
