<template>
  <div>
    <HeaderMain />
    <div class="fullheight">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.fullheight {
  min-height: calc(100vh - 3rem);
}
</style>
