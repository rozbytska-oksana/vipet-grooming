# Header / Hero — реалізація першого екрана

## Актуально: окремі шари Hero v6

За запитом користувача сцена розділена на static interior та прозорий foreground:
тварини, стіл, аксесуари й світлова стрічка. Обидва assets — дозволена AI-реконструкція,
можливі відмінності деталей від v5. Оригінали збережені окремо; checksum, розміри
і байти похідних — source-assets/hero-layers.manifest.json.

Інтер’єр займає всю секцію (object-fit cover), має плавну маску зліва, без
рухомого контейнера або прямокутної межі всередині Hero. Desktop-only source
media не завантажує інтер’єр на mobile; fallback — inline порожній SVG.
Передній шар однаковий на всіх пристроях, contain 3:2 з резервуванням місця.
На desktop його ширина обмежена 66vw і доступною висотою. Вступний рух та
scroll-parallax застосовані тільки до foreground; interior не є GSAP target.
Reduced-motion, SSR visible content і cleanup збережені.

Експорт: scripts/export-hero-layers.mjs, локальний sharp установив користувач.
Foreground: 480/768/1200/1536; interior: 1280/1920; AVIF + WebP fallback.
Alpha перевірено в обох форматах (min 0, max 255); WebP переглянуто на #303033.
768px foreground: AVIF 55 433 байти / WebP 125 060; 1536px AVIF 149 461.
Це розміри файлів, не виміряний приріст швидкості.

Перевірки: Prettier PASS; isolated generate PASS (5.60s); усі 12 derivatives
присутні в .output/public, обидва picture є в SSR HTML. Vue-tsc повідомляє
лише попередні дві TS18047 PricingSection.vue:172. Browser automation зараз
недоступна: responsive visual, reduced-motion runtime, hydration і CWV не перевірені.

## Експеримент: повноекранний desktop Hero

Desktop від 1200 px: min-height max(780px, 100svh). Нижче 780 px секція
може бути вищою за viewport, щоб зберегти читабельність. Tablet/mobile правила не змінено.
Контейнер Hero розширено до ширини секції; колонка тексту 34vw (мінімум 380px)
замість прив’язки до загального контейнера 1440px. Це відділяє текст від тварин.
Фотосцена зберігає пропорції 1983/793 і обмежується шириною та доступною
висотою екрана; 24px унизу залишено для scroll-parallax. Оригінали незмінні.
Додані делікатні золоті дуги лише на desktop; існуючі анімації хвиль збережені.

Перевірки: Prettier PASS; isolated nuxt generate PASS (4.22s).
Opera localhost, responsive override, без performance throttling:
1920×1080 візуально перевірено; геометрія 1200×750, 3439×1440,
768×1024 і 375×667 без горизонтального overflow. Native Windows не перевірявся.
Це перевірка layout, не вимірювання Core Web Vitals.

## Центрування тексту на високих мобільних екранах

Вільна висота mobile Hero розподілена порівну над intro і після actions.
Текст із цінностями центрується між header та фотосценою, фото лишається внизу.
Grid tracks minmax(0,1fr) стискаються на коротких екранах без обрізання контенту.
Tablet/desktop grid не змінено.

## Повноекранне мобільне меню

Останнє уточнення замінює dropdown: native dialog.showModal() займає100dvh,
має власний brand/close рядок, navigation і CTA внизу. Native modal забезпечує
inert background і focus containment; наявний body:has(dialog[open]) блокує scroll.
WAAPI opacity/translate: відкриття650ms, закриття350ms, reduced motion — одразу.
Escape закриває плавно, focus повертається на trigger; unmount очищає animation
та dialog. При desktop resize dialog закривається. Content scrollable на коротких
екранах, safe-area-inset-bottom врахований. Залежності не додані.
Browser375×667: Enter відкрив modal із focus на close; Escape закрив і повернув
focus на trigger; console errors/warnings порожні. Pointer automation повертав
timeout, тому відкриття перевірено клавіатурою. Prettier PASS.

## Мобільна навігація Graphite & Gold

