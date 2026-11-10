import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import { useReducedMotion } from './useReducedMotion';

/** CSS owns entrance from first paint; GSAP owns desktop scroll transforms. */
export function useHeroMotion(root: Ref<HTMLElement | null>) {
  const reduced = useReducedMotion();
  const desktop = ref(false);
  let viewport: MediaQueryList | undefined;
  const updateViewport = () => {
    desktop.value = viewport?.matches ?? false;
  };
  onMounted(() => {
    viewport = window.matchMedia('(min-width: 1200px)');
    updateViewport();
    viewport.addEventListener('change', updateViewport);
  });
  let loading = false;
  let disposed = false;
  let media: gsap.MatchMedia | undefined;

  watch([reduced, desktop], async ([isReduced, isDesktop]) => {
    if (isReduced || !isDesktop || media || loading) return;
    loading = true;
    try {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (disposed || !root.value) return;
      gsap.registerPlugin(ScrollTrigger);
      const element = root.value;
      const select = gsap.utils.selector(element);
      media = gsap.matchMedia();

      media.add(
        '(min-width: 1200px) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: element,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
              defaults: { ease: 'none' },
            })
            // Separate wrappers keep entrance and scroll transforms independent.
            .to(select('.hero__picture'), { y: 22, duration: 1 }, 0)
            .to(select('.hero__ribbon'), { y: 10, duration: 1 }, 0)
            .to(select('.hero__intro'), { y: -14, opacity: 0.25, duration: 0.4 }, 0.6);
        },
        element,
      );
    } catch {
      media?.revert();
    } finally {
      loading = false;
    }
  });

  onBeforeUnmount(() => {
    disposed = true;
    viewport?.removeEventListener('change', updateViewport);
    media?.revert();
  });
}
