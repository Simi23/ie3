<template>
  <div>
    <div class="mx-10 my-10 flex flex-row flex-wrap justify-between">
      <UserCard :user-id="userStore.userId" />
      <UserMapCard :user-id="userStore.userId" />
    </div>

    <UserSessionCard :user-id="userStore.userId" />
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