Перероблено native details dropdown: graphite gradient, тонка золота рамка,
декоративна SVG хвиля, label «Світ V.I.Pet», numbered serif links30px,
делікатні розділювачі й активна крива, компактна фірмова CTA.
Панель максимум32rem, scrollable за висотою100svh; відкриття .45s,
reduced-motion вимикає рух. Це немодальний dropdown із native keyboard disclosure.
Desktop та користувацький BaseButton збережені.
Перевірено Opera375×667: Enter відкриває, Escape закриває і повертає focus
на summary; низ панелі584.8px, усі пункти й CTA вміщуються, horizontal overflow
немає, console errors/warnings порожні. Pointer automation повертав timeout;
клавіатурна перевірка виконана успішно. Prettier PASS.

## Desktop navigation: розмір і активний пункт

SiteHeader: desktop links20–22px замість16px. SVG крива під кожним посиланням
промальовується зліва направо через stroke-dashoffset за .6s на hover fine pointer,
focus-visible та aria-current=location. При reduced motion стан змінюється одразу.
Активність відповідає секції на30% висоти viewport; в Hero та секціях без власного
пункту активного посилання немає. Passive scroll listener оновлює стан через rAF;
listeners/кадр очищаються на unmount. Mobile links отримують aria-current також.
Стилі кнопки користувача збережені. Prettier PASS; browser #services визначив
«Послуги» активним, page overflow відсутній, console errors/warnings порожні.

## Компактніший мобільний Hero

До768px зменшено wordmark приблизно до71px при375px viewport, слоган до31px,
опис до16px, eyebrow до14px (декоративний label). Верхній відступ після header
12px замість40px, відступ до цінностей16px замість24px. Tablet/desktop
типографіка збережена. Зображення піднімається вище завдяки компактнішому тексту.

## Корекція золота без помаранчевого відтінку

Після відгуку користувача металевий gradient написів та іконок змінений
на #fff0bf / #e5c779 / #bfa05a / #d8bb70. Прибрано бурштинові
#edb84e / #bd8329 / #e6aa37. Світлові хвилі збережені.

## Насичене золото та ліві хвилі

Посилено металеву палітру Hero: бурштинове золото #edb84e/#e6aa37,
глибокий #bd8329 і світловий #ffe6a3. Додано окремий SVG шар ліворуч:
три криві, статичний glow і дві світлові точки за зразком референсу.
Криві промальовуються в наявному entrance; reduced-motion/cleanup успадковані
від GSAP matchMedia. На mobile шар вужчий і приглушений. Фото не змінено.

## Металеве золото й спрощення дій Hero

