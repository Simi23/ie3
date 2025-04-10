<template>
  <div
    class="flex flex-col flex-nowrap gap-5 p-5 md:gap-7 md:p-7 lg:gap-10 lg:p-10"
  >
    <UCard class="dark:bg-opacity-90">
      <template #header>
        <h1 class="text-xl font-bold">Adatok</h1>
      </template>
      <p>Létszám: {{ data?.numberOfCompetitors }}</p>
      <UButton
        label="Feltöltés"
        icon="i-heroicons-user-group-solid"
        class="mt-6"
        @click="fillBracketModal"
      />
    </UCard>
    <UCard class="dark:bg-opacity-90">
      <template #header>
        <h1 class="text-xl font-bold">Kitöltés</h1>
      </template>
      <div>
        <TextToggle label="Szerkesztés" v-model="editing" />
      </div>
      <BracketHolder
        v-if="data"
        :editing="editing"
        :round-count="roundCount"
        :display-bracket="data"
        ref="bracketadmin"
        @success="refresh"
        class="p-8"
      />
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import ModalBracketFill from "~/components/Modal/BracketFill.vue";

definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});

const { params } = useRoute();
const bracketadmin = useTemplateRef("bracketadmin");
const editing = ref(false);
const modal = useModal();

const { data, refresh } = useFetch(`/api/bracket/display/${params.id}`);

const roundCount = computed(() => {
  return calculateBracketSize(data.value?.numberOfCompetitors ?? 0);
});

async function fillBracketModal() {
  modal.open(ModalBracketFill, {
    bracketId: data.value?.id ?? "",
    competitionId: data.value?.competitionId ?? "",
    numberOfCompetitors: data.value?.numberOfCompetitors ?? 0,
    onSuccess: () => {
      refresh();
      modal.close();
    },
  });
}

function calculateBracketSize(numberOfCompetitors: number) {
  return Math.ceil(nLog(2, numberOfCompetitors));
}

function nLog(n: number, x: number) {
  return Math.log(x) / Math.log(n);
}
</script>

<style></style>
