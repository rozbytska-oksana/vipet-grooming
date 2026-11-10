<template>
  <picture class="comparison-photo">
    <source
      type="image/avif"
      :srcset="sources('avif')"
      :sizes="sizes"
    />
    <img
      :src="`${baseURL}images/before-after/${id}-${role}-${thumbnail ? 320 : 640}.webp`"
      :srcset="sources('webp')"
      :sizes="sizes"
      :alt="alt"
      :width="width"
      :height="height"
      loading="lazy"
      fetchpriority="low"
      decoding="async"
      draggable="false"
    />
  </picture>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id: string;
    role: 'before' | 'after';
    width: number;
    height: number;
    alt: string;
    thumbnail?: boolean;
  }>(),
  { thumbnail: false },
);
const baseURL = useRuntimeConfig().app.baseURL;
const sizes = computed(() =>
  props.thumbnail
    ? '(min-width: 1200px) 150px, 100px'
    : '(min-width: 768px) 480px, calc(100vw - 40px)',
);
const sources = (format: string) =>
  (props.thumbnail ? [320] : [640, 960])
    .map(
      (width) =>
        `${baseURL}images/before-after/${props.id}-${props.role}-${width}.${format} ${width}w`,
    )
    .join(', ');
</script>

<style scoped lang="scss">
.comparison-photo {
  display: block;
  width: 100%;
  height: 100%;
  & img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    user-select: none;
    -webkit-user-drag: none;
  }
}
</style>
