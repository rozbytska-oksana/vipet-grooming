import { onBeforeUnmount, onMounted, ref } from 'vue';

export function useReducedMotion() {
  const reduced = ref(true);
  let query: MediaQueryList | undefined;
  const update = () => {
    reduced.value = query?.matches ?? true;
  };
  onMounted(() => {
    query = window.matchMedia('(prefers-reduced-motion: reduce)');
    update();
    query.addEventListener('change', update);
  });
  onBeforeUnmount(() => query?.removeEventListener('change', update));
  return reduced;
}
