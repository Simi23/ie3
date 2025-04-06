<script lang="ts" setup>
import type { CellData, DisplayBracket } from "~/utils/types";

const props = defineProps<{
  editing: boolean;
  isTeamBracket: boolean;
  roundCount: number;
  displayBracket: DisplayBracket;
}>();

const emit = defineEmits<{
  editCell: [upperId: string, lowerId: string];
}>();

defineExpose({
  regenerateBracket,
});

interface TableData {
  rowspan: number;
  colId: number;
  rowId: number;
  containsCell: boolean;
  starterCell: boolean;
  cellData: CellData;
}

interface TableRow {
  cells: TableData[];
  rowId: number;
}

const tableData = ref([] as TableRow[]);

function regenerateBracket() {
  tableData.value = [];
  const totalRows = Math.pow(2, props.roundCount - 1);
  for (let row = 0; row < totalRows; row++) {
    const curRow = {
      cells: [],
      rowId: row,
    } as TableRow;

    for (let cell = 0; cell < props.roundCount; cell++) {
      const curColRowSpan = Math.pow(2, cell);
      if (row % curColRowSpan != 0) {
        continue;
      }

      const containsCell = props.displayBracket.parts.some(
        (part) =>
          part.round == cell && part.roundLocation == row / curColRowSpan,
      );

      // const containsCell = props.isTeamBracket
      //   ? props.displayBracket.teamParts.some(
      //       (part) =>
      //         part.round == cell && part.roundLocation == row / curColRowSpan
      //     )
      //   : props.displayBracket.userParts.some(
      //       (part) =>
      //         part.round == cell && part.roundLocation == row / curColRowSpan
      //     );

      let cellData = {} as CellData;
      let starterCell = false;

      if (containsCell) {
        let upperCell = props.displayBracket.parts.find(
          (part) =>
            part.round == cell &&
            part.roundLocation == row / curColRowSpan &&
            part.upper,
        );
        let lowerCell = props.displayBracket.parts.find(
          (part) =>
            part.round == cell &&
            part.roundLocation == row / curColRowSpan &&
            !part.upper,
        );

        // let upperCell = props.displayBracket.teamParts.find(
        //   (part) =>
        //     part.round == cell &&
        //     part.roundLocation == row / curColRowSpan &&
        //     part.upper
        // );
        // let lowerCell = props.displayBracket.teamParts.find(
        //   (part) =>
        //     part.round == cell &&
        //     part.roundLocation == row / curColRowSpan &&
        //     !part.upper
        // );
        cellData.upper = {
          name: upperCell?.team?.name ?? "",
          points: upperCell?.points ?? [],
          won: upperCell?.won ?? false,
          id: upperCell?.id ?? "",
        };
        cellData.lower = {
          name: lowerCell?.team?.name ?? "",
          points: lowerCell?.points ?? [],
          won: lowerCell?.won ?? false,
          id: lowerCell?.id ?? "",
        };

        // cellData.upperName = upperCell?.team?.name ?? "";
        // cellData.upperPoints = upperCell?.points ?? [];
        // cellData.upperWon = upperCell?.won ?? false;
        // cellData.upperId = upperCell?.id ?? -1;
        // cellData.lowerName = lowerCell?.team?.name ?? "";
        // cellData.lowerPoints = lowerCell?.points ?? [];
        // cellData.lowerWon = lowerCell?.won ?? false;
        // cellData.lowerId = lowerCell?.id ?? -1;

        cellData.started = upperCell?.started ?? false;
        cellData.ended = upperCell?.ended ?? false;
        cellData.tracked = upperCell?.isTracked ?? false;

        starterCell =
          (lowerCell?.startLocation && upperCell?.startLocation) ?? false;
      }

      const curCell = {
        rowspan: curColRowSpan,
        rowId: row,
        colId: cell,
        containsCell: containsCell,
        starterCell: starterCell,
        cellData: cellData,
      } as TableData;
      curRow.cells.push(curCell);
    }

    tableData.value.push(curRow);
  }
}

// onMounted(() => {});
</script>

<template>
  <div class="h-fit w-fit bg-gray-800 text-white">
    <div>
      <h1 class="text-center text-3xl">
        {{ displayBracket.competition?.title ?? "" }}
      </h1>
      <table>
        <tr v-for="row in tableData">
          <td
            v-for="cell in row.cells"
            :rowspan="cell.rowspan"
            class="relative h-20 px-4"
          >
            <!-- LINE BEFORE (HORIZONTAL) -->
            <div
              v-if="cell.containsCell && !cell.starterCell"
              class="line-h line-start"
            ></div>
            <!-- DATA -->
            <div v-if="cell.containsCell" class="flex justify-center">
              <BracketPart
                :cell-data="cell.cellData"
                :class="{ 'cell-editing': props.editing }"
                @click="
                  emit(
                    'editCell',
                    cell.cellData.upper.id,
                    cell.cellData.lower.id,
                  )
                "
              ></BracketPart>
            </div>
            <!-- LINE AFTER (HORIZONTAL) -->
            <div
              v-if="cell.containsCell && cell.colId != props.roundCount - 1"
              class="line-h line-end"
            ></div>
            <!-- VERTICAL LINE (UP) -->
            <div
              v-if="
                cell.containsCell &&
                cell.colId != props.roundCount - 1 &&
                (cell.rowId / cell.rowspan) % 2 == 1
              "
              class="line-v line-up"
            ></div>
            <!-- VERTICAL LINE (DOWN) -->
            <div
              v-if="
                cell.containsCell &&
                cell.colId != props.roundCount - 1 &&
                (cell.rowId / cell.rowspan) % 2 == 0
              "
              class="line-v line-down"
            ></div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
.line-h {
  position: absolute;
  top: calc(50% - 1px);
  width: calc(1rem + 1px);
  border-bottom: 2px solid white;
}

.line-start {
  left: -1px;
}

.line-end {
  right: -1px;
}

.line-v {
  position: absolute;
  right: -1px;
  border-right: 2px solid white;
  height: 50%;
}

.line-up {
  top: 0;
}

.line-down {
  bottom: 0;
}

.cell-editing {
  cursor: pointer;
  border-radius: 6px;
  transition: box-shadow 0.2s;
}

.cell-editing:hover {
  box-shadow: 0 0 6px 1px white;
}
</style>
