<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import bodyFont from './assets/fonts/manrope-cyrillic.woff2?url';
import headingFont from './assets/fonts/cormorant-garamond-italic-cyrillic.woff2?url';

const baseURL = useRuntimeConfig().app.baseURL;

useHead({
  meta: [{ name: 'format-detection', content: 'telephone=no' }],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` },
    { rel: 'icon', type: 'image/png', sizes: '48x48', href: `${baseURL}favicon-48.png` },
    { rel: 'apple-touch-icon', sizes: '180x180', href: `${baseURL}apple-touch-icon.png` },
    ...[bodyFont, headingFont].map((href) => ({
      rel: 'preload' as const,
      as: 'font' as const,
      type: 'font/woff2',
      href,
      crossorigin: 'anonymous' as const,
    })),
  ],
});
</script>
