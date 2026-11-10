<template>
  <section
    id="testimonials"
    ref="section"
    class="testimonials"
    data-surface="light"
    aria-labelledby="testimonials-title"
  >
    <BaseContainer>
      <header
        class="testimonials__heading"
        data-reveal
      >
        <p class="testimonials__eyebrow">Відгуки</p>
        <h2
          id="testimonials-title"
          class="testimonials__title"
          tabindex="-1"
        >
          Що кажуть наші клієнти
        </h2>
        <svg
          class="testimonials__accent"
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
            opacity="0.4"
          />
        </svg>
      </header>
      <template v-if="testimonials.length">
        <div
          ref="viewport"
          class="testimonials__viewport"
          :class="{ 'testimonials__viewport--ready': api }"
        >
          <div class="testimonials__track">
            <div
              v-for="(item, index) in testimonials"
              :key="item.id"
              class="testimonials__slide"
              :class="{ 'testimonials__slide--active': index === selected }"
            >
              <figure class="testimonials__card">
                <figcaption class="testimonials__author">
                  <span
                    class="testimonials__initial"
                    aria-hidden="true"
                  >
                    {{ item.name.slice(0, 1) }}
                  </span>
                  <span>
                    {{ item.name }}
                    <small>Google Maps</small>
                  </span>
                </figcaption>
                <div
                  v-if="item.rating"
                  class="testimonials__rating"
                  role="img"
                  :aria-label="`${item.rating} з 5`"
                >
                  <svg
                    v-for="star in item.rating"
                    :key="star"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="m12 2 3 6.3 7 .9-5 4.9 1.2 7L12 17.8l-6.2 3.3 1.2-7L2 9.2l7-.9Z" />
                  </svg>
                </div>
                <blockquote
                  :id="`review-${item.id}`"
                  :class="{
                    'testimonials__quote--clamped':
                      enhanced && item.text.length > 260 && !expanded.includes(item.id),
                  }"
                >
                  {{ item.text }}
                </blockquote>
                <button
                  v-if="enhanced && item.text.length > 260"
                  class="testimonials__read-more"
                  type="button"
                  :aria-expanded="expanded.includes(item.id)"
                  :aria-controls="`review-${item.id}`"
                  @click="toggle(item.id)"
                >
                  {{ expanded.includes(item.id) ? 'Згорнути' : 'Читати далі' }}
                </button>
                <a
                  v-if="item.sourceUrl"
                  :href="item.sourceUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Переглянути відгук у Google
                </a>
              </figure>
            </div>
          </div>
        </div>
        <div
          v-if="testimonials.length > 1"
          class="testimonials__controls"
          role="group"
          aria-label="Керування відгуками"
        >
          <button
            type="button"
            aria-label="Попередній відгук"
            :disabled="!canPrevious"
            @click="api?.scrollPrev(reduced)"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="m14 6-6 6 6 6" />
            </svg>
          </button>
          <div class="testimonials__dots">
            <button
              v-for="index in visibleSnaps"
              :key="index"
              type="button"
              :aria-label="`Відгук ${index + 1}`"
              :aria-current="selected === index ? 'true' : undefined"
              @click="api?.scrollTo(index, reduced)"
            >
              <span />
            </button>
          </div>
          <button
            type="button"
            aria-label="Наступний відгук"
            :disabled="!canNext"
            @click="api?.scrollNext(reduced)"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="m10 6 6 6-6 6" />
            </svg>
          </button>
        </div>
      </template>
      <p
        v-else
        class="testimonials__empty"
      >
        Ваші враження та історії — у відгуках про V.I.Pet у Google Maps.
      </p>
      <a
        class="testimonials__source"
        :href="googleMapsUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        Усі відгуки в Google Maps
      </a>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import emblaCarouselVue from 'embla-carousel-vue';
import BaseContainer from '../ui/BaseContainer.vue';
import { useScrollReveal } from '../../composables/useScrollReveal';
import { testimonials, googleMapsUrl } from '../../data/testimonials';
import { useReducedMotion } from '../../composables/useReducedMotion';
const section = ref<HTMLElement | null>(null);
useScrollReveal(section);
const reduced = useReducedMotion();
const enhanced = ref(false);
const expanded = ref<string[]>([]);
onMounted(() => {
  enhanced.value = true;
});
const toggle = (id: string) => {
  expanded.value = expanded.value.includes(id)
    ? expanded.value.filter((value) => value !== id)
    : [...expanded.value, id];
};
const [viewport, api] = emblaCarouselVue(
  computed(() => ({
    align: 'center' as const,
    loop: true,
    skipSnaps: true,
    duration: reduced.value ? 0 : 35,
  })),
);
const selected = ref(0);
const snaps = ref<number[]>([]);
const visibleSnaps = computed(() => {
  const count = Math.min(5, snaps.value.length);
  const start = Math.max(0, Math.min(selected.value - 2, snaps.value.length - count));
  return Array.from({ length: count }, (_, index) => start + index);
});
const canPrevious = ref(false);
const canNext = ref(false);
const update = () => {
  selected.value = api.value?.selectedScrollSnap() ?? 0;
  snaps.value = api.value?.scrollSnapList() ?? [];
  canPrevious.value = api.value?.canScrollPrev() ?? false;
  canNext.value = api.value?.canScrollNext() ?? false;
};
watch(api, (value) => {
  value?.on('select', update).on('reInit', update);
  update();
});
onBeforeUnmount(() => {
  api.value?.off('select', update).off('reInit', update);
});
</script>

