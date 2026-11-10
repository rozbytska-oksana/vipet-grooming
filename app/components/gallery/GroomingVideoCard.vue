<template>
  <div class="grooming-video">
    <video
      v-if="loaded"
      ref="video"
      class="grooming-video__player"
      :src="`${baseURL}${src}`"
      :poster="`${baseURL}${poster}-768.webp`"
      controls
      preload="none"
      playsinline
      :aria-label="title"
      @play="onPlay"
      @pause="playing = false"
      @ended="playing = false"
      @error="failed = true"
    />
    <button
      v-if="loaded && !failed"
      class="grooming-video__gesture"
      type="button"
      :aria-label="`${playing ? 'Призупинити' : 'Відтворити'}: ${title}`"
      @click="togglePlayback"
    >
      <span
        v-if="!playing"
        class="grooming-video__play"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24"><path d="m9 5 11 7-11 7Z" /></svg>
      </span>
    </button>
    <a
      v-if="!loaded || failed"
      class="grooming-video__cover"
      draggable="false"
      :href="`${baseURL}${src}`"
      :aria-label="`Відтворити відео: ${title}`"
      @click="start"
    >
      <picture>
        <source
          type="image/avif"
          :srcset="`${baseURL}${poster}-384.avif 384w, ${baseURL}${poster}-768.avif 768w`"
          :sizes="sizes"
        />
        <img
          :src="`${baseURL}${poster}-768.webp`"
          :srcset="`${baseURL}${poster}-384.webp 384w, ${baseURL}${poster}-768.webp 768w`"
          :sizes="sizes"
          :alt="title"
          width="540"
          height="960"
          draggable="false"
          loading="lazy"
          fetchpriority="low"
          decoding="async"
        />
      </picture>
      <span
        class="grooming-video__play"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24"><path d="m9 5 11 7-11 7Z" /></svg>
      </span>
      <span class="grooming-video__hint">
        {{ failed ? 'Відкрити відео окремо' : title }}
      </span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';

defineProps<{ src: string; poster: string; title: string }>();
const emit = defineEmits<{ play: [player: HTMLVideoElement] }>();
const baseURL = useRuntimeConfig().app.baseURL;
const loaded = ref(false);
const failed = ref(false);
const playing = ref(false);
const video = ref<HTMLVideoElement | null>(null);
const sizes = '(min-width: 1200px) 28vw, (min-width: 768px) 40vw, 78vw';
const onPlay = () => {
  playing.value = true;
  if (video.value) emit('play', video.value);
};
const togglePlayback = async () => {
  const player = video.value;
  if (!player) return;
  if (!player.paused) {
    player.pause();
    return;
  }
  try {
    await player.play();
  } catch {
    // The native controls remain available for another playback attempt.
  }
};
const start = async (event: MouseEvent) => {
  if (failed.value || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  loaded.value = true;
  await nextTick();
  try {
    if (video.value) {
      video.value.muted = false;
      await video.value.play();
    }
  } catch {
    // Native controls remain available if the browser declines scripted playback.
  }
};
</script>

<style scoped lang="scss">
.grooming-video {
  position: relative;
  aspect-ratio: 9 / 16;
  overflow: hidden;
  border: 1px solid #c7a668;
  border-radius: 0.75rem;
  background: #202022;
  box-shadow: 0 12px 30px rgb(0 0 0 / 20%);

  &__player,
  &__cover,
  &__cover picture,
  &__cover img {
    display: block;
    width: 100%;
    height: 100%;
  }

  &__player,
  &__cover img {
    object-fit: contain;
  }

  &__cover {
    position: absolute;
    inset: 0;
    color: #f6d797;
    text-decoration: none;

    &:focus-visible {
      outline: 3px solid #f6d797;
      outline-offset: -5px;
    }
  }

  &__gesture {
    position: absolute;
    // Reserve the bottom of the video for native playback/seek/volume controls.
    inset: 0 0 5rem;
    padding: 0;
    border: 0;
    background: transparent;
    color: #f6d797;
    touch-action: pan-y pinch-zoom;

    &:focus-visible {
      outline: 3px solid #f6d797;
      outline-offset: -5px;
    }
  }

  &__cover img {
    user-select: none;
    -webkit-user-drag: none;
  }

  &__play {
    position: absolute;
    inset: 50% auto auto 50%;
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    transform: translate(-50%, -50%);
    border: 1px solid #f6d797;
    border-radius: 50%;
    background: rgb(32 32 34 / 85%);

    & svg {
      width: 28px;
      height: 28px;
      fill: currentColor;
    }
  }

  &__hint {
    position: absolute;
    inset: auto 0 0;
    padding: 2rem 0.75rem 0.875rem;
    background: linear-gradient(transparent, rgb(0 0 0 / 85%));
    text-align: center;
    font: 400 clamp(1.25rem, 1.8vw, 1.75rem)/1.3 var(--font-editorial);
    color: #f6d797;
  }
}
</style>
