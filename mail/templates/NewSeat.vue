<script setup lang="ts">
import { Html, Text, Head, Heading, Style } from "@vue-email/components";
import type { StyleValue } from "vue";

const props = defineProps<{
  siteName: string;
  bgUrl: string;
  newSeat: string;
}>();

const containerStyle: StyleValue = {
  color: "#ffffff",
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
      <title>Átültetés - Infósok Éjszakája</title>
      <Style> body { color: white; } </Style>
    </Head>
    <div :style="containerStyle">
      <div
        style="
          color: #ffffff;
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          padding: 10px;
        "
      >
        <Heading as="h1">Átültetés - Infósok Éjszakája</Heading>

        <Text
          >A csapatok összeültetése érdekében a rendezvény szervezői átültettek
          téged.</Text
        >

        <Text style="margin-top: 24px; font-size: 1.3rem; font-weight: 500">
          Az új ülőhelyed: <span style="font-weight: 800">{{ newSeat }}</span>
        </Text>
      </div>
    </div>
  </Html>
</template>
