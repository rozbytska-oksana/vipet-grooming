# V.I.Pet — детальний аналіз дизайн-референсів

Переглянуто обидва оригінальні PNG 2026-11-03. Це аналіз статичних зображень,
не працюючого прототипу: анімації, hover, focus, поведінка форми й точні шрифтові
файли з них не визначаються. Архітектурні висновки нижче — пропозиції реалізації.

## Джерела та межі використання

| Референс | Фактичний файл                                                                                  | Розмір      | Обсяг           |
| -------- | ----------------------------------------------------------------------------------------------- | ----------- | --------------- |
| Desktop  | [V.I.Pet: Розкішний грумінг у Житомирі](<references/V.I.Pet_ Розкішний грумінг у Житомирі.png>) | 1024×1536px | 2 151 555 bytes |
| Mobile   | [Розкішний мобільний сайт](<references/Розкішний мобільний сайт V.I.Pet Grooming Salon.png>)    | 724×2172px  | 2 150 414 bytes |

Desktop — стислий довгий знімок усієї концепції. Mobile — три рамки телефонів із
фрагментами довгої сторінки, а не layout у три колонки, не три routes і не screenshot
реального viewport 724px. За ними не можна обчислювати точні CSS font-size/gutters.
Системний status bar, gold device frames, тіні телефонів і зовнішній beige фон —
оформлення презентації; у сайт їх не переносимо. Оригінали не змінені й не є
готовими production background images.

SHA-256 originals:

- Desktop: `b710baa0c6a6ae54eafb7fa551b52436474fdfd95cb72706d2a5fe4367e09fdd`.
- Mobile: `3c71ae157306793ecb0c40e79af213fcf801d2a5da5cb773f23b5c33bbe724c1`.

## Візуальна мова

У макетах переважає теплий black/cream/gold, а не холодний black/silver. Світлі
секції мають теплий рожево-кремовий відтінок; gold — champagne highlight → honey,
із легкими metal gradients. Темні поверхні нагадують оксамит/студійне освітлення.
Початкову палітру уточнюємо теплими surface/gold tokens, silver залишаємо secondary.
HEX у дизайн-системі — контрольована web-палітра, не точне відновлення з PNG.

Повторювані мотиви:

- Великі зображення собаки й кота, погляд до глядача, gold аксесуари, темний textile.
- Тонкі gold дуги/світлові стрічки, іноді контур лапи; вони з’єднують секції.
- Serif display з контрастними штрихами; body/nav/inputs — sans. Точну family
  із raster достовірно не визначити: залишаємо перевірену систему Cormorant/Manrope,
  Bodoni лише для вибраних англійських рядків.
- Primary CTA — pill із gold gradient, без стрілки всередині. Це уточнює попередню
  пропозицію radius 2–4px; pill доречний для CTA, не для кожного контейнера.
- Cards мають помірні rounded corners, делікатну світлу межу й м’яку тінь. Не
  відтворювати важкий neumorphism або надмірно роздутий drop shadow.
- Лапи, heart, scissors, shield тощо — акценти, не причина замінити semantic labels
  піктограмами. У реалізації — узгоджені SVG, не emoji.

Композиція впізнавана, проте desktop PNG дуже щільний. Його висоти секцій не є
нормативом: зберігаємо generous spacing і readable 18px body, а не стискаємо весь
контент у 1536px. Gold rays не повинні світити за текстом або ставати постійною
рухомою рекламою; максимум одна статична композиційна лінія на групу секцій.

## Аналіз секцій і технічні наслідки

