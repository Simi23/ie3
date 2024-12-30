<template>
  <div>
    <UContainer
      class="flex min-h-screen w-full flex-col items-center justify-center"
    >
      <h1 class="mb-8 text-center text-4xl font-bold">Regisztráció</h1>
      <div class="flex items-center">
        <UCard class="mr-2 min-w-[380px] max-w-[480px]">
          <template #header>
            <h1 class="text-center text-2xl font-bold">Adatok</h1>
          </template>
          <CarouselMenu :pagecount="4" name="registerdata">
            <!-- 1/4 -->
            <!-- USERNAME, EMAIL, PASSWORD -->
            <template #page1>
              <UForm :schema="registrationSchema1p3" :state="regState1p3">
                <!-- EMAIL -->
                <UFormGroup
                  name="email"
                  label="E-mail cím"
                  class="mx-1 my-2 h-20"
                >
                  <UInput
                    v-model="registrationState.email"
                    class="inputField"
                    placeholder="E-mail cím"
                  />
                </UFormGroup>

                <!-- USERNAME -->
                <UFormGroup
                  name="username"
                  label="Felhasználónév"
                  class="mx-1 my-2 h-20"
                >
                  <UInput
                    v-model="registrationState.username"
                    class="inputField"
                    placeholder="Felhasználónév"
                  />
                </UFormGroup>

                <!-- PASSWORD -->
                <UFormGroup
                  name="password"
                  label="Jelszó"
                  class="mx-1 my-2 h-20"
                >
                  <UInput
                    v-model="registrationState.password"
                    class="inputField"
                    type="password"
                    placeholder="Jelszó"
                  />
                </UFormGroup>

                <!-- PASSWORD CONFIRM -->
                <UFormGroup
                  name="confirmPassword"
                  label="Jelszó újra"
                  class="mx-1 my-2 h-20"
                >
                  <UInput
                    v-model="registrationState.confirmPassword"
                    class="inputField"
                    type="password"
                    placeholder="Jelszó újra"
                  />
                </UFormGroup>

                <!-- ACTION BUTTONS -->
                <div class="float-right mt-5">
                  <UButton
                    size="sm"
                    label="Bejelentkezés"
                    to="/login"
                    variant="ghost"
                    icon="i-heroicons-arrow-right-end-on-rectangle-solid"
                    class="h-full align-middle"
                  />
                  <UButton
                    class="ml-2 align-middle"
                    size="sm"
                    label="Tovább"
                    type="submit"
                  />
                </div>
                <div class="clear-both"></div>
              </UForm>
            </template>

            <!-- 2/4 -->
            <!-- FULLNAME, CLASS -->
            <template #page2>
              <UForm :schema="registrationSchema2p3" :state="regState2p3">
                <!-- FULLNAME -->
                <UFormGroup
                  name="fullname"
                  label="Teljes név"
                  class="mx-1 my-2 h-20"
                >
                  <UInput
                    v-model="registrationState.fullname"
                    class="inputField"
                  />
                </UFormGroup>

                <!-- CLASS -->
                <UFormGroup
                  name="classId"
                  label="Osztály"
                  class="mx-1 my-2 h-20"
                >
                  <ClassSelect
                    ref="class-selector"
                    v-model="registrationState.classId"
                  />
                </UFormGroup>
              </UForm>
            </template>

            <!-- 3/4 -->
            <!-- OWNPC, ETHERNETPORT, OWNCHAIR -->
            <template #page3>
              <UForm :schema="registrationSchema3p3" :state="regState3p3">
                <!-- OWNPC -->
                <UFormGroup name="ownPc">
                  <UCheckbox
                    label="Saját számítógép"
                    help="Iskolai gép igényléséhez kapcsold ki"
                    v-model="registrationState.ownPc"
                  />
                </UFormGroup>

                <!-- ETHERNETPORT -->
                <UFormGroup name="ethernetPort">
                  <UCheckbox
                    label="Ethernet aljzat"
                    help="Van-e a számítógépeden ethernet (RJ-45) aljzat"
                    v-model="registrationState.ethernetPort"
                    :disabled="!registrationState.ownPc"
                  />
                </UFormGroup>

                <!-- OWNCHAIR -->
                <UFormGroup name="ownChair">
                  <UCheckbox
                    label="Saját szék"
                    v-model="registrationState.ownChair"
                  />
                </UFormGroup>
              </UForm>
            </template>

            <!-- 4/4 -->
            <!-- SEAT -->
            <template #page4>
              <UForm :schema="registrationSchemaSeat" :state="regStateSeat">
                <UFormGroup name="seatName">
                  <SeatMap
                    svg-id="register-map"
                    arrow-stroke="#ffffff"
                    seat-stroke="#222222"
                    letter-stroke="#ffffff"
                    class="w-[480px]"
                  />
                </UFormGroup>
              </UForm>
            </template>
          </CarouselMenu>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
import {
  registrationSchema,
  registrationSchema1p3,
  registrationSchema2p3,
  registrationSchema3p3,
  registrationSchemaSeat,
  type RegistrationSchema,
  type RegistrationSchema1p3,
  type RegistrationSchema2p3,
  type RegistrationSchema3p3,
  type RegistrationSchemaSeat,
} from "~/schemas/registrationSchema";
import { type UForm } from "#build/components";
import ClassSelect from "~/components/Class/Select.vue";

definePageMeta({
  middleware: "registration-status",
});

type ClassSelectT = InstanceType<typeof ClassSelect>;
const classRef = useTemplateRef<ClassSelectT>("class-selector");

const registrationState = ref<RegistrationSchema>({
  fullname: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  classId: "",
  ownPc: true,
  ethernetPort: false,
  ownChair: false,
  seatName: "",
});

const regState1p3 = computed<RegistrationSchema1p3>(() => {
  return {
    username: registrationState.value.username,
    email: registrationState.value.email,
    password: registrationState.value.password,
    confirmPassword: registrationState.value.confirmPassword,
  };
});

const regState2p3 = computed<RegistrationSchema2p3>(() => {
  return {
    fullname: registrationState.value.fullname,
    classId: registrationState.value.classId,
  };
});

const regState3p3 = computed<RegistrationSchema3p3>(() => {
  return {
    ownPc: registrationState.value.ownPc,
    ethernetPort: registrationState.value.ethernetPort,
    ownChair: registrationState.value.ownChair,
  };
});

const regStateSeat = computed<RegistrationSchemaSeat>(() => {
  return {
    seatName: registrationState.value.seatName,
  };
});

// PC / Ethernet integrity check
watch(
  registrationState,
  (newValue, oldValue) => {
    if (!newValue.ownPc) {
      registrationState.value.ethernetPort = true;
    }
  },
  {
    deep: true,
  },
);
</script>

<style>
.inputField ~ p {
  user-select: none;
  margin-top: 0;
}
</style>
