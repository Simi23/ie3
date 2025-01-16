<template>
  <UCard class="mx-10 my-10 dark:bg-opacity-90">
    <template #header>
      <h1 class="text-xl font-bold">Média</h1>
    </template>
    <h2 class="text-lg font-bold">Fájl feltöltése</h2>
    <div class="mt-4 px-2">
      <UInput
        :loading="loading"
        :disabled="loading"
        loading-icon="i-heroicons-arrow-path"
        type="file"
        placeholder="Fájl kiválasztása..."
        class="mb-3 w-fit"
        @change="getFileChange"
        icon="i-heroicons-archive-box"
        v-model="uploadName"
      />
      <UButton label="Feltöltés" @click="uploadImage" />
    </div>

    <UDivider size="sm" class="my-6"></UDivider>

    <h2 class="text-lg font-bold">Feltöltött fájlok</h2>
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
      <template #type-data="{ row }">
        <UBadge
          :color="typeBadge[row.type].color"
          :label="typeBadge[row.type].name"
          :icon="typeBadge[row.type].icon"
          size="xs"
        />
      </template>
      <template #action-data="{ row }">
        <UTooltip text="Megtekintés">
          <UButton
            color="cyan"
            icon="i-heroicons-eye"
            :square="true"
            @click="displayImage(row.name, row.url)"
          />
        </UTooltip>
        <UTooltip text="Átnevezés" class="mx-3">
          <UButton
            color="indigo"
            icon="i-heroicons-pencil-square-solid"
            :square="true"
            @click="renameModal(row.id, row.name)"
          />
        </UTooltip>
        <UButton
          label="Törlés"
          icon="i-heroicons-trash-solid"
          variant="outline"
          color="red"
          @click="deleteModal(row.id)"
        />
      </template>
    </UTable>
  </UCard>
</template>

<script lang="ts" setup>
import ModalConfirmAction from "~/components/Modal/ConfirmAction.vue";
import ModalImageDisplay from "~/components/Modal/ImageDisplay.vue";
import ModalSingleInput from "~/components/Modal/SingleInput.vue";

definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const upload = ref<File>();
const uploadName = ref<string>("");
const loading = ref<boolean>(false);

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
    key: "type",
    label: "Típus",
  },
  {
    key: "action",
    label: "Művelet",
  },
];

const {
  data: fileRows,
  refresh: refreshFiles,
  status,
} = useFetch("/api/media", {
  default: () => [],
});

const typeBadge: Record<string, Badge> = {
  Image: {
    icon: "i-heroicons-photo-solid",
    color: "sky",
    name: "Kép",
  },
};

async function uploadImage() {
  if (upload.value == undefined) return;
  loading.value = true;
  let fd = new FormData();
  fd.append("image", upload.value);

  await $fetchCsrfNotification("/api/media", {
    method: "POST",
    body: fd,
  }).catch();

  await refreshFiles();
  loading.value = false;
}

function getFileChange(fl: FileList) {
  const item = fl.item(0);
  if (item == null) return;
  upload.value = item;
}

async function displayImage(name: string, path: string) {
  modal.open(ModalImageDisplay, {
    title: name,
    path: path,
  });
}

async function updateName(id: string, newName: string) {
  loadingSpinner.value = true;

  await $fetchCsrfNotification("/api/media/rename", {
    method: "POST",
    body: {
      id: id,
      newName: newName,
    },
  }).catch();

  await refreshFiles();
  loadingSpinner.value = false;
}

async function renameModal(id: string, name: string) {
  modal.open(ModalSingleInput, {
    title: `${name} átnevezése`,
    confirmText: "Átnevezés",
    fieldText: "Új fájlnév",
    onSuccess: (answer) => {
      modal.close();
      updateName(id, answer);
    },
  });
}

async function deleteMedia(id: string) {
  loadingSpinner.value = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>(`/api/media/${id}`, {
      method: "DELETE",
    }),
  );

  await refreshFiles();

  loadingSpinner.value = false;
}

async function deleteModal(id: string) {
  const row = fileRows.value.find((row) => row.id === id);
  if (row === undefined) return;

  modal.open(ModalConfirmAction, {
    title: "Média törlése",
    longDescription: [
      "Biztosan törli a következő médiaelemet:",
      `${row.name}?`,
    ],
    confirmText: "Igen",
    cancelText: "Nem",
    onSuccess: () => {
      modal.close();
      deleteMedia(id);
    },
  });
}
</script>

<style></style>
