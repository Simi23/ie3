<template>
  <div>
    <UContainer class="flex min-h-screen w-fit items-center">
      <UCard class="h-fit min-w-72">
        <h1 class="text-center text-2xl font-bold">Regisztráció zárva</h1>

        <div class="mt-2 text-center">
          <p v-if="$route.query.r == '0'">
            A regisztráció még nem nyílt meg. Nézz vissza később!
          </p>
          <div v-if="$route.query.r == '2'">
            <p>A regisztráció lezárult.</p>
            <p v-if="queueLink && queueLink != ''">
              A várólistára a következő linken lehet jelentkezni:
              <NuxtLink
                :to="queueLink"
                class="text-cyan-500 underline underline-offset-4"
                >LINK</NuxtLink
              >
            </p>
          </div>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
const { data: queueLink } = useFetch("/api/admin/queuelink");
</script>

<style></style>
