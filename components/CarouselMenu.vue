<template>
  <div>
    <div
      class="size-transition relative contain-content"
      :style="{ height: boxHeight }"
    >
      <div
        v-for="i in props.pagecount"
        :key="i"
        :id="`page${i}`"
        class="scrolled-page absolute left-0 top-0 h-fit w-full"
      >
        <slot :name="'page' + i"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  pagecount?: number;
  initialheight?: string;
}

const props = withDefaults(defineProps<Props>(), {
  pagecount: 1,
  initialheight: "300px",
});

const boxHeight = ref<string>(props.initialheight);

defineExpose({
  jumpTo,
});

let curPageNum = 1;

async function jumpTo(number: number) {
  if (number == curPageNum) return;

  const previousElement = document.getElementById(`page${curPageNum}`);
  const nextElement = document.getElementById(`page${number}`);

  if (previousElement === null || nextElement === null) return;

  let forwardX = "";
  let backwardX = "";

  if (number > curPageNum) {
    // Scroll forwards
    forwardX = "translateX(100%)";
    backwardX = "translateX(-100%)";
  } else {
    //Scroll backwards
    forwardX = "translateX(-100%)";
    backwardX = "translateX(100%)";
  }

  boxHeight.value = nextElement.clientHeight + "px";

  previousElement.style.transform = "translateX(0)";
  previousElement.style.opacity = "1";
  nextElement.style.transition = "none";
  nextElement.style.transform = forwardX;
  nextElement.style.opacity = "0";
  await sleep(20);
  previousElement.style.transition = "opacity 0.2s, transform 0.4s ease-in";
  nextElement.style.transition = "opacity 0.2s, transform 0.4s ease-in-out";
  nextElement.style.visibility = "visible";
  await sleep(20);
  previousElement.style.transform = backwardX;
  previousElement.style.opacity = "0";
  nextElement.style.transform = "translateX(0)";
  nextElement.style.opacity = "1";
  await sleep(450);
  previousElement.style.visibility = "hidden";

  curPageNum = number;
}

onMounted(() => {
  const currentElement = document.getElementById(`page${curPageNum}`);
  if (currentElement === null) return;
  boxHeight.value = currentElement.clientHeight + "px";
  currentElement.style.visibility = "visible";
});
</script>

<style scoped>
.size-transition {
  transition: height 0.4s ease-in-out;
}

.scrolled-page {
  visibility: hidden;
}
</style>
