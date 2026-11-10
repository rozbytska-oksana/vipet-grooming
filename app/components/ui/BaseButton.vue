<template>
  <a
    v-if="href && !disabled"
    :href="href"
    class="base-button"
    :class="[`base-button--${variant}`, { 'is-shimmering': isShimmering }]"
    @mouseenter="startShimmer"
    @animationend="onAnimationEnd"
  >
    <span class="base-button__label">
      <slot />
    </span>
  </a>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    class="base-button"
    :class="[`base-button--${variant}`, { 'is-shimmering': isShimmering }]"
    @mouseenter="startShimmer"
    @animationend="onAnimationEnd"
  >
    <span class="base-button__label">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

withDefaults(
  defineProps<{
    href?: string;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
  }>(),
  {
    href: undefined,
    type: 'button',
    variant: 'primary',
    disabled: false,
  },
);

// Анімація запускається при наведенні й завжди доходить до кінця,
// навіть якщо курсор уже пішов: так перелив ніколи не біжить назад.
const isShimmering = ref(false);

function startShimmer(event: MouseEvent) {
  if (isShimmering.value) return;
  if ((event.currentTarget as HTMLElement).matches(':disabled')) return;
  isShimmering.value = true;
}

function onAnimationEnd(event: AnimationEvent) {
  if (event.animationName.includes('button-shimmer')) {
    isShimmering.value = false;
  }
}
</script>

<style scoped lang="scss">
.base-button {
  // Градієнт періодичний: початок і кінець однакові,
  // тому після анімації кнопка повертається у вихідний вигляд непомітно.
  --gold-flow: var(--button-gold-flow);
  --shimmer-duration: 1.1s;

  position: relative;
  isolation: isolate;
  display: inline-flex;
  min-height: 56px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0.875rem 2rem;
  border: 1px solid transparent;
  border-radius: var(--radius-button);
  font-family: var(--font-editorial);
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.1;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition:
    border-color var(--motion-micro),
    background-color var(--motion-micro),
    box-shadow 0.4s ease;

  &__label {
    position: relative;
    z-index: 1;
  }

  &--primary {
    border-color: #e3c373;
    background: var(--gold-flow);
    background-position: 0 0;
    background-size: 200% 100%;
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 55%),
      inset 0 -1px 0 rgb(120 80 20 / 25%),
      0 4px 14px rgb(201 154 67 / 22%);
    color: var(--color-black);

    &::before {
      position: absolute;
      z-index: 0;
      inset: -50% auto -50% -60%;
      width: 40%;
      transform: translateX(0) skewX(-20deg);
      background: linear-gradient(90deg, transparent, rgb(255 255 255 / 50%), transparent);
      content: '';
      opacity: 0;
      pointer-events: none;
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover:not(:disabled) {
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 60%),
          inset 0 -1px 0 rgb(120 80 20 / 25%),
          0 6px 22px rgb(212 175 95 / 40%);
      }
    }

    @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
      &.is-shimmering {
        animation: button-gold-flow var(--shimmer-duration) cubic-bezier(0.4, 0, 0.2, 1) both;

        &::before {
          animation: button-shimmer var(--shimmer-duration) cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      }
    }

    &:focus-visible {
      outline: 2px solid #fff0b5;
      outline-offset: 3px;
    }
  }

  &--secondary {
    border-color: var(--border-control);
    background: transparent;
    color: var(--text-primary);

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        border-color: var(--color-gold);
        background: rgb(199 166 104 / 8%);
      }
    }
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
}

// Золото тече тільки зліва направо
@keyframes button-gold-flow {
  from {
    background-position: 100% 0;
  }

  to {
    background-position: 0 0;
  }
}

// Блік проходить зліва направо й плавно зникає
@keyframes button-shimmer {
  0% {
    transform: translateX(0) skewX(-20deg);
    opacity: 0;
  }

  15% {
    opacity: 1;
  }

  75% {
    opacity: 1;
  }

  100% {
    transform: translateX(650%) skewX(-20deg);
    opacity: 0;
  }
}
</style>
