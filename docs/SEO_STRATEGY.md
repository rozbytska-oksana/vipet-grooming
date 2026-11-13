# V.I.Pet — SEO-стратегія

## Реалізація станом на 2026-11-10

Основна мова uk, Open Graph locale uk_UA. Адресу, телефон, Instagram і графік
підтвердила користувачка, вони зберігаються в app/data/salon.ts. Основний домен —
https://vipet-grooming.com.ua (підтверджено 2026-11-13). `npm run generate:hostpro`
задає його як NUXT_PUBLIC_SITE_URL і лишає noindex,nofollow, доки збірку не
запущено з `--indexable`. public/.htaccess робить цей origin канонічним (HTTPS, без www).

app/composables/useHomeSeo.ts налаштовує title, description, Open Graph та Twitter
Card. Соцпрев’ю — images/social-preview.jpg, 1200×630, з оригінальним логотипом.
Фірмові SVG, PNG 48×48, ICO та Apple touch icon 180×180 узгоджені між собою.
Попередню стандартну іконку Nuxt замінено. Скрипт відтворення —
scripts/export-seo-assets.mjs. Це компонування наявного логотипа з фірмовим фоном.

Перед індексованим релізом налаштувати приватний локальний .env або оточення збірки.

```dotenv
NUXT_PUBLIC_SITE_URL=https://example.test
NUXT_PUBLIC_SITE_INDEXABLE=true
```

example.test використовується лише як тестовий приклад. Підставити перевірений
реальний HTTPS origin без шляху, query або fragment. Шлях розміщення задає
NUXT_APP_BASE_URL. Збірка з активною індексацією й порожнім доменом відхиляється.
NUXT_PUBLIC_BOOKING_ENABLED налаштовується незалежно після перевірки Telegram.

Для indexable-сайту головна має self-canonical, WebSite/WebPage, LocalBusiness
і п’ять Service nodes. Дані включають підтверджені адресу, телефон і години
вівторок–субота 10:00–17:00. Застосовано загальний LocalBusiness. Власний рейтинг
та FAQ rich-results розмітку не додаємо. JSON-LD екранується перед вставкою в HTML.

Nitro генерує robots.txt та, лише в індексованому режимі, sitemap.xml із єдиною
головною URL. Це статичні файли готової збірки, окремий сервер для SEO не потрібний.
Public review дозволяє crawl для читання noindex, canonical й sitemap не публікує.
GitHub Pages команда примусово залишає індексацію та доставку форми вимкненими,
а Open Graph отримує фактичну адресу Pages. .env з production-параметрами цей
режим не перемикає.

Українська error.vue має noindex та посилання на головну з deployment base path.
Установлена версія Nuxt підтримує experimental.prerenderErrorPages, який увімкнено
для server-rendered 404.html. Це забезпечує видимий текст помилки без JavaScript.
Справжній HTTP 404 залежить також від налаштувань майбутнього хостингу.

Перевірено тести нормалізації URL, захисту від помилкової індексації, фактичних
бізнес-даних та екранування JSON-LD. У тимчасовій production-збірці з example.test
перевірені canonical, зв’язність восьми schema nodes, robots/sitemap і noindex 404.
Цей тестовий output не є артефактом для публікації. Google Schema Validator,
Rich Results Test та перевірку live URL потрібно повторити після підключення домену.

Нижче збережено контентні й релізні вимоги.

## Контент і локальний намір

Один індексований landing route `/`. Один український h1, h2 для основних секцій,
h3 для послуг/підрозділів. Header/nav/main/footer, section з aria-labelledby,
справжні anchors, skip link. FAQ і каталожний текст є у server-generated HTML.
Секційні fragments не є окремими індексованими сторінками чи sitemap entries.

