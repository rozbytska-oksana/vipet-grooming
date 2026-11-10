<template>
  <section
    id="gallery"
    ref="section"
    class="pet-gallery"
    data-surface="dark"
    aria-labelledby="gallery-title"
  >
    <BaseContainer>
      <header
        class="pet-gallery__heading"
        data-reveal
      >
        <p class="pet-gallery__eyebrow">За лаштунками догляду</p>
        <h2
          id="gallery-title"
          tabindex="-1"
        >
          У кожного — свій характер
        </h2>
        <svg
          class="pet-gallery__accent"
          viewBox="0 0 260 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 15C70 -8 170 28 258 4"
            stroke="currentColor"
          />
          <path
            d="M45 16C122 2 189 20 240 9"
            stroke="currentColor"
            opacity=".4"
          />
        </svg>
      </header>
      <div
        role="region"
        aria-label="Відео процесу грумінгу"
        aria-roledescription="карусель"
      >
        <div
          ref="viewport"
          class="pet-gallery__viewport"
          :class="{ 'pet-gallery__viewport--ready': api }"
        >
          <div class="pet-gallery__track">
            <figure
              v-for="(item, index) in groomingVideos"
              :key="item.id"
              class="pet-gallery__slide"
              :class="{
                'pet-gallery__slide--active': selected === index,
                'pet-gallery__slide--nearby': isNearby(index),
              }"
              role="group"
              aria-roledescription="слайд"
              :aria-label="`${index + 1} із ${groomingVideos.length}: ${item.title}`"
            >
              <div class="pet-gallery__frame">
                <GroomingVideoCard
                  :src="item.src"
                  :poster="item.poster"
                  :title="item.title"
                  @play="onPlay(index, $event)"
                />
              </div>
            </figure>
          </div>
        </div>
        <div
          v-if="api"
          class="pet-gallery__controls"
        >
          <button
            type="button"
            aria-label="Попереднє відео"
            @click="api?.scrollPrev(reduced)"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="m14 5-7 7 7 7" />
            </svg>
          </button>
          <div
            class="pet-gallery__dots"
            role="group"
            aria-label="Обрати відео"
          >
            <button
              v-for="dot in visibleDots"
              :key="dot.id"
              type="button"
              :aria-label="`Відео ${dot.index + 1}: ${dot.title}`"
              :aria-current="selected === dot.index ? 'true' : undefined"
              @click="api?.scrollTo(dot.index, reduced)"
            >
              <span aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            aria-label="Наступне відео"
            @click="api?.scrollNext(reduced)"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="m10 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <a
        v-if="business.instagramUrl"
        class="pet-gallery__instagram"
        :href="business.instagramUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        Більше робіт в Instagram
      </a>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import emblaCarouselVue from 'embla-carousel-vue';
import BaseContainer from '../ui/BaseContainer.vue';
import GroomingVideoCard from '../gallery/GroomingVideoCard.vue';
import { groomingVideos } from '../../data/grooming-videos';
import { business } from '../../data/salon';
import { useReducedMotion } from '../../composables/useReducedMotion';
import { useScrollReveal } from '../../composables/useScrollReveal';

