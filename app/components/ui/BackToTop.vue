<template>
  <Transition name="back-to-top">
    <button
      v-if="visible"
      class="back-to-top"
      type="button"
      aria-label="Повернутися на початок сторінки"
      @click="scrollToTop"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5m-6 6 6-6 6 6" />
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useReducedMotion } from '../../composables/useReducedMotion';
const reduced = useReducedMotion();
const visible = ref(false);
let frame = 0;
const update = () => {
  frame = 0;
  visible.value = window.scrollY > Math.max(480, window.innerHeight * 0.85);
};
const schedule = () => {
  if (!frame) frame = window.requestAnimationFrame(update);
};
const scrollToTop = () => {
  document.getElementById('main-content')?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: reduced.value ? 'instant' : 'smooth' });
};
onMounted(() => {
  update();
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', schedule);
  window.removeEventListener('resize', schedule);
  window.cancelAnimationFrame(frame);
});
</script>

<style scoped lang="scss">
.back-to-top {
  position: fixed;
  z-index: 20;
  right: calc(1rem + env(safe-area-inset-right, 0px));
  bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 1px solid #a98b51;
  border-radius: 50%;
  background: #252527;
  color: var(--color-gold-highlight);
  box-shadow: 0 4px 18px #0003;
  svg {
    width: 24px;
    height: 24px;
  }
  &-enter-active,
  &-leave-active {
    transition:
      opacity 250ms ease,
      transform 250ms ease;
  }
  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateY(8px);
  }
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: #343436;
      border-color: var(--color-gold-highlight);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    &-enter-active,
    &-leave-active {
      transition: none;
    }
    &-enter-from,
    &-leave-to {
      transform: none;
    }
  }
  :global(body:has(dialog[open])) & {
    visibility: hidden;
  }
  @media (forced-colors: active) {
    border-color: ButtonText;
  }
}
</style>