Робочі напрямки запитів, а не результати keyword research: «грумінг Житомир»,
«грумінг собак Житомир», «грумінг котів Житомир», «догляд за шерстю Житомир».
Використовувати лише фактично наявні послуги/види тварин. Не додавати приховані
списки порід, повтори міста в кожному alt чи фіктивні landing pages районів.
Відповіді на наміри: хто доглядає, які процедури, роботи до/після, як визначається
вартість, як подати запит і де знаходиться салон. Тексти погоджуються з власницею.

## Head і URL

- `useSeoMeta`/`useHead` у Nuxt з єдиного verified business/deployment config.
- Draft title: «V.I.Pet — грумінг-салон у Житомирі». Це варіант редакції, не вже
  затверджена metadata. Description створити після підтвердження послуг і процесу
  запису; не вставляти обіцянок досвіду/якості, які не підтверджені.
- Canonical — абсолютний production URL з правильним base path. Normalize query
  tracking і fragment до canonical content URL; не canonicalize всі future routes
  на головну. Єдина trailing-slash policy у build, host redirects і sitemap.
- `og:type=website`, `og:title`, `og:description`, `og:url`, `og:site_name`,
  `og:locale=uk_UA`, absolute `og:image`, image width/height і опис. Social preview
  1200×630 з дозволеної фотографії/логотипа; без вигаданого marketing claim.
- Favicon SVG/PNG/ICO за фактичним logo; перевірити links, MIME, dimensions,
  доступність URL й base path окремо від OG image.
- English display fragments мають lang=en, але не створюють hreflang. Інших
  language routes поки немає, тому hreflang не потрібний.

`[ПОТРІБНО: production origin]` — редакційний placeholder лише тут. Не віддавати
placeholder domain у HTML/JSON-LD. Production build має відмовитися без origin;
preview явно noindex і не є production release.

## Sitemap, robots, preview

Для однієї сторінки достатньо малих build-generated sitemap.xml/robots.txt без SEO
suite. Shared route registry породжує тільки intended indexable absolute URLs.
Не включати fragments, modal URLs, `/_ipx`, query variants, 404 чи preview.
`lastmod` лише за відомою датою зміни контенту, не час кожного deploy.

| Середовище          | HTML / headers                               | robots.txt                            | Sitemap                        |
| ------------------- | -------------------------------------------- | ------------------------------------- | ------------------------------ |
| Production          | index,follow; verified self-canonical        | Allow crawl; absolute Sitemap URL     | Verified production routes     |
| Public preview/demo | noindex,nofollow (header за можливості теж)  | Crawl дозволений для читання noindex  | Не рекламувати preview sitemap |
| Private staging     | Автентифікація на hosting, додатково noindex | Не вважати robots засобом приватності | Не публікувати                 |

Не поєднувати noindex з `Disallow: /` на публічному preview. Індексацію вмикати явно
на production generation, а не за випадковим NODE_ENV. Вивантажувати тільки
перевірений output правильного середовища; source config не доводить його політику.

## Structured data: точність важливіша за вузький тип

Перевірка Schema.org 2026-11-03: відповідного спеціалізованого grooming subtype
у переглянутій ієрархії LocalBusiness не знайдено. Не створювати `PetGrooming`,
не називати салон `VeterinaryCare`, `BeautySalon` або `AnimalShelter` заради subtype.
`ProfessionalService` deprecated. Рішення: базовий `LocalBusiness` + пов’язані
`Service` nodes з точним serviceType. Повторно перевірити vocabulary перед release;
вузький subtype додавати тільки якщо він справді існує й відповідає діяльності.
Це свідоме уточнення вимоги про «appropriate subtype».

Майбутній JSON-LD graph:

- LocalBusiness з name, verified URL і stable `@id` на кшталт canonical + `#business`.
  Address, telephone, openingHoursSpecification, geo, logo, image, sameAs — тільки
  з підтверджених значень, узгоджених із видимим контентом.