| Область            | Що видно в reference                                                                                        | Як реалізувати                                                                                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header             | Logo зліва, щільна desktop nav, social icons і CTA; mobile logo + burger                                    | SiteHeader, компактна nav; menu panel з keyboard/Escape/focus return; social links тільки з verified URLs; sticky не вважати підтвердженим зі screenshot         |
| Hero               | Desktop текст ліворуч, dog/cat праворуч; gold arc; mobile текст над тваринами, trust row і CTA нижче        | HeroSection із responsive art direction; справжній h1/copy/CTA в DOM; окремі photo/decor layers лише за наявності originals; native scroll, зарезервована висота |
| Trust / Philosophy | Три короткі trust labels у hero, окремої philosophy story немає                                             | Залишити PhilosophySection з brief; не дублювати hero labels у великій кількості; текст очікує погодження                                                        |
| Services           | Desktop 3 cards у верхньому ряду + 2 широкі нижче; mobile 3 stacked cards і «Всі послуги»                   | Grid на 6 tracks на desktop: 2/2/2 + 3/3 spans; tablet 2 колонки; mobile повний список або accessible disclosure, не втрата 2 послуг                             |
| Service card       | Photo зліва, icon/title/description праворуч, gold price pill                                               | Reusable ServiceCard лише при реальній реалізації; title/copy у HTML; price — текст, а не button, якщо він нічого не робить; ranges тільки з verified data       |
| Groomer            | Desktop portrait + bio/stats поруч; mobile portrait над біографією, signature й stats нижче                 | GroomerSection, content-first DOM; portrait не crop з mockup; stats optional; signature decorative/approved                                                      |
| Certificates       | Desktop поруч із groomer, mobile окрема dark section; overlapping certificate cards, dots, prev/next        | Незалежний CertificatesSection з anchor; desktop сусід у спільній grid-групі, не вкладений у GroomerSection; Embla + dialog/full-size link                       |
| Before/after       | Desktop heading ліворуч, широкий comparison праворуч; mobile вертикальна пара у mask, handle, labels і dots | BeforeAfterSection, один native range з клавіатурою; фото однакової геометрії; при кількох парах окрема navigation без конфлікту swipe/drag                      |
| Gallery            | Окремої Pet Fashion Show немає                                                                              | PetGallerySection лишається з brief: реальні роботи, desktop storytelling optional, mobile swipe; не підміняти before-after тією самою галереєю                  |
| Pricing            | Desktop вузький horizontal strip; mobile stacked choices, pet toggles, selects, summary і CTA               | PricingSection не стискати до strip; petType/breed/service + extras; page-owned selection → BookingSection; no known price → quote-required                      |
| Why choose us      | Desktop 5 причин у ряд; mobile icon/text list                                                               | WhyChooseUsSection із configurable items; factual copy очікує погодження; без надлишкових boxed cards                                                            |
| Testimonials       | Desktop 3 dark cards і navigation; mobile одна card з dots                                                  | Реальні відгуки/permission; component може бути статичним grid на desktop, Embla на mobile; рішення не вимагає autoplay                                          |
| FAQ                | Desktop світлий блок поруч із booking/contact CTA; mobile окрема секція                                     | FaqSection з native details/summary і повними SSR answers на всіх екранах; accordion indicators — SVG/CSS                                                        |
| Booking            | Desktop лише CTA і messenger links; mobile повна форма                                                      | На desktop теж повна BookingSection із усіма required полями; contact links не замінюють submit; endpoint окреме рішення                                         |
| Footer             | Dark logo/tagline/address/phone/social icons; mobile вертикальна композиція й back-to-top                   | SiteFooter володіє contacts anchor; відображає лише verified contacts; back-to-top — accessible anchor зі SVG, copyright не копіювати зі знімка                  |

## Responsive правила та єдиний порядок контенту

Desktop і mobile показують різний порядок Before/After та Certificates. Щоб не
розходилися DOM/reading/focus order, приймаємо один робочий порядок на всіх екранах:

1. Hero.
2. Philosophy / trust / care.
3. Services.
4. Groomer.
5. Certificates.
6. Before/After.
7. Pet Gallery.
8. Pricing.
9. Why V.I.Pet.
10. Testimonials.
11. FAQ.
12. Booking.
13. Contacts у footer.

Це відповідає desktop expertise group і новому переліку компонентів користувача;
уточнює стару Phase 0 послідовність. Візуальне сусідство Groomer/Certificates на
≥1200px дає page-level grid wrapper без додаткового semantic section. Mobile/tablet
зберігають той самий порядок і незалежні headings. CSS order не переставляє focus.

