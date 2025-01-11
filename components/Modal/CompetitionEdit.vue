<script lang="ts" setup>
import {
  competitionSchema,
  type CompetitionSchema,
} from "~/schemas/competitionSchema";

type Props = {
  title?: string;

  defaultTitle?: string;
  defaultDescription?: string;
  defaultImage?: string;
  defaultTeamCompetition?: boolean;
  defaultTeamLimit?: number;

  actionTextConfirm?: string;
  actionTextCancel?: string;
};

const props = withDefaults(defineProps<Props>(), {
  title: "Verseny szerkesztése",
  actionTextConfirm: "Mentés",
  actionTextCancel: "Mégse",
});

const modal = useModal();
const competitionState = ref({
  title: "",
  description: "",
  image: "",
  teamCompetition: false,
  teamLimit: 1,
});

watch(
  competitionState,
  (newVal, oldVal) => {
    if (newVal.teamCompetition == false) {
      newVal.teamLimit = 1;
    }
  },
  {
    deep: 2,
  },
);

const teamEditForm = ref();

function applyDefaults() {
  if (props.defaultTitle) {
    competitionState.value.title = props.defaultTitle;
  }
  if (props.defaultDescription) {
    competitionState.value.description = props.defaultDescription;
  }
  if (props.defaultImage) {
    competitionState.value.image = props.defaultImage;
  }
  if (props.defaultTeamCompetition) {
    competitionState.value.teamCompetition = props.defaultTeamCompetition;
  }
  if (props.defaultTeamLimit) {
    competitionState.value.teamLimit = props.defaultTeamLimit;
  }
}

onMounted(() => {
  applyDefaults();
});

const emit = defineEmits<{
  success: [competition: CompetitionSchema];
}>();

function submitClick() {
  teamEditForm.value.submit();
}

async function handleSubmit() {
  emit("success", competitionState.value);
}
</script>

<template>
  <UModal>
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">{{ props.title }}</h1>
      </template>

      <UForm
        :state="competitionState"
        :schema="competitionSchema"
        ref="teamEditForm"
        @submit.prevent="handleSubmit"
      >
        <UFormGroup name="title" label="Verseny neve" class="mb-6">
          <UInput v-model="competitionState.title" placeholder="Verseny neve" />
        </UFormGroup>

        <UFormGroup name="description" label="Verseny leírása" class="my-6">
          <UInput
            v-model="competitionState.description"
            placeholder="Verseny leírása"
          />
        </UFormGroup>

        <UFormGroup name="image" label="Verseny képe" class="my-6">
          <MediaSelect v-model="competitionState.image" />
        </UFormGroup>

        <UFormGroup name="teamCompetition" class="my-6">
          <UCheckbox
            label="Csapatverseny"
            v-model="competitionState.teamCompetition"
          />
        </UFormGroup>

        <UFormGroup
          name="teamLimit"
          label="Maximális csapatlétszám"
          class="mt-6"
        >
          <UInput
            v-model="competitionState.teamLimit"
            type="number"
            :disabled="!competitionState.teamCompetition"
          />
        </UFormGroup>
      </UForm>

      <template #footer>
        <div class="float-right">
          <UButton
            @click="modal.close"
            color="red"
            :label="props.actionTextCancel"
          />
          <UButton
            @click="submitClick"
            color="emerald"
            class="mx-2"
            :label="props.actionTextConfirm"
          />
        </div>
        <div class="clear-both"></div>
      </template>
    </UCard>
  </UModal>
</template>
