# Composables — контракти перед реалізацією

- useReducedMotion.ts: readonly preference; SSR/client initial state однаковий,
  консервативно без анімації до mount; matchMedia listener тільки на client, cleanup.
  CSS і JS однаково реагують на live preference changes.
- useScrollReveal.ts: component-scoped IntersectionObserver для простих once reveals;
  контент за замовчуванням видимий, reduced motion/import failure не ховають DOM;
  disconnect при unmount. Не підміняти ним окрему складну GSAP timeline hero.
- useCountUp.ts: verified numeric value, 0→value приблизно 1800ms, once на mount,
  final SSR/screen-reader text; cleanup rAF/observer, миттєвий final для reduced motion.

Не створювати composables з no-op реалізаціями лише заради дерева. GSAP scene
lifecycle, booking adapter і pure price calculator додаються у відповідних milestones.
Немає module-scope shared browser state, window під час SSR чи нового store.