const section = ref<HTMLElement | null>(null);
const reduced = useReducedMotion();
useScrollReveal(section);
const selected = ref(0);
const isNearby = (index: number) => {
  const distance = Math.abs(selected.value - index);
  return Math.min(distance, groomingVideos.length - distance) <= 2;
};
const visibleDots = computed(() => {
  const count = Math.min(5, groomingVideos.length);
  const start = Math.max(0, Math.min(selected.value - 2, groomingVideos.length - count));
  return groomingVideos
    .slice(start, start + count)
    .map((item, index) => ({ ...item, index: start + index }));
});
const options = computed(() => ({
  loop: true,
  align: 'center' as const,
  skipSnaps: true,
  duration: reduced.value ? 0 : 35,
  watchDrag: (_api: unknown, event: MouseEvent | TouchEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return true;
    // The transparent playback button forwards drags to Embla; its click is
    // automatically suppressed by Embla after a drag. Native controls stay free.
    if (target.closest('.grooming-video__gesture')) return true;
    return !target.closest('video, button, input, select, textarea');
  },
}));
const [viewport, api] = emblaCarouselVue(options);
let playingVideo: HTMLVideoElement | null = null;
let playingIndex = -1;
const pause = (except = -1) => {
  if (playingIndex !== except && playingVideo && !playingVideo.paused) playingVideo.pause();
};
const update = () => {
  selected.value = api.value?.selectedScrollSnap() ?? 0;
  pause(selected.value);
};
const onPlay = (index: number, player: HTMLVideoElement) => {
  pause(index);
  playingVideo = player;
  playingIndex = index;
  api.value?.scrollTo(index, reduced.value);
};
watch(api, (value, previous) => {
  previous?.off('select', update).off('reInit', update);
  value?.on('select', update).on('reInit', update);
  update();
});
let observer: IntersectionObserver | undefined;
const onVisibility = () => {
  if (document.hidden) pause();
};
onMounted(() => {
  document.addEventListener('visibilitychange', onVisibility);
  if (section.value && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) pause();
    });
    observer.observe(section.value);
  }
});
onBeforeUnmount(() => {
  pause();
  playingVideo = null;
  observer?.disconnect();
  document.removeEventListener('visibilitychange', onVisibility);
  api.value?.off('select', update).off('reInit', update);
});
</script>

<style scoped lang="scss">
@use '../../assets/styles/breakpoints' as bp;
.pet-gallery {
  padding-block: clamp(2.5rem, 4vw, 4rem);
  overflow: clip;
  background: radial-gradient(ellipse at 50% 35%, rgb(199 166 104 / 9%), transparent 65%), #29292b;
  color: #f6f2e9;

  &__heading {
    text-align: center;
    margin-bottom: 1rem;

    & h2 {
      margin: 0;
      font: 400 clamp(2rem, 3.2vw, 3.25rem)/1.08 var(--font-editorial);
      text-wrap: balance;
    }
  }

  &__eyebrow {
    margin: 0 0 0.75rem;
    color: #f6d797;
    font-size: 1rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  &__accent {
    display: block;
    width: min(15rem, 60%);
    height: auto;
    margin: 0.75rem auto 0;
    color: #c7a668;
  }

  &__viewport {
    overflow-x: auto;
    padding-block: clamp(1.75rem, 3vw, 3rem) 1.75rem;

    &--ready {
      overflow: hidden;
    }
  }

  &__track {
    display: flex;
    align-items: center;
    touch-action: pan-y pinch-zoom;
  }

  &__slide {
    flex: 0 0 78%;
    min-width: 0;
    margin: 0 1.25rem 0 0;

    @include bp.medium {
      flex-basis: 40%;
    }

    @include bp.x-large {
      flex-basis: calc((100% - 3rem) / 3);
      margin-right: 1.5rem;
    }
  }

  &__frame {
    transform: scale(0.94);
  }

  &__slide--active {
    position: relative;
    z-index: 1;
  }

  &__slide--active &__frame {
    transform: scale(1.04);
  }

  &__controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 0.5rem;

    & > button {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border: 1px solid #c7a668;
      border-radius: 50%;
      background: transparent;
      color: #f6d797;
    }

    & svg {
      width: 22px;
      height: 22px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.5;
    }
  }

  &__instagram {
    display: block;
    width: fit-content;
    margin: 1rem auto 0;
    padding-block: 0.75rem;
    color: #f6d797;
    font-size: 1rem;
    text-align: center;
    text-underline-offset: 0.25em;

    &:focus-visible {
      outline: 2px solid #f6d797;
      outline-offset: 4px;
    }
  }

  &__dots {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: center;
    min-width: 0;
    color: #f6d797;

    & button {
      display: grid;
      place-items: center;
      width: 28px;
      height: 44px;
      padding: 0;
      border: 0;
      background: transparent;
      color: inherit;
    }

    & span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
      opacity: 0.35;
    }

    & button[aria-current='true'] span {
      opacity: 1;
      box-shadow: 0 0 8px rgb(246 215 151 / 45%);
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    &__slide--nearby &__frame {
      will-change: transform;
    }

    &__frame {
      transition: transform 650ms cubic-bezier(0.22, 1, 0.36, 1);
    }
  }
}
</style>
