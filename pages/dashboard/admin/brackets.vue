<template>
  <div class="p-5 md:p-7 lg:p-10">
    <UCard class="dark:bg-opacity-90">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold">Keretek</h1>
          <UButton
            icon="i-heroicons-plus"
            label="Új keret"
            @click="newBracketModal"
          />
        </div>
      </template>
      <UTable
        :columns="cols"
        :rows="modBrackets"
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
        <template #action-data="{ row }">
          <div class="space-x-2">
            <UButton
              label="Kitöltés"
              icon="i-heroicons-pencil-square-solid"
              variant="soft"
            />
            <UButton
              label="Törlés"
              icon="i-heroicons-trash-solid"
              color="red"
              variant="soft"
              @click="deleteBracketModal(row.id)"
            />
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import ModalBracketCreate from "~/components/Modal/BracketCreate.vue";
import ModalConfirmAction from "~/components/Modal/ConfirmAction.vue";

const modal = useModal();
const loadingSpinner = useLoadingSpinner();

definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const cols = [
  {
    key: "title",
    label: "Megjelenítési név",
  },
  {
    key: "administrativeTitle",
    label: "Adminisztratív név",
  },
  {
    key: "competitionTitle",
    label: "Verseny",
  },
  {
    key: "action",
    label: "Műveletek",
  },
];

const {
  data: brackets,
  refresh: refreshBrackets,
  status,
} = useFetch("/api/bracket");
const modBrackets = computed(() => {
  return brackets.value?.map((b) => {
    return {
      id: b.id,
      title: b.title,
      administrativeTitle: b.administrativeTitle,
      competitionTitle: b.competition.title,
    };
  });
});

async function newBracketModal() {
  modal.open(ModalBracketCreate, {
    onSuccess: () => {
      modal.close();
      refreshBrackets();
    },
  });
}

async function deleteBracketModal(bracketId: string) {
  modal.open(ModalConfirmAction, {
    danger: true,
    confirmText: "Törlés",
    description: "Biztosan törli a keretet?",
    onSuccess: () => {
      deleteBracket(bracketId);
      modal.close();
    },
  });
}

async function deleteBracket(bracketId: string) {
  loadingSpinner.value = true;

  await $fetchCsrfNotification("/api/bracket", {
    method: "DELETE",
    body: {
      bracketId: bracketId,
    },
  });

  await refreshBrackets();

  loadingSpinner.value = false;
}
</script>

<style></style>
