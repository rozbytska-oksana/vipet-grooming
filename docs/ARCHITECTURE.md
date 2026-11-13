# V.I.Pet — технічна архітектура

Актуальне уточнення Header/Hero v2: [стан реалізації та перевірки](HEADER_HERO_IMPLEMENTATION.md).
GSAP/ScrollTrigger вже підключені для hero; single photo + text/light layers,
справжній локальний курсив, JPEG preview після проблеми AVIF у браузері.
Попередні згадки CSS-only hero нижче описують історичну v1.

Оновлено після аналізу desktop/mobile референсів 2026-11-03. Nuxt starter уже
створений користувачем. Підготовлені style tokens, typed empty data і папки з
контрактами. Header/Hero, index.vue, BaseButton/BaseContainer/BaseIcon та preview dialog уже
реалізовані; решта секцій і animation composables — план. Користувач встановив
starter dependencies і Sass; global SCSS та NuxtPage підключені. Деталі й межі
перевірок — [Header/Hero](HEADER_HERO_IMPLEMENTATION.md).

Візуальні рішення: [аналіз референсів](DESIGN_REFERENCE_ANALYSIS.md).
Контент: [CONTENT.md](CONTENT.md). Команди й наступні кроки: [план](IMPLEMENTATION_PLAN.md).

## Рішення

| Питання   | Рекомендація                                    | Причина / межа                                        |
| --------- | ----------------------------------------------- | ----------------------------------------------------- |
| Rendering | Nuxt 4, SSR enabled, `nuxt generate`            | Контент доступний до JS; static hosting               |
| Routing   | `app/pages/index.vue`, `app/app.vue` з NuxtPage | Один content route, можливі допоміжні legal pages     |
| Styling   | Scoped SCSS + shared tokens/fonts/reset         | Без UI framework; mobile-first                        |
| Content   | Typed local data                                | CMS не потрібна для першого випуску                   |
| State     | Page-level refs/computed + props/events         | Pricing/booking спільні лише в одній сторінці         |
| Motion    | CSS/native + client GSAP/ScrollTrigger          | Не включати animation runtime в SSR logic             |
| Carousel  | `embla-carousel-vue` v8                         | Версійно узгоджена Vue 3 інтеграція                   |
| Images    | Nuxt Image build-time static pipeline           | Production image server не передбачається             |
| Requests  | Окремий delivery adapter / HTTPS endpoint       | Static page не може безпечно тримати bot/SMTP secrets |
| Testing   | Vitest, цільові component tests                 | Pure pricing + критичні interactive contracts         |
| SEO       | Nuxt head APIs, small build-time artifacts      | Без повного SEO suite для одного route                |

## Узгоджений напрям структури

