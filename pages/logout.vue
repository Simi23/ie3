<template>
  <div>
    <h1>Kijelentkezés...</h1>
  </div>
</template>

<script setup lang="ts">
// Clear user data from Pinia store
useUserStore().logout();

// Get rid of JWT cookie
if (import.meta.client) {
  await useFetch("/api/user/logout", {
    method: "POST",
    headers: {
      "csrf-token": useCsrf().csrf,
    },
  });
}

navigateTo("/login");
</script>
