<template>
  <div class="w-full">
    <table
      class="bracket-border w-full min-w-36 bg-gray-900"
      :class="{
        watched: props.cellData.tracked,
      }"
    >
      <tbody>
        <tr>
          <!-- STATUS -->
          <th rowspan="2" class="w-0 border-r border-gray-700 px-1">
            <UIcon :name="status.icon" :class="status.color" />
          </th>
          <!-- UPPER -->
          <td class="border-b border-gray-700">
            <UIcon
              v-if="props.cellData.ended"
              :name="upperResult.resultIcon"
              :class="upperResult.resultColor"
              class="size-5 align-sub"
            />
            <span class="ml-2" :class="upperResult.nameStyle">
              {{ props.cellData.upper.name }}
            </span>
          </td>
          <td
            v-for="round in upperResult.points"
            class="border-b border-l border-gray-700 border-l-gray-800"
            :class="round.color"
          >
            {{ round.amount }}
          </td>
        </tr>
        <tr>
          <!-- LOWER -->
          <td>
            <UIcon
              v-if="props.cellData.ended"
              :name="lowerResult.resultIcon"
              :class="lowerResult.resultColor"
              class="size-5 align-sub"
            />
            <span class="ml-2" :class="lowerResult.nameStyle">
              {{ props.cellData.lower.name }}
            </span>
          </td>
          <td
            v-for="round in lowerResult.points"
            class="border-l border-l-gray-800"
            :class="round.color"
          >
            {{ round.amount }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import type { CellData } from "~/utils/types";

const props = defineProps<{
  cellData: CellData;
}>();

const status = computed(() => {
  if (props.cellData.started === false) {
    // NOT STARTED YET
    return {
      icon: "i-material-symbols-calendar-today",
      color: "text-blue-400",
    };
  } else if (props.cellData.ended === false) {
    // ONGOING
    return {
      icon: "i-material-symbols-event-note",
      color: "text-yellow-400",
    };
  }

  // FINISHED
  return {
    icon: "i-material-symbols-event-available",
    color: "text-teal-400",
  };
});

const upperResult = computed(() => {
  let nameStyle = "";
  if (props.cellData.ended) {
    nameStyle = props.cellData.upper.won ? "text-emerald-300" : "text-gray-400";
  }

  return {
    resultIcon: props.cellData.upper.won
      ? "i-material-symbols-celebration"
      : "i-material-symbols-close",
    resultColor: props.cellData.upper.won ? "text-emerald-400" : "text-red-400",
    nameStyle: nameStyle,
    points: props.cellData.upper.points.map((value, i) => {
      const lowerValue = props.cellData.lower.points[i] ?? 0;
      const upperValue = props.cellData.upper.points[i] ?? 0;
      let color = "text-yellow-300";
      if (lowerValue < upperValue) {
        color = "text-emerald-300";
      } else if (lowerValue > upperValue) {
        color = "text-red-300";
      }
      return {
        amount: upperValue,
        color: color,
      };
    }),
  };
});

const lowerResult = computed(() => {
  let nameStyle = "";
  if (props.cellData.ended) {
    nameStyle = props.cellData.lower.won ? "text-emerald-300" : "text-gray-400";
  }

  return {
    resultIcon: props.cellData.lower.won
      ? "i-material-symbols-celebration"
      : "i-material-symbols-close",
    resultColor: props.cellData.lower.won ? "text-emerald-400" : "text-red-400",
    nameStyle: nameStyle,
    points: props.cellData.lower.points.map((value, i) => {
      const lowerValue = props.cellData.lower.points[i] ?? 0;
      const upperValue = props.cellData.upper.points[i] ?? 0;
      let color = "text-yellow-300";
      if (lowerValue > upperValue) {
        color = "text-emerald-300";
      } else if (lowerValue < upperValue) {
        color = "text-red-300";
      }
      return {
        amount: lowerValue,
        color: color,
      };
    }),
  };
});
</script>

<style>
.bracket-border td {
  @apply h-9 px-2 py-1;
}

.bracket-border th {
  font-weight: normal;
}

.bracket-border {
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 6px;
  @apply border border-gray-700;
}

.watched {
  box-shadow: 0 0 8px 2px yellow;
}
</style>
