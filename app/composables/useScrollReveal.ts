import { onBeforeUnmount, onMounted, watch, type Ref } from 'vue';
import { useReducedMotion } from './useReducedMotion';

export function useScrollReveal(
  root: Ref<HTMLElement | null>,
  options: { duration?: number; fromOpacity?: number; easing?: string } = {},
) {
  const reduced = useReducedMotion();
  let observer: IntersectionObserver | undefined;
  const animations = new Set<Animation>();
  const seen = new WeakSet<Element>();
  const clear = () => {
    observer?.disconnect();
    animations.forEach((animation) => animation.cancel());
    animations.clear();
  };
  const setup = () => {
    clear();
    if (reduced.value || !root.value || !('IntersectionObserver' in window)) return;
    const pending = new Map<Element, Animation>();
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const animation = pending.get(entry.target);
          if (!animation) return;
          pending.delete(entry.target);
          seen.add(entry.target);
          observer?.unobserve(entry.target);
          animation.play();
        });
      },
      { threshold: 0, rootMargin: '0px 0px 48px 0px' },
    );
    root.value.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
      if (seen.has(element)) return;
      // Already painted content (including restored anchors) must never disappear.
      if (element.getBoundingClientRect().top < window.innerHeight) {
        seen.add(element);
        return;
      }
      // Prepare below-fold elements before scrolling can expose them. Waiting for
      // the observer callback to apply opacity causes a visible → hidden flash.
      const animation = element.animate(
        [
          { transform: 'translateY(16px)', opacity: options.fromOpacity ?? 0.55 },
          { transform: 'translateY(0)', opacity: 1 },
        ],
        {
          duration: options.duration ?? 700,
          delay: Number(element.dataset.revealDelay ?? 0),
          easing: options.easing ?? 'cubic-bezier(.22,1,.36,1)',
          fill: 'both',
        },
      );
      const finishOnFocus = () => {
        pending.delete(element);
        seen.add(element);
        observer?.unobserve(element);
        animation.finish();
      };
      element.addEventListener('focusin', finishOnFocus);
      animation.oncancel = () => element.removeEventListener('focusin', finishOnFocus);
      animation.pause();
      animations.add(animation);
      pending.set(element, animation);
      animation.onfinish = () => {
        animation.cancel();
        animations.delete(animation);
      };
      observer?.observe(element);
    });
  };
  onMounted(setup);
  watch(reduced, setup);
  onBeforeUnmount(clear);
}
