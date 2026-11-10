<template>
  <div
    ref="element"
    class="base-stat"
  >
    <div
      class="base-stat__value"
      aria-hidden="true"
    >
      <slot name="before" />
      <span
        class="base-stat__number"
        :data-final="statistic.value + statistic.suffix"
      >
        <span>{{ displayed }}{{ statistic.suffix }}</span>
      </span>
      <slot name="after" />
    </div>
    <span class="visually-hidden">{{ statistic.value }}{{ statistic.suffix }}</span>
    <span class="base-stat__label">{{ statistic.label }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Statistic } from '../../types/content';
import { useCountUp } from '../../composables/useCountUp';
const props = defineProps<{ statistic: Statistic }>();
const element = ref<HTMLElement | null>(null);
const displayed = useCountUp(element, props.statistic.value);
</script>

<style scoped lang="scss">
.base-stat {
  display: grid;
  text-align: center;
  &__value {
    display: grid;
    grid-template-columns: auto max-content auto;
    justify-content: center;
    align-items: center;
    gap: clamp(0.125rem, 1cqi, 0.25rem);
  }
  &__number {
    display: grid;
    white-space: nowrap;
    color: var(--color-gold-highlight);
    font: 500 3.25rem/1.1 var(--font-editorial);
    font-variant-numeric: tabular-nums;
  }
  &__number::before {
    content: attr(data-final);
    visibility: hidden;
    grid-area: 1 / 1;
  }
  &__number > span {
    grid-area: 1 / 1;
  }
  &__label {
    font-size: 1rem;
  }
}
</style>
