<template>
  <section
    id="philosophy"
    ref="section"
    class="philosophy"
    data-surface="light"
    aria-labelledby="philosophy-title"
  >
    <BaseContainer class="philosophy__layout">
      <header
        class="philosophy__heading"
        data-reveal
      >
        <h2
          id="philosophy-title"
          class="philosophy__title"
          tabindex="-1"
        >
          Наш підхід —
          <br />
          більше, ніж стрижка
        </h2>
        <svg
          class="philosophy__flourish"
          viewBox="0 0 280 44"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M5 36C82 8 184 48 250 23C267 17 274 9 271 3"
            stroke="currentColor"
            stroke-width="1.8"
            pathLength="1"
          />
          <path
            d="M25 39C112 15 210 43 257 21"
            stroke="currentColor"
            stroke-width="0.5"
            pathLength="1"
          />
        </svg>
      </header>
      <ul class="philosophy__values">
        <li
          v-for="(value, index) in values"
          :key="value.title"
          class="philosophy__value"
        >
          <svg
            class="philosophy__icon"
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
            data-reveal
            :data-reveal-delay="index * 120"
          >
            <path :d="value.path" />
          </svg>
          <h3
            class="philosophy__label"
            data-reveal
            :data-reveal-delay="index * 120 + 120"
          >
            {{ value.title }}
          </h3>
          <p
            class="philosophy__description"
            data-reveal
            :data-reveal-delay="index * 120 + 180"
          >
            {{ value.text }}
          </p>
        </li>
      </ul>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import BaseContainer from '../ui/BaseContainer.vue';
import { useScrollReveal } from '../../composables/useScrollReveal';
import { useReducedMotion } from '../../composables/useReducedMotion';

const values = [
  {
    title: 'Турбота',
    text: 'Улюбленець — у центрі уваги.',
    path: 'M24 39 8 23C-2 11 13 1 24 13 35 1 50 11 40 23ZM20 21l4 4 7-8',
  },
  {
    title: 'Делікатність',
    text: 'Комфорт і спокій під час процедур.',
    path: 'M10 37C10 15 22 8 40 8c0 20-10 30-25 26M8 41l23-23M20 29l-1-9M27 22l9 1',
  },
  {
    title: 'Індивідуальність',
    text: 'У кожного свій характер і власний стиль.',
    path: 'M24 34C9 26 15 13 24 6c9 7 15 20 0 28ZM24 36C6 37 3 27 4 19c11 0 16 5 20 15M24 36c18 1 21-9 20-17-11 0-16 5-20 15M10 38c8 6 20 6 28 0',
  },
  {
    title: 'Естетика',
    text: 'Краса, що починається з деталей.',
    path: 'M24 5l5 13 14 6-14 6-5 13-5-13-14-6 14-6ZM38 4v8M34 8h8',
  },
] as const;
const section = ref<HTMLElement | null>(null);
useScrollReveal(section);
const reduced = useReducedMotion();
let observer: IntersectionObserver | undefined;
let played = false;
const animations = new Set<Animation>();
const clear = () => {
  observer?.disconnect();
  animations.forEach((animation) => animation.cancel());
  animations.clear();
};
const setupLine = () => {
  clear();
  const line = section.value?.querySelector('.philosophy__flourish');
  if (!line || reduced.value || played || !('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      played = true;
      observer?.disconnect();
      line.querySelectorAll('path').forEach((path) => {
        const animation = path.animate(
          [
            { strokeDasharray: '1', strokeDashoffset: '1' },
            { strokeDasharray: '1', strokeDashoffset: '0' },
          ],
          { duration: 900, delay: 200, easing: 'ease-out', fill: 'backwards' },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    },
    { threshold: 0.2 },
  );
  observer.observe(line);
};
onMounted(setupLine);
watch(reduced, setupLine);
onBeforeUnmount(clear);
</script>

<style scoped lang="scss">
@use '../../assets/styles/breakpoints' as bp;
.philosophy {
  position: relative;
  padding-block: clamp(2.5rem, 4vw, 4rem);
  background: linear-gradient(110deg, #f7f1ea, #f0e5d9 55%, #f7f1ea);
  color: #242326;
  color-scheme: light;

  &__layout {
    display: grid;
    align-items: center;
    gap: 2rem;
    @include bp.x-large {
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 2.1fr);
      gap: 2.5rem;
    }
  }
  &__heading {
    max-width: 30rem;
    margin-inline: auto;
    text-align: center;
    @include bp.x-large {
      margin: 0;
      text-align: left;
    }
  }
  &__title {
    margin: 0;
    font: 400 clamp(2rem, 3.2vw, 3.25rem) / 1.03 var(--font-editorial);
    letter-spacing: -0.025em;
    text-wrap: balance;
  }
  &__flourish {
    display: block;
    width: 80%;
    height: auto;
    margin: -0.2rem 0 0 auto;
    color: #b5974b;
  }
  &__values {
    min-width: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.75rem 0;
    margin: 0;
    padding: 0;
    list-style: none;
    @include bp.medium {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0;
    }
  }
  &__value {
    min-width: 0;
    container-type: inline-size;
    display: grid;
    align-content: start;
    justify-items: center;
    gap: 0.65rem;
    padding-inline: clamp(0.5rem, 1vw, 1rem);
    text-align: center;
    &:nth-child(even) {
      border-left: 1px solid rgb(137 97 43 / 40%);
    }
    @include bp.medium {
      & + & {
        border-left: 1px solid rgb(137 97 43 / 40%);
      }
    }
  }
  &__icon {
    width: 44px;
    height: 44px;
    color: #b5974b;
    transition: transform 0.3s ease;
  }
  &__label {
    max-width: 100%;
    margin: 0;
    font: 500 clamp(1.25rem, 12cqi, 1.625rem) / 1.15 var(--font-editorial);
    color: #242326;
    hyphens: auto;
    text-wrap: balance;
  }
  &__description {
    width: 100%;
    max-width: 23ch;
    margin: 0.25rem 0 0;
    color: #5b5650;
    font-size: 1rem;
    line-height: 1.5;
    text-wrap: pretty;
  }
  @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    &__value:hover &__icon {
      transform: translateY(-4px) scale(1.04);
    }
  }
}
</style>
