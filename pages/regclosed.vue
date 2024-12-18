<template>
  <div>
    <UContainer class="flex min-h-screen w-fit items-center">
      <UCard class="h-fit min-w-72">
        <h1 class="text-center text-2xl font-bold">Regisztráció zárva</h1>

        <div class="mt-2 text-center">
          <p v-if="$route.query.r == '0'">
            A regisztráció még nem nyílt meg. Nézz vissza később!
          </p>
          <p v-if="$route.query.r == '2'">
            A regisztráció lezárult.
            <!-- TODO: várólista implementáció -->
          </p>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
