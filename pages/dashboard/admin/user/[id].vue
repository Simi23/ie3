<template>
  <div>
    <div
      class="flex flex-row flex-wrap justify-evenly gap-5 p-5 md:p-7 lg:p-10"
    >
      <UserCard :user-id="$route.params.id.toString()" :admin-mode="true" />
      <UserMapCard :user-id="$route.params.id.toString()" :admin-mode="true" />
    </div>

    <div class="p-5 md:p-7 lg:p-10">
      <UserSessionCard :user-id="$route.params.id.toString()" />
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});
</script>

<style></style>
