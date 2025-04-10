<template>
  <UModal
    :ui="{
      background: 'bg-transparent dark:bg-transparent',
    }"
  >
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold">Keret feltöltése</h1>
      </template>

      <div>Kiválasztva: {{ selectedCount }} / {{ numberOfCompetitors }}</div>

      <div>
        <div v-for="teamId in Object.keys(state)">
          <UCheckbox
            v-model="state[teamId]"
            :label="
              data?.teamCompetition
                ? (data.teams.find((t) => t.id == teamId)?.name ??
                  'Ismeretlen csapat')
                : (data?.teams.find((t) => t.id == teamId)?.users[0].user
                    .fullname ?? 'Ismeretlen játékos')
            "
          />
        </div>
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
            label="Feltöltés"
            icon="i-heroicons-check"
            @click="fillBracket"
            :disabled="selectedCount != numberOfCompetitors"
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
  bracketId: string;
  competitionId: string;
  numberOfCompetitors: number;
};
const props = defineProps<Props>();

// ID / Selected
const state = ref<Record<string, boolean>>({});

const { data } = useFetch(`/api/competition/${props.competitionId}`);

watch(data, (newData, oldData) => {
  state.value = {};
  newData?.teams.forEach((t) => {
    state.value[t.id] = false;
  });
});

const selectedCount = computed(() => {
  return Object.keys(state.value).filter((k) => state.value[k]).length;
});

async function fillBracket() {
  const teamIds = Object.keys(state.value).filter((k) => state.value[k]);
  loadingSpinner.value = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>("/api/bracket/fill", {
      method: "POST",
      body: {
        bracketId: props.bracketId,
        competitors: teamIds,
      },
    }),
  );

  loadingSpinner.value = false;

  if (error === undefined) {
    emit("success");
  }
}
</script>

<style scoped></style>
