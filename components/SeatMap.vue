<script lang="ts" setup>
interface Props {
  svgId: string;
  letterStroke?: string;
  seatStroke?: string;
  arrowStroke?: string;
}

const {
  svgId,
  letterStroke = "#000000",
  seatStroke = "#000000",
  arrowStroke = "#000000",
} = defineProps<Props>();

const emit = defineEmits(["chosenSeat"]);

const baseColor = ref<string>("");
const originalColors = ref<Record<string, string>>({});

/**
 * Returns an SVGRectElement in the map from the seat name.
 * @param seatName The name of the seat
 */
function getSeat(seatName: string): SVGRectElement | null {
  let svg = document.getElementById(svgId);
  let rects = svg?.getElementsByTagName("rect");

  if (rects == undefined) {
    return null;
  }

  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    const seatNameCur =
      r.attributes.getNamedItem("inkscape:label")?.value ?? "unknown";
    if (seatNameCur == seatName) {
      return r;
    }
  }

  return null;
}

/**
 * Returns all the seat rectangles.
 */
function getAllSeats(): HTMLCollectionOf<SVGRectElement> | null {
  let svg = document.getElementById(svgId);
  let rects = svg?.getElementsByTagName("rect");

  if (rects == undefined) {
    return null;
  }

  return rects;
}

function colorMultiply(seat: SVGRectElement, multiplier: number): string {
  const current = getComputedStyle(seat).fill;
  const m = current.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (m) {
    let c = [Number(m[1]), Number(m[2]), Number(m[3])];
    c = c.map((col) => Math.min(Math.max(col * multiplier, 0), 255));
    return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
  }
  return seat.style.fill;
}

/**
 * Set seat colour.
 * @param seatName The seat to modify. If set to `all`, applies to all seats.
 * @param color Any color string that is accepted by CSS
 * @param changeBase Whether to change the original colors of the map. Defaults to true, intended for internal use only.
 */
function changeSeatColour(seatName: string, color: string, changeBase = true) {
  if (seatName == "all") {
    if (changeBase) {
      baseColor.value = color;
    }
    let rects = getAllSeats();
    if (rects == null) return;
    for (let i = 0; i < rects.length; i++) {
      rects[i].style.fill = color;
    }
    return;
  }

  const seat = getSeat(seatName);
  if (seat === null) return;
  if (changeBase) {
    originalColors.value[seatName] = color;
  }
  seat.style.fill = color;
}

/**
 * Highlights a given seat by increasing its lightness.
 * @param seatName The seat to be highlighted
 * @param darken Whether to darken the other seats. Base seats will not be darkened.
 * @param nocancel If set to true, other highlights will not be cancelled.
 */
function highlightSeat(
  seatName: string,
  darken: boolean,
  nocancel?: boolean,
): void {
  const keys = Object.keys(originalColors.value);
  if (!keys.includes(seatName)) return;
  const seat = getSeat(seatName);
  if (seat === null) return;
  if (nocancel != true) {
    cancelHighlight();
  }

  const newCol = colorMultiply(seat, 1.3);
  seat.style.fill = newCol;
  if (darken) {
    keys.forEach((key) => {
      if (key == seatName) return;
      const curSeat = getSeat(key);
      if (curSeat === null) return;
      const darker = colorMultiply(curSeat, 0.7);
      curSeat.style.fill = darker;
    });
  }
}

/**
 * Cancels highlighting and returns all seats to their default colour.
 */
function cancelHighlight(): void {
  const keys = Object.keys(originalColors.value);
  keys.forEach((key) => {
    const curSeat = getSeat(key);
    if (curSeat === null) return;
    curSeat.style.fill = originalColors.value[key];
  });
}

/**
 * Make seat clickable and assign a click event to it.
 * @param seatName The seat to modify
 * @param emitName The param string to call `chosenSeat` event with, if omitted, the event is called with `seatName` instead.
 */
