<template>
  <UModal :ui="{ background: 'bg-transparent dark:bg-transparent' }">
    <UCard>
      <template #header>
        <h1 class="text-lg">
          <span class="font-bold">
            {{ userData?.fullname }}
          </span>
          <span class="ml-2 font-light">
            {{ userData?.username }}
          </span>
        </h1>
      </template>
      <UForm
        :state="formState"
        :schema="userEditSchema"
        @submit.prevent="updateUser"
      >
        <UFormGroup name="fullname" label="Név" class="mb-3">
          <UInput v-model="formState.fullname" />
        </UFormGroup>
        <UFormGroup name="email" label="Email cím" class="my-3">
          <UInput v-model="formState.email" />
        </UFormGroup>
        <UFormGroup name="class" label="Osztály" class="my-3">
          <ClassSelect v-model="formState.classId" show-hidden="1" />
        </UFormGroup>
        <URadioGroup
          :options="options"
          v-model="formState.adminClass"
          legend="Jogosultság"
          class="my-3"
          :ui-radio="{ wrapper: 'my-1' }"
        >
          <template #label="{ option }">
            <UBadge
              :icon="option.icon"
              :color="option.color"
              :label="option.label"
              size="xs"
              class="align-text-bottom"
            />
          </template>
        </URadioGroup>
        <UCheckbox name="ownPc" v-model="formState.ownPc" label="Saját gép" />
        <UCheckbox
          name="ethernetPort"
          v-model="formState.ethernetPort"
          label="RJ45 aljzat"
        />
        <UCheckbox
          name="ownChair"
          v-model="formState.ownChair"
          label="Saját szék"
        />

        <div class="mt-3 flex w-full flex-row flex-nowrap justify-end">
          <UButton
            label="Mégse"
            color="red"
            variant="outline"
            @click="modal.close()"
          />
          <UButton type="submit" label="Mentés" class="ml-2" />
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import { userEditSchema } from "~/schemas/userEditSchema";
import type { Badge, UserData } from "~/utils/types";

interface Props {
  userId: string;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  success: [];
}>();
const modal = useModal();
const loadingSpinner = useLoadingSpinner();

const formState = ref({
  fullname: "",
  classId: "",
  email: "",
  adminClass: 0,
  ownPc: false,
  ethernetPort: false,
  ownChair: false,
});

const { data: userData } = useFetch<UserData>(`/api/user/${props.userId}`, {
  onResponse: (r) => {
    formState.value.fullname = r.response._data.fullname;
    formState.value.classId = r.response._data.class.id;
    formState.value.email = r.response._data.email;
    formState.value.adminClass = r.response._data.adminClass;
    formState.value.ownPc = r.response._data.ownPc;
    formState.value.ethernetPort = r.response._data.ethernetPort;
    formState.value.ownChair = r.response._data.ownChair;
  },
});

const options = [
  {
    label: "Felhasználó",
    value: 0,
    color: "sky",
    icon: "i-heroicons-user-solid",
  },
  {
    label: "Pénzügy",
    value: 1,
    color: "emerald",
    icon: "i-heroicons-banknotes-solid",
  },
  {
    label: "Admin",
    value: 2,
    color: "orange",
    icon: "i-heroicons-users-solid",
  },
];

async function updateUser() {
  loadingSpinner.value = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<any>(`/api/user/${props.userId}`, {
      method: "PUT",
      body: formState.value,
    }),
  );

  loadingSpinner.value = false;

  if (error === undefined) {
    emit("success");
  }
}
</script>

<style></style>
