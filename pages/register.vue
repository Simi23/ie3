<template>
  <div>
    <UContainer
      class="flex min-h-screen w-fit flex-col items-center justify-center"
    >
      <h1 class="mb-3 text-center text-4xl font-bold">Regisztráció</h1>
      <div class="flex">
        <UCard class="mr-2">
          <template #header>
            <h1 class="text-left text-2xl font-bold">Adatok</h1>
          </template>

          <UForm
            ref="form"
            :schema="registrationSchema"
            :state="registrationState"
          >
            <UFormGroup name="email" label="E-mail cím" class="mx-1 my-2 h-20">
              <UInput v-model="registrationState.email" class="inputField" />
            </UFormGroup>
            <UFormGroup
              name="username"
              label="Felhasználónév"
              class="mx-1 my-2 h-20"
            >
              <UInput v-model="registrationState.username" class="inputField" />
            </UFormGroup>

            <UFormGroup
              name="fullname"
              label="Teljes név"
              class="mx-1 my-2 h-20"
            >
              <UInput v-model="registrationState.fullname" class="inputField" />
            </UFormGroup>
            <UFormGroup name="classId" label="Osztály" class="mx-1 my-2 h-20">
              <ClassSelect ref="class-selector" />
            </UFormGroup>
          </UForm>

          Email Felh. név Név Osztály Jelszó INTEGRITY CHECK!!!! Iskolai gép
          Ethernet aljzat Saját szék
        </UCard>
        <UCard>
          <template #header>
            <h1 class="text-left text-2xl font-bold">Ülőhely</h1>
          </template>
          Ülőhely
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
import {
  registrationSchema,
  type RegistrationSchema,
} from "~/schemas/registrationSchema";
import type { UForm } from "#build/components";
import ClassSelect from "~/components/Class/Select.vue";

definePageMeta({
  middleware: "registration-status",
});

const classRef =
  useTemplateRef<InstanceType<typeof ClassSelect>>("class-selector");

const formRef = useTemplateRef<InstanceType<typeof UForm>>("form");
const registrationState = ref({
  fullname: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  classId: classRef.value?.currentClass,
  ownPc: false,
  ethernetPort: false,
  ownChair: false,
  seatName: "",
});
</script>

<style>
.inputField ~ p {
  user-select: none;
  margin-top: 0;
}
</style>
