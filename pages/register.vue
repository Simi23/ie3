<template>
  <div>
    <UContainer
      class="flex min-h-screen w-full flex-col items-center justify-center"
    >
      <h1 class="mb-8 text-center text-4xl font-bold">Regisztráció</h1>
      <div class="flex items-center">
        <UCard class="min-w-[380px] max-w-[576px]">
          <template #header>
            <h1 class="text-center text-2xl font-bold">
              {{ stageNames[stageId] }}
            </h1>
          </template>
          <CarouselMenu :pagecount="4" name="registerdata" ref="registercm">
            <!-- 1/4 -->
            <!-- USERNAME, EMAIL, PASSWORD -->
            <template #page1>
              <UForm
                :schema="registrationSchema1p3"
                :state="regState1p3"
                @submit.prevent="completeStage(1)"
                @error="stageError"
                class="w-[340px]"
              >
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
              <UForm
                :schema="registrationSchema2p3"
                :state="regState2p3"
                @submit.prevent="completeStage(2)"
                @error="stageError"
                class="w-[340px]"
              >
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
                    :sm-popper="{ strategy: 'fixed' }"
                    :sm-ui="{ width: 'w-24' }"
                  />
                </UFormGroup>

                <!-- ACTION BUTTONS -->
                <div class="float-right mt-5">
                  <UButton
                    size="sm"
                    label="Vissza"
                    @click="revertStage(2)"
                    variant="ghost"
                    icon="i-heroicons-arrow-small-left-solid"
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

            <!-- 3/4 -->
            <!-- OWNPC, ETHERNETPORT, OWNCHAIR -->
            <template #page3>
              <!-- Low PC count -->
              <UAlert
                v-if="(schoolPc?.freePcs ?? 0) <= 0"
                title="Elfogytak az iskolai gépek."
                color="red"
                variant="soft"
                icon="i-heroicons-exclamation-circle-16-solid"
                class="mb-4"
              />
              <UAlert
                v-else-if="(schoolPc?.freePcs ?? 0) <= 4"
                title="Kevesebb, mint 5 iskolai gép maradt."
                color="amber"
                variant="soft"
                icon="i-heroicons-exclamation-circle-16-solid"
                class="mb-4"
              />
              <UAlert
                v-else-if="(schoolPc?.freePcs ?? 0) <= 9"
                title="Kevesebb, mint 10 iskolai gép maradt."
                color="yellow"
                variant="soft"
                icon="i-heroicons-exclamation-circle-16-solid"
                class="mb-4"
              />

              <UForm
                :schema="registrationSchema3p3"
                :state="regState3p3"
                @submit.prevent="completeStage(3)"
                @error="stageError"
                class="w-[340px]"
              >
                <!-- OWNPC -->
                <UFormGroup name="ownPc" class="mx-1 my-2">
                  <UCheckbox
                    label="Saját számítógép"
                    help="Iskolai gép igényléséhez kapcsold ki"
                    v-model="registrationState.ownPc"
                    :disabled="(schoolPc?.freePcs ?? 0) <= 0"
                  />
                </UFormGroup>

                <!-- ETHERNETPORT -->
                <UFormGroup name="ethernetPort" class="mx-1 my-2">
                  <UCheckbox
                    label="Ethernet aljzat"
                    help="Van-e a számítógépeden ethernet (RJ-45) aljzat"
                    v-model="registrationState.ethernetPort"
                    :disabled="!registrationState.ownPc"
                  />
                </UFormGroup>

                <!-- OWNCHAIR -->
                <UFormGroup name="ownChair" class="mx-1 my-2">
                  <UCheckbox
                    label="Saját szék"
                    v-model="registrationState.ownChair"
                  />
                </UFormGroup>

                <!-- ACTION BUTTONS -->
                <div class="float-right mt-5">
                  <UButton
                    size="sm"
                    label="Vissza"
                    @click="revertStage(3)"
                    variant="ghost"
                    icon="i-heroicons-arrow-small-left-solid"
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

            <!-- 4/4 -->
            <!-- SEAT -->
            <template #page4>
              <UForm
                :schema="registrationSchemaSeat"
                :state="regStateSeat"
                @submit.prevent="completeStage(4)"
                @error="stageError"
              >
                <span class="mr-1 text-lg font-bold">
                  Kiválasztott ülőhely:
                </span>
                <span class="text-lg">{{
                  registrationState.seatName.length == 0
                    ? "nincs"
                    : registrationState.seatName
                }}</span>
                <UFormGroup name="seatName" class="mt-3 h-[340px]">
                  <SeatMap
                    ref="register-map"
                    svg-id="register-map"
                    arrow-stroke="#ffffff"
                    seat-stroke="#222222"
                    letter-stroke="#ffffff"
                    class="w-[480px]"
                    @chosen-seat="seatEvent"
                  />
                </UFormGroup>

                <!-- ACTION BUTTONS -->
                <div class="float-right mt-5">
                  <UButton
                    size="sm"
                    label="Vissza"
                    @click="revertStage(4)"
                    variant="ghost"
                    icon="i-heroicons-arrow-small-left-solid"
                    class="h-full align-middle"
                  />
                  <UButton
                    class="ml-2 align-middle"
                    icon="i-heroicons-user-plus-solid"
                    size="sm"
                    label="Regisztrálok"
                    type="submit"
                  />
                </div>
                <div class="clear-both"></div>
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
import CarouselMenu from "~/components/CarouselMenu.vue";
import SeatMap from "~/components/SeatMap.vue";

