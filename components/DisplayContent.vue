<template>
  <div class="h-screen w-screen overflow-hidden">
    <div v-if="data" class="h-full w-full">
      <div
        v-if="data.type == 'ShortText'"
        class="flex h-full w-full flex-row items-center justify-center"
      >
        <h1 class="text-7xl font-semibold">{{ data.shortText }}</h1>
      </div>
      <div
        v-if="data.type == 'FormattedText'"
        class="flex h-full w-full flex-row items-center justify-center"
      >
        <ContentDisplay
          :content-id="data.formattedTextId ?? ''"
          class="w-1/2 scale-[2] text-center"
        />
      </div>
      <div
        v-if="data.type == 'Bracket'"
        class="flex h-full w-full flex-row items-center justify-center"
      >
        <BracketHolder
          v-if="bracket"
          :display-bracket="bracket"
          :editing="false"
          :round-count="roundCount"
          id="bracket"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { DisplayIdGetResponse } from "~/server/api/display/[id]/index.get";

type Props = {
  displayContentId: string;
};
const props = defineProps<Props>();

const { data, refresh } = useFetch<DisplayIdGetResponse>(
  `/api/display/${props.displayContentId}`,
);

const { data: bracket, refresh: refreshBracket } = useFetch(
  `/api/bracket/display/${data.value?.bracketId}`,
);

const roundCount = computed(() => {
  return calculateBracketSize(bracket.value?.numberOfCompetitors ?? 0);
});

function calculateBracketSize(numberOfCompetitors: number) {
  return Math.ceil(nLog(2, numberOfCompetitors));
}

function nLog(n: number, x: number) {
  return Math.log(x) / Math.log(n);
}

function resizeBracket() {
  const sW = window.innerWidth;
  const sH = window.innerHeight;
  const bracket = document.getElementById("bracket");
  if (bracket == null) {
    return;
  }
  const bW = bracket.offsetWidth ?? 1;
  const bH = bracket.offsetHeight ?? 1;

  const scaleFactor = Math.min(sW / bW, sH / bH);
  bracket.style.transform = `scale(${scaleFactor})`;
}

async function refreshContent() {
  await refresh();
  if (data.value?.type == "Bracket") {
    await refreshBracket();
    resizeBracket();
  }
}

defineExpose({ refreshContent });
</script>

<style></style>
