<template>
  <UCard class="grow dark:bg-opacity-90">
    <template #header>
      <div class="flex flex-row flex-nowrap items-center justify-between">
        <h1 class="text-2xl font-bold">
          Discord
          <UBadge
            v-if="dcData?.dcConnected"
            :label="dcData?.dcGlobalName"
            size="md"
            variant="subtle"
          >
            <template #leading>
              <UAvatar :src="dcAvatar" size="3xs" crossorigin />
            </template>
          </UBadge>
          <span class="ml-2 text-xl font-extralight text-amber-500" v-else
            >Nincs csatlakoztatva</span
          >
        </h1>
      </div>
    </template>
    <UButton
      v-if="!dcData?.dcConnected"
      label="Fiók összekapcsolása"
      icon="i-heroicons-link"
      @click="redirectToDiscord"
    />
    <UButton
      v-else
      label="Fiók leválasztása"
      icon="i-heroicons-link-slash"
      color="red"
      variant="soft"
      @click="disconnectDiscord"
    />
  </UCard>
</template>

<script lang="ts" setup>
import ModalConfirmAction from "~/components/Modal/ConfirmAction.vue";

const cfg = useRuntimeConfig();
const modal = useModal();

const { data: dcData, refresh } = useFetch("/api/discord/me");
const dcAvatar = computed(() => {
  return `https://cdn.discordapp.com/avatars/${dcData.value?.dcId}/${dcData.value?.dcAvatar}.jpg?size=128`;
});

function redirectToDiscord() {
  const redirect_uri_base = encodeURIComponent(
    `${cfg.public.siteName}/api/discord/onboardcallback`,
  );
  const redirect_uri = `https://discord.com/oauth2/authorize?client_id=1338156490137141270&response_type=code&redirect_uri=${redirect_uri_base}&scope=identify`;

  return navigateTo(redirect_uri, {
    external: true,
    // open: {
    //   target: "_blank",
    // },
  });
}

async function disconnectDiscord() {
  modal.open(ModalConfirmAction, {
    description: "Biztosan leválasztod a Discord fiókodat?",
    onSuccess: async () => {
      const [error, data] = await catchError(
        $fetchCsrfNotification<NotificationResponse>(
          "/api/discord/disconnect",
          {
            method: "POST",
          },
        ),
      );

      modal.close();
      refresh();
    },
  });
}
</script>

<style></style>
