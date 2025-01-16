<template>
  <UModal :ui="{ background: 'bg-transparent dark:bg-transparent' }">
    <UCard>
      <template #header>
        <div class="flex flex-row flex-nowrap items-center justify-between">
          <UFormGroup label="Új csapatnév" v-if="renaming">
            <UInput v-model="newName" />
          </UFormGroup>
          <div v-else>
            <h1 class="text-2xl font-extrabold">{{ team?.name }}</h1>
            <h2 class="text-lg font-bold text-gray-500">
              {{ team?.competitionTitle }}
            </h2>
          </div>
          <UTooltip text="Csapat átnevezése" v-if="imLeader && !renaming">
            <UButton
              icon="i-heroicons-pencil"
              variant="soft"
              color="indigo"
              @click="renameTeam"
            />
          </UTooltip>
          <UButton
            v-else-if="renaming"
            icon="i-heroicons-check"
            color="emerald"
            label="Mentés"
            @click="saveNewName"
            :loading="loading.rename"
            :disabled="loading.rename"
          />
        </div>
      </template>

      <h2 class="text-lg font-bold">Csapattagok</h2>
      <ul class="ml-2 list-inside list-disc">
        <li v-for="member in team?.users" :key="member.id" class="my-1">
          <span class="text-lg">{{ member.name }}</span>

          <UTooltip
            v-if="imLeader && !member.isMe"
            text="Kirúgás"
            class="ml-3 align-bottom"
          >
            <UButton
              icon="i-heroicons-x-mark"
              color="red"
              variant="soft"
              size="xs"
              @click="showConfirm('kick', member.id)"
            />
          </UTooltip>

          <UBadge
            v-if="member.isLeader"
            class="ml-3 align-text-bottom"
            icon="i-heroicons-chevron-double-up-16-solid"
            label="Csapatvezető"
            variant="subtle"
            color="amber"
            size="xs"
            :ui="{ rounded: 'rounded-full' }"
          />
        </li>
        <li
          v-for="member in team?.invites"
          :key="member.id"
          class="my-1 text-gray-300"
        >
          <span class="text-lg">{{ member.name }}</span>

          <UTooltip v-if="imLeader" text="Kirúgás" class="ml-3 align-bottom">
            <UButton
              icon="i-heroicons-x-mark"
              color="red"
              variant="soft"
              size="xs"
              @click="showConfirm('kick', member.id)"
            />
          </UTooltip>

          <UBadge
            class="ml-3 align-text-bottom"
            icon="i-heroicons-envelope"
            label="Meghívott"
            variant="subtle"
            color="indigo"
            size="xs"
            :ui="{ rounded: 'rounded-full' }"
          />
        </li>
      </ul>

      <template #footer>
        <div class="flex flex-row justify-between">
          <div>
            <UButtonGroup v-if="imLeader">
              <UInput
                placeholder="Felhasználónév"
                v-model="inviteUserInput"
                :disabled="fullTeam"
              />
              <UTooltip text="Meghívás" :prevent="fullTeam">
                <UButton
                  icon="i-heroicons-user-plus"
                  color="indigo"
                  @click="inviteUser"
                  :loading="loading.invite"
                  :disabled="loading.invite || fullTeam"
                />
              </UTooltip>
            </UButtonGroup>
          </div>
          <div class="flex flex-row flex-nowrap">
            <UButton
              v-if="imLeader"
              label="Csapat törlése"
              color="red"
              variant="outline"
              icon="i-heroicons-trash"
              @click="showConfirm('delTeam')"
            />
            <UButton
              v-else
              label="Kilépés"
              color="red"
              variant="outline"
              icon="i-heroicons-user-minus"
              @click="showConfirm('leave')"
            />
            <UButton
              label="Kész"
              class="ml-2"
              @click="modal.close"
              :disabled="renaming"
            />
          </div>
        </div>
      </template>
    </UCard>

    <Transition name="slide">
      <UCard class="mt-2" v-show="confirmCard">
        <div class="flex flex-row flex-nowrap items-center justify-between">
          <div>
            <h1 class="text-2xl font-extrabold">Megerősítés</h1>
            <h2 class="text-lg font-bold text-gray-500">
              {{ confirmText }}
            </h2>
          </div>
          <div class="flex flex-col flex-nowrap">
            <UButton
              color="red"
              label="Nem"
              icon="i-heroicons-x-mark"
              variant="soft"
              block
              @click="hideConfirm"
            />
            <UButton
              color="emerald"
              label="Igen"
              icon="i-heroicons-check"
              class="mt-1"
              block
              @click="confirmAction"
            />
          </div>
        </div>
      </UCard>
    </Transition>
  </UModal>
