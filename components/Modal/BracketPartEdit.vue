<template>
  <UModal
    :ui="{
      background: 'bg-transparent dark:bg-transparent',
      width: 'md:max-w-2xl',
    }"
  >
    <UCard>
      <template #header>
        <div class="flex w-full flex-row flex-nowrap justify-between">
          <h1 class="text-2xl font-bold">Szerkesztés</h1>
          <div>
            <UButton
              v-if="state.tracked"
              label="Követés leállítása"
              color="yellow"
              variant="soft"
              icon="i-material-symbols-visibility-off-outline"
              @click="untrack"
            />
            <UButton
              v-else
              label="Követés"
              color="yellow"
              icon="i-material-symbols-visibility-outline"
              @click="track"
            />
          </div>
        </div>
      </template>
      <TextToggle label="Elkezdődött" v-model="state.started" />
      <TextToggle label="Vége" v-model="state.ended" />
      <table class="mt-4">
        <thead>
          <tr>
            <th>Név</th>
            <th v-for="(item, index) in state.upper.points">
              {{ index + 1 }}. kör
            </th>
            <th>Győztes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {{ state.upper.name }}
            </td>
            <td v-for="(item, index) in state.upper.points">
              <UInput v-model="state.upper.points[index]" type="number" />
            </td>
            <td>
              <div class="flex w-full flex-row justify-center">
                <UCheckbox v-model="state.upper.won" />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              {{ state.lower.name }}
            </td>
            <td v-for="(item, index) in state.lower.points">
              <UInput v-model="state.lower.points[index]" type="number" />
            </td>
            <td>
              <div class="flex w-full flex-row justify-center">
                <UCheckbox v-model="state.lower.won" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="mt-4 flex flex-row gap-2">
        <UButton
          label="Kör hozzáadása"
          icon="i-material-symbols-add-column-right-outline"
          @click="addRound"
        />
        <UButton
          label="Utolsó kör törlése"
          icon="i-material-symbols-delete-outline"
          color="red"
          @click="removeRound"
        />
      </div>

      <template #footer>
        <div class="flex w-full flex-row justify-end gap-2">
          <UButton
            label="Mégse"
            color="red"
            variant="soft"
            icon="i-heroicons-x-mark"
            @click="modal.close"
          />
          <UButton
            label="Mentés"
            icon="i-heroicons-check"
            color="green"
            @click="save"
          />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
const loadingSpinner = useLoadingSpinner();
const modal = useModal();

const emit = defineEmits<{
  success: [];
}>();

type Props = {
  initData: CellData;
};
const props = defineProps<Props>();

const state = ref({
  started: true,
  ended: false,
  tracked: true,
  upper: {
    points: [3, 5, 6] as number[],
    won: false,
    name: "Felső",
    id: "",
  },
  lower: {
    points: [2, 6, 7] as number[],
    won: false,
    name: "Alsó",
    id: "",
  },
});

function addRound() {
  state.value.upper.points.push(0);
  state.value.lower.points.push(0);
}

function removeRound() {
  state.value.upper.points.pop();
  state.value.lower.points.pop();
}

async function save() {
  loadingSpinner.value = true;

  const [error, value] = await catchError(
    $fetchCsrfNotification<NotificationResponse>("/api/bracket/part", {
      method: "PUT",
      body: {
        started: state.value.started,
        ended: state.value.ended,
        upper: {
          id: state.value.upper.id,
          won: state.value.upper.won,
          points: state.value.upper.points,
        },
        lower: {
          id: state.value.lower.id,
          won: state.value.lower.won,
          points: state.value.lower.points,
        },
      },
    }),
  );

  loadingSpinner.value = false;

  emit("success");
}

async function track() {
  loadingSpinner.value = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>("/api/bracket/part/track", {
      method: "PUT",
      body: {
        bracketPartIdUpper: props.initData.upper.id,
        bracketPartIdLower: props.initData.lower.id,
      },
    }),
  );

  if (error === undefined) {
    state.value.tracked = true;
  }

  loadingSpinner.value = false;
}

async function untrack() {
  loadingSpinner.value = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>("/api/bracket/part/untrack", {
      method: "PUT",
    }),
  );

  if (error === undefined) {
    state.value.tracked = false;
  }

  loadingSpinner.value = false;
}

onMounted(() => {
  state.value = {
    started: props.initData.started,
    ended: props.initData.ended,
    tracked: props.initData.tracked,
    upper: {
      points: props.initData.upper.points,
      won: props.initData.upper.won,
      name: props.initData.upper.name,
      id: props.initData.upper.id,
    },
    lower: {
      points: props.initData.lower.points,
      won: props.initData.lower.won,
      name: props.initData.lower.name,
      id: props.initData.lower.id,
    },
  };
});
</script>

<style scoped>
th,
td {
  @apply px-3 py-1 text-center;
}
</style>
