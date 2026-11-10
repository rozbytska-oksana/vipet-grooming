<template>
  <section
    id="certificates"
    class="certificates"
    aria-labelledby="certificates-title"
  >
    <h2
      id="certificates-title"
      class="certificates__title"
    >
      Професійний розвиток
      <BaseIcon name="paw" />
    </h2>
    <div
      ref="viewport"
      class="certificates__viewport"
      :class="{ 'certificates__viewport--ready': api }"
    >
      <div class="certificates__track">
        <figure
          v-for="(item, index) in certificates"
          :key="item.id"
          class="certificates__slide"
          :class="{
            'certificates__slide--landscape': item.width > item.height,
            'certificates__slide--active': selected === index,
          }"
        >
          <a
            :href="`${baseURL}${item.fullSrc}`"
            class="certificates__frame"
            :aria-label="`Збільшити: ${item.caption}`"
            @click="open($event, item)"
          >
            <picture>
              <source
                type="image/avif"
                :srcset="sources(item.id, 'avif')"
                :sizes="sizes"
              />
              <source
                type="image/webp"
                :srcset="sources(item.id, 'webp')"
                :sizes="sizes"
              />
              <img
                :src="`${baseURL}${item.src}`"
                :alt="item.alt"
                :width="item.width"
                :height="item.height"
                loading="lazy"
                fetchpriority="low"
                decoding="async"
              />
            </picture>
          </a>
        </figure>
      </div>
    </div>
    <div
      class="certificates__controls"
      aria-label="Керування сертифікатами"
    >
      <button
        type="button"
        aria-label="Попередні сертифікати"
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
      <div
        class="certificates__dots"
        aria-label="Оберіть сертифікат"
      >
        <button
          v-for="(_, index) in snaps"
          :key="index"
          type="button"
          :aria-label="`Сертифікат ${index + 1}`"
          :aria-current="selected === index ? 'true' : undefined"
          @click="api?.scrollTo(index, reduced)"
        >
          <span />
        </button>
      </div>
      <button
        type="button"
        aria-label="Наступні сертифікати"
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
    <dialog
      ref="dialog"
      class="certificates__dialog"
      :aria-label="active?.caption || 'Сертифікат'"
      @cancel.prevent="close"
      @close="restore"
      @click="backdrop"
      @keydown.left.prevent="navigate(-1)"
      @keydown.right.prevent="navigate(1)"
    >
      <button
        ref="closeButton"
        class="certificates__close"
        type="button"
        aria-label="Закрити сертифікат"
        @click="close"
      >
        <BaseIcon name="close" />
      </button>
      <button
        class="certificates__modal-nav certificates__modal-nav--previous"
        type="button"
        aria-label="Попередній сертифікат"
        @click="navigate(-1)"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="m14 6-6 6 6 6" />
        </svg>
      </button>
      <button
        class="certificates__modal-nav certificates__modal-nav--next"
        type="button"
        aria-label="Наступний сертифікат"
        @click="navigate(1)"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="m10 6 6 6-6 6" />
        </svg>
      </button>
      <figure
        v-if="active"
        class="certificates__expanded"
      >
        <img
          :src="`${baseURL}${active.fullSrc}`"
          :alt="active.alt"
          :width="active.width"
          :height="active.height"
        />
      </figure>
    </dialog>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import emblaCarouselVue from 'embla-carousel-vue';
import BaseIcon from '../ui/BaseIcon.vue';
import { certificates } from '../../data/certificates';
import type { MediaItem } from '../../types/content';
import { useReducedMotion } from '../../composables/useReducedMotion';
const baseURL = useRuntimeConfig().app.baseURL;
const reduced = useReducedMotion();
const [viewport, api] = emblaCarouselVue(
  computed(() => ({
    align: 'center' as const,
    startIndex: 0,
    loop: true,
    skipSnaps: true,
    dragFree: false,
    duration: reduced.value ? 0 : 35,
  })),
);
const selected = ref(0),
  snaps = ref<number[]>([]),
  canPrevious = ref(false),
  canNext = ref(false);
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
const sizes = '(min-width: 1200px) 15vw, (min-width: 768px) 34vw, 68vw';
const sources = (id: string, format: string) =>
  [480, 960].map((w) => `${baseURL}images/certificates/${id}-${w}.${format} ${w}w`).join(', ');
const dialog = ref<HTMLDialogElement | null>(null),
  closeButton = ref<HTMLButtonElement | null>(null);
const active = ref<MediaItem | null>(null);
let trigger: HTMLElement | null = null,
  animation: Animation | null = null,
  disposed = false,
  closing = false;
