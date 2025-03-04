<template>
  <div>
    <HeaderMain />
    <div class="flex">
      <HeaderAdmin class="hidden lg:block" />
      <div class="min-h-[calc(100vh-3rem)] w-full">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped></style>
