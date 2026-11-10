import { onBeforeUnmount, onMounted, watch, type Ref } from 'vue';
import { useReducedMotion } from './useReducedMotion';

/** Draw once, only when the whole heading is visible. No CSS hiding without JS. */
export function useStrokeReveal(
  root: Ref<HTMLElement | null>,
  headingSelector: string,
  pathSelector: string,
) {
  const reduced = useReducedMotion();
  let observer: IntersectionObserver | undefined;
  let played = false;
  const animations = new Set<Animation>();
  const clear = () => {
    observer?.disconnect();
    animations.forEach((animation) => animation.cancel());
    animations.clear();
  };
  const setup = () => {
    clear();
    const heading = root.value?.querySelector(headingSelector);
    if (!heading || reduced.value || played || !('IntersectionObserver' in window)) return;
    heading.querySelectorAll<SVGPathElement>(pathSelector).forEach((path) => {
      const animation = path.animate(
        [
          { strokeDasharray: '1', strokeDashoffset: '1' },
          { strokeDasharray: '1', strokeDashoffset: '0' },
        ],
        { duration: 1200, delay: 250, easing: 'ease-in-out', fill: 'both' },
      );
      animation.pause();
      animations.add(animation);
      animation.onfinish = () => {
        animation.cancel();
        animations.delete(animation);
      };
    });
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 1)) return;
        played = true;
        observer?.disconnect();
        animations.forEach((animation) => animation.play());
      },
      { threshold: 1, rootMargin: '0px 0px -24px 0px' },
    );
    observer.observe(heading);
  };
  onMounted(setup);
  watch(reduced, setup);
  onBeforeUnmount(clear);
}
