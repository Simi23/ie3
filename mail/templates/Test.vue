<script setup lang="ts">
import { Button, Hr, Html, Text, Head, Heading } from '@vue-email/components'

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
    <div class="bg-mail-bg text-white">
        <Heading as="h1">{{ title }}</Heading>
        
        <Text>{{ text }}</Text>
    </div>
  </Html>
</template>
