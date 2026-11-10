<template>
  <div
    class="pet-toggle"
    :class="{ 'pet-toggle--cat': model === 'cat' }"
  >
    <label
      v-for="pet in options"
      :key="pet.id"
      class="pet-toggle__option"
    >
      <input
        v-model="model"
        type="radio"
        :name="name"
        :value="pet.id"
        @change="emit('change')"
      />
      <span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.4"
          aria-hidden="true"
        >
          <path
            :d="pet.path"
            stroke-linejoin="round"
          />
        </svg>
        {{ pet.label }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import type { PetType } from '../../types/content';
defineProps<{ name: string }>();
const model = defineModel<PetType>({ required: true });
const emit = defineEmits<{ change: [] }>();
const options = [
  { id: 'dog', label: 'Собака', path: 'M6 4 3 3 2 9l4 2v8h4v-5h4v5h4v-8l4-2-1-6-3 1-3 3H9Z' },
  { id: 'cat', label: 'Кіт', path: 'M5 9V3l6 4h2l6-4v6a8 8 0 1 1-14 0Zm3 4h1m6 0h1m-5 3h2' },
] as const;
</script>

<style scoped lang="scss">
.pet-toggle {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  border: 1px solid var(--border-control);
  border-radius: 0.85rem;
  background: #3a3a3b;
  color: var(--color-ivory);

  &::before {
    position: absolute;
    z-index: 0;
    inset: 2px auto 2px 2px;
    width: calc(50% - 2px);
    border-radius: 0.7rem;
    background: var(--button-gold-flow);
    background-size: 200% 100%;
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 55%),
      inset 0 -1px 0 rgb(120 80 20 / 25%);
    pointer-events: none;
    content: '';
  }

  &--cat::before {
    transform: translateX(100%);
  }

  &__option {
    position: relative;
    z-index: 1;
    cursor: pointer;

    & input {
      position: absolute;
      width: 1px;
      height: 1px;
      opacity: 0;
    }

    & span {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.35rem;
      min-height: 50px;
      padding: 0.5rem 0.35rem;
      border-radius: 0.75rem;
    }

    & svg {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }
    & input:checked + span {
      color: #211d14;
    }
    & input:focus-visible + span {
      outline: 2px solid var(--color-gold-highlight);
      outline-offset: -4px;
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    &::before {
      transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
    }
  }

  @media (forced-colors: active) {
    &::before {
      display: none;
    }
    &__option input:checked + span {
      outline: 2px solid Highlight;
      outline-offset: -4px;
    }
  }
}
</style>
