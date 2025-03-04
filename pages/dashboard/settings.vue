<template>
  <div>
    <div
      class="flex flex-row flex-wrap justify-evenly gap-5 p-5 md:p-7 lg:p-10"
    >
      <UserCard :user-id="userStore.userId" />
      <UserMapCard :user-id="userStore.userId" />
    </div>

    <div class="p-5 md:p-7 lg:p-10">
      <UserSessionCard :user-id="userStore.userId" />
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const userStore = useUserStore();
</script>

<style></style>