- PostalAddress: місто Житомир, country UA відомі; street і postcode підтверджені, geo не надано.
  Не заповнювати вигаданими значеннями. Для повноцінної Google LocalBusiness
  eligibility потрібні required fields, зокрема name/address; перевірити цей
  release gate перед індексованою публікацією, не видавати неповний graph за валідну
  розмітку для rich result.
- Service: name, description, serviceType, provider → business @id; areaServed
  тільки підтверджена географія. Ніяких Product/Offer з null або прикладними цінами.
  Offers/priceSpecification — лише якщо пізніше реальні тарифи й семантика range
  дозволяють це коректно виразити; це не обов’язкова частина першого випуску.
- WebSite/WebPage — необов’язкові короткі nodes з реальним name, URL, inLanguage;
  не додавати SearchAction без пошуку.
- Відгуки можуть бути видимим реальним контентом. Не додавати self-serving
  aggregateRating/review markup заради зірок салону; нічого не агрегувати без даних.
- FAQ залишити семантичним видимим контентом. FAQPage markup не потрібний для
  launch; не закладати очікування FAQ rich results для грумінг-салону.

Будувати JSON-LD з typed verified data, пропускати невідомі optional properties,
без небезпечної вставки користувацького HTML. Тести на відсутність placeholders,
зв’язність IDs, абсолютні URLs, фактичну відповідність тексту. Перевірити Schema.org
Validator і актуальний Google Rich Results Test; валідність не гарантує показ.

## Фото, швидкість і discoverability

Descriptive alt українською за конкретним вмістом, без оцінок/породи, якщо не відомі.
Декоративні фото — alt порожній. Before/after й certificates мають captions,
full-size links і зрозумілий контекст. Не класти важливий текст лише у фотографію.
Images/srcset/width/height і fonts — за [архітектурою](ARCHITECTURE.md).

Targets: Lighthouse mobile Performance ≥90, Accessibility ≥95, SEO ≥95;
LCP ≤2.5s, CLS ≤0.1, INP ≤200ms. Вони не гарантують ranking чи field CWV.
Перевіряти generated HTML, client navigation, no-JS і фактичний host HTTP 404.
SPA fallback з 200 для неіснуючих URL — не справжній 404.

## Локальна присутність і після запуску

Попросити існуючий Google Business Profile URL і підтвердити власника доступу;
не створювати дублікат. NAP на сайті й listing мають збігатися. Map — verified
location link або click-to-load embed, не важкий iframe на старті; жодних вигаданих
координат. Search Console, listing і analytics — різні доступи й задачі.

Після окремо авторизованого deploy перевірити TLS, host redirects зі збереженням
path/query, metadata, assets, robots/sitemap та unknown-route status. Search Console
verification/submit/recrawl — тільки в межах відповідного дозволу. Не міняти DNS
або наявні verification records автоматично. Зміни CSS не вимагають нового sitemap.

Видимість оцінювати за queries/pages/dates у Search Console; accepted crawl request
не дорівнює indexing або ranking. Analytics — окреме рішення власниці, без form
contents, контактів чи comment у events. Відсутність traffic на старті не є помилкою
архітектури, польові метрики можуть бути недоступними при малому обсязі.

## Release checklist

- Перевірені origin, NAP, metadata copy, OG image, favicon і publishing rights.
- Український HTML, один h1, anchors/FAQ доступні, unique title/description.
- Canonical/robots/sitemap/JSON-LD узгоджені з output і base path.
- Жодних placeholder values, вигаданих claims, рейтингів чи цін.
- Rich Results/Schema validation без релевантних помилок; без обіцянок rich results.
- Static image URLs, direct refresh і true HTTP 404 перевірені на chosen hosting.

Офіційні джерела:
[LocalBusiness](https://schema.org/LocalBusiness),
[ProfessionalService deprecation](https://schema.org/ProfessionalService),
[Service](https://schema.org/Service),
[Google LocalBusiness guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business),
[Google documentation updates](https://developers.google.com/search/updates).