function assignSeat(seatName: string, emitName?: string) {
  let svg = document.getElementById(svgId);
  let rects = svg?.getElementsByTagName("rect");
  if (rects == undefined) {
    return;
  }

  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    const seatNameCur =
      r.attributes.getNamedItem("inkscape:label")?.value ?? "unknown";

    if (seatNameCur == seatName) {
      r.style.cursor = "pointer";
      if (emitName == undefined) {
        r.addEventListener(
          "mousedown",
          () => {
            emit("chosenSeat", seatNameCur);
          },
          false,
        );
      } else {
        r.addEventListener(
          "mousedown",
          () => {
            emit("chosenSeat", emitName);
          },
          false,
        );
      }
    }
  }
}

/**
 * Replace all of the seats to clear their events.
 */
function clearSeatEvents() {
  let svg = document.getElementById(svgId);
  let rects = svg?.getElementsByTagName("rect");
  if (rects == undefined) {
    return;
  }

  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    const seatNameCur =
      r.attributes.getNamedItem("inkscape:label")?.value ?? "unknown";

    if (seatNameCur != "unknown") {
      r.style.cursor = "default";
      const copyNode = r.cloneNode(true);
      r.parentElement?.replaceChild(copyNode, r);
    }
  }
}

defineExpose({
  changeSeatColour,
  highlightSeat,
  cancelHighlight,
  assignSeat,
  clearSeatEvents,
});
</script>

