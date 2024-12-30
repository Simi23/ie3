<template>
  <div
    class="size-transition relative"
    :class="{ 'mask-overflow': moving }"
    :style="{ height: boxHeight, width: boxWidth }"
  >
    <div
      v-for="i in props.pagecount"
      :id="`${props.name}page${i}`"
      :key="i"
      class="scrolled-page absolute left-0 top-0 h-fit"
    >
      <slot :name="'page' + i" />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  pagecount?: number;
  initialheight?: string;
  initialwidth?: string;
  name: string;
}

const props = withDefaults(defineProps<Props>(), {
  pagecount: 1,
  initialheight: "300px",
  initialwidth: "300px",
});

const boxHeight = ref<string>(props.initialheight);
const boxWidth = ref<string>(props.initialwidth);
const moving = ref<boolean>(false);

defineExpose({
  jumpTo,
});

let curPageNum = 1;

async function jumpTo(number: number) {
  if (number == curPageNum) return;

  const previousElement = document.getElementById(
    `${props.name}page${curPageNum}`,
  );
  const nextElement = document.getElementById(`${props.name}page${number}`);

  if (previousElement === null || nextElement === null) return;

  moving.value = true;

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
  boxWidth.value = nextElement.clientWidth + "px";

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
  moving.value = false;
}

onMounted(() => {
  const currentElement = document.getElementById(
    `${props.name}page${curPageNum}`,
  );
  if (currentElement === null) return;
  boxHeight.value = currentElement.clientHeight + "px";
  boxWidth.value = currentElement.clientWidth + "px";
  currentElement.style.visibility = "visible";
});
</script>

<style scoped>
.size-transition {
  transition:
    height 0.4s ease-in-out,
    width 0.4s ease-in-out;
}

.mask-overflow {
  mask-image: linear-gradient(white, white);
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
}

.scrolled-page {
  visibility: hidden;
}
</style>
