<template>
  <section
    id="before-after"
    ref="section"
    class="comparison"
    data-surface="light"
    aria-labelledby="before-after-title"
  >
    <BaseContainer>
      <div class="comparison__layout">
        <header
          class="comparison__heading"
          data-reveal
        >
          <p class="comparison__eyebrow">До і після</p>
          <h2
            id="before-after-title"
            class="comparison__title"
            tabindex="-1"
          >
            Перетворення,
            <br />
            які надихають
          </h2>
          <svg
            class="comparison__accent"
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
          <p class="comparison__intro">
            Знайомий погляд. Новий образ. Подивіться, як змінюються наші улюбленці після догляду.
          </p>
          <div class="comparison__interaction">
            <p
              id="comparison-help"
              class="comparison__hint"
            >
              {{
                both
                  ? 'Два фото поруч — кожна деталь на виду.'
                  : 'Рухайте золоту лінію, щоб порівняти результат.'
              }}
            </p>
            <button
              v-if="ready"
              type="button"
              class="comparison__mode"
              :aria-pressed="both"
              @click="both = !both"
            >
              {{ both ? 'Порівняти повзунком' : 'Показати фото поруч' }}
            </button>
          </div>
        </header>
        <div
          class="comparison__viewer"
          data-reveal
        >
          <div
            class="comparison__frame"
            :class="{ 'comparison__frame--both': both }"
          >
            <Transition
              name="comparison-change"
              mode="out-in"
            >
              <div
                :key="active.id"
                class="comparison__images"
              >
                <figure class="comparison__photo comparison__photo--before">
                  <ComparisonPhoto
                    :id="active.id"
                    role="before"
                    :width="active.before.width"
                    :height="active.before.height"
                    :alt="`Улюбленець до грумінгу, пара ${selected + 1}`"
                  />
                </figure>
                <figure
                  class="comparison__photo comparison__photo--after"
                  :style="both ? {} : { clipPath: `inset(0 0 0 ${position}%)` }"
                >
                  <ComparisonPhoto
                    :id="active.id"
                    role="after"
                    :width="active.after.width"
                    :height="active.after.height"
                    :alt="`Той самий улюбленець після грумінгу, пара ${selected + 1}`"
                  />
                </figure>
              </div>
            </Transition>
            <span class="comparison__label comparison__label--before">До</span>
            <span class="comparison__label comparison__label--after">Після</span>
            <template v-if="ready && !both">
              <span
                class="comparison__divider"
                :style="{ left: `${position}%` }"
                aria-hidden="true"
              >
                <span class="comparison__handle">
                  <svg
                    viewBox="0 0 32 24"
                    fill="none"
                  >
                    <path d="m11 6-6 6 6 6M21 6l6 6-6 6" />
                  </svg>
                </span>
              </span>
              <input
                v-model.number="position"
                class="comparison__range"
                type="range"
                min="0"
                max="100"
                aria-label="Межа між фото до та після"
                aria-describedby="comparison-help"
                :aria-valuetext="`${position}% фото до, ${100 - position}% фото після`"
              />
            </template>
          </div>
          <p
            class="visually-hidden"
            role="status"
            aria-live="polite"
          >
            Пара {{ selected + 1 }} з {{ beforeAfterPairs.length }}
          </p>
        </div>
      </div>
      <div
        ref="viewport"
        class="comparison__viewport"
        role="group"
        :class="{ 'comparison__viewport--ready': api }"
        aria-label="Роботи до та після грумінгу"
      >
        <div class="comparison__track">
          <div
            v-for="(pair, index) in beforeAfterPairs"
            :key="pair.id"
            class="comparison__slide"
          >
            <button
              type="button"
              class="comparison__thumbnail"
              :class="{ 'comparison__thumbnail--active': index === selected }"
              :aria-label="`Показати пару ${index + 1} до та після грумінгу`"
              :aria-pressed="index === selected"
              :disabled="!api"
              @click="api?.scrollTo(index, reduced)"
            >
              <ComparisonPhoto
                :id="pair.id"
                role="after"
                :width="pair.after.width"
                :height="pair.after.height"
                alt=""
                thumbnail
              />
              <span
                class="comparison__number"
                aria-hidden="true"
              >
                {{ String(index + 1).padStart(2, '0') }}
              </span>
            </button>
          </div>
        </div>
      </div>
      <div class="comparison__controls">
        <button
          type="button"
          aria-label="Попередня пара"
          :disabled="!api"
          @click="api?.scrollPrev(reduced)"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="m14 6-6 6 6 6" />
          </svg>
        </button>
        <div class="comparison__dots">
          <button
            v-for="index in visibleSnaps"
            :key="index"
            type="button"
            :aria-label="`Пара ${index + 1}`"
            :aria-current="index === selected ? 'true' : undefined"
            @click="api?.scrollTo(index, reduced)"
          >
            <span />
          </button>
        </div>
        <button
          type="button"
          aria-label="Наступна пара"
          :disabled="!api"
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
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import emblaCarouselVue from 'embla-carousel-vue';
import BaseContainer from '../ui/BaseContainer.vue';
import ComparisonPhoto from '../before-after/ComparisonPhoto.vue';
import { beforeAfterPairs } from '../../data/before-after';
import { useReducedMotion } from '../../composables/useReducedMotion';
import { useScrollReveal } from '../../composables/useScrollReveal';

