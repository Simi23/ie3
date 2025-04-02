<template>
  <UCard class="grow dark:bg-opacity-90">
    <template #header>
      <div class="flex flex-row flex-nowrap items-center justify-between">
        <div>
          <h1 class="text-2xl">
            <span class="font-bold">
              {{ userData?.fullname }}
            </span>
            <span class="ml-3 font-light">
              {{ userData?.username }}
            </span>
          </h1>
          <UBadge
            size="xs"
            variant="soft"
            :label="userData?.paid ? 'Fizetett' : 'Nem fizetett'"
            :color="userData?.paid ? 'emerald' : 'red'"
          />
        </div>
        <div v-if="adminMode" class="space-y-2">
          <div class="space-x-2">
            <UTooltip
              text="Email-megerősítő üzenet küldése"
              :popper="{ placement: 'top' }"
            >
              <UButton
                icon="i-heroicons-envelope-solid"
                color="indigo"
                variant="soft"
                size="md"
                @click="sendVerificationMail"
              />
            </UTooltip>
            <UTooltip
              text="Jelszó-helyreállítás küldése"
              :popper="{ placement: 'top' }"
            >
              <UButton
                icon="i-heroicons-lock-closed-solid"
                color="indigo"
                variant="soft"
                size="md"
                @click="sendRecoveryMail"
              />
            </UTooltip>
            <UTooltip text="Jelszó beállítása" :popper="{ placement: 'top' }">
              <UButton
                icon="i-heroicons-key-solid"
                color="indigo"
                variant="soft"
                size="md"
                @click="setPassword"
              />
            </UTooltip>
            <UTooltip text="Felhasználó törlése" :popper="{ placement: 'top' }">
              <UButton
                icon="i-heroicons-trash-solid"
                color="red"
                variant="soft"
                size="md"
                @click="deleteUser"
              />
            </UTooltip>
          </div>
          <div>
            <UButton
              label="Szerkesztés"
              icon="i-heroicons-pencil-solid"
              color="cyan"
              variant="soft"
              size="md"
              block
              @click="openUserEditModal"
            />
          </div>
        </div>
      </div>
    </template>
    <p><b>Osztály:</b> {{ userData?.class.name }}</p>
    <p>
      <b>Email cím:</b> {{ userData?.email }}
      <UBadge
        v-if="userData?.emailVerified"
        label="Megerősítve"
        icon="i-heroicons-check-circle-solid"
        size="xs"
        color="cyan"
        variant="subtle"
        class="align-text-bottom"
      />
      <UBadge
        v-else
        label="Nincs megerősítve"
        icon="i-heroicons-question-mark-circle-solid"
        size="xs"
        color="amber"
        variant="subtle"
        class="align-text-bottom"
      />
    </p>
    <p>
      <b>Regisztráció ideje:</b>
      {{ registrationDate.toLocaleString("hu") }}
    </p>

    <p class="mt-4">
      <b>Jogosultság: </b>
      <UBadge
        :icon="roleDisplay.icon"
        :color="roleDisplay.color"
        :label="roleDisplay.name"
        size="xs"
        class="align-text-bottom"
      />
    </p>

    <p class="mt-4">
      <b>Számítógép:</b>
      <span v-if="userData?.ownPc" class="text-emerald-400"> Saját </span>
      <span v-else class="text-yellow-400"> Iskolai </span>
    </p>
    <p>
      <b>RJ45 aljzat:</b>
      <span v-if="userData?.ethernetPort" class="text-emerald-400"> Van </span>
      <span v-else class="text-red-400"> Nincs </span>
    </p>
    <p>
      <b>Szék:</b>
      <span v-if="userData?.ownChair" class="text-emerald-400"> Saját </span>
      <span v-else class="text-yellow-400"> Iskolai </span>
    </p>

    <div v-if="props.adminMode" class="mt-4">
      <b>Discord:</b>
      <DiscordUserBadge
        v-if="userData?.dcConnected"
        :dc-data="{
          id: userData.dcId,
          globalName: userData.dcGlobalName,
          avatar: userData.dcAvatar,
        }"
        class="ml-2 align-sub"
      />
      <span v-else class="ml-2 font-extralight text-amber-500"
        >Nincs csatlakoztatva</span
      >
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import type { Badge, UserData } from "~/utils/types";
import ModalUserEdit from "~/components/Modal/UserEdit.vue";
import ModalConfirmAction from "~/components/Modal/ConfirmAction.vue";
import ModalSingleInput from "~/components/Modal/SingleInput.vue";

type Props = {
  userId: string;
  adminMode?: boolean;
};
const props = defineProps<Props>();
const modal = useModal();

const { data: userData, refresh } = useFetch<UserData>(
  `/api/user/${props.userId}`,
);

const registrationDate = computed(
  () => new Date(userData.value?.createdAt ?? Date()),
);

const roles: Badge[] = [
  { name: "Felhasználó", color: "sky", icon: "i-heroicons-user-solid" },
  { name: "Pénzügy", color: "emerald", icon: "i-heroicons-banknotes-solid" },
  { name: "Admin", color: "orange", icon: "i-heroicons-users-solid" },
];
const roleDisplay = computed(() => {
  return roles[userData?.value?.adminClass ?? 0];
});

async function openUserEditModal() {
  modal.open(ModalUserEdit, {
    userId: props.userId,
    onSuccess: async () => {
      await refresh();
      modal.close();
    },
  });
}

async function sendVerificationMail() {
  modal.open(ModalConfirmAction, {
    title: "Megerősítő mail küldése",
    description: `Biztosan elküldi a megerősítő levelet ${userData?.value?.fullname} felhasználónak?`,
    onSuccess: async () => {
      modal.close();
      const [error, data] = await catchError(
        $fetchCsrfNotification<NotificationResponse>("/api/admin/mailverify", {
          method: "POST",
          body: {
            userId: userData.value?.id ?? 0,
          },
        }),
      );
    },
  });
}

async function sendRecoveryMail() {
  modal.open(ModalConfirmAction, {
    title: "Jelszó-helyreállítás küldése",
    description: `Biztosan elküldi a jelszó-helyreállító levelet ${userData?.value?.fullname} felhasználónak?`,
    onSuccess: async () => {
      modal.close();
      const [error, data] = await catchError(
        $fetchCsrfNotification<NotificationResponse>("/api/admin/mailrecover", {
          method: "POST",
          body: {
            email: userData.value?.email ?? "",
          },
        }),
      );
    },
  });
}

async function setPassword() {
  modal.open(ModalSingleInput, {
    title: "Új jelszó beállítása",
    fieldText: "Új jelszó",
    placeHolder: "Jelszó",
    isPassword: true,
    onSuccess: async (newPassword) => {
      const [error, data] = await catchError(
        $fetchCsrfNotification<NotificationResponse>(
          `/api/user/${userData.value?.id ?? "0"}/password`,
          {
            method: "PUT",
            body: {
              password: newPassword,
            },
          },
        ),
      );
      if (error == undefined) {
        modal.close();
      }
    },
  });
}

async function deleteUser() {
  modal.open(ModalConfirmAction, {
    title: "Felhasználó törlése",
    description: `Biztosan törli ${userData?.value?.fullname} felhasználót?`,
    danger: true,
    onSuccess: async () => {
      modal.close();
      const [error, data] = await catchError(
        $fetchCsrfNotification<NotificationResponse>(
          `/api/user/${userData.value?.id ?? "0"}`,
          {
            method: "DELETE",
          },
        ),
      );
      if (error == undefined) {
        return navigateTo("/dashboard/admin/users");
      }
    },
  });
}
</script>

<style></style>
