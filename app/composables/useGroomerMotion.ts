import { onBeforeUnmount, onMounted, watch, type Ref } from 'vue';
import { useReducedMotion } from './useReducedMotion';

/** Two independent visibility triggers keep the signature on screen on mobile. */
export function useGroomerMotion(root: Ref<HTMLElement | null>) {
  const reduced = useReducedMotion();
  let dispose = () => {};
  let version = 0;
  const seen = new WeakSet<Element>();
  const setup = async () => {
    const current = ++version;
    dispose();
    if (reduced.value || !root.value || !('IntersectionObserver' in window)) return;
    try {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (current !== version || !root.value || reduced.value) return;
      gsap.registerPlugin(ScrollTrigger);
      const observers: IntersectionObserver[] = [];
      const timelines: gsap.core.Timeline[] = [];
      const media = gsap.matchMedia();
      const context = gsap.context(() => {
        media.add(
          { desktop: '(min-width: 1200px)', motion: '(prefers-reduced-motion: no-preference)' },
          (match) => {
            if (!match.conditions?.motion) return;
            const portrait = root.value?.querySelector('.groomer__portrait');
            const floating = root.value?.querySelector('.groomer__float');
            const visual = root.value?.querySelector('.groomer__visual');
            // Entrance and scroll transforms belong to separate nested elements.
            const distance = match.conditions?.desktop ? 18 : 8;
            const parallax =
              floating && visual
                ? gsap.fromTo(
                    floating,
                    { y: distance },
                    {
                      y: -distance,
                      ease: 'none',
                      scrollTrigger: {
                        trigger: visual,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 0.65,
                        invalidateOnRefresh: true,
                      },
                    },
                  )
                : undefined;
            const paw = root.value?.querySelector('.groomer__paw');
            const copy = root.value?.querySelectorAll('[data-groomer-copy]');
            const signature = root.value?.querySelector('.groomer__signature');
            const observe = (element: Element, timeline: gsap.core.Timeline, threshold: number) => {
              timelines.push(timeline);
              const observer = new IntersectionObserver(
                (entries) => {
                  if (
                    !entries.some(
                      (entry) => entry.isIntersecting && entry.intersectionRatio >= threshold,
                    )
                  )
                    return;
                  seen.add(element);
                  observer.disconnect();
                  timeline.play();
                },
                { threshold },
              );
              observers.push(observer);
              observer.observe(element);
            };
            // Never hide content already painted, including restored anchor positions.
            const belowFold = (element: Element) =>
              !seen.has(element) && element.getBoundingClientRect().top >= window.innerHeight;
            if (portrait && belowFold(portrait)) {
              const timeline = gsap.timeline({ paused: true });
              if (paw) timeline.from(paw, { opacity: 0, duration: 1.35 }, 0);
              timeline.from(
                portrait,
                {
                  opacity: 0,
                  y: match.conditions?.desktop ? 45 : 12,
                  scale: match.conditions?.desktop ? 1.025 : 1,
                  duration: 1.1,
                  ease: 'power2.out',
                },
                0.1,
              );
              observe(portrait, timeline, 0.2);
            }
            copy?.forEach((element, index) => {
              if (!belowFold(element)) return;
              const timeline = gsap.timeline({ paused: true }).from(element, {
                opacity: 0,
                y: 12,
                duration: 0.8,
                delay: index * 0.08,
                ease: 'power2.out',
              });
              observe(element, timeline, 0.2);
            });
            if (signature && belowFold(signature)) {
              const paths = signature.querySelectorAll('[data-signature-stroke]');
              const timeline = gsap
                .timeline({ paused: true })
                .fromTo(
                  paths,
                  { strokeDasharray: 1, strokeDashoffset: 1 },
                  { strokeDashoffset: 0, duration: 0.6, stagger: 0.12, ease: 'power1.inOut' },
                  1.15,
                );
              observe(signature, timeline, 1);
            }
            return () => {
              parallax?.scrollTrigger?.kill();
              parallax?.kill();
              observers.forEach((observer) => observer.disconnect());
              timelines.forEach((timeline) => timeline.kill());
            };
          },
        );
      }, root.value);
      dispose = () => {
        observers.forEach((observer) => observer.disconnect());
        media.revert();
        context.revert();
      };
    } catch {
      // SSR content stays visible when animation resources cannot load.
    }
  };
  onMounted(setup);
  watch(reduced, setup);
  onBeforeUnmount(() => {
    version++;
    dispose();
  });
}
