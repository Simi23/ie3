<template>
  <div>
    <USelectMenu
      v-model="currentClass"
      :options="classGroups"
      class="w-full"
      placeholder="Válassz osztályt..."
    >
      <template #option="{ option: row }">
        <span :class="['truncate', row.disabled == false ? 'pl-4' : '']">{{
          row.label
        }}</span>
      </template>
    </USelectMenu>
  </div>
</template>

<script lang="ts" setup>
const eventBus = useMittBus();

const classGroups = ref();

const props = defineProps<{
  showHidden?: string;
}>();

const { refresh } = await useFetch("/api/classes", {
  onResponse: ({ response }) => {
    if (response._data == null) return;

    if (!Array.isArray(response._data)) return;

    const newObject = [];

    for (let i = 0; i < response._data.length; i++) {
      const group = response._data[i];
      const groupObject = {
        label: group.name,
        disabled: true,
      };
      newObject.push(groupObject);

      if (!Array.isArray(group.classes)) return;

      group.classes.forEach((classObject: any) => {
        newObject.push({
          label: classObject.name,
          disabled: false,
          value: classObject.id,
        });
      });
    }

    classGroups.value = newObject;
  },
  query: {
    showhidden: computed(() => props.showHidden ?? "0"),
  },
});

const currentClass = ref();

eventBus.on("update-class-group", () => {
  refresh();
});
eventBus.on("update-class", () => {
  refresh();
});

defineExpose({
  refresh,
  currentClass,
});
</script>

<style></style>