let previousOverflow = '';
const restore = () => {
  document.body.style.overflow = previousOverflow;
  trigger?.focus({ preventScroll: true });
  trigger = null;
  closing = false;
};
const open = async (event: MouseEvent, item: MediaItem) => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !dialog.value) return;
  event.preventDefault();
  if (dialog.value.open) return;
  trigger = event.currentTarget as HTMLElement;
  const origin = trigger.getBoundingClientRect();
  active.value = item;
  await nextTick();
  if (disposed || !dialog.value) return;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  dialog.value.showModal();
  closeButton.value?.focus({ preventScroll: true });
  const target = dialog.value.getBoundingClientRect();
  if (!reduced.value)
    animation = dialog.value.animate(
      [
        {
          opacity: 0,
          transform: `translate(${origin.x + origin.width / 2 - target.x - target.width / 2}px, ${origin.y + origin.height / 2 - target.y - target.height / 2}px) scale(.3)`,
        },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 560, easing: 'cubic-bezier(.22,1,.36,1)' },
    );
};
const navigate = (direction: number) => {
  if (!active.value || closing) return;
  const index = certificates.findIndex((item) => item.id === active.value?.id);
  const nextIndex = (index + direction + certificates.length) % certificates.length;
  active.value = certificates[nextIndex] ?? null;
  api.value?.scrollTo(nextIndex, reduced.value);
};
const close = async () => {
  if (!dialog.value?.open || closing) return;
  closing = true;
  animation?.cancel();
  if (!reduced.value) {
    animation = dialog.value.animate(
      [
        { opacity: 1, transform: 'none' },
        { opacity: 0, transform: 'translateY(12px) scale(.96)' },
      ],
      { duration: 230, easing: 'ease-in', fill: 'forwards' },
    );
    await animation.finished.catch(() => {});
  }
  dialog.value?.close();
  animation?.cancel();
};
const backdrop = (event: MouseEvent) => {
  if (!dialog.value || event.target !== dialog.value) return;
  const r = dialog.value.getBoundingClientRect();
  if (
    event.clientX < r.left ||
    event.clientX > r.right ||
    event.clientY < r.top ||
    event.clientY > r.bottom
  )
    void close();
};
watch(reduced, (value) => {
  if (value) animation?.finish();
});
onBeforeUnmount(() => {
  disposed = true;
  animation?.cancel();
  if (dialog.value?.open) {
    dialog.value.close();
    restore();
  }
  api.value?.off('select', update).off('reInit', update);
});
</script>

<style scoped lang="scss">
@use '../../assets/styles/breakpoints' as bp;
.certificates {
  min-width: 0;
  &__title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0 0 1.5rem;
    font: 400 clamp(1.75rem, 2.3vw, 2.5rem)/1.1 var(--font-editorial);
  }
  &__title svg {
    width: 28px;
    height: 28px;
    color: var(--color-gold-highlight);
  }
  &__viewport {
    overflow-x: auto;
    padding: 32px 0;
    margin: -16px 0 -20px;
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
    flex: 0 0 62%;
    min-width: 0;
    margin: 0 0.75rem 0 0;
    @include bp.medium {
      flex-basis: calc((100% - 1.5rem) / 3);
    }
    &--active {
      position: relative;
      z-index: 1;
      .certificates__frame {
        transform: scale(1.1);
        @media (prefers-reduced-motion: reduce) {
          transform: none;
        }
      }
    }
  }
  &__frame {
    display: block;
    width: 100%;
    margin-inline: auto;
    transform: scale(0.98);
    transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
    @media (prefers-reduced-motion: reduce) {
      transform: none;
      transition: none;
    }
    padding: 3px;
    border-radius: 12px;
    background: linear-gradient(135deg, #b28435, #fff0b9 24%, #c49845 47%, #f5dda1 75%, #99702c);
    box-shadow: 0 9px 22px #0005;
  }
  &__frame picture {
    display: block;
    border: 1px solid #866127;
    border-radius: 8px;
    overflow: hidden;
  }
  &__frame img {
    display: block;
    width: 100%;
    height: auto;
  }
  &__controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
    color: var(--color-gold-highlight);
  }
  &__controls button,
  &__close,
  &__modal-nav {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 1px solid var(--color-gold);
    border-radius: 50%;
    background: #29292b;
    color: var(--color-gold-highlight);
  }
  &__controls button:disabled {
    opacity: 0.35;
  }
  &__controls svg,
  &__close svg,
  &__modal-nav svg {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
  }
  &__dialog {
    width: max-content;
    max-width: calc(100vw - 2rem);
    max-height: calc(100dvh - 2rem);
    padding: 0;
    overflow: visible;
    border: 3px solid #e6c476;
    border-radius: 6px;
    background: #29292b;
    color: var(--color-ivory);
    box-shadow:
      inset 0 0 0 2px #795d2b,
      0 24px 80px #0008;
  }
  &__dialog::backdrop {
    background: rgb(10 10 12 / 85%);
  }
  &__close {
    position: absolute;
    z-index: 1;
    top: 0.5rem;
    right: 0.5rem;
    background: rgb(25 25 27 / 90%);
  }
  &__modal-nav {
    position: absolute;
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
    background: rgb(25 25 27 / 90%);
    &--previous {
      left: 0.5rem;
    }
    &--next {
      right: 0.5rem;
    }
  }
  &__expanded {
    margin: 0;
    text-align: center;
  }
  &__expanded img {
    display: block;
    width: auto;
    height: auto;
    max-width: calc(100vw - 2rem - 6px);
    max-height: calc(100dvh - 2rem - 6px);
    border-radius: 3px;
  }
  &__dots {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  &__dots button {
    width: 24px;
    height: 44px;
    border: 0;
    background: transparent;
    padding: 0;
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
    box-shadow: 0 0 8px #e6c47666;
  }
}
</style>
