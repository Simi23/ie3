<template>
  <UCard class="mx-10 my-10 dark:bg-opacity-90">
    <template #header>
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold">Tartalom</h1>
        <UButton label="Új tartalom" @click="newContentModal" />
      </div>
    </template>

    <UTable
      :columns="cols"
      :rows="fileRows"
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
      <template #createdAt-data="{ row }">
        {{ new Date(row.createdAt).toLocaleString("hu") }}
      </template>
      <template #action-data="{ row }">
        <UTooltip text="Előnézet">
          <UButton
            color="cyan"
            icon="i-heroicons-eye"
            :square="true"
            @click="previewContentModal(row.id)"
          />
        </UTooltip>
        <UTooltip text="Szerkesztés" class="mx-3">
          <UButton
            color="emerald"
            icon="i-heroicons-pencil-square-solid"
            :square="true"
            @click="editContentModal(row.id)"
          />
        </UTooltip>
        <UButton
          label="Törlés"
          icon="i-heroicons-trash-solid"
          variant="outline"
          color="red"
          @click="deleteContentModal(row.id)"
        />
      </template>
    </UTable>
  </UCard>
</template>

<script lang="ts" setup>
import ModalContentEdit from "~/components/Modal/ContentEdit.vue";
import ModalContentPreview from "~/components/Modal/ContentPreview.vue";
import ModalConfirmAction from "~/components/Modal/ConfirmAction.vue";

definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const modal = useModal();
const loadingSpinner = useLoadingSpinner();

const cols = [
  {
    key: "name",
    label: "Név",
  },
  {
    key: "createdAt",
    label: "Feltöltve",
  },
  {
    key: "action",
    label: "Művelet",
  },
];

const {
  data: fileRows,
  refresh: refreshContent,
  status,
} = useFetch("/api/content", {
  default: () => [],
});

async function previewContentModal(contentId: string) {
  modal.open(ModalContentPreview, {
    contentId: contentId,
  });
}

async function newContent(title: string, text: string) {
  loadingSpinner.value = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>("/api/content", {
      method: "POST",
      body: {
        title: title,
        text: text,
      },
    }),
  );

  await refreshContent();

  loadingSpinner.value = false;

  if (error === undefined) {
    modal.close();
  }
}

async function newContentModal() {
  modal.open(ModalContentEdit, {
    title: "Új tartalom",
    onSuccess: (title, text) => {
      newContent(title, text);
    },
  });
}

async function editContent(contentId: string, title: string, text: string) {
  loadingSpinner.value = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>(`/api/content/${contentId}`, {
      method: "PUT",
      body: {
        title: title,
        text: text,
      },
    }),
  );

  await refreshContent();

  loadingSpinner.value = false;

  if (error === undefined) {
    modal.close();
  }
}

async function editContentModal(contentId: string) {
  const currentContent = fileRows.value.find((row) => row.id === contentId);
  if (currentContent === undefined) return;
  modal.open(ModalContentEdit, {
    title: "Tartalom szerkesztése",
    initValueTitle: currentContent.name,
    initValueText: currentContent.content,
    onSuccess: (title, text) => {
      editContent(contentId, title, text);
    },
  });
}

async function deleteContent(contentId: string) {
  loadingSpinner.value = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>(`/api/content/${contentId}`, {
      method: "DELETE",
    }),
  );

  await refreshContent();
  loadingSpinner.value = false;
}

async function deleteContentModal(contentId: string) {
  const currentContent = fileRows.value.find((row) => row.id === contentId);
  if (currentContent === undefined) return;

  modal.open(ModalConfirmAction, {
    title: "Tartalom törlése",
    longDescription: [
      "Biztosan törli a következő tartalmat:",
      `${currentContent.name}?`,
    ],
    confirmText: "Igen",
    cancelText: "Nem",
    onSuccess: () => {
      modal.close();
      deleteContent(contentId);
    },
  });
}
</script>

<style></style>
