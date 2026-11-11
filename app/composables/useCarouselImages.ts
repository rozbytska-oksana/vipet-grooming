import { onBeforeUnmount, onMounted, type Ref } from 'vue';

/** Prepare responsive previews before their carousel enters the viewport. */
export function useCarouselImages(viewport: Ref<HTMLElement | null | undefined>) {
  let observer: IntersectionObserver | undefined;
  let idle: number | undefined;
  let disposed = false;

  const prepare = () => {
    const images = Array.from(viewport.value?.querySelectorAll('img') ?? []);
    images.forEach((image) => {
      image.loading = 'eager';
    });
    let index = 0;
    const decodeNext = () => {
      if (disposed || index >= images.length) return;
      const image = images[index++];
      const decode = async () => {
        if (disposed) return;
        try {
          await image?.decode();
        } catch {
          // A failed preview keeps its native image fallback and can be retried.
        }
        decodeNext();
      };
      if (typeof window.requestIdleCallback === 'function') {
        idle = window.requestIdleCallback(() => void decode(), { timeout: 1000 });
      } else {
        idle = window.setTimeout(() => void decode(), 32);
      }
    };
    decodeNext();
  };

  onMounted(() => {
    if (!viewport.value || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer?.disconnect();
        prepare();
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(viewport.value);
  });

  onBeforeUnmount(() => {
    disposed = true;
    observer?.disconnect();
    if (idle === undefined) return;
    if (typeof window.requestIdleCallback === 'function') window.cancelIdleCallback(idle);
    else window.clearTimeout(idle);
  });
}
