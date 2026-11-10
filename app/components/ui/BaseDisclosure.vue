<template>
  <details
    ref="details"
    class="base-disclosure"
  >
    <summary @click="toggle"><slot name="summary" /></summary>
    <div
      ref="content"
      class="base-disclosure__content"
    >
      <slot />
    </div>
  </details>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useExpandMotion } from '../../composables/useExpandMotion';
const details = ref<HTMLDetailsElement | null>(null);
const content = ref<HTMLElement | null>(null);
const motion = useExpandMotion();
let intendedOpen: boolean | undefined;
const toggle = (event: MouseEvent) => {
  if (!details.value || !content.value) return;
  event.preventDefault();
  const target = details.value;
  const body = content.value;
  const opening = !(intendedOpen ?? target.open);
  const from = target.open ? body.getBoundingClientRect().height : 0;
  intendedOpen = opening;
  motion.cancel(body);
  if (opening) target.open = true;
  body.inert = !opening;
  motion.animate(body, from, opening ? body.scrollHeight : 0, () => {
    target.open = opening;
    body.inert = false;
    intendedOpen = undefined;
  });
};
</script>

<style scoped lang="scss">
.base-disclosure__content {
  overflow: hidden;
}
</style>