```text
vipet-grooming/
├── app/
│   ├── app.vue                         # NuxtRouteAnnouncer + NuxtPage
│   ├── assets/styles/                  # підключено у nuxt.config.ts
│   │   ├── main.scss
│   │   ├── variables.scss              # один набір palette/semantic/type/spacing tokens
│   │   ├── animations.scss             # motion tokens + reduced-motion overrides
│   │   ├── _fonts.scss                # локальні WOFF2 через Vite
│   │   └── _breakpoints.scss           # 768px / 1200px
│   ├── assets/fonts/                   # local WOFF2 через Vite
│   ├── components/
│   │   ├── ui/                         # BaseButton/BaseContainer/BaseIcon; решта — план
│   │   │   ├── BaseButton.vue          # реалізовано
│   │   │   ├── BaseIcon.vue             # реалізовано SVG icons
│   │   ├── BaseHeading.vue         # план
│   │   │   ├── BaseContainer.vue       # реалізовано
│   │   │   └── BaseImage.vue           # план
│   │   ├── layout/
│   │   │   ├── SiteHeader.vue          # реалізовано
│   │   │   └── SiteFooter.vue          # план; contacts anchor
│   │   # booking/BookingPreviewDialog.vue — реалізований інформаційний dialog
│   │   └── sections/
│   │       ├── HeroSection.vue         # реалізовано
│   │       ├── PhilosophySection.vue   # план
│   │       ├── ServicesSection.vue     # план
│   │       ├── GroomerSection.vue      # план
│   │       ├── CertificatesSection.vue # план
│   │       ├── BeforeAfterSection.vue  # план
│   │       ├── PetGallerySection.vue   # план
│   │       ├── PricingSection.vue      # план
│   │       ├── WhyChooseUsSection.vue  # план
│   │       ├── TestimonialsSection.vue # план
│   │       ├── FaqSection.vue          # план
│   │       └── BookingSection.vue      # план
│   ├── composables/                    # README з контрактами, функції ще не створені
│   │   ├── useScrollReveal.ts          # план
│   │   ├── useCountUp.ts               # план
│   │   └── useReducedMotion.ts         # план
│   ├── data/                           # створені typed empty collections
│   │   ├── services.ts
│   │   ├── breeds.ts
│   │   ├── pricing.ts
│   │   ├── faq.ts
│   │   └── navigation.ts                # availability flags для поточного preview
│   ├── types/content.ts                # створені мінімальні content/pricing contracts
│   ├── pages/index.vue                 # реалізовано header/hero/dialog
│   ├── utils/calculatePrice.ts          # план разом із calculator/tests
│   └── error.vue                       # план до release; host також має віддавати 404
├── public/
│   ├── images/hero/                    # responsive AI demo AVIF/JPEG
│   ├── fonts/                          # ліцензії OFL; WOFF2 у app/assets/fonts
│   ├── favicon.ico                     # starter, не затверджений бренд-asset
│   └── robots.txt                      # starter; не production/preview indexing policy
├── docs/
│   ├── references/                     # незмінні PNG, не production photos
│   ├── DESIGN_REFERENCE_ANALYSIS.md
│   ├── DESIGN_SYSTEM.md
│   ├── ANIMATIONS.md
│   ├── ARCHITECTURE.md
│   ├── CONTENT.md
│   ├── CONTENT_CHECKLIST.md
│   ├── PROJECT_OVERVIEW.md
│   ├── SEO_STRATEGY.md
│   └── IMPLEMENTATION_PLAN.md
├── source-assets/                      # generated original, exact prompt, manifest; real originals — пізніше
├── scripts/                            # план: image/SEO artifact validation за потреби
├── tests/                              # план: meaningful unit/component tests
├── AGENTS.md
├── .prettierrc.json                    # створено baseline
├── .prettierignore                     # references/assets/lockfiles excluded
├── .editorconfig                       # створено baseline
├── nuxt.config.ts                      # підключено shared SCSS і lang uk
├── package.json                        # користувач установив starter + Sass
├── tsconfig.json
└── README.md                           # існуючий starter README
```

Позначка «план» означає, що відповідного application file зараз немає; дерево
описує ціль, а не стверджує повну реалізацію. README у scaffold folders містять контракти; лише Header/Hero та потрібні їм
компоненти вже створені, без десятків порожніх SFC/composables. Index route створений; інших routes і глобальних animation plugins поки немає.

## Межі компонентів і composition