<template>
  <div class="select-none">
    <ClientOnly>
      <svg
        xmlns:dc="http://purl.org/dc/elements/1.1/"
        xmlns:cc="http://creativecommons.org/ns#"
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns:svg="http://www.w3.org/2000/svg"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
        xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
        sodipodi:docname="elrendezes.svg"
        inkscape:version="1.0 (4035a4fb49, 2020-05-01)"
        version="1.1"
        viewBox="0 0 545.5027 349.90647"
        height="100%"
        width="100%"
        :id="svgId"
      >
        <defs id="defs2">
          <marker
            inkscape:stockid="Arrow1Lend"
            orient="auto"
            refY="0.0"
            refX="0.0"
            id="Arrow1Lend"
            style="overflow: visible"
            inkscape:isstock="true"
          >
            <path
              id="path1048"
              d="M 0.0,0.0 L 5.0,-5.0 L -12.5,0.0 L 5.0,5.0 L 0.0,0.0 z "
              :style="{ stroke: arrowStroke, fill: arrowStroke }"
              style="
                fill-rule: evenodd;
                stroke-width: 1pt;
                stroke-opacity: 1;
                fill-opacity: 1;
              "
              transform="scale(0.8) rotate(180) translate(12.5,0)"
            />
          </marker>
          <marker
            inkscape:stockid="Arrow1Lstart"
            orient="auto"
            refY="0.0"
            refX="0.0"
            id="Arrow1Lstart"
            style="overflow: visible"
            inkscape:isstock="true"
          >
            <path
              id="path1045"
              d="M 0.0,0.0 L 5.0,-5.0 L -12.5,0.0 L 5.0,5.0 L 0.0,0.0 z "
              :style="{ stroke: arrowStroke, fill: arrowStroke }"
              style="
                fill-rule: evenodd;
                stroke-width: 1pt;
                stroke-opacity: 1;
                fill-opacity: 1;
              "
              transform="scale(0.8) translate(12.5,0)"
            />
          </marker>
          <marker
            inkscape:isstock="true"
            style="overflow: visible"
            id="Arrow1Lend-3"
            refX="0"
            refY="0"
            orient="auto"
            inkscape:stockid="Arrow1Lend"
          >
            <path
              transform="matrix(-0.8,0,0,-0.8,-10,0)"
              :style="{ stroke: arrowStroke, fill: arrowStroke }"
              style="
                fill-opacity: 1;
                fill-rule: evenodd;
                stroke-width: 1pt;
                stroke-opacity: 1;
              "
              d="M 0,0 5,-5 -12.5,0 5,5 Z"
              id="path1048-1"
            />
          </marker>
          <marker
            inkscape:isstock="true"
            style="overflow: visible"
            id="Arrow1Lend-30"
            refX="0"
            refY="0"
            orient="auto"
            inkscape:stockid="Arrow1Lend"
          >
            <path
              transform="matrix(-0.8,0,0,-0.8,-10,0)"
              :style="{ stroke: arrowStroke, fill: arrowStroke }"
              style="
                fill-opacity: 1;
                fill-rule: evenodd;
                stroke-width: 1pt;
                stroke-opacity: 1;
              "
              d="M 0,0 5,-5 -12.5,0 5,5 Z"
              id="path1048-9"
            />
          </marker>
          <marker
            inkscape:isstock="true"
            style="overflow: visible"
            id="Arrow1Lend-6"
            refX="0"
            refY="0"
            orient="auto"
            inkscape:stockid="Arrow1Lend"
          >
            <path
              transform="matrix(-0.8,0,0,-0.8,-10,0)"
              :style="{ stroke: arrowStroke, fill: arrowStroke }"
              style="
                fill-opacity: 1;
                fill-rule: evenodd;
                stroke-width: 1pt;
                stroke-opacity: 1;
              "
              d="M 0,0 5,-5 -12.5,0 5,5 Z"
              id="path1048-7"
            />
          </marker>
          <marker
            inkscape:isstock="true"
            style="overflow: visible"
            id="Arrow1Lend-2"
            refX="0"
            refY="0"
            orient="auto"
            inkscape:stockid="Arrow1Lend"
          >
            <path
              transform="matrix(-0.8,0,0,-0.8,-10,0)"
              :style="{ stroke: arrowStroke, fill: arrowStroke }"
              style="
                fill-opacity: 1;
                fill-rule: evenodd;
                stroke-width: 1pt;
                stroke-opacity: 1;
              "
              d="M 0,0 5,-5 -12.5,0 5,5 Z"
              id="path1048-4"
            />
          </marker>
        </defs>
        <g
          transform="translate(490.8432,150.65241)"
          id="layer1"
          inkscape:groupmode="layer"
          inkscape:label="Réteg 1"
        >
          <rect
            inkscape:label="A-04"
            y="2.3208001"
            x="-446.73767"
            height="15.999416"
            width="22.600254"
            id="rect864"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
          />
          <rect
            inkscape:label="A-03"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-2"
            width="22.600254"
            height="15.999416"
            x="-424.13742"
            y="2.3208001"
          />
          <rect
            inkscape:label="A-01"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-9"
            width="22.600254"
            height="15.999416"
            x="-378.93692"
            y="2.3208001"
          />
          <rect
            inkscape:label="A-02"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-3"
            width="22.600254"
            height="15.999416"
            x="-401.53717"
            y="2.3208001"
          />
          <rect
            inkscape:label="A-08"
            transform="matrix(0.30865113,0.95117532,-0.95043925,0.31091033,0,0)"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-8"
            width="22.58066"
            height="16.013344"
            x="-227.12701"
            y="425.60651"
          />
          <rect
            inkscape:label="A-07"
            transform="matrix(0.30865113,0.95117532,-0.95043925,0.31091033,0,0)"
            y="425.60651"
            x="-204.54633"
            height="16.013344"
            width="22.58066"
            id="rect864-2-9"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
          />
          <rect
            inkscape:label="A-05"
            transform="matrix(0.30865113,0.95117532,-0.95043925,0.31091033,0,0)"
            y="425.60651"
            x="-159.38501"
            height="16.013344"
            width="22.58066"
            id="rect864-9-7"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
          />
          <rect
            inkscape:label="A-06"
            transform="matrix(0.30865113,0.95117532,-0.95043925,0.31091033,0,0)"
            y="425.60651"
            x="-181.9657"
            height="16.013344"
            width="22.58066"
            id="rect864-3-4"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
          />
          <rect
            inkscape:label="A-09"
            transform="rotate(-35.960479)"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-6"
            width="22.600254"
            height="15.999416"
            x="-335.07394"
            y="-362.40256"
          />
          <rect
            inkscape:label="A-10"
            transform="rotate(-35.960479)"
            y="-362.40256"
            x="-312.47366"
            height="15.999416"
            width="22.600254"
            id="rect864-2-3"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
          />
          <rect
            inkscape:label="A-12"
            transform="rotate(-35.960479)"
            y="-362.40256"
            x="-267.27316"
            height="15.999416"
            width="22.600254"
            id="rect864-9-8"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
          />
          <rect
            inkscape:label="A-11"
            transform="rotate(-35.960479)"
            y="-362.40256"
            x="-289.87344"
            height="15.999416"
            width="22.600254"
            id="rect864-3-0"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
          />
          <rect
            inkscape:label="A-13"
            transform="rotate(36.117975)"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-4"
            width="22.600254"
            height="15.999416"
            x="-404.90292"
            y="110.09412"
          />
          <rect
            inkscape:label="A-14"
            transform="rotate(36.117975)"
            y="110.09412"
            x="-382.30264"
            height="15.999416"
            width="22.600254"
            id="rect864-2-2"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
          />
          <rect
            inkscape:label="A-16"
            transform="rotate(36.117975)"
            y="110.09412"
            x="-337.10214"
            height="15.999416"
            width="22.600254"
            id="rect864-9-9"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
          />
          <rect
            inkscape:label="A-15"
            transform="rotate(36.117975)"
            y="110.09412"
            x="-359.70242"
            height="15.999416"
            width="22.600254"
            id="rect864-3-8"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
          />
          <rect
            inkscape:label="A-17"
            transform="rotate(-71.853521)"
            y="-337.9938"
            x="-45.406685"
            height="15.999416"
            width="22.600254"
            id="rect864-9-6"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
          />
          <rect
            inkscape:label="A-18"
            transform="rotate(-71.853521)"
            y="-337.9938"
            x="-68.006966"
            height="15.999416"
            width="22.600254"
            id="rect864-3-03"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
          />
          <rect
            y="2.217679"
            x="-193.93379"
            height="15.999416"
            width="22.600254"
            id="rect864-9-74"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            inkscape:label="B-17"
          />
          <rect
            y="2.217679"
            x="-216.53407"
            height="15.999416"
            width="22.600254"
            id="rect864-3-2"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            inkscape:label="B-18"
          />
          <rect
            y="249.60381"
            x="-169.70546"
            height="16.013344"
            width="22.58066"
            id="rect864-8-5"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            transform="matrix(0.30865114,0.95117531,-0.95043925,0.31091034,0,0)"
            inkscape:label="B-04"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-2-9-9"
            width="22.58066"
            height="16.013344"
            x="-147.12477"
            y="249.60381"
            transform="matrix(0.30865114,0.95117531,-0.95043925,0.31091034,0,0)"
            inkscape:label="B-03"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-9-7-9"
            width="22.58066"
            height="16.013344"
            x="-101.96346"
            y="249.60381"
            transform="matrix(0.30865114,0.95117531,-0.95043925,0.31091034,0,0)"
            inkscape:label="B-01"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-3-4-1"
            width="22.58066"
            height="16.013344"
            x="-124.54414"
            y="249.60381"
            transform="matrix(0.30865114,0.95117531,-0.95043925,0.31091034,0,0)"
            inkscape:label="B-02"
          />
          <rect
            y="-253.8472"
            x="-185.26776"
            height="15.999416"
            width="22.600254"
            id="rect864-6-2"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            transform="rotate(-35.960478)"
            inkscape:label="B-05"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-2-3-6"
            width="22.600254"
            height="15.999416"
            x="-162.66748"
            y="-253.8472"
            transform="rotate(-35.960478)"
            inkscape:label="B-06"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-9-8-6"
            width="22.600254"
            height="15.999416"
            x="-117.46698"
            y="-253.8472"
            transform="rotate(-35.960478)"
            inkscape:label="B-08"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-3-0-0"
            width="22.600254"
            height="15.999416"
            x="-140.06726"
            y="-253.8472"
            transform="rotate(-35.960478)"
            inkscape:label="B-07"
          />
          <rect
            y="0.96075457"
            x="-255.51729"
            height="15.999416"
            width="22.600254"
            id="rect864-4-8"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            transform="rotate(36.117974)"
            inkscape:label="B-09"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-2-2-9"
            width="22.600254"
            height="15.999416"
            x="-232.91701"
            y="0.96075457"
            transform="rotate(36.117974)"
            inkscape:label="B-10"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-9-9-3"
            width="22.600254"
            height="15.999416"
            x="-187.71645"
            y="0.96075457"
            transform="rotate(36.117974)"
            inkscape:label="B-12"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-3-8-8"
            width="22.600254"
            height="15.999416"
            x="-210.31679"
            y="0.96075457"
            transform="rotate(36.117974)"
            inkscape:label="B-11"
          />
          <rect
            y="-162.22421"
            x="-55.490753"
            height="15.999416"
            width="22.600254"
            id="rect864-20-5"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            transform="rotate(-71.853521)"
            inkscape:label="B-16"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-2-5-7"
            width="22.600254"
            height="15.999416"
            x="-32.890465"
            y="-162.22421"
            transform="rotate(-71.853521)"
            inkscape:label="B-15"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-9-6-0"
            width="22.600254"
            height="15.999416"
            x="12.310036"
            y="-162.22421"
            transform="rotate(-71.853521)"
            inkscape:label="B-13"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-3-03-4"
            width="22.600254"
            height="15.999416"
            x="-10.290245"
            y="-162.22421"
            transform="rotate(-71.853521)"
            inkscape:label="B-14"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-00"
            width="22.600254"
            height="15.999416"
            x="-80.5784"
            y="2.3208048"
            inkscape:label="C-18"
          />
          <rect
            y="2.3208048"
            x="-57.978134"
            height="15.999416"
            width="22.600254"
            id="rect864-2-92"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            inkscape:label="C-17"
          />
          <rect
            y="2.3208048"
            x="-12.777635"
            height="15.999416"
            width="22.600254"
            id="rect864-9-99"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            inkscape:label="C-15"
          />
          <rect
            sodipodi:insensitive="true"
            y="2.3208048"
            x="-35.377914"
            height="15.999416"
            width="22.600254"
            id="rect864-3-7"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            inkscape:label="C-16"
          />
          <rect
            y="77.323875"
            x="-113.28397"
            height="16.013344"
            width="22.58066"
            id="rect864-8-51"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            transform="matrix(0.30865114,0.95117531,-0.95043925,0.31091034,0,0)"
            inkscape:label="C-02"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-2-9-7"
            width="22.58066"
            height="16.013344"
            x="-90.703278"
            y="77.323875"
            transform="matrix(0.30865114,0.95117531,-0.95043925,0.31091034,0,0)"
            inkscape:label="C-01"
          />
          <rect
            y="-147.38393"
            x="-38.696495"
            height="15.999416"
            width="22.600254"
            id="rect864-6-0"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            transform="rotate(-35.960478)"
            inkscape:label="C-03"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-2-3-2"
            width="22.600254"
            height="15.999416"
            x="-16.096214"
            y="-147.38393"
            transform="rotate(-35.960478)"
            inkscape:label="C-04"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-9-8-5"
            width="22.600254"
            height="15.999416"
            x="29.104286"
            y="-147.38393"
            transform="rotate(-35.960478)"
            inkscape:label="C-06"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-3-0-3"
            width="22.600254"
            height="15.999416"
            x="6.5040059"
            y="-147.38393"
            transform="rotate(-35.960478)"
            inkscape:label="C-05"
          />
          <rect
            y="-105.7384"
            x="-109.11765"
            height="15.999416"
            width="22.600254"
            id="rect864-4-6"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            transform="rotate(36.117974)"
            inkscape:label="C-07"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-2-2-8"
            width="22.600254"
            height="15.999416"
            x="-86.517403"
            y="-105.7384"
            transform="rotate(36.117974)"
            inkscape:label="C-08"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-9-9-8"
            width="22.600254"
            height="15.999416"
            x="-41.316807"
            y="-105.7384"
            transform="rotate(36.117974)"
            inkscape:label="C-10"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-3-8-3"
            width="22.600254"
            height="15.999416"
            x="-63.917149"
            y="-105.7384"
            transform="rotate(36.117974)"
            inkscape:label="C-09"
          />
          <rect
            y="9.9539671"
            x="0.8318724"
            height="15.999416"
            width="22.600254"
            id="rect864-20-6"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            transform="rotate(-71.853521)"
            inkscape:label="C-14"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-2-5-5"
            width="22.600254"
            height="15.999416"
            x="23.432161"
            y="9.9539671"
            transform="rotate(-71.853521)"
            inkscape:label="C-13"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-9-6-5"
            width="22.600254"
            height="15.999416"
            x="68.632652"
            y="9.9539671"
            transform="rotate(-71.853521)"
            inkscape:label="C-11"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-3-03-1"
            width="22.600254"
            height="15.999416"
            x="46.032372"
            y="9.9539671"
            transform="rotate(-71.853521)"
            inkscape:label="C-12"
          />
          <rect
            transform="scale(-1)"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-7"
            width="22.600254"
            height="15.999416"
            x="356.45303"
            y="-46.383945"
            inkscape:label="D-18"
          />
          <rect
            transform="scale(-1)"
            y="-46.383945"
            x="379.05331"
            height="15.999416"
            width="22.600254"
            id="rect864-2-97"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            inkscape:label="D-17"
          />
          <rect
            transform="scale(-1)"
            y="-46.383945"
            x="424.25381"
            height="15.999416"
            width="22.600254"
            id="rect864-9-2"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            inkscape:label="D-15"
          />
          <rect
            transform="scale(-1)"
            y="-46.383945"
            x="401.65353"
            height="15.999416"
            width="22.600254"
            id="rect864-3-6"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            inkscape:label="D-16"
          />
          <rect
            y="-353.40363"
            x="-23.697018"
            height="16.013344"
            width="22.58066"
            id="rect864-8-3"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            transform="matrix(-0.30865114,-0.95117531,0.95043925,-0.31091034,0,0)"
            inkscape:label="D-02"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-2-9-72"
            width="22.58066"
            height="16.013344"
            x="-1.1163285"
            y="-353.40363"
            transform="matrix(-0.30865114,-0.95117531,0.95043925,-0.31091034,0,0)"
            inkscape:label="D-01"
          />
          <rect
            y="69.830078"
            x="343.64722"
            height="15.999416"
            width="22.600254"
            id="rect864-6-6"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            transform="rotate(144.03952)"
            inkscape:label="D-03"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-2-3-65"
            width="22.600254"
            height="15.999416"
            x="366.2475"
            y="69.830078"
            transform="rotate(144.03952)"
            inkscape:label="D-04"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-9-8-7"
            width="22.600254"
            height="15.999416"
            x="411.448"
            y="69.830078"
            transform="rotate(144.03952)"
            inkscape:label="D-06"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-3-0-5"
            width="22.600254"
            height="15.999416"
            x="388.84772"
            y="69.830078"
            transform="rotate(144.03952)"
            inkscape:label="D-05"
          />
          <rect
            y="-402.69043"
            x="215.20955"
            height="15.999416"
            width="22.600254"
            id="rect864-4-2"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            transform="rotate(-143.88203)"
            inkscape:label="D-07"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-2-2-3"
            width="22.600254"
            height="15.999416"
            x="237.80983"
            y="-402.69043"
            transform="rotate(-143.88203)"
            inkscape:label="D-08"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-9-9-1"
            width="22.600254"
            height="15.999416"
            x="283.01038"
            y="-402.69043"
            transform="rotate(-143.88203)"
            inkscape:label="D-10"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-3-8-1"
            width="22.600254"
            height="15.999416"
            x="260.41003"
            y="-402.69043"
            transform="rotate(-143.88203)"
            inkscape:label="D-09"
          />
          <rect
            y="410.07999"
            x="183.22652"
            height="15.999416"
            width="22.600254"
            id="rect864-20-9"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            transform="rotate(108.14648)"
            inkscape:label="D-14"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-2-5-58"
            width="22.600254"
            height="15.999416"
            x="205.8268"
            y="410.07999"
            transform="rotate(108.14648)"
            inkscape:label="D-13"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-9-6-8"
            width="22.600254"
            height="15.999416"
            x="251.0273"
            y="410.07999"
            transform="rotate(108.14648)"
            inkscape:label="D-11"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-3-03-0"
            width="22.600254"
            height="15.999416"
            x="228.42702"
            y="410.07999"
            transform="rotate(108.14648)"
            inkscape:label="D-12"
          />
          <rect
            transform="scale(-1)"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-1"
            width="22.600254"
            height="15.999416"
            x="-10.827894"
            y="-46.280773"
            inkscape:label="E-04"
          />
          <rect
            transform="scale(-1)"
            y="-46.280773"
            x="11.772387"
            height="15.999416"
            width="22.600254"
            id="rect864-2-10"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            inkscape:label="E-03"
          />
          <rect
            transform="scale(-1)"
            y="-46.280773"
            x="56.972885"
            height="15.999416"
            width="22.600254"
            id="rect864-9-93"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            inkscape:label="E-01"
          />
          <rect
            transform="scale(-1)"
            y="-46.280773"
            x="34.372604"
            height="15.999416"
            width="22.600254"
            id="rect864-3-64"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            inkscape:label="E-02"
          />
          <rect
            y="-4.0222621"
            x="-137.79073"
            height="16.013344"
            width="22.58066"
            id="rect864-8-53"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            transform="matrix(-0.30865114,-0.95117531,0.95043925,-0.31091034,0,0)"
            inkscape:label="E-08"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-2-9-3"
            width="22.58066"
            height="16.013344"
            x="-115.21004"
            y="-4.0222621"
            transform="matrix(-0.30865114,-0.95117531,0.95043925,-0.31091034,0,0)"
            inkscape:label="E-07"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-9-7-18"
            width="22.58066"
            height="16.013344"
            x="-70.048721"
            y="-4.0222621"
            transform="matrix(-0.30865114,-0.95117531,0.95043925,-0.31091034,0,0)"
            inkscape:label="E-05"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-3-4-2"
            width="22.58066"
            height="16.013344"
            x="-92.62941"
            y="-4.0222621"
            transform="matrix(-0.30865114,-0.95117531,0.95043925,-0.31091034,0,0)"
            inkscape:label="E-06"
          />
          <rect
            y="-145.76375"
            x="46.301292"
            height="15.999416"
            width="22.600254"
            id="rect864-6-60"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            transform="rotate(144.03952)"
            inkscape:label="E-09"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-2-3-25"
            width="22.600254"
            height="15.999416"
            x="68.901573"
            y="-145.76375"
            transform="rotate(144.03952)"
            inkscape:label="E-10"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-9-8-4"
            width="22.600254"
            height="15.999416"
            x="114.10204"
            y="-145.76375"
            transform="rotate(144.03952)"
            inkscape:label="E-12"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-3-0-8"
            width="22.600254"
            height="15.999416"
            x="91.501793"
            y="-145.76375"
            transform="rotate(144.03952)"
            inkscape:label="E-11"
          />
          <rect
            y="-186.11342"
            x="-81.421066"
            height="15.999416"
            width="22.600254"
            id="rect864-4-4"
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            transform="rotate(-143.88203)"
            inkscape:label="E-13"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-2-2-7"
            width="22.600254"
            height="15.999416"
            x="-58.820755"
            y="-186.11342"
            transform="rotate(-143.88203)"
            inkscape:label="E-14"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-9-9-7"
            width="22.600254"
            height="15.999416"
            x="-13.620192"
            y="-186.11342"
            transform="rotate(-143.88203)"
            inkscape:label="E-16"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-3-8-6"
            width="22.600254"
            height="15.999416"
            x="-36.220535"
            y="-186.11342"
            transform="rotate(-143.88203)"
            inkscape:label="E-15"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-9-6-58"
            width="22.600254"
            height="15.999416"
            x="136.54057"
            y="61.098476"
            transform="rotate(108.14648)"
            inkscape:label="E-17"
          />
          <rect
            :style="{ stroke: seatStroke }"
            style="
              fill: none;
              stroke-width: 1.165;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
            "
            id="rect864-3-03-16"
            width="22.600254"
            height="15.999416"
            x="113.94029"
            y="61.098476"
            transform="rotate(108.14648)"
            inkscape:label="E-18"
          />
          <text
            id="text1159"
            y="-29.876978"
            x="-437.01138"
            :style="{ fill: letterStroke }"
            style="
              font-style: normal;
              font-weight: normal;
              font-size: 50.8px;
              line-height: 1.25;
              font-family: sans-serif;
              fill-opacity: 1;
              stroke: none;
              stroke-width: 0.264583;
            "
            xml:space="preserve"
          >
            <tspan
              style="font-size: 101.6px; stroke-width: 0.264583"
              y="-29.876978"
              x="-437.01138"
              id="tspan1157"
              sodipodi:role="line"
            >
              A
            </tspan>
          </text>
          <text
            xml:space="preserve"
            :style="{ fill: letterStroke }"
            style="
              font-style: normal;
              font-weight: normal;
              font-size: 50.8px;
              line-height: 1.25;
              font-family: sans-serif;
              fill-opacity: 1;
              stroke: none;
              stroke-width: 0.264583;
            "
            x="-250.43875"
            y="-25.015135"
            id="text1159-5"
          >
            <tspan
              sodipodi:role="line"
              id="tspan1157-5"
              x="-250.43875"
              y="-25.015135"
              style="font-size: 101.6px; stroke-width: 0.264583"
            >
              B
            </tspan>
          </text>
          <text
            xml:space="preserve"
            :style="{ fill: letterStroke }"
            style="
              font-style: normal;
              font-weight: normal;
              font-size: 50.8px;
              line-height: 1.25;
              font-family: sans-serif;
              fill-opacity: 1;
              stroke: none;
              stroke-width: 0.264583;
            "
            x="-72.437256"
            y="-23.946058"
            id="text1159-7"
          >
            <tspan
              sodipodi:role="line"
              id="tspan1157-9"
              x="-72.437256"
              y="-23.946058"
              style="font-size: 101.6px; stroke-width: 0.264583"
            >
              C
            </tspan>
          </text>
          <text
            xml:space="preserve"
            :style="{ fill: letterStroke }"
            style="
              font-style: normal;
              font-weight: normal;
              font-size: 50.8px;
              line-height: 1.25;
              font-family: sans-serif;
              fill-opacity: 1;
              stroke: none;
              stroke-width: 0.264583;
            "
            x="-440.2001"
            y="143.89922"
            id="text1159-2"
          >
            <tspan
              sodipodi:role="line"
              id="tspan1157-56"
              x="-440.2001"
              y="143.89922"
              style="font-size: 101.6px; stroke-width: 0.264583"
            >
              D
            </tspan>
          </text>
          <text
            xml:space="preserve"
            :style="{ fill: letterStroke }"
            style="
              font-style: normal;
              font-weight: normal;
              font-size: 50.8px;
              line-height: 1.25;
              font-family: sans-serif;
              fill-opacity: 1;
              stroke: none;
              stroke-width: 0.264583;
            "
            x="-68.590332"
            y="142.62383"
            id="text1159-9"
          >
            <tspan
              sodipodi:role="line"
              id="tspan1157-6"
              x="-68.590332"
              y="142.62383"
              style="font-size: 101.6px; stroke-width: 0.264583"
            >
              E
            </tspan>
          </text>
          <path
            :style="{ stroke: arrowStroke }"
            style="
              fill: none;
              stroke-width: 0.665;
              stroke-linecap: butt;
              stroke-linejoin: miter;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
              marker-end: url(#Arrow1Lend);
            "
            d="m -358.54479,-5.7923277 h -17.10524"
            id="path1043"
          />
          <path
            id="path1043-1"
            d="m -254.15633,-2.1870427 -6.79525,-15.6975733"
            :style="{ stroke: arrowStroke }"
            style="
              fill: none;
              stroke-width: 0.665001;
              stroke-linecap: butt;
              stroke-linejoin: miter;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
              marker-end: url(#Arrow1Lend-3);
            "
          />
          <path
            id="path1043-3"
            d="m -89.312956,-44.732715 -5.95904,-16.033682"
            :style="{ stroke: arrowStroke }"
            style="
              fill: none;
              stroke-width: 0.665001;
              stroke-linecap: butt;
              stroke-linejoin: miter;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
              marker-end: url(#Arrow1Lend-30);
            "
          />
          <path
            id="path1043-10"
            d="m -77.505288,51.705352 h 17.105239"
            :style="{ stroke: arrowStroke }"
            style="
              fill: none;
              stroke-width: 0.665001;
              stroke-linecap: butt;
              stroke-linejoin: miter;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
              marker-end: url(#Arrow1Lend-6);
            "
          />
          <path
            id="path1043-9"
            d="m -349.06232,92.603819 6.22002,15.934271"
            :style="{ stroke: arrowStroke }"
            style="
              fill: none;
              stroke-width: 0.665001;
              stroke-linecap: butt;
              stroke-linejoin: miter;
              stroke-miterlimit: 4;
              stroke-dasharray: none;
              stroke-opacity: 1;
              marker-end: url(#Arrow1Lend-2);
            "
          />
        </g>
      </svg>
    </ClientOnly>
  </div>
</template>

<style scoped></style>
