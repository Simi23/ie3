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

const config = useRuntimeConfig();

const bgUrl = `${config.public.siteName}/hatter.png`;
const containerStyle: StyleValue = {
  width: "50%",
  minWidth: "320px",
  paddingTop: "16px",
  paddingBottom: "24px",
  margin: "auto",
  backgroundImage: `url('${bgUrl}')`,
  backgroundSize: "100%",
  backgroundPosition: "bottom",
};

defineProps({
  title: String,
  text: String,
});
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