| Рівень            | Відповідальність                                                                 | Чого не робить                                              |
| ----------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| pages/index.vue   | Єдиний DOM порядок, SEO, page-local PricingSelection, prefill через props/events | Не містить price matrix, GSAP globals чи server secrets     |
| ui/BaseButton     | Native button/link, variants, pending/focus, slot label                          | Не виконує submit delivery або routing через div click      |
| ui/BaseHeading    | Semantic heading level незалежно від visual size                                 | Не створює h1 у кожній секції                               |
| ui/BaseContainer  | Width/gutters і slot                                                             | Не додає section semantics чи великий vertical spacing      |
| ui/BaseImage      | Тонкий Nuxt Image/picture adapter, явні alt/dimensions/sources                   | Не приховує art direction і не вигадує runtime image server |
| layout/SiteHeader | Logo, доступна навігація, mobile menu, CTA                                       | Не керує calculator/form state                              |
| layout/SiteFooter | 13-та змістова зона contacts, verified links, legal copy                         | Не бере адресу/телефон із mockup                            |
| sections/*        | Власний anchor/heading/layout, props із typed data, scoped styles                | Не дублює бізнес-дані в template                            |
| composables/*     | Client lifecycle і незалежна interaction logic                                   | Не читає browser APIs під час SSR і не створює shared store |
| data/* + types/*  | Реальний контент і доменні контракти                                             | Не містить screenshot fixtures як production data           |

Імпорти UI/layout/section components у script setup — явні. Це зберігає запропоновані
імена без залежності від folder-prefixed auto-import naming; глобальне pathPrefix
переналаштування не потрібне. Не додавати BaseImage лише як обгортку, яка втрачає
можливості NuxtImg/NuxtPicture; advanced art direction може лишатися явним picture.

Єдиний порядок сторінки: Hero → Philosophy → Services → Groomer → Certificates →
BeforeAfter → PetGallery → Pricing → WhyChooseUs → Testimonials → FAQ → Booking →
Contacts/Footer. Це актуалізує Phase 0 порядок відповідно до нового reference.
Desktop expertise wrapper може ставити GroomerSection і CertificatesSection поруч
на ≥1200px. Вони залишаються незалежними siblings із власними anchors і таким
самим reading/focus order на mobile. Немає окремих копій desktop/mobile content.

PricingSection отримує controlled selection і emits update/prefill; page передає
в BookingSection. Не піднімати PII в shared state й не включати його в URL. Детальні
PricingCalculator/BookingForm/media widgets виділяються під час реалізації за
потребою, а не створюються наперед як зайві порожні abstraction layers.

Styles entry main.scss уже підключений у nuxt.config.ts після ручної інсталяції
Sass. Cormorant/Manrope локальні, normal WOFF2 400–600; relative font imports
дають hashed output URLs. Nuxt Image ще не встановлений: demo picture використовує
build-independent AVIF/JPEG derivatives без runtime optimizer. Reduced-motion CSS
токени не замінюють cleanup/instant-final поведінку майбутніх JS composables.

Створювати helpers/components у міру потреби; дерево не вимагає одразу десятків
порожніх файлів. Source assets з правовими обмеженнями зберігати в погодженому
приватному сховищі; не припускати, що майбутній Git repository приватний.
`server/api/booking.post.ts` додається лише якщо обрано Nitro/serverless backend;
у static `.output/public` такий endpoint не працює.

## Моделі й перевірка даних

Service/Breed/PriceRange/PriceRule/ServiceExtra/PricingSelection/FaqItem уже описані
в types/content.ts; решта контрактів нижче — план наступних milestones. Бізнес-значень немає.

| Модель           | Поля та інваріанти                                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| BusinessProfile  | name, city, country; optional verified address/phone/email/hours/socials/geo; null для невідомого                                                      |
| Service          | id, title, description, petTypes, mediaId, inclusions; лише погоджені послуги                                                                          |
| Breed            | id, label, petType; explicit «інша/метис/не знаю» як стан запиту, не вигаданий тариф                                                                   |
| PriceRule        | id, petType, breedId, serviceId, range `{ minMinor, maxMinor, currency: 'UAH' }`, eligibleExtraIds, adjustmentNotes; range null означає quote-required |
| ServiceExtra     | id, title, serviceIds/petTypes, pricing.kind included/additive/quote; range лише для additive                                                          |
| PricingSelection | petType dog/cat або null, breedId/serviceId або null, extraIds[]                                                                                       |
| PriceEstimate    | discriminated status incomplete/available/quote-required/unavailable, range лише для available, reason                                                 |
| Statistic        | id, label, value number або null, suffix, precision, evidence reference, verifiedAt                                                                    |
| MediaAsset       | id, role, dimensions, alt, caption, source reference, approved crops, preview/full URL                                                                 |
| Testimonial      | id, exact text, permitted display name, source, publication permission; rating лише коли підтверджений                                                 |
| BookingRequest   | customerName, petName, petType, breedId або breedText, serviceId, preferredChannel, contactValue, comment?                                             |

`minMinor/maxMinor` — цілі minor units, не floating money. min ≤ max, nonnegative,
UAH, унікальні IDs, валідні foreign keys і відсутність дубльованих price rules.
Нуль дозволений лише якщо бізнес підтвердив безкоштовність; null не є нуль.
Runtime guards для зовнішніх/untrusted даних та build-time перевірка локальних
таблиць потрібні навіть з TypeScript. Окрема schema library поки не потрібна.

## Pricing: алгоритм і потік

1. Вибрати dog/cat; на зміні очистити несумісні breed, service, extras й попередню
   оцінку. SSR initial state — incomplete, без випадкового default price.
2. Вибрати breed і service; фільтрувати лише сумісні підтверджені записи.
3. Шукати точне правило petType + breedId + serviceId. Не підмінювати тариф іншої
   породи. Generic fallback допустимий лише як окреме підтверджене бізнес-правило.
4. Додати лише явно additive, сумісні extras. Included не рахувати вдруге.
   Невідомий тариф extra або coat/weight rule без достатніх даних → quote-required,
   не показувати неправдиво повний числовий total.
5. Range total = сума lower bounds і upper bounds. Не вигадувати коефіцієнти
   шерсті/ваги; показувати підтверджені пояснення, що це попередня оцінка.
6. Немає даних — «Вартість потребує уточнення», не 0 грн і не «від» без числа.
   Непідтримуваний вид/послуга — unavailable, не обіцянка можливості запису.
7. Кнопка «Перейти до заявки» emits typed selection з IDs, не персональні дані.
   Page передає prefill і прокручує до форми; focus на heading із tabindex -1.
   Не перезаписувати customerName/contact/comment; при несумісності запитати вибір
   у самій формі й показати повідомлення. Без передачі даних через query string.
8. Форма й сервер перевіряють IDs знову. Client estimate не є остаточною ціною
   або довіреною сумою. За потреби backend заново рахує з актуального каталогу.

Unit cases: incomplete, точна порода, інша порода, missing rule, min/max, included
і additive extras, дублікати extras, quote extra, несумісність після pet change,
невалідні IDs, відсутні прайси. Fixtures тільки синтетичні, явно позначені test data.

## Booking і delivery

Обов’язкові поля: ім’я клієнта, ім’я тварини, вид, порода (або «не знаю»/free text),
послуга, contact details, preferred channel Telegram/Viber/Email. Comment optional.
Видимий label контакту залежить від каналу; email перевіряється як email, Telegram
дозволяє погоджений username/contact format, Viber — номер у погодженому міжнародному
форматі. Не вимагати одночасно email і телефон. Конкретний формат підтвердити перед
інтеграцією; preferred reply channel не означає автоматичну відправку цим каналом.

Стани: idle → validating → submitting → received/error. Success лише за реальним
HTTP acknowledgment після durable acceptance або підтвердження provider, з request
reference, якщо є. Accepted/queued не означає доставлено/прочитано чи записано.
Timeout означає невідомий результат: чесне повідомлення й безпечний retry з
idempotency key. Зберігати fields при error; pending запобігає повторному click.
Live status один, `aria-busy`, error summary + inline errors. Не зберігати PII у
localStorage, analytics або URL; не логувати payload. Мінімізувати retention.

| Варіант                                    | Переваги                                         | Обмеження / рішення                                                      |
| ------------------------------------------ | ------------------------------------------------ | ------------------------------------------------------------------------ |
| HTTPS serverless endpoint + email provider | SSG залишається; контроль валідації й acceptance | Потрібні hosting/account, verified sender, secrets, abuse protection     |
| Nitro server endpoint                      | Один codebase, приватні server env               | Потрібен Node/serverless runtime; не працює на plain static host         |
| Зовнішній form service                     | Менше власного backend                           | Перевірити privacy, retention, API, CORS, тарифи, підтвердження доставки |
| Messenger/email handoff                    | Може бути окремим contact link                   | Відкриває застосунок; не submission і не доказ відправлення              |

Рекомендація: static frontend + невеликий окремий HTTPS endpoint, остаточно після
вибору hosting та отримувача. Telegram bot — лише server-side adapter з verified
chat destination; жодних bot tokens у клієнті. Не припускати доступність Viber API
або безкоштовність business integration; перевірити окремо, якщо буде обрано.

Endpoint contract перед реалізацією: POST JSON, обмежені lengths/body size,
allowlisted origin, server validation, rate limits, honeypot/інші засоби проти abuse,
idempotency, sanitized notification, безпечні відповіді 422/429/5xx, timeout/retry.
CORS сам по собі не є захистом від spam. CAPTCHA — лише за реальною потребою.
До інтеграції форма у preview явно недоступна для реальної відправки; жодного
симульованого success. Privacy notice/retention/одержувач погоджуються власницею.

## Зображення, fonts і static hosting

1. Зберегти originals byte-for-byte; manifest з SHA-256, dimensions, правами й
   дозволеними crops. EXIF/location приватних даних прибирати тільки з derivatives.
   Crop ≠ retouch; mobile/desktop crops погоджуються окремо. SVG — logo/icons,
   sanitization для untrusted SVG; фото не перетворювати на SVG.
2. Підготувати лише потрібні джерела. Hero art direction — native picture з media
   conditions 768/1200, кількома реальними srcset, узгодженими sizes; Nuxt Image
   генерує URL варіантів. Не рендерити два eager img, приховуючи один CSS.
3. AVIF + WebP + JPEG/PNG fallback за потреби; перевірити якість шерсті, очей і
   дрібного тексту сертифікатів. Width set визначати від реальних slots і DPR,
   початково 480/768/1200/1600 для великих фото, без генерації кожного формату
   для кожного можливого розміру. Це image widths, не CSS breakpoints.
4. Nuxt Image static provider/build generation (`ipxStatic` для відповідної версії)
   перевірити інтеграційним spike. SSR crawl знаходить rendered image URLs; modal
   full-size, client-only gallery items, art-directed sources не гарантовано знайдені.
   Додати всі потрібні URLs до prerender list, отриманої з manifest, і перевірити файли.
5. Якщо selected version/host не дає повного static output, fallback — build-time
   pre-generated derivatives з явним manifest і static serving, а не runtime /_ipx.
   Не додавати sharp як пряму залежність, доки не обрано цей pipeline.
6. Full-size certificate має бути читабельною погодженою копією без обрізання;
   preview lazy. Full-size URL accessible як link без JS, а не лише після carousel.
   Оригінали з приватними даними не публікувати автоматично.
7. Width/height + aspect-ratio, стабільна parent height, low-cost placeholders.
   Hero actual LCP eager/high priority, решта lazy/async за потреби. Не давати
   high priority кожному layered asset; оцінити фактичний LCP у trace.
8. Self-host selected WOFF2/subsets, explicit display, license. Перевірити fallback
   metrics і slow-font CLS. Деталі — [дизайн-система](DESIGN_SYSTEM.md).

Production deployable output — тільки `.output/public`. Перевіряти без Nuxt dev
server: кожен src/srcset URL, modal images, fonts, favicon, 404 та прямі refresh.
Root/subpath підтримка вимагає base-aware public paths і canonical, не ручного
склеювання `'/images'` без урахування base. Host має вміти true 404, TLS, redirects
і відповідні cache headers; не припускати Apache/.htaccess.

Build configuration proposal: `NUXT_PUBLIC_SITE_URL` — verified origin;
`NUXT_APP_BASE_URL` — base path; `VIPET_INDEXING` — explicit preview/production
build mode; `NUXT_PUBLIC_BOOKING_ENDPOINT` — public endpoint URL без секретів.
Production generation fail-closed при відсутньому origin/несумісній indexing policy.
Приватні provider keys тільки у середовищі обраного backend. Імена є пропозицією
цього проєкту; secrets та конкретні значення у Phase 0 не створюються.

Офіційні джерела: [Nuxt 4 structure](https://nuxt.com/docs/4.x/directory-structure/app),
[Nuxt Image static](https://image.nuxt.com/advanced/static-images),
[Embla Vue v8](https://www.embla-carousel.com/docs/v8/get-started/vue).
