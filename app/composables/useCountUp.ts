import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import { useReducedMotion } from './useReducedMotion';

export function useCountUp(root: Ref<HTMLElement | null>, value: number) {
  const displayed = ref(value);
  const reduced = useReducedMotion();
  let observer: IntersectionObserver | undefined;
  let frame = 0;
  let played = false;
  const finish = () => {
    cancelAnimationFrame(frame);
    displayed.value = value;
    observer?.disconnect();
  };
  const start = () => {
    if (played || reduced.value) return;
    played = true;
    const started = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - started) / 1800, 1);
      displayed.value = Math.round(value * (1 - (1 - progress) ** 3));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    displayed.value = 0;
    frame = requestAnimationFrame(tick);
  };
  const onVisibility = () => {
    if (document.hidden) finish();
  };
  onMounted(() => {
    if (root.value && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.3)) {
            start();
            if (played) observer?.disconnect();
          }
        },
        { threshold: 0.3 },
      );
      observer.observe(root.value);
    }
    document.addEventListener('visibilitychange', onVisibility);
  });
  watch(reduced, (value) => {
    if (value) finish();
  });
  onBeforeUnmount(() => {
    finish();
    document.removeEventListener('visibilitychange', onVisibility);
  });
  return displayed;
}