const section = ref<HTMLElement | null>(null);
useScrollReveal(section);
const reduced = useReducedMotion();
const ready = ref(false);
const both = ref(true);
const position = ref(50);
const selected = ref(0);
const active = computed(() => beforeAfterPairs[selected.value] ?? beforeAfterPairs[0]);
const [viewport, api] = emblaCarouselVue(
  computed(() => ({
    align: 'center' as const,
    loop: true,
    skipSnaps: true,
    duration: reduced.value ? 0 : 35,
  })),
);
const visibleSnaps = computed(() => {
  const count = Math.min(5, beforeAfterPairs.length);
  const start = Math.max(0, Math.min(selected.value - 2, beforeAfterPairs.length - count));
  return Array.from({ length: count }, (_, index) => start + index);
});
const update = () => {
  selected.value = api.value?.selectedScrollSnap() ?? 0;
  position.value = 50;
};
watch(api, (value, previous) => {
  previous?.off('select', update).off('reInit', update);
  value?.on('select', update).on('reInit', update);
  update();
});
onMounted(() => {
  ready.value = true;
  both.value = false;
});
onBeforeUnmount(() => {
  api.value?.off('select', update).off('reInit', update);
});
</script>

<style scoped lang="scss">
@use '../../assets/styles/breakpoints' as bp;
.comparison {
  --surface: #f6f0e6;
  --text-primary: #29292b;
  --text-secondary: #57534d;
  --focus-ring: #a47a2c;
  padding-block: clamp(2rem, 3vw, 3rem);
  background: radial-gradient(ellipse at 15% 20%, #fffaf2, transparent 65%), var(--surface);
  color: var(--text-primary);
  color-scheme: light;
  overflow: clip;
  &__layout {
    display: grid;
    align-items: center;
    gap: 0.75rem;
    max-width: 68rem;
    margin-inline: auto;
    @include bp.medium {
      grid-template-columns: 0.9fr 1fr;
      gap: clamp(2rem, 5vw, 5rem);
    }
  }
  &__heading {
    text-align: center;
    @include bp.medium {
      text-align: left;
    }
  }
  &__eyebrow {
    margin: 0 0 0.6rem;
    color: var(--color-gold-ink);
    font-size: 1rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
  }
  &__title {
    margin: 0;
    font: 400 clamp(2.1rem, 4vw, 3.5rem)/1.05 var(--font-editorial);
    text-wrap: balance;
  }
  &__accent {
    display: block;
    width: min(75%, 18rem);
    height: 1.5rem;
    margin: 1rem auto;
    color: #bb963c;
    @include bp.medium {
      margin-inline: 0;
    }
  }
  &__intro {
    max-width: 32ch;
    margin: 1.25rem auto 0;
    font-size: 1.125rem;
    color: var(--text-secondary);
    @include bp.medium {
      margin-inline: 0;
    }
  }
  &__interaction {
    min-height: 7rem;
  }
  &__hint {
    margin: 1rem 0 0;
    font-size: 1rem;
    color: var(--text-secondary);
  }
  &__mode {
    margin-top: 0.75rem;
    padding: 0.5rem 0;
    min-height: 44px;
    border: 0;
    background: transparent;
    color: var(--color-gold-ink);
    text-decoration: underline;
    text-underline-offset: 0.3em;
    font: inherit;
  }
  &__viewer {
    min-width: 0;
    width: 100%;
    max-width: 30rem;
    margin-inline: auto;
  }
  &__frame {
    position: relative;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    border: 1px solid #c7a668;
    border-radius: 1rem;
    background: #e6dfd4;
    box-shadow: 0 12px 32px rgb(77 54 20 / 10%);
    &:has(:focus-visible) {
      outline: 2px solid var(--focus-ring);
      outline-offset: 4px;
    }
  }
  &__images {
    position: absolute;
    inset: 0;
  }
  &__photo {
    position: absolute;
    inset: 0;
    margin: 0;
  }
  &__frame--both &__images {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
  &__frame--both &__photo {
    position: relative;
    height: 100%;
    min-width: 0;
  }
  &__label {
    position: absolute;
    bottom: 0.8rem;
    z-index: 2;
    padding: 0.25rem 0.9rem;
    border: 1px solid #dfbf74;
    border-radius: 2rem;
    background: var(--button-gold-fill);
    color: #292215;
    font: italic 1.25rem/1.2 var(--font-editorial);
    pointer-events: none;
    &--before {
      left: 0.8rem;
    }
    &--after {
      right: 0.8rem;
    }
  }
  &__divider {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #ffe9b0;
    box-shadow: 0 0 8px rgb(80 55 20 / 40%);
    pointer-events: none;
  }
  &__handle {
    position: absolute;
    top: 50%;
    left: 50%;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    transform: translate(-50%, -50%);
    border: 1px solid #c7a668;
    border-radius: 50%;
    background: var(--button-gold-fill);
    & svg {
      width: 30px;
      stroke: #49391d;
      stroke-width: 1.5;
    }
  }
  &__range {
    position: absolute;
    inset: 0;
    z-index: 3;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: ew-resize;
    touch-action: pan-y;
  }
  &__viewport {
    margin-top: 1.5rem;
    overflow-x: auto;
    padding-block: 0.5rem;
    &--ready {
      overflow: hidden;
      touch-action: pan-y pinch-zoom;
    }
  }
  &__track {
    display: flex;
    align-items: center;
  }
  &__slide {
    flex: 0 0 29%;
    min-width: 0;
    padding-inline: 0.35rem;
    @include bp.medium {
      flex-basis: 18%;
    }
    @include bp.x-large {
      flex-basis: 13%;
    }
  }
  &__thumbnail {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 3 / 4;
    padding: 0;
    overflow: hidden;
    border: 1px solid #c7a668;
    border-radius: 0.65rem;
    background: #e6dfd4;
    transform: scale(0.92);
    opacity: 0.65;
    transition:
      transform 450ms ease,
      opacity 450ms ease,
      box-shadow 450ms ease;
    & :deep(img) {
      object-fit: cover;
    }
    &--active {
      transform: scale(1);
      opacity: 1;
      box-shadow: 0 0 0 2px #d3b261;
    }
  }
  &__number {
    position: absolute;
    bottom: 0.3rem;
    right: 0.3rem;
    padding: 0.1rem 0.4rem;
    border-radius: 1rem;
    background: rgb(41 41 43 / 80%);
    color: #ffe4a5;
    font-size: 0.875rem;
  }
  &__controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.65rem;
    margin-top: 0.75rem;
    & > button {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border: 1px solid #bb963c;
      border-radius: 50%;
      background: transparent;
      color: var(--color-gold-ink);
      & svg {
        width: 22px;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.4;
      }
    }
  }
  &__dots {
    display: flex;
    & button {
      display: grid;
      place-items: center;
      width: 30px;
      height: 44px;
      padding: 0;
      border: 0;
      background: transparent;
      & span {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #cdbb9c;
      }
      &[aria-current='true'] span {
        background: #8b6428;
      }
    }
  }
}
.comparison-change-enter-active,
.comparison-change-leave-active {
  transition: opacity 220ms ease;
}
.comparison-change-enter-from,
.comparison-change-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .comparison__thumbnail,
  .comparison-change-enter-active,
  .comparison-change-leave-active {
    transition: none;
  }
}
@media (forced-colors: active) {
  .comparison__divider,
  .comparison__dots button span {
    background: CanvasText;
  }
  .comparison__handle,
  .comparison__label {
    background: Canvas;
    color: CanvasText;
  }
}
</style>
