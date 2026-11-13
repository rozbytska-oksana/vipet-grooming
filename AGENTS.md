# V.I.Pet — правила роботи

## Статус і джерела рішень

Реалізовано основні секції односторінкового Nuxt 4 сайту. Поточний стан і перевірки
описано в docs/FULL_PAGE_IMPLEMENTATION.md. Фото, прайс, відгуки й реквізити
надала користувачка. Hero та ілюстрації послуг мають погоджене AI-походження,
опубліковані адаптивні AVIF/WebP, оригінали збережені в source-assets.

GitHub Pages — окрема production-оптимізована версія для погодження з noindex
та локальною перевіркою форми. HostPro — майбутній основний сайт з PHP-обробником
Telegram. Домен — https://vipet-grooming.com.ua; збірка `npm run generate:hostpro`,
індексація вмикається явно прапорцем `--indexable` (див. docs/HOSTPRO_DEPLOY.md). Поточна SEO-реалізація
описана в docs/SEO_STRATEGY.md. Ініціалізацію повторно не запускати.
Спілкування й документація українською, ідентифікатори коду англійською.

Перед змінами прочитати цей файл і відповідні документи:

- [Контекст і межі](docs/PROJECT_OVERVIEW.md).
- [Дизайн-система](docs/DESIGN_SYSTEM.md).
- [Анімації](docs/ANIMATIONS.md).
- [Архітектура](docs/ARCHITECTURE.md).
- [Аналіз референсів](docs/DESIGN_REFERENCE_ANALYSIS.md).
- [Контентний контракт](docs/CONTENT.md).
- [Header/Hero: реалізація і перевірки](docs/HEADER_HERO_IMPLEMENTATION.md).
- [SEO](docs/SEO_STRATEGY.md).
- [План, команди, перевірки](docs/IMPLEMENTATION_PLAN.md).
- [Деплой на HostPro](docs/HOSTPRO_DEPLOY.md).
- [Реальний контент](docs/CONTENT_CHECKLIST.md).

Явні рішення користувача мають пріоритет. Запропоновані кольори, бюджети й таймінги
є стартовими проєктними рішеннями, а не затвердженим макетом. Оновлювати документи,
коли реалізація або рішення змінюються; не оголошувати заплановане виконаним.

## Межі повноважень

- Спочатку перевірити локальні інструкції, файли, package manager, scripts і зміни.
  Не перезаписувати існуючий проєкт або сторонні зміни.
- Ініціалізацію та встановлення/оновлення/видалення залежностей виконує користувач,
  якщо явно не делегував. Надавати точні команди. Не запускати package creators,
  package-downloading npx чи інсталяцію самостійно. Lockfile змінює лише менеджер.
- Не комітити, не пушити, не публікувати, не змінювати DNS, не надсилати повідомлень
  третім особам без відповідного дозволу. Git зараз успадкований від батьківського
  каталогу: не робити операцій з усім батьківським репозиторієм.
- Працювати пропорційно задачі. Не додавати CMS, Pinia, UI kit, form/animation
  wrappers, smooth-scroll library або backend без підтвердженої потреби.
- Блокувальні питання ставити лише для залежної роботи; решту виконувати автономно.

## Архітектурні правила

Nuxt 4, Vue 3, TypeScript strict, Composition API. Основна сторінка `/` — SSG
через `nuxt generate` зі збереженим SSR. Основний текст, ціни, FAQ та навігація
присутні в HTML до JS. Не використовувати `ssr: false` чи ClientOnly для SEO-контенту.
Реальний 404 і політика preview/production є частиною збірки.

Дані відокремлені від UI; чиста функція розрахунку ціни має окремі тести. Компонент
сторінки володіє вибором для pricing → booking і передає props/events. Для цього
не потрібен глобальний store. Browser API — у client lifecycle; SSR не читає
window, localStorage, випадкові значення чи ширину екрана.

GSAP + ScrollTrigger — тільки складні timeline/scroll-сцени. CSS та native API —
для shimmer, hover, disclosure, простих reveal і count-up. Embla Vue — для
каруселей. Не додавати autoplay чи scroll hijacking. Чистити component-scoped
GSAP context/matchMedia, observers, listeners, rAF і власні підписки Embla.
Не викликати глобальне видалення чужих ScrollTrigger.

## Формат і стилі

Нові SFC мають порядок `<template>`, `<script setup lang="ts">`,
`<style scoped lang="scss">`, з порожнім рядком між блоками. Непотрібні блоки
опускати. TypeScript: крапки з комою, одинарні лапки, 2 пробіли, LF, UTF-8,
newline в EOF. Закривальні теги батьків — на окремому рядку; не розривати тег
на кшталт `</NuxtLink>`. Перевіряти пробіли біля inline-тексту.

Prettier відповідає за форматування, ESLint — за correctness і Vue block conventions,
EditorConfig — за редактор. Точні baseline-конфігурації наведено в плані.
Не додавати конкурентних конфігів. Shared global tokens/reset/fonts — у
`app/assets/styles/`, решта — scoped SCSS. Нові класи BEM, вкладення через `&`.

Mobile first. Єдині width-breakpoints: medium 768px і x-large 1200px у спільному
`_breakpoints.scss`; `@use` з namespace, includes всередині відповідного селектора.
`<picture>`/sizes і JS media conditions узгоджені з цими значеннями. Device/a11y
queries не є додатковими width-breakpoints. Не стискати секції до одного екрана.

