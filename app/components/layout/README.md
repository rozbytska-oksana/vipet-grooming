# Layout — межі майбутніх компонентів

- SiteHeader.vue (реалізовано): logo, verified section links, primary CTA, mobile menu; без
  вигаданих social URLs. Mobile menu має aria-expanded/controls, Escape і focus return.
  Default — звичайний header; sticky додається лише як перевірене рішення.
- SiteFooter.vue: contacts anchor, approved logo/copy, лише verified contact actions;
  label має відповідати реальній дії. Ніякої адреси/телефону з PNG без підтвердження.

Route composition і pricing/booking state належать pages/index.vue. Layout не
містить каталогу послуг або логіки calculator. Реалізований Header/Hero preview; SiteFooter ще не створений.