За прямим уточненням користувача прибрано CTA запису і «Наш підхід» із Hero,
разом із їх стилями та GSAP targets. Запис через header збережено.
Eyebrow і слоган мають металевий gradient із палітри виправленої користувачем
кнопки BaseButton (#c99a43/#f4dc97/#fff3c4/#e2bb66). Лапки, heart і award
використовують SVG gradient для stroke, лапки назви також для fill.
Без безперервного shimmer; forced-colors для тексту збережено.

## Уточнення за крупним фрагментом лівого блоку

Опис замінено на наданий користувачем текст у трьох рядках: «Професійний
грумінг у Житомирі, де турбота, краса та комфорт поєднуються в преміальному
догляді». Опис і eyebrow — Manrope; слоган збережено Cormorant italic.
Лапки тепер замінюють дві крапки й анімуються в послідовності символів.
Окрему появу лапок прибрано, проміжок назва–слоган зменшено.
Це уточнення замінює попередній короткий опис та serif стиль опису.

## Уточнення текстової композиції

Тварини й геометрія фотосцени збережені. Зменшено вертикальні інтервали
між eyebrow, назвою, divider, слоганом і діями. Desktop назва збільшена
до112–144px; лапки17px підняті ближче до базової лінії. Опис використовує
Cormorant Garamond22px/1.3 як у редакційній композиції референсу.
Затверджений короткий текст про грумінг собак і котів у Житомирі збережено.
Від768px цінності мають іконку поруч із підписом; mobile лишається компактним.
CTA та scroll link збережені відповідно до погодженого завдання.

## Повернення до затвердженої сірої палітри

За уточненням користувача Hero використовує #303033 / #232325 / #1C1C1E.
Світло розподілене горизонтально, без світлої сірої плями зверху. Нижній край
фотосцени отримав делікатний графітовий CSS overlay; оригінал фото не змінений.
Header gradient також нейтральний графітовий. Золото й анімації збережені.
Це уточнення замінює попередню теплу основу #191817. Інші секції не змінені.
Prettier перевірено; відповідність кольорів у браузері ще не перевірена.

## Посимвольна поява назви

Hero wordmark розбитий на сім декоративних spans: V, крапка, I, крапка, P, e, t.
Кожен проявляється за .95s зі зміщенням18px; stagger .17s, початок на .45s.
Лапки проявляються окремо. Inline-flex не додає пробілів між символами;
місце під назву зарезервоване. Для assistive technology лишається один
текст V.I.Pet, декоративні символи aria-hidden. SSR/no-JS та reduced motion
показують цілу назву без приховування. Перевірено Prettier; browser QA цієї
зміни не виконано.

## Плавність entrance — уточнення після відгуку

Послідовність Hero подовжена з 2.2 до 3.65s. Easing sine.out замість
power3.out дає спокійніший початок; фото проявляється 2s, назва 1.6s,
слоган 1.5s. Інтервали між етапами збільшено, цінності мають stagger .16s,
CTA починає з’являтися на 2.25s. Reduced motion і завершення entrance при
клавіатурному фокусі збережені. Зміна лише таймінгів; перевірка Prettier,
без повторного browser QA у цьому уточненні.

## Корекція фону після відгуку користувача

Прибрано світлі сірі radial gradients: основа тепер єдина тепла темна,
з дуже слабким золотим освітленням біля сцени. Desktop висота 780–850px,
вертикальні відступи зменшені, щоб скоротити порожню зону над тваринами.
Це уточнення має пріоритет над попередніми розмірами нижче.

## Поточне оновлення Hero — 2026-11-04

Цей розділ має пріоритет над історичними описами нижче. Завдання: лише Hero,
за CODEX TASK 01 і Hero-частиною DESIGN_AND_MOTION_SPEC.md. Інші секції,
shared BaseButton, Header markup, залежності й оригінали не змінювалися.

- Оновлені HeroSection.vue та useHeroMotion.ts. Graphite & Gold палітра локальна
  до Hero, щоб не змінювати інші секції. Desktop 40% для тексту, висота 820–950px
  з можливістю росту за контентом. На tablet/mobile вертикальна композиція.
- Затверджений слоган і короткий опис; мінілапки, divider, три цінності,
  велика CTA на всіх ширинах і доступне посилання «Наш підхід».
- Збережено всю desktop JPEG сцену: собака, кіт, оксамит, дуга, лапка, ножиці,
  щітка та флакон. М’яка маска усуває стик фото з графітовим освітленням.
  SVG стрічки і сім нерухомих світлових точок доповнюють сцену.
- GSAP entrance перекриває етапи в межах 2.2s: фон/Header .5–.6s,
  бренд .8–1s, divider .9s, фото 1.3s (opacity, scale1.04, y35 desktop),
  слоган .9s, текст .7s, SVG stroke reveal 1.1s, частинки, stagger цінностей,
  CTA .7s та scroll indicator останнім. Mobile менші transform distances.
- Desktop ScrollTrigger без pin: фотошар +22px, стрічки +10px, світло +8px,
  текст слабшає наприкінці Hero. Окремі wrappers не конфліктують з entrance.
- CTA використовує наявний CSS shimmer, локально .7s, без руху тексту/стрілки.
  Фокус усередині Hero/Header завершує entrance, щоб control не лишався прозорим.
- matchMedia вимикає рух при reduced-motion; revert повертає статичний стан,
  cleanup прибирає власні timeline/ScrollTrigger/listeners, async unmount guard.
  SSR контент видимий без GSAP; deep-link нижче Hero не запускає entrance.

### Фактичні перевірки

Opera, localhost:3000, 2026-11-04, без throttling, звичайний кеш; browser zoom
залишено користувацьким. CSS widths 1440, 1279 (найближче доступне до1280 при
цьому zoom), 1024,390: screenshots і відсутність horizontal page overflow.
Мобільна геометрія після виправлення: фотосцена390px, CTA300px при viewport390px.
Desktop final elements opacity1; entrance спостережено після reload.
При scrollY576 фотошар мав translateY10.4676px, тобто scroll-driven рух працює.
CTA переводить activeElement на booking-title; реального надсилання немає.
Console errors/warnings — порожній результат. Prettier двох файлів — PASS.
Static generate в ізольованій копії — PASS; vue-tsc показав лише два TS18047
у PricingSection.vue:172 (можливий null range), цей файл не змінювався.
ESLint не встановлений/не налаштований, lint не запускався.

Browser keyboard press API повернув timeout, тому повний keyboard QA не
зараховано. Live reduced-motion toggle, no-JS browser mode, cold-cache CLS,
Lighthouse і client remount cleanup у браузері не перевірені. Reduced-motion
та cleanup перевірені по реалізації, це не заміна browser QA.

### Обмеження ресурсів

Тварини, велика дуга, фонова лапка й аксесуари об’єднані в JPEG: вони проявляються
разом. Окреме промальовування великої дуги та незалежна поява ножиць/щітки/флакону
потребують окремих прозорих шарів; їх у поточних ресурсах немає. Stroke reveal
реалізований для додаткових SVG стрічок. Наявні original assets не ретушувалися.
Офіційного SVG логотипа немає; типографічна назва та лапки залишаються preview.
JPEG лишається активним через раніше зафіксовану проблему AVIF. Виміряних
показників LCP/CLS/INP та заяви про production-ready результат немає.

Статус: код реалізований 2026-11-03. Це preview першого екрана, не готовий до
production сайт і не повна реалізація всіх секцій. Користувач дозволив тимчасові
нереальні зображення; бізнес-дані з reference не додавалися.

## Оновлення за зауваженням до референсу — 2026-11-03

Цей розділ описує актуальну v2; нижче залишена історія v1.

- Header тепер накладається на єдину темну фотосцену. Desktop навігація наближена
  до референсу; логотип поки типографічний із лапкою, не оригінальний знак.
- Hero: великий V.I.Pet, золотий справжній Cormorant Garamond italic «Кожен
  улюбленець особливий», короткий локальний опис, горизонтальні цінності.
  На desktop CTA у header; на mobile дублюється під текстом. Header не sticky.
- Нова тимчасова AI-сцена: `source-assets/generated/hero-scene-v2.png`.
  Prompt: `source-assets/generated/hero-scene-v2.prompt.md`;
  checksum/derivatives: `source-assets/hero-scene-v2.manifest.json`.
  Це вигадані тварини та інтер’єр, не підтвердження реальних робіт.
- JPEG srcset 640/1280/1983; AVIF candidates переміщені поза public у
  `source-assets/generated/avif-validation`: native decode успішний, але Opera
  показувала порожню фотосцену. До виправлення encoder/browser compatibility
  активним лишається JPEG. Оригінали та v1 не змінені.
- GSAP встановив користувач. `useHeroMotion` динамічно імпортує GSAP/ScrollTrigger,
  запускає text stagger, image scale 1.06→1 (mobile 1.025→1), halo і ribbon reveal.
  Desktop scroll: picture +32px, intro −16px, scrub .5, без pin.
  Це шари фото/текст/світло; пес і кіт ще не незалежні cutout layers.
- Reduced motion через matchMedia: повернення до статичного стану, без повторного
  entrance при перемиканні; cleanup через media.revert, async unmount guard.
  SSR зберігає видимі h1, текст та фото, імпорт не блокує LCP видимість.
- Browser QA: Opera localhost:3000, 2026-11-03, CSS viewport 390×844 і 768px:
  зображення завантажується, horizontal overflow відсутній; mobile меню відкривається,
  Escape закриває; booking dialog має initial focus, Escape повертає focus на CTA.
  Desktop композиція перевірена при CSS width 1440px. При viewport 1440×450 і
  scrollY 213.75 DOM показав photo translateY 14.74px та text −7.37px: parallax працює. Dev console без errors/warnings.
  Viewport override враховував існуючий browser zoom; zoom користувача не змінювали.
- Production generation — PASS (Node 24.22.0, Nuxt 4.6.4). Запущена в ізольованій тимчасовій копії із symlinks
  на встановлені пакети та окремим node_modules/.cache, щоб не конфліктувати з dev server користувача.
  Повторний build спершу виявив спільний Nuxt cache через symlink усього
  node_modules; після ізоляції cache фінальна генерація й HTML/assets/checksums — PASS.
  Browser reduced-motion toggle, cold-cache CLS, Lighthouse і повний typecheck/lint
  ще не перевірені. Історичні результати v1 нижче не є перевірками v2.

## Історія v1: що працювало в коді

- SiteHeader: тимчасова типографічна композиція V.I.Pet з власною SVG лапкою,
  desktop nav, tablet CTA, mobile native details/summary menu. Це не відтворений
  офіційний SVG-логотип; його треба замінити на original asset.
- Пункти майбутніх розділів поки spans з aria-disabled, без broken hrefs. Головна
  веде до #hero. У data/navigation.ts available змінюється лише разом із реальною
  секцією. Перевіряти aria-current, коли додаватиметься активна scroll navigation.
- Mobile menu має native keyboard disclosure, Escape/вибір закривають його та
  повертають focus. Це dropdown, не modal drawer, тому focus trap не потрібний.
- Hero: Ukrainian h1 + editorial wordmark, dark/gold composition, dog/cat image,
  SVG halo/ribbon, цінності як brand principles, а не статистика/сертифікація.
- Gold capsule CTA зі serif, короткий hover shimmer лише при fine pointer і
  no-preference. CSS text translation не приховує текст або LCP image; reduced
  motion вимикає entrance. Немає GSAP, parallax, scroll interception або loops.
- CTA відкриває BookingPreviewDialog: чесне пояснення, що онлайн-запис недоступний.
  Native dialog забезпечує modal semantics, Escape/inert background; у коді є
  initial focus, close/backdrop actions і focus return. Немає fake submission.
- App.vue підключає NuxtPage, index.vue — header/hero/dialog. Preview noindex,
  український lang, немає фіктивного canonical, контактів, цін або LocalBusiness.
- Shared SCSS підключено; один набір 768/1200px breakpoints, local WOFF2, SVG favicon
  як тимчасовий V monogram. Лише дрібний 8px descriptor у brand lockup має локальну
  design exception; це не body/nav/control text, вони 16px або більші.

## Тимчасові зображення й fonts

AI original: source-assets/generated/hero-pets-demo.png, generated built-in image_gen.
Точний prompt: [generation record](../source-assets/generated/hero-pets-demo.prompt.md).
[Manifest](../source-assets/manifest.json) містить SHA-256, розміри й bytes.

Published derivatives: public/images/hero/pets-demo-{480,960,1536}.{avif,jpg}.
AVIF розміри приблизно 14/44/107KiB; JPEG fallback приблизно 39/139/339KiB.
Native codec AVIF декодовано назад у PNG для візуальної перевірки якості.
Зменшення bytes — властивість файлів, не виміряне покращення LCP.

Native picture + srcset/sizes не потребують image server; Nuxt Image ще не
встановлений і не заявляється використаним. Після вибору остаточного pipeline
можна підключити його без зміни source ownership. Actual image eager/high priority;
container geometry резервується до fetch/decode. CSS object-position — тимчасовий
responsive crop; це не окремі реальні photo layers для parallax.

Cormorant Garamond/Manrope: локальні variable normal WOFF2 400–600 із latin,
cyrillic, cyrillic-ext. CSS ranges включають українські Ґґ/Єє/Іі/Її; visual glyph
specimen у браузері ще не перевірений. Font assets через relative CSS imports
отримують Vite hashes/base paths; ліцензії OFL у public/fonts. Немає synthetic
italic у hero; Bodoni не завантажується, бо поки не використовується.

## Перевірки та межі

- Root static generate виконано на встановленому Node 24.22.0, Nuxt 4.6.4.
- Subpath /vipet-preview/ generation і artifact validation — PASS. Фінальна root
  generation/validation — PASS, output відновлений для `/`. Перевірено uk/one h1,
  noindex, anchor targets, усі image/head/script/font URLs, priority/dimensions/alt,
  OFL notices і відсутність temporary codec files.
- Local static preview на 127.0.0.1:4173 повернув HTTP 200; отриманий HTML
  byte-for-byte збігається з фінальним root output. Це не browser rendering test.
- Browser UI tests не виконані: browser access host unavailable, native Computer
  Use permissions not granted. Тому mobile/desktop screenshots, keyboard/focus,
  actual hydration, reduced-motion rendering і CLS/INP не вважаються перевіреними.
- TypeScript/vue-tsc/ESLint/Prettier checks не виконані: ці dev tools ще не
  встановлені. Nuxt client/server compilation не замінює повний typecheck.
- npm/lockfile створені користувачем; агент не встановлював/оновлював залежності.

## Перегляд і наступні дії

`.nvmrc` вказує на вже встановлений Node 24.22.0. Для dev у корені:

```sh
nvm use
npm run dev
```

Спочатку перевірити layout у браузері на mobile/desktop, menu/CTA/Escape/focus,
no-JS/reduced motion та холодне завантаження fonts/images. Потім узгодити перший
екран, замінити logo/фото й додавати наступні секції з реальними anchors. До live
booking/production потрібні verified content, endpoint, origin і окрема авторизація.

## Продовження інтер’єру на desktop

Декоративний SVG viewport показує лише верхній правий фрагмент існуючої
фотосцени (1450 0 530 200), без тварин. Opacity 0.32, статичний blur 3px
та radial mask розчиняють його у фоні. Основний кадр і оригінали незмінні.
Шар aria-hidden, без pointer events, прихований нижче 1200px.

## Уточнення арки над собачкою

Розмите продовження та CSS-еліпси прибрані. Desktop використовує AI-редаговану
копію scene-v3 з округлою аркою над пуделем. Source PNG, checksum та JPEG
1280/1983 збережені окремо. AI-реконструкція може мати дрібні відмінності деталей.
Mobile/tablet використовують v2. Оригінали не змінено.

## Природний світловий розчерк v4

За відгуком користувача рівномірну подвійну арку замінено асиметричним
світловим розчерком: локальний світлий відблиск, змінна товщина і прозорі кінці.
Переглянуто згенерований asset; desktop picture підключений до v4.
Попередні оригінали збережені. Перевірка у браузері не виконана.

## Ліві світлові стрічки

SVG-криві отримали асиметричні вигини, прозорі заповнені стрічки зі
звуженням та компактніші відблиски на вигинах. Збережено existing reveal
і reduced-motion; raster assets не змінювалися.

## Структура лівого сяйва

Ліві SVG-стрічки пом’якшено: прозорість градієнта змінюється вздовж
траєкторії, контури тонші, заповнення з легким blur, відблиски витягнуті
за напрямком кривої. Орієнтир — світловий розчерк scene-v4.

## Вищий desktop фон v5

Для desktop від 1200px зі співвідношенням viewport до 2:1 підключений
окремий 8:5 AI-фон: інтер’єр продовжено вгору панелями та світильниками.
Ширина обмежена доступною висотою, тому весь кадр вміщується без обрізання.
Широкі viewport лишаються на v4, tablet/mobile — v2. Source та checksum збережено.

## Повноекранний tablet Hero

Прибрано tablet reset min-height:0. На всіх розмірах секція має min-height
100svh; tablet layout враховує header і верхній padding. Вільна висота
розподіляється над текстом та між цінностями й фото, фото лишається внизу.
Desktop окремо скидає grid rows/min-height внутрішнього контейнера. На коротких
екранах природна висота контенту може перевищити viewport без обрізання.

## Оригінальні логотипи та срібний Hero wordmark

Header/mobile menu і footer використовують надані оригінали. Hero-літери
зберігають GSAP stagger та отримали срібний CSS gradient, лапки — золоті.
Джерела, похідні й перевірки: [BRANDING_ASSETS.md](BRANDING_ASSETS.md).

## Точний фірмовий напис Hero

Шрифтову імітацію замінено crop оригінального PNG02. Сім CSS clip-шарів
зберігають GSAP-появу символ за символом, точні тонкі штрихи та кольори.
Деталі crop та перевірок — [BRANDING_ASSETS.md](BRANDING_ASSETS.md).

## 7 листопада 2026 — світло на спільному передньому шарі v8

За уточненням власниці світловий вигин лишається у PNG разом із тваринами, а не окремим SVG/DOM-шаром. AI-редагування v6 прибрало з’єднання стрічки зі столом: нижній лівий край згасає вище столу, верхній вигин ширший та має відступ над собакою. Демо-тварини й композиція візуально збережені; AI-редагування не є гарантією піксельної тотожності деталей.

Джерело source-assets/generated/hero-foreground-v8.png збережено окремо; оригінал v6 не змінений. SHA-256, розміри та bytes у source-assets/hero-foreground-v8.manifest.json. Responsive AVIF/WebP 480/768/1200/1536, alpha перевірено. Interior залишається v6. Мобільний/десктопний layout та анімації не змінені. Неактивний v7 без стрічки не підключено до сайту, його похідні прибрані з public.

## Плавна навігація між секціями

Глобальний html scroll-behavior:smooth лише за prefers-reduced-motion:no-preference. Native anchor links (header/footer/services/skip link) використовують браузерний скрол без бібліотек чи перехоплення коліщатка. Mobile menu спершу завершує закриття dialog, потім змінює hash; повторний перехід на поточний hash викликає scrollIntoView. CTA booking вже враховує reduced motion окремо. Ручний scroll і Embla-каруселі не змінені.