<style scoped lang="scss">
@use '../../assets/styles/breakpoints' as bp;
.testimonials {
  --surface: #f6f0e6;
  --text-primary: #29292b;
  --text-secondary: #57534d;
  --focus-ring: #8b6428;
  padding-block: clamp(2rem, 3vw, 3rem);
  color: var(--text-primary);
  color-scheme: light;
  overflow: clip;
  &__heading {
    text-align: center;
    margin-bottom: 1rem;
  }
  &__eyebrow {
    margin: 0 0 0.5rem;
    color: var(--color-gold-ink);
    font-size: 1rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
  }
  &__title {
    margin: 0;
    font: 400 clamp(2rem, 3.2vw, 3.25rem) / 1.08 var(--font-editorial);
    text-wrap: balance;
  }
  &__accent {
    display: block;
    width: min(15rem, 60%);
    height: auto;
    margin: 0.75rem auto 0;
    color: #b5974b;
  }
  background: radial-gradient(ellipse at 50% 0, #fffaf2, transparent 70%), var(--surface);
  &__viewport {
    overflow-x: auto;
    padding-block: 2rem;
    margin-block: -1rem;
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
    flex: 0 0 88%;
    min-width: 0;
    margin-right: 1rem;
    @include bp.medium {
      flex-basis: calc((100% - 1rem) / 2);
    }
    @include bp.x-large {
      flex-basis: calc((100% - 2rem) / 3);
    }
  }
  &__card {
    margin: 0;
    padding: clamp(1.125rem, 1.5vw, 1.5rem);
    background: #fffbf4;
    border: 1px solid #c9a14e;
    border-radius: 1rem;

    box-shadow: 0 8px 24px #5745290a;
    transform: scale(0.96);
    transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  &__slide--active {
    position: relative;
    z-index: 1;
  }
  &__slide--active &__card {
    transform: scale(1.06);
  }
  &__author {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.125rem;
  }
  &__author small {
    display: block;
    margin-top: 0.25rem;
    font-size: 1rem;
    color: var(--text-secondary);
  }
  &__initial {
    display: grid;
    place-items: center;
    flex: 0 0 48px;
    height: 48px;
    border: 1px solid #c9a14e;
    border-radius: 50%;
    font: 400 1.75rem var(--font-editorial);
  }
  &__rating {
    display: flex;
    gap: 0.2rem;
    margin-top: 0.75rem;
    color: #966d24;
  }
  &__rating svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }
  blockquote {
    margin: 0.75rem 0;
    font-size: 1.125rem;
    line-height: 1.6;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }
  &__quote--clamped {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6;
    overflow: hidden;
  }
  &__read-more {
    display: block;
    min-height: 44px;
    padding: 0.5rem 0;
    border: 0;
    background: transparent;
    color: #75521f;
    text-decoration: underline;
    text-underline-offset: 0.25em;
    font-size: 1rem;
  }
  &__card a,
  &__source {
    color: #75521f;
    text-underline-offset: 0.25em;
    font-size: 1rem;
  }
  &__source {
    display: block;
    width: fit-content;
    margin: 0.75rem auto 0;
    padding-block: 0.75rem;
  }
  &__empty {
    max-width: 40rem;
    margin: 0 auto;
    text-align: center;
    color: var(--text-secondary);
  }
  &__controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.25rem;
    color: #805b20;
  }
  &__controls > button {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border: 1px solid #b58b3d;
    border-radius: 50%;
    background: transparent;
    color: inherit;
  }
  &__controls > button:disabled {
    opacity: 0.4;
  }
  &__controls svg {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
  }
  &__dots {
    display: flex;
    flex-wrap: nowrap;
    min-width: 0;
    justify-content: center;
  }
  &__dots button {
    display: grid;
    place-items: center;
    width: 28px;
    height: 44px;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
  }
  &__dots span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.35;
  }
  &__dots button[aria-current='true'] span {
    opacity: 1;
  }
  @media (prefers-reduced-motion: reduce) {
    &__card,
    &__slide--active &__card {
      transform: none;
      transition: none;
    }
  }
}
</style>
