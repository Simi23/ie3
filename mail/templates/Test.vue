<script setup lang="ts">
import { Button, Hr, Html, Text, Head, Heading, Img } from '@vue-email/components'

defineProps({
  title: String,
  text: String,
})
</script>

<template>
  <Html lang="hu">
    <Head>
        <title>{{ title }}</title>
    </Head>
    <div style="width: 50%; min-width: 320px; padding-top: 16px; padding-bottom: 24px; margin: auto; background-image: url('https://files.penguin.hu/hatter.png'); background-size: 100%; background-position: bottom;">  
        <div style="position: absolute; top: 0; bottom: 0; right: 0; left: 0; color: white; padding: 10px;">
          <Heading as="h1">{{ title }}</Heading>
          
          <Text>{{ text }}</Text>
        </div>
    </div>
  </Html>
</template>
