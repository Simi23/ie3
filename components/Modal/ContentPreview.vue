<script lang="ts" setup>
interface Props {
  contentId: string;
}
const props = defineProps<Props>();

const modal = useModal();
</script>

<template>
  <UModal fullscreen>
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold">Előnézet</h1>
            (A frissítéshez szükség lehet F5-re.)
          </div>

          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="modal.close"
          />
        </div>
      </template>
      <ContentDisplay :content-id="props.contentId" />
    </UCard>
  </UModal>
</template>
