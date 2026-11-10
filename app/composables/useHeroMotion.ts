import { onBeforeUnmount, watch, type Ref } from 'vue';
import { useReducedMotion } from './useReducedMotion';

/** SSR stays visible; optional motion owns only this Hero and its sibling header. */
export function useHeroMotion(root: Ref<HTMLElement | null>) {
  const reduced = useReducedMotion();
  let loading = false;
  let disposed = false;
  let media: gsap.MatchMedia | undefined;
  let entrancePlayed = false;

  watch(reduced, async (isReduced) => {
    if (isReduced || media || loading) return;
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
        '(prefers-reduced-motion: no-preference)',
        () => {
          if (entrancePlayed) return;
          entrancePlayed = true;
          // Do not replay a loading sequence when restoring a deep section link.
          if (element.getBoundingClientRect().bottom <= 0) return;
          const mobile = !window.matchMedia('(min-width: 1200px)').matches;
          const header = element.closest('.home-page')?.querySelector('.site-header__inner');
          const timeline = gsap.timeline({ defaults: { ease: 'sine.out' } });
          timeline.from(select('.hero__light'), { opacity: 0, duration: 1.2 }, 0);
          if (header) timeline.from(header, { opacity: 0, y: -12, duration: 1 }, 0);
          timeline
            .from(select('.hero__eyebrow'), { opacity: 0, y: 16, duration: 1.25 }, 0.2)
            .from(
              select('.hero__letter'),
              { opacity: 0, y: 18, duration: 0.95, stagger: 0.17 },
              0.45,
            )
            .from(select('.hero__divider'), { scaleX: 0, duration: 1.4 }, 1)
            // Only the transparent foreground moves; the interior is a static sibling.
            .from(
              select('.hero__image'),
              {
                opacity: 0,
                scale: 1,
                y: mobile ? 16 : 35,
                transformOrigin: '75% 65%',
                duration: 2,
              },
              0.55,
            )
            .from(select('.hero__description'), { opacity: 0, y: 18, duration: 1.5 }, 1.15)
            .from(select('.hero__lead'), { opacity: 0, y: 12, duration: 1.2 }, 1.55)
            .from(
              select('.hero__ribbon path, .hero__left-waves path'),
              {
                strokeDasharray: 1,
                strokeDashoffset: 1,
                opacity: 0,
                duration: 1.7,
              },
              1.3,
            )
            .from(select('.hero__left-waves ellipse'), { opacity: 0, duration: 1.6 }, 1.5)
            .from(
              select('.hero__particles i'),
              {
                opacity: 0,
                y: 6,
                duration: 1.1,
                stagger: 0.1,
              },
              1.65,
            )
            .from(
              select('.hero__value'),
              {
                opacity: 0,
                y: 12,
                duration: 1.1,
                stagger: 0.16,
              },
              1.9,
            );
          // Keyboard users must never land on a temporarily transparent control.
          const finish = () => timeline.progress(1);
          element.addEventListener('focusin', finish);
          header?.addEventListener('focusin', finish);
          return () => {
            element.removeEventListener('focusin', finish);
            header?.removeEventListener('focusin', finish);
          };
        },
        element,
      );

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
    media?.revert();
  });
}
