<script setup lang="ts">
import { Html, Text, Head, Heading } from "@vue-email/components";
import type { StyleValue } from "vue";

const props = defineProps<{
  title: string;
  text: string;
  siteName: string;
  bgUrl: string;
}>();

// const bgUrl = `https://i.imgur.com/I9gDeaL.png`;
const containerStyle: StyleValue = {
  width: "50%",
  minWidth: "320px",
  paddingTop: "16px",
  paddingBottom: "24px",
  margin: "auto",
  backgroundColor: "#000d44",
  backgroundImage: `url('cid:${props.bgUrl}')`,
  backgroundSize: "100%",
  backgroundPosition: "bottom",
};
</script>

<template>
  <Html lang="hu">
    <Head>
      <title>{{ title }}</title>
    </Head>
    <div :style="containerStyle">
      <div
        style="
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          color: white;
          padding: 10px;
        "
      >
        <Heading as="h1">{{ title }}</Heading>

        <Text>{{ text }}</Text>
      </div>
    </div>
  </Html>
</template>