</template>

<script lang="ts" setup>
import { type TeamResponse } from "~/server/api/team/[id].get";

interface Props {
  teamId: string;
}

const props = defineProps<Props>();
const toast = useToast();
const modal = useModal();
const loadingSpinner = useLoadingSpinner();

const loading = ref({
  rename: false,
  invite: false,
});

const confirmCard = ref(false);
const confirmText = ref("Biztosan kilépsz a csapatból?");
const kickUserId = ref("");
const currentAction = ref<"delTeam" | "leave" | "kick">();

const renaming = ref(false);
const newName = ref("");

const { data: team, refresh } = await useFetch<TeamResponse>(
  `/api/team/${props.teamId}`,
);

const emit = defineEmits<{
  finish: [refresh: boolean];
}>();

const imLeader = computed<boolean>(() => {
  return team.value?.users.find((u) => u.isMe)?.isLeader ?? false;
});
const fullTeam = computed<boolean>(() => {
  return (
    (team.value?.users.length ?? 0) + (team.value?.invites.length ?? 0) >=
    (team.value?.teamLimit ?? 0)
  );
});

function renameTeam() {
  newName.value = team.value?.name ?? "Új csapat";
  renaming.value = true;
}

async function saveNewName() {
  if (newName.value.length < 1) {
    toast.add({
      description: "A csapatnév nem lehet üres!",
      color: "red",
      title: "Hiba",
      icon: "i-heroicons-x-mark-20-solid",
    });
    return;
  }

  loading.value.rename = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>(`/api/team/${props.teamId}`, {
      method: "PUT",
      body: {
        newName: newName.value,
      },
    }),
  );

  await refresh();

  loading.value.rename = false;
  if (error === undefined) {
    renaming.value = false;
  }
}

const inviteUserInput = ref("");

async function inviteUser() {
  loading.value.invite = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>("/api/invite", {
      method: "POST",
      body: {
        teamId: props.teamId,
        username: inviteUserInput.value,
      },
    }),
  );
  if (error === undefined) {
    inviteUserInput.value = "";
  }
  await refresh();
  loading.value.invite = false;
}

async function showConfirm(
  action: "delTeam" | "leave" | "kick",
  userId?: string,
) {
  confirmCard.value = true;
  currentAction.value = action;

  let userName = "";
  if (userId) {
    userName =
      team.value?.users.find((u) => u.id == userId)?.name ??
      team.value?.invites.find((i) => i.id == userId)?.name ??
      "ismeretlen";
    kickUserId.value = userId;
  }

  switch (action) {
    case "delTeam":
      confirmText.value = "Biztosan kitörlöd a csapatot?";
      break;

    case "leave":
      confirmText.value = "Biztosan kilépsz a csapatból?";
      break;

    case "kick":
      confirmText.value = `Biztosan kirúgod "${userName}" felhasználót?`;
      break;

    default:
      break;
  }
}

async function hideConfirm() {
  confirmCard.value = false;
}

async function confirmAction() {
  if (currentAction.value == "kick") {
    kickUser();
  } else {
    leaveCompetition();
  }
}

async function kickUser() {
  loadingSpinner.value = true;

  const isInvite = team.value?.invites.some((i) => i.id == kickUserId.value);

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>("/api/team/kick", {
      method: "POST",
      body: {
        teamId: props.teamId,
        kickId: kickUserId.value,
        invite: isInvite,
      },
    }),
  );

  await refresh();
  loadingSpinner.value = false;
  if (error === undefined) {
    hideConfirm();
  }
}

async function leaveCompetition() {
  loadingSpinner.value = true;

  const [error, data] = await catchError(
    $fetchCsrfNotification<NotificationResponse>(
      `/api/competition/leave/${team.value?.competitionId}`,
      {
        method: "POST",
      },
    ),
  );

  loadingSpinner.value = false;
  if (error === undefined) {
    emit("finish", true);
  }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.slide-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
