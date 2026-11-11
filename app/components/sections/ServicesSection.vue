<template>
  <section
    id="services"
    ref="section"
    class="services"
    data-surface="light"
    aria-labelledby="services-title"
  >
    <BaseContainer>
      <header
        class="services__heading"
        data-reveal
      >
        <p class="services__eyebrow">Наші послуги</p>
        <h2
          id="services-title"
          class="services__title"
          tabindex="-1"
        >
          Догляд для собак і котів
        </h2>
        <svg
          class="services__accent"
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
      <p class="services__note">
        Базова вартість за прайсом. Остаточна ціна залежить від породи, ваги та стану шерсті.
      </p>
      <div class="services__grid">
        <article
          v-for="(item, index) in cards"
          :key="item.id"
          class="service-card"
          data-reveal
          :data-reveal-delay="index * 120"
        >
          <div class="service-card__image">
            <picture>
              <source
                type="image/avif"
                :srcset="`${baseURL}images/services/${item.image}-v2-384.avif 384w, ${baseURL}images/services/${item.image}-v2-768.avif 768w`"
                :sizes="imageSizes"
              />
              <img
                :src="`${baseURL}images/services/${item.image}-v2-768.webp`"
                :srcset="`${baseURL}images/services/${item.image}-v2-384.webp 384w, ${baseURL}images/services/${item.image}-v2-768.webp 768w`"
                :sizes="imageSizes"
                :alt="item.alt"
                width="768"
                height="768"
                loading="lazy"
                fetchpriority="low"
                decoding="async"
              />
            </picture>
          </div>
          <div class="service-card__body">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
            <p
              v-if="item.id === 'express-shedding'"
              class="service-card__price-scope"
            >
              Для великих порід
            </p>
            <p class="service-card__price">{{ formatServicePrice(item.id) }}</p>
            <BaseButton
              href="#pricing"
              class="service-card__button"
              :aria-label="`Дізнатись більше: ${item.title}`"
            >
              Дізнатись більше
            </BaseButton>
          </div>
        </article>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useScrollReveal } from '../../composables/useScrollReveal';
import BaseContainer from '../ui/BaseContainer.vue';
import BaseButton from '../ui/BaseButton.vue';
import { serviceCards } from '../../data/service-cards';
import { formatServicePrice } from '../../data/service-prices';
const section = ref<HTMLElement | null>(null);
const baseURL = useRuntimeConfig().app.baseURL;
useScrollReveal(section, { duration: 900, fromOpacity: 0, easing: 'ease-out' });
const cards = serviceCards;
const imageSizes =
  '(min-width: 1200px) calc((min(100vw, 90rem) - clamp(5rem, 8vw, 10rem) - clamp(1.5rem, 2.5vw, 2.5rem) - 6px) / 3), (min-width: 768px) calc((100vw - 4rem - clamp(1.5rem, 2.5vw, 2.5rem) - 6px) / 3), calc(100vw - 2.5rem - 2px)';
</script>

<style scoped lang="scss">
@use '../../assets/styles/breakpoints' as bp;
.services {
  --text-secondary: #57534f;
  padding-block: clamp(2.5rem, 3vw, 5rem);
  background: linear-gradient(110deg, #f7f1ea, #f0e5d9 55%, #f7f1ea);
  color: var(--text-primary);
  color-scheme: light;

  &__heading {
    text-align: center;
    margin-bottom: 1.5rem;
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

  &__note {
    max-width: 60ch;
    margin: 0 auto 1.75rem;
    text-align: center;
    color: var(--text-secondary);
    font-size: 1rem;
  }
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: clamp(0.75rem, 1.25vw, 1.25rem);
    @include bp.medium {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    @include bp.x-large {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}
.service-card {
  &__price-scope {
    font-size: 1rem;
  }

  position: relative;

  &::after {
    position: absolute;
    z-index: 2;
    inset: -1px;
    padding: 2px;
    border-radius: inherit;
    background: conic-gradient(
      from var(--service-border-angle),
      transparent 0deg 250deg,
      #b59649 285deg,
      #e4c778 315deg,
      #fff4cf 335deg,
      #d1ae5d 350deg,
      transparent 360deg
    );
    mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    mask-composite: exclude;
    opacity: 0;
    pointer-events: none;
    content: '';
    transition: opacity 240ms ease;
  }

  &:focus-within {
    border-color: var(--color-gold);
  }

  @media (prefers-reduced-motion: no-preference) {
    &:focus-within::after {
      opacity: 1;
      animation: service-border-sweep 2.4s linear 1;
    }
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: var(--color-gold);
    }
  }

  @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    &:hover::after {
      opacity: 1;
      animation: service-border-sweep 2.4s linear 1;
    }
  }

  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(199 166 104 / 55%);
  border-radius: 0.75rem;
  background: var(--surface-raised);
  color: var(--text-primary);
  &__image {
    aspect-ratio: 1.1;
    overflow: hidden;
  }
  &__image :deep(picture) {
    display: block;
    height: 100%;
  }
  &__image :deep(img) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    padding: 1.25rem 1rem 1.5rem;
    text-align: center;
  }
  &__body h3 {
    margin: 0;
    font: 400 clamp(1.75rem, 2.2vw, 2rem) / 1.05 var(--font-editorial);
  }
  &__body p {
    margin: 0.75rem 0 1.25rem;
    line-height: 1.5;
    font-size: 1rem;
    color: var(--text-secondary);
  }
  &__body &__price {
    margin: auto 0 0.75rem;
    color: var(--color-gold-ink);
    font: 500 1.5rem / 1.15 var(--font-editorial);
    font-variant-numeric: tabular-nums;
  }
  &__button.base-button {
    width: 100%;
    min-height: 44px;
    margin-top: 0;
    padding: 0.65rem 0.5rem;
    font-size: 1.25rem;
  }
  @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    transition:
      border-color 240ms,
      box-shadow 240ms;
    &:hover {
      border-color: var(--color-gold);
      box-shadow: 0 0 24px rgb(199 166 104 / 12%);
    }
    &__image :deep(img) {
      transition: transform 650ms var(--motion-ease-out);
    }
    &:hover :deep(img) {
      transform: scale(1.035);
    }
  }
}
@keyframes service-border-sweep {
  from {
    --service-border-angle: 0deg;
  }
  to {
    --service-border-angle: 360deg;
  }
}
</style>
