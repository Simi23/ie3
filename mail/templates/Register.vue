<script setup lang="ts">
import { Button, Html, Text, Head, Heading } from "@vue-email/components";
import type { StyleValue } from "vue";

const props = defineProps<{
  title: string;
  text: string;
  emailVerifyLink: string;
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
  backgroundImage: `url('${props.bgUrl}')`,
  backgroundSize: "100%",
  backgroundPosition: "bottom",
};

const buttonStyle: StyleValue = {
  backgroundColor: "#49bae7",
  color: "white",
  margin: "12px auto",
  padding: "6px 8px",
  borderRadius: "4px",
  fontSize: "1rem",
  fontWeight: "bold",
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
        <Button :href="emailVerifyLink" :style="buttonStyle">
          Email cím megerősítése
        </Button>
      </div>
    </div>
  </Html>
</template>
