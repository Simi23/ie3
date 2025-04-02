<template>
  <div
    class="flex flex-col flex-nowrap justify-evenly gap-5 p-5 md:gap-7 md:p-7 lg:gap-10 lg:p-10"
  >
    <div
      class="flex flex-row flex-wrap justify-evenly gap-5 md:gap-7 lg:gap-10"
    >
      <UserCard :user-id="$route.params.id.toString()" :admin-mode="true" />
      <UserMapCard :user-id="$route.params.id.toString()" :admin-mode="true" />
    </div>

    <div>
      <UserCompetitionCard :user-id="$route.params.id.toString()" />
    </div>

    <div>
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
