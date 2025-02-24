<template>
  <div>
    <div class="mx-10 my-10 flex flex-row flex-wrap justify-between">
      <UserCard :user-id="$route.params.id.toString()" :admin-mode="true" />
      <UserMapCard :user-id="$route.params.id.toString()" :admin-mode="true" />
    </div>

    <UserSessionCard :user-id="$route.params.id.toString()" />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard-admin",
  middleware: "auth",
});
</script>

<style></style>
