import { onBeforeUnmount, watch } from 'vue';
import { useReducedMotion } from './useReducedMotion';

/** Height transitions are limited to explicit disclosure interactions. */
export function useExpandMotion() {
  const reduced = useReducedMotion();
  const running = new Map<HTMLElement, Animation>();
  const cancel = (element: HTMLElement) => {
    running.get(element)?.cancel();
    running.delete(element);
  };
  const animate = (element: HTMLElement, from: number, to: number, done: () => void) => {
    cancel(element);
    if (reduced.value || !element.animate) {
      done();
      return;
    }
    const animation = element.animate(
      [
        { height: `${from}px`, opacity: from === 0 ? 0 : 1 },
        { height: `${to}px`, opacity: to === 0 ? 0 : 1 },
      ],
      { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' },
    );
    running.set(element, animation);
    animation.onfinish = () => {
      running.delete(element);
      done();
      animation.cancel();
    };
  };
  const beforeEnter = (element: Element) => {
    (element as HTMLElement).style.height = '0px';
  };
  const enter = (element: Element, done: () => void) => {
    const target = element as HTMLElement;
    animate(target, 0, target.scrollHeight, () => {
      target.style.height = '';
      done();
    });
  };
  const leave = (element: Element, done: () => void) => {
    const target = element as HTMLElement;
    const from = target.getBoundingClientRect().height;
    target.style.height = '';
    animate(target, from, 0, done);
  };
  const cancelled = (element: Element) => {
    cancel(element as HTMLElement);
    (element as HTMLElement).style.height = '';
  };
  watch(reduced, (value) => {
    if (value) [...running.values()].forEach((animation) => animation.finish());
  });
  onBeforeUnmount(() => {
    running.forEach((animation) => animation.cancel());
    running.clear();
  });
  return { animate, cancel, beforeEnter, enter, leave, cancelled };
}