definePageMeta({
  middleware: "registration-status",
});

type t_ClassSelect = InstanceType<typeof ClassSelect>;
type t_CarouselMenu = InstanceType<typeof CarouselMenu>;
type t_SeatMap = InstanceType<typeof SeatMap>;

const classRef = useTemplateRef<t_ClassSelect>("class-selector");
const cmRef = useTemplateRef<t_CarouselMenu>("registercm");
const r_SeatMap = useTemplateRef<t_SeatMap>("register-map");

const toast = useToast();
const loadingSpinner = useLoadingSpinner();

const stageNames = ref<string[]>([
  "Belépési adatok",
  "Személyes adatok",
  "Opciók",
  "Ülőhely",
]);
const stageId = ref<number>(0);

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

const { data: schoolPc, refresh: refreshSchoolPc } = useFetch(
  "/api/stat/schoolpc",
  {
    onResponse: (data) => {
      if (data.response._data.freePcs === 0) {
        registrationState.value.ownPc = true;
      }
    },
  },
);

const { data: freeSeats, refresh: refreshFreeSeats } = useFetch(
  "/api/stat/freeseats",
  {
    server: false,
    lazy: true,
  },
);

type Seat = {
  id: string;
  name: string;
};

function recolorSeats() {
  r_SeatMap.value?.clearSeatEvents();
  r_SeatMap.value?.changeSeatColour("all", "#b91c1c");
  if (!Array.isArray(freeSeats.value) || freeSeats.value == null) return;
  const seatArray: Seat[] = freeSeats.value;
  for (let i = 0; i < seatArray.length; i++) {
    const cSeat = seatArray[i];
    r_SeatMap.value?.changeSeatColour(cSeat.name, "#059669");
    r_SeatMap.value?.assignSeat(cSeat.name);
  }
  r_SeatMap.value?.changeSeatColour(
    registrationState.value.seatName,
    "#22d3ee",
  );
}

watch(freeSeats, recolorSeats);

async function register() {
  loadingSpinner.value = true;
  try {
    const result = await $fetchCsrfNotification("/api/user/register", {
      method: "POST",
      body: registrationState.value,
    });
  } catch (error) {
    loadingSpinner.value = false;
    return;
  }
  loadingSpinner.value = false;
  await navigateTo("/regcomplete");
}

/**
 * Stages:
 * 1/4: Email, username, password (check email/username availability)
 * 2/4: Full name, class
 * 3/4: Options (check for pc availability!)
 * 4/4: Seat
 */
async function completeStage(stage: number) {
  if (stage == 2) {
    await refreshSchoolPc();
  }

  if (stage == 3) {
    await refreshFreeSeats();
  }

  if (stage < 4) {
    stageId.value = stageId.value + 1;
    await cmRef.value?.jumpTo(stage + 1);
    return;
  }

  if (stage == 4) {
    register();
  }
}

async function revertStage(stage: number) {
  stageId.value = stageId.value - 1;
  await cmRef.value?.jumpTo(stage - 1);
}

function stageError() {
  toast.add({
    title: "Hiba",
    description:
      "Nem megfelelő az űrlap kitöltése. Ellenőrizd a megadott adatokat!",
    icon: "i-heroicons-x-mark-20-solid",
    color: "red",
  });
}

function seatEvent(seatName: string) {
  console.log(seatName);
  registrationState.value.seatName = seatName;
  recolorSeats();
  r_SeatMap.value?.changeSeatColour(seatName, "#22d3ee");
}
</script>

<style>
.inputField ~ p {
  user-select: none;
  margin-top: 0;
}
</style>
