<script setup lang="ts">
import {
  Button,
  Hr,
  Html,
  Text,
  Head,
  Heading,
  Img,
} from "@vue-email/components";
import type { StyleValue } from "vue";

const props = defineProps({
  title: String,
  text: String,
  siteName: String,
});

const bgUrl = `${props.siteName}/hatter.png`;
const containerStyle: StyleValue = {
  width: "50%",
  minWidth: "320px",
  paddingTop: "16px",
  paddingBottom: "24px",
  margin: "auto",
  backgroundColor: "#000d44",
  backgroundImage: `url('${bgUrl}')`,
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
