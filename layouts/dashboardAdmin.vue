<template>
  <div>
    <HeaderMain />
    <div class="flex">
      <HeaderAdmin />
      <div class="w-full">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped></style>