Mobile <768px: одна колонка, text → media → actions, фото не перекривають inputs,
FAQ доступний, елементи мінімум 44×44px. Medium ≥768px: 2-column layouts, stacked
expertise за недостатнього місця. X-large ≥1200px: editorial layout, service 3+2,
groomer/certificates поруч. Рамки телефонів не визначають width-breakpoints.

«Всі послуги» на single-page може розгортати додаткові cards через button із
aria-expanded/aria-controls. До такого enhancement усі послуги мають бути доступні
в HTML; не робити link на неіснуючу /services. Формат відкладено до реального каталогу.

## Функціональні розбіжності, які виправляємо

- У mobile booking є бажана дата, але немає окремого breed field. Зберігаємо породу
  з brief. Preferred date — optional запит, не availability calendar; додається
  тільки після рішення власниці, не є required у нинішньому контракті.
- Reference використовує phone field незалежно від preferred channel. Форма має
  відповідно міняти contact label/validation: не вимагати телефон для email-only
  запиту без бізнес-потреби.
- На screenshot є WhatsApp-подібні social icons, тоді як brief визначає
  Telegram/Viber/Email. Не підміняти Viber іконкою WhatsApp; підтримувані канали
  й destinations потрібно підтвердити.
- Gold price pills у service cards не автоматично є інтерактивними. Clickable
  стає лише явний вибір послуги, якщо реалізовано prefill у pricing/booking.
- Великий hero wordmark не замінює український h1 про реальну діяльність і місто.
- Статична PNG не доводить video, parallax, loop, carousel autoplay або sticky header.
  Motion визначається окремою специфікацією з reduced-motion alternatives.

## Які дані з макета не стають бізнес-фактами

Числа 5+, 10+, 1000+, будь-які price ranges, ім’я/роль на портреті чи підписі,
certificate dates/нагороди, відгуки/імена/рейтинги, адреса, телефон, social URLs,
твердження про косметику/здоров’я й copyright year у PNG не підтверджені окремо.
Не переносити їх у app/data, metadata або JSON-LD. Навіть якщо слово виглядає
правдоподібно, воно потребує approval. Перелік послуг теж потребує підтвердження.

## Ресурси для точного відтворення

Потрібні окремо: vector logo; allowed hero desktop/mobile photos або cutouts;
підкладка/lighting assets, якщо дозволені; service photos; реальний portrait;
before-after pairs; читабельні certificates; gallery photos; SVG icons.
З flatten PNG неможливо отримати справжні dog/cat layers, чистий background або
оригінальні fonts без реконструкції. Не вирізати screenshot text у сайт і не
робити весь hero однією картинкою з текстом. AI-реконструкція/ретуш потребує
окремого дозволу; цей етап нічого не генерує й не редагує.

Gold arcs можна намалювати простими власними decorative SVG/CSS без копіювання
чужих photo details, але вони aria-hidden і не створюють animation dependency.
No-JS/SSG content, accessible controls і фактичні responsive sources обов’язкові.

## Наслідки для архітектури та перший proof

Використовуємо запропоновані користувачем ui/layout/sections, styles/main.scss,
variables.scss, animations.scss, composables і public/images. Додаємо shared
_breakpoints.scss, types і окремі domain data без бізнес-заглушок. CONTENT.md
описує поля/власників/статус; CONTENT_CHECKLIST.md лишається списком збору матеріалів.

Контракти майбутніх компонентів визначені в [ARCHITECTURE.md](ARCHITECTURE.md).
Не потрібні порожні SFC для кожної секції: вони створюються з фактичною розміткою
під час відповідного milestone. На цьому етапі готуються папки, style tokens,
typed data contracts і документація, без повної сторінки й встановлення пакетів.

Перший visual proof: один responsive hero, одна service card і expertise group
на desktop/mobile з реальними assets. Перевірити readability, focus, body sizing,
parent height/CLS, cropped focal points та лише потім додавати GSAP.
