<template>
  <UContainer class="flex min-h-screen w-fit items-center">
    <UCard class="h-fit min-w-72">
      <h1 class="text-center text-2xl font-bold">Sikeres regisztráció!</h1>

      <div class="mt-2 text-center">
        <p>A megadott email címre kaptál egy megerősítő linket.</p>
        <p>Kérlek, mihamarabb nézd meg és erősítsd meg a címedet!</p>
      </div>

      <div class="mt-4">
        <div class="float-right">
          <UButton
            label="Tovább a bejelentkezéshez"
            to="/login"
            trailing-icon="i-heroicons-arrow-right-solid"
          />
        </div>
        <div class="clear-both"></div>
      </div>
    </UCard>
  </UContainer>
</template>

<script lang="ts" setup></script>

<style></style>
