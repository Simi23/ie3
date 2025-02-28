<template>
  <UModal :ui="{ background: 'bg-transparent dark:bg-transparent' }">
    <UCard>
      <template #header>
        <h1 class="text-lg font-bold">Új felhasználó</h1>
      </template>
      <UForm
        :state="formState"
        :schema="newUserSchema"
        @submit.prevent="createUser"
        class="space-y-4"
      >
        <UFormGroup name="email" label="Email cím">
          <UInput v-model="formState.email" />
        </UFormGroup>

        <UFormGroup name="username" label="Felhasználónév">
          <UInput v-model="formState.username" />
        </UFormGroup>

        <UFormGroup name="fullname" label="Teljes név">
          <UInput v-model="formState.fullname" />
        </UFormGroup>

        <UFormGroup name="classId" label="Osztály">
          <ClassSelect v-model="formState.classId" show-hidden="1" />
        </UFormGroup>

        <div>
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
        </div>

        <UFormGroup label="Ülőhely kiválasztása" name="seatId">
          <USelectMenu
            :options="freeSeats"
            v-model="formState.seatId"
            option-attribute="name"
            value-attribute="id"
          />
        </UFormGroup>

        <div class="flex w-full flex-row flex-nowrap justify-end">
          <UButton
            label="Mégse"
            color="red"
            variant="outline"
            @click="emit('success')"
          />
          <UButton type="submit" label="Mentés" class="ml-2" />
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import { newUserSchema } from "~/schemas/newUserSchema";

const emit = defineEmits<{
  success: [];
}>();

const modal = useModal();
const formState = ref({
  email: "",
  username: "",
  fullname: "",
  classId: "",
  ownPc: false,
  ethernetPort: false,
  ownChair: false,
  seatId: "",
});

const { data: seatData } = useFetch("/api/seat");

const freeSeats = computed(() => {
  return seatData.value
    ?.filter((s) => {
      return s.owner === null && s.name !== "SWAP";
    })
    .map((s) => {
      return {
        name: s.name,
        id: s.id,
      };
    });
});

async function createUser() {
  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>("/api/admin/newuser", {
      method: "POST",
      body: {
        email: formState.value.email,
        username: formState.value.username,
        fullname: formState.value.fullname,
        classId: formState.value.classId,
        ownPc: formState.value.ownPc,
        ethernetPort: formState.value.ethernetPort,
        ownChair: formState.value.ownChair,
        seatId: formState.value.seatId,
      },
    }),
  );

  if (error === undefined) {
    emit("success");
  }
}
</script>

<style></style>
