<template>
  <UContainer class="flex min-h-screen w-fit items-center">
    <UCard class="h-fit min-w-72">
      <h1 class="text-center text-2xl font-bold">{{ text }}</h1>

      <div class="mt-2 text-center">
        <div v-if="status == 'success'">
          <div v-if="data == 0">
            <p>Email cím megerősítése sikeres!</p>
            <UButton to="/login" label="Tovább a belépéshez" class="mt-2" />
          </div>
          <p v-else>Email cím megerősítése sikertelen!</p>
        </div>
        <div v-else>
          <p>Folyamatban...</p>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<script lang="ts" setup>
const { csrf } = useCsrf();
const { token } = useRoute().query;

const { data, status, execute } = useFetch("/api/user/verifymail", {
  server: false,
  lazy: true,
  immediate: false,
  method: "post",
  headers: {
    "csrf-token": csrf,
  },
  body: {
    token: token,
  },
});

const text = computed(() => {
  if (status.value == "success" && data.value == 0) return "Email megerősítve";

  return "Email megerősítése...";
});

onMounted(async () => {
  await nextTick();
  await execute();
});
</script>

<style></style>