## Контент, доступність і приватність

- Не вигадувати ціни, адресу, години, контакти, статистику, відгуки, сертифікації,
  нагороди, обіцянки безпеки чи медичні властивості послуг.
- Невідомі значення — `null`, порожні масиви або редакційний `[ПОТРІБНО: …]` лише
  в документах. Не віддавати редакційні placeholders у production, JSON-LD чи sitemap.
- Семантичні header/nav/main/section/footer, один h1, логічні h2/h3, skip link,
  видимий `:focus-visible`, справжні links/buttons. Мінімум 44×44px для controls.
- Body переважно 18px, secondary/forms не менше 16px. Контраст: 4.5:1 для звичайного
  тексту, 3:1 для великого тексту та значущих UI-границь/станів.
- SVG-іконки; декоративні `aria-hidden`. Без emoji-іконок чи стрілок у primary CTA.
- Діалоги: доступне ім’я, initial focus, focus containment, Escape, відновлення focus.
  Drag/swipe не можуть бути єдиним способом керування. FAQ є на всіх розмірах.
- Поважати reduced motion включно зі зміною налаштування під час роботи.
  Без JS істотний контент видимий; failure імпорту GSAP не приховує сторінку.
- Заявка не підтверджує час. Успіх лише після реального підтвердження endpoint.
  Відкриття Telegram/Viber/email не означає відправлення. Секретів немає в клієнті.
  Не передавати персональні дані у URL, аналітику чи client logs.

## Ресурси, SEO й продуктивність

Оригінали зберігати byte-for-byte поза public; manifest фіксує checksum, права,
розміри, crop і derivatives. Не ретушувати/генерувати реконструкції без дозволу.
Публікувати лише потрібні AVIF/WebP/fallback, окремо читабельні full-size certificates.
LCP-зображення не lazy, priority лише справді критичному ресурсу. width/height,
співвідношення сторін і висота композиції зарезервовані з першого HTML.

Nuxt Image для static повинен мати всі варіанти у `.output/public`, включно з
клієнтськими модалками; runtime image server не передбачається. Перевіряти root
і subpath, якщо підтримуються. WOFF2 локально, обмежені subsets/weights, ліцензії
збережені, font-swap перевірений.

Canonical, OG, sitemap, robots і JSON-LD спираються на одне перевірене origin.
Preview — noindex, доступний crawler для читання директиви; production — явно
дозволена індексація. Не використовувати фальшивий підтип Schema.org.

Цілі: mobile Lighthouse Performance ≥90, Accessibility ≥95, SEO ≥95;
LCP ≤2.5s, CLS ≤0.1, INP ≤200ms. Це цілі, не гарантії. Lighthouse не вимірює
реальний INP; TBT — лабораторний сигнал. Польові CWV оцінюються окремо.

## Перевірки й передача

Після відповідних code changes запускати format:check/lint, typecheck, цільові
Vitest tests, generate й перевірку артефакту. Не встановлювати відсутні інструменти
без делегування. Для документації достатньо посилань, узгодженості й diff scope.

UI перевіряти на mobile/tablet/desktop, клавіатурою, reduced motion, без JS,
на client navigation і direct refresh; перевіряти hydration. CLS досліджувати
cold-cache, із затриманими fonts/images та поступовим HTML, а не лише скриншотом.
Фіксувати viewport, URL, версії інструментів, throttling/cache, дату й результати.
Не запускати конкурентні Nuxt processes в одній build directory; не зупиняти
процеси користувача. Повідомляти фактичні результати та обмеження.

## Уточнення після дизайн-референсів

- docs/references — immutable PNG originals, не publishable page backgrounds.
  Не переносити screenshot prices, counts, names, testimonials чи contacts у data.
- Shared CSS tokens — app/assets/styles/variables.scss, motion tokens — animations.scss,
  єдині width-breakpoints — _breakpoints.scss. Не створювати паралельний _tokens.scss.
- public/images — approved production images; originals не публікувати автоматично.
- Поточний порядок DOM: Hero, Services, Groomer (із Certificates), BeforeAfter,
  Pricing, Philosophy, PetGallery, BeforeVisit, Booking, Testimonials, SalonRules, FAQ, Contacts/Footer.
  Philosophy об’єднує підхід і цінності колишнього WhyChooseUs.
- Gold pill CTA відповідає reference; без стрілок. Mobile device frames не UI.
- UI/layout/sections імпортувати явно; не залежати від folder-prefix auto-import names.
- Не генерувати десятки порожніх SFC заради дерева. README у scaffold folders
  фіксують контракти; .vue/.ts interactions додаються разом із реальною реалізацією.

## Header/Hero preview

Користувач дозволив тимчасові нереальні зображення. AI hero — демонстраційний,
original/prompt/checksums у source-assets; не трактувати його як реальні роботи.
Navigation available flags true для створених секцій. CTA веде до #booking;
форма надсилає POST до booking.php лише при NUXT_PUBLIC_BOOKING_ENABLED=true
(HostPro); GitHub Pages і вимкнений прапорець — лише локальна перевірка. Preview лишається noindex.
SCSS активний, fonts локальні й content-versioned через Vite, OFL у public/fonts.
Для перевірок використовувати встановлений Node 24.22.0 (.nvmrc), не shell Node 20.
