<template>
  <div class="p-5 md:p-7 lg:p-10">
    <UCard class="dark:bg-opacity-90">
      <template #header>
        <div class="flex flex-row flex-nowrap justify-between">
          <h1 class="text-xl font-bold">Vetítés</h1>
          <UButton
            label="Mentés"
            icon="i-heroicons-check"
            color="emerald"
            @click="save"
          />
        </div>
      </template>

      <UButton
        label="Elem hozzáadása"
        icon="i-heroicons-plus"
        class="mb-4"
        @click="addRow"
      />

      <UTable
        :columns="cols"
        :rows="state"
        :loading="status === 'pending'"
        :loading-state="{
          icon: 'i-heroicons-arrow-path-20-solid',
          label: 'Betöltés...',
        }"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'Nincs megjeleníthető adat',
        }"
        class="pb-48"
      >
        <template #name-data="{ row }">
          <UInput v-model="newState[row.order - 1].name" />
        </template>
        <template #displayTimeMs-data="{ row }">
          <UInput
            v-model="newState[row.order - 1].displayTimeMs"
            type="number"
          />
        </template>
        <template #showProgress-data="{ row }">
          <UToggle v-model="newState[row.order - 1].showProgress" />
        </template>

        <!-- Típus -->
        <template #type-data="{ row }">
          <DisplayContentTypeSelect v-model="newState[row.order - 1].type" />
        </template>

        <!-- Tartalom -->
        <template #content-data="{ row }">
          <UInput
            v-if="newState[row.order - 1].type == 'ShortText'"
            v-model="newState[row.order - 1].content"
          />
          <ContentSelect
            v-else-if="newState[row.order - 1].type == 'FormattedText'"
            v-model="newState[row.order - 1].content"
          />
          <BracketSelect
            v-else-if="newState[row.order - 1].type == 'Bracket'"
            v-model="newState[row.order - 1].content"
          />
          <MediaSelect
            v-else-if="newState[row.order - 1].type == 'Media'"
            v-model="newState[row.order - 1].content"
          />
          <TopListSelect
            v-else-if="newState[row.order - 1].type == 'TopList'"
            v-model="newState[row.order - 1].content"
          />
        </template>

        <template #action-data="{ row }">
          <div class="space-x-2">
            <UButton
              icon="i-heroicons-chevron-up"
              :disabled="row.order == 1"
              @click="up(row.order)"
            />
            <UButton
              icon="i-heroicons-chevron-down"
              :disabled="row.order == state.length"
              @click="down(row.order)"
            />
            <UButton
              icon="i-heroicons-trash"
              color="red"
              variant="soft"
              @click="deleteRow(row.id)"
            />
          </div>
        </template>

        <!-- <template #action-data="{ row }">
          <div class="space-x-2">
            <UButton
              label="Szerkesztés"
              :to="`/dashboard/admin/bracket/${row.id}`"
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
        </template> -->
      </UTable>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import type { $Enums } from "@prisma/client";
import ModalConfirmAction from "~/components/Modal/ConfirmAction.vue";

definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const loadingSpinner = useLoadingSpinner();
const modal = useModal();

const { data, refresh, status } = useFetch("/api/display");

type Row = {
  id: string;
  order: number;
  name: string;
  displayTimeMs: number;
  showProgress: boolean;
  type: $Enums.DisplayContentType;
  content: string;
};

const state = ref<Row[]>([]);

const newState = ref<Row[]>([]);

watch(data, (newRows, oldRows) => {
  state.value =
    newRows?.rows.map((r) => {
      let content = "";
      switch (r.type) {
        case "Bracket":
          content = r.bracketId ?? "";
          break;
        case "FormattedText":
          content = r.formattedTextId ?? "";
          break;
        case "Media":
          content = r.mediaId ?? "";
          break;
        case "ShortText":
          content = r.shortText ?? "";
          break;
        case "TopList":
          content = r.topListId ?? "";
          break;

        default:
          break;
      }

      return {
        id: r.id,
        order: r.order,
        name: r.name,
        displayTimeMs: r.displayTimeMs,
        showProgress: r.showProgress,
        type: r.type,
        content: content,
      };
    }) ?? [];

  newState.value =
    newRows?.rows.map((r) => {
      let content = "";
      switch (r.type) {
        case "Bracket":
          content = r.bracketId ?? "";
          break;
        case "FormattedText":
          content = r.formattedTextId ?? "";
          break;
        case "Media":
          content = r.mediaId ?? "";
          break;
        case "ShortText":
          content = r.shortText ?? "";
          break;
        case "TopList":
          content = r.topListId ?? "";
          break;

        default:
          break;
      }

      return {
        id: r.id,
        order: r.order,
        name: r.name,
        displayTimeMs: r.displayTimeMs,
        showProgress: r.showProgress,
        type: r.type,
        content: content,
      };
    }) ?? [];
});

const cols = [
  {
    key: "order",
    label: "Sorrend",
  },
  {
    key: "name",
    label: "Név",
  },
  {
    key: "displayTimeMs",
    label: "Megjelenítési idő (ms)",
  },
  {
    key: "showProgress",
    label: "Progress bar",
  },
  {
    key: "type",
    label: "Típus",
  },
  {
    key: "content",
    label: "Tartalom",
  },
  {
    key: "action",
    label: "Műveletek",
  },
];

async function addRow() {
  loadingSpinner.value = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>("/api/display", {
      method: "POST",
    }),
  );

  if (error === undefined) {
    await refresh();
  }

  loadingSpinner.value = false;
}

async function deleteRow(id: string) {
  modal.open(ModalConfirmAction, {
    description: "Biztosan törlöd a kiválasztott oldalt?",
    danger: true,
    title: "Megerősítés",
    onSuccess: async () => {
      loadingSpinner.value = true;

      const [error, data] = await catchError(
        $fetchCsrfNotification<NotificationResponse>(`/api/display/${id}`, {
          method: "DELETE",
        }),
      );

      if (error === undefined) {
        await refresh();
      }

      loadingSpinner.value = false;
      modal.close();
    },
  });
}

function up(id: number) {
  newState.value[id - 1].order--;
  newState.value[id - 2].order++;
  save();
}

function down(id: number) {
  newState.value[id - 1].order++;
  newState.value[id].order--;
  save();
}

async function save() {
  loadingSpinner.value = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>("/api/display/save", {
      method: "post",
      body: {
        contents: newState.value,
      },
    }),
  );

  if (error === undefined) {
    await refresh();
  }

  loadingSpinner.value = false;
}
</script>

<style></style>
