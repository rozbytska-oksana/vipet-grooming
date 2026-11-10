<template>
  <section
    id="faq"
    ref="section"
    class="faq"
    data-surface="light"
    aria-labelledby="faq-title"
  >
    <BaseContainer class="faq__layout">
      <header
        class="faq__heading"
        data-reveal
      >
        <p class="faq__eyebrow">Перед знайомством</p>
        <h2
          id="faq-title"
          class="faq__title"
          tabindex="-1"
        >
          Часті запитання
        </h2>
        <svg
          class="faq__flourish"
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
      <div class="faq__list">
        <BaseDisclosure
          v-for="item in faqItems"
          :key="item.id"
          class="faq__item"
          data-reveal
        >
          <template #summary>
            <span>{{ item.question }}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="m6 9 6 6 6-6"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
          </template>
          <div class="faq__answer">
            <p
              v-for="(paragraph, index) in item.answer.split('\n\n')"
              :key="index"
            >
              {{ paragraph }}
            </p>
            <ul v-if="item.points?.length">
              <li
                v-for="point in item.points"
                :key="point"
              >
                {{ point }}
              </li>
            </ul>
          </div>
        </BaseDisclosure>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseContainer from '../ui/BaseContainer.vue';
import BaseDisclosure from '../ui/BaseDisclosure.vue';
import { useScrollReveal } from '../../composables/useScrollReveal';
import { faqItems } from '../../data/faq';

const section = ref<HTMLElement | null>(null);
useScrollReveal(section);
</script>

<style scoped lang="scss">
.faq {
  position: relative;
  overflow: clip;
  padding-block: clamp(2rem, 3vw, 3rem);
  color: var(--text-primary);
  background:
    radial-gradient(ellipse at top left, rgb(255 253 246 / 65%), transparent 60%), var(--surface);

  &__layout {
    display: grid;
    gap: 2rem;
  }

  &__heading {
    position: relative;
    isolation: isolate;
    text-align: center;
  }

  &__eyebrow {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--color-gold-ink);
  }

  &__title {
    margin: 0;
    font: 400 clamp(2rem, 3.2vw, 3.25rem)/1.08 var(--font-editorial);
    text-wrap: balance;
  }

  &__flourish {
    display: block;
    width: min(16rem, 75%);
    height: auto;
    margin: 1rem auto 0;
    color: #b5974b;
  }

  &__list {
    display: grid;
    min-width: 0;
    width: min(100%, 64rem);
    margin-inline: auto;
  }

  &__item {
    min-width: 0;
    border-bottom: 1px solid rgb(181 151 75 / 40%);
    background: transparent;

    &[open] {
      border-color: #b5974b;
      background: transparent;
    }

    & :deep(summary) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.125rem;
      min-height: 64px;
      border-radius: 0.25rem;
      font-size: 1.125rem;
      line-height: 1.5;
      cursor: pointer;
      list-style: none;

      &:focus-visible {
        outline: 2px solid #a27b2c;
        outline-offset: 3px;
        box-shadow: 0 0 0 6px rgb(199 166 104 / 20%);
      }
    }

    & :deep(summary::-webkit-details-marker) {
      display: none;
    }

    & span {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    & svg {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      color: #9b772f;
    }

    &[open] svg {
      transform: rotate(180deg);
    }
  }

  &__answer {
    max-width: 76ch;
    padding: 0 1.125rem 1.25rem;
    color: #57534f;
    overflow-wrap: anywhere;
    line-height: 1.7;

    & p {
      margin: 0;
    }

    & p + p {
      margin-top: 0.875rem;
    }

    & ul {
      margin: 0.875rem 0 0;
      padding-left: 1.25rem;
    }

    & li + li {
      margin-top: 0.75rem;
    }

    & li::marker {
      color: #9b772f;
    }
  }

  @media (hover: hover) {
    &__item:hover {
      border-color: #b5974b;
    }

    &__item:hover svg {
      color: #715323;
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    &__item {
      transition:
        border-color 250ms,
        background-color 250ms;
    }

    &__item svg {
      transition: transform 350ms ease;
    }
  }

  @media (forced-colors: active) {
    &__item :deep(summary:focus-visible) {
      outline-color: Highlight;
    }
  }
}
</style>
