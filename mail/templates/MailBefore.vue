<script setup lang="ts">
import { Html, Text, Head, Heading, Style } from "@vue-email/components";
import type { StyleValue } from "vue";

const props = defineProps<{
  siteName: string;
  bgUrl: string;
  openTime: string;
  startTime: string;
  seat: string;
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
      <title>Kedves Játékos!</title>
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
        <Heading as="h1">Kedves Játékos!</Heading>

        <Text
          >Holnap kezdődik az Infósok Éjszakája! Néhány fontosabb
          információ:</Text
        >

        <Text style="margin-top: 24px; font-size: 1.1rem; font-weight: 500">
          Nyitási idő: <span style="font-weight: 800">{{ openTime }}</span>
        </Text>
        <Text style="margin-top: 8px; font-size: 1.1rem; font-weight: 500">
          Kezdési idő: <span style="font-weight: 800">{{ startTime }}</span>
        </Text>
        <Text style="margin-top: 8px; font-size: 1.1rem; font-weight: 500">
          Az ülőhelyed: <span style="font-weight: 800">{{ seat }}</span>
        </Text>
      </div>
    </div>
  </Html>
</template>
