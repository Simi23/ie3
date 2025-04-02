<template>
  <UBadge :label="props.dcData.globalName" size="md" variant="subtle">
    <template #leading>
      <UAvatar :src="dcAvatar" size="3xs" crossorigin />
    </template>
  </UBadge>
</template>

<script lang="ts" setup>
type Props = {
  dcData: {
    avatar: string;
    id: string;
    globalName: string;
  };
};
const props = defineProps<Props>();

const dcAvatar = computed(() => {
  return `https://cdn.discordapp.com/avatars/${props.dcData.id}/${props.dcData.avatar}.jpg?size=128`;
});
</script>

<style></style>
