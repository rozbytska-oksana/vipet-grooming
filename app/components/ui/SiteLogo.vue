<template>
  <picture
    class="site-logo"
    :style="{ '--logo-width': `${width}px` }"
  >
    <source
      type="image/webp"
      :srcset="sources"
      :sizes="`${width}px`"
    />
    <img
      :src="`${baseURL}images/brand/logo-${tone}-320.png`"
      width="320"
      height="283"
      alt="V.I.Pet — Grooming Salon"
      :loading="loading"
      decoding="async"
    />
  </picture>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = withDefaults(
  defineProps<{ tone?: 'light' | 'dark'; width?: number; loading?: 'eager' | 'lazy' }>(),
  { tone: 'light', width: 104, loading: 'eager' },
);
const baseURL = useRuntimeConfig().app.baseURL;
const sources = computed(() =>
  [160, 320, 480]
    .map((width) => `${baseURL}images/brand/logo-${props.tone}-${width}.webp ${width}w`)
    .join(', '),
);
</script>

<style scoped lang="scss">
.site-logo {
  display: block;
  width: var(--logo-width);
  max-width: 100%;
  aspect-ratio: 320 / 283;
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
