# V.I.Pet — дизайн-система v1

Актуальне уточнення Header/Hero v2: [стан реалізації та перевірки](HEADER_HERO_IMPLEMENTATION.md).
GSAP/ScrollTrigger вже підключені для hero; single photo + text/light layers,
справжній локальний курсив, JPEG preview після проблеми AVIF у браузері.
Попередні згадки CSS-only hero нижче описують історичну v1.

Уточнено за desktop/mobile PNG у docs/references. Див.
[детальний аналіз](DESIGN_REFERENCE_ANALYSIS.md). References задають напрям, не
підтверджують бізнес-контент. Окремі logo/photo/font assets ще не надані.
50% immersive pet imagery, 35% editorial luxury, 15% restrained playful details.
Без generic pet template, надміру округлих cards, heavy sans headings чи clutter.

## Палітра й семантика

Файли main.scss/variables.scss/animations.scss/_breakpoints.scss підключені до Nuxt
після встановлення Sass користувачем; _fonts.scss завантажує local WOFF2. HEX — запропоновані web tokens,
не виміряні оригінальні design variables PNG.

CSS custom properties живуть у `app/assets/styles/variables.scss`. Темна основа
чергується з ivory editorial sections; це одна art direction, не theme switcher.

| Token                    | Значення  | Призначення                                    |
| ------------------------ | --------- | ---------------------------------------------- |
| `--color-black`          | `#0B0C0E` | Глибокий фон                                   |
| `--color-charcoal`       | `#1B1D21` | Піднята поверхня                               |
| `--color-ivory`          | `#F6F2E9` | Основний світлий текст/піднята світла поверхня |
| `--color-cream`          | `#F4E8DD` | Теплі світлі секції з reference                |
| `--color-gold-highlight` | `#F6D797` | Світлий край gold gradient/focus на темному    |
| `--color-silver`         | `#BEC2C8` | Другорядний текст на темному                   |
| `--color-gold`           | `#C7A668` | Primary fill, декоративний акцент на темному   |
| `--color-gold-ink`       | `#715323` | Акцентний текст на ivory                       |
| `--color-line-dark`      | `#737780` | Значущі межі на темному                        |
| `--color-line-light`     | `#8A8174` | Значущі межі на світлому                       |
| `--color-error-dark`     | `#FFB4AB` | Error на темному                               |
| `--color-error-light`    | `#9B2424` | Error на світлому                              |
| `--color-success-dark`   | `#A7D8B4` | Success на темному                             |
| `--color-success-light`  | `#245B35` | Success на світлому                            |

Semantic aliases: `--surface`, `--surface-raised`, `--text-primary`,
`--text-secondary`, `--border-control`, `--focus-ring`, `--feedback-error`,
`--feedback-success` перевизначати на wrapper світлої секції через `data-surface="light"`. Primary gold button
завжди має black text. Gold не використовувати для дрібного тексту на ivory.
На фотографіях читабельність забезпечує стабільна scrim/окрема текстова площина.

Перевірка Phase 0 за формулою relative luminance: ivory/black 17.51:1,
silver/charcoal 9.44:1, black/gold 8.46:1, gold-ink/ivory 6.34:1;
значущі межі dark/charcoal 3.76:1 і light/ivory 3.43:1. Error/success pairs
у визначених контекстах також перевищують 4.5:1. Це математична перевірка
токенів, не перевірка фактичного UI, фотографій, shimmer чи focus states.

Після уточнення warm palette перевірено cream pairs: black 16.24:1, gold-ink
5.88:1, control border 3.19:1, error 6.53:1, success 6.65:1. Black text на
gold gradient endpoints має 8.46:1 і 14.06:1; фактичний shimmer потребує UI-перевірки.

Перевірити кожну фактичну пару й стан, не лише базові swatches: 4.5:1 normal text,
3:1 large text та UI boundaries/focus. Disabled не позначати тільки кольором.

## Типографіка й перевірка шрифтів

Перевірено метадані Google Fonts 2026-11-03:

| Шрифт              | Підтримка / роль                                                               | Стартові ваги |
| ------------------ | ------------------------------------------------------------------------------ | ------------- |
| Cormorant Garamond | Cyrillic + Cyrillic-ext; українські editorial h1/h2 і prominent CTA            | 400, 500, 600 |
| Bodoni Moda        | Latin/Latin-ext; Cyrillic subset немає; лише вибрані English display fragments | 400–500       |
| Manrope            | Cyrillic + Cyrillic-ext; body, nav, labels, forms, numeric prices              | 400, 500, 600 |

Це перевірка сімейств, не вже завантажених WOFF2. Перед використанням перевірити
cmap фактичних файлів та візуальний specimen: `Ґґ Єє Іі Її Йй Жж — ’ «» ₴ 0123456789`.
Перевірити italic окремо, ліцензію OFL і збереження copyright. Не покладатися на
silent fallback для української у Bodoni. English fragments мають `lang="en"`.
Слова не перекладати англійською лише заради шрифту. Не відтворювати логотип шрифтом.

| Роль              | Розмір (fluid)                             | Line-height | Примітка                                   |
| ----------------- | ------------------------------------------ | ----------- | ------------------------------------------ |
| Hero display      | `clamp(3rem, 7vw, 7.5rem)`                 | 1.02–1.08   | Cormorant 400/500, без обрізаних діакритик |
| Section h2        | `clamp(2.25rem, 4.5vw, 4.75rem)`           | 1.1         | Cormorant 500                              |
| h3                | `clamp(1.625rem, 2.4vw, 2.5rem)`           | 1.2         | Cormorant 500/600                          |
| Body              | `clamp(1.125rem, 1.05rem + .2vw, 1.25rem)` | 1.6         | Manrope 400, measure 55–68ch               |
| Secondary / label | `1rem`                                     | 1.5         | Manrope 400/500                            |
| Prominent CTA     | `1.25rem`                                  | 1.2         | Cormorant 600                              |
| Price             | `clamp(1.5rem, 2.5vw, 2.25rem)`            | 1.25        | Manrope, tabular-nums                      |

Не зменшувати кнопки/labels до 12–14px заради luxury look. Letter spacing body 0;
display орієнтовно -0.015em, не шкодити українським літерам. Заголовки можуть
переноситися природно; не ставити desktop `<br>` без mobile перевірки.

Self-host WOFF2 із `font-display: swap`, потрібними unicode-range й subsets;
Bodoni завантажується лише за наявності тексту цією family. Preload тільки реально
критичних файлів першого екрана. Cormorant fallback — Georgia/serif, Manrope —
system-ui/sans-serif. Метрики fallback/size-adjust налаштувати після вимірювання;
перевірити затримане завантаження, не заявляти відсутність CLS заздалегідь.

## Сітка, простір, responsive

Єдине джерело width-breakpoints — `app/assets/styles/_breakpoints.scss`:

```scss
$medium: 768px;
$x-large: 1200px;

@mixin medium {
  @media (min-width: $medium) {
    @content;
  }
}

@mixin x-large {
  @media (min-width: $x-large) {
    @content;
  }
}
```

Mobile <768px: одна колонка, stacked narratives, swipe, без pin/parallax.
Tablet ≥768px: дві колонки там, де читабельно; без desktop pin.
Desktop ≥1200px: editorial asymmetry, до 12 grid tracks, scroll storytelling.
JS використовує відповідні min-width conditions; синхронність перевіряти тестом,
SCSS — нормативне джерело, не вводити інші viewport thresholds.

| Параметр              | Mobile            | Tablet            | Desktop                           |
| --------------------- | ----------------- | ----------------- | --------------------------------- |
| Container             | 100% мінус 2×20px | 100% мінус 2×32px | max 1440px, gutters fluid 40–80px |
| Text container        | max 68ch          | max 68ch          | max 68ch                          |
| Section padding block | 80–112px          | 112–152px         | 144–200px                         |
| Від h2 до content     | 32–48px           | 48–64px           | 64–80px                           |
| Grid gap              | 24px              | 32px              | 40–64px                           |

Spacing scale у rem: .25, .5, .75, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12.
Section spacing через clamp у межах таблиці. Не змушувати кожну секцію бути 100vh.
Hero: min-height приблизно 90svh з мінімумом для контенту, auto-height при довгому
тексті, zoom чи landscape; generous padding. Зарезервувати всю висоту layered
composition, а не лише aspect-ratio однієї фотографії. Decorative layers absolute
усередині визначеного box. Не перекривати CTA mobile safe areas.

## Компонентні правила

- Primary: gold fill, black serif text, padding приблизно 16×28px, min-height 52px,
  тонка межа, pill radius 999px за новим reference. Без стрілки. Одноразовий shimmer зліва направо за
  650ms при hover-capable/fine pointer; transform псевдоелемента, pointer-events none.
  Focus має окремий контрастний outline, reduced motion прибирає shimmer.
- Secondary: transparent із контрастною межею, той самий типографічний ритм.
  Text link — underline/focus, не маскувати link під неактивний текст.
- Form fields: native inputs/select/textarea, видимі labels, min-height 48px,
  helper/error text пов’язаний через aria-describedby, aria-invalid при помилці.
  Placeholder не замінює label. Default/hover/focus/error/disabled/submitting.
- Cards: editorial media + title + description, помірний radius 16px і делікатна
  світла межа за reference; без важких shadows/neumorphism. Для service grid на
  desktop 3+2 картки, tablet 2 колонки, mobile stacked. Gold price pill — текст,
  якщо не виконує реального вибору послуги. Service action — тільки реальне посилання/кнопка;
  не робити всю декоративну card clickable. Gold border reveal не є єдиним feedback.
- Certificate preview: contain без обрізання документа; gallery photo може cover.
  Модалка з caption, close, keyboard, Escape, focus return, full-size link.
- FAQ: native details/summary, кілька відповідей можуть бути відкриті; однакова
  доступність на mobile/desktop; відповіді SSR, без окремої прихованої mobile копії.
- Pricing: fieldset/legend для типу, native breed/service select, extras checkboxes,
  зарезервований result box і один polite live region після завершеного вибору.
- Feedback: іконка/текст, не лише колір; sending не є success. Error summary
  фокусується після невдалої перевірки, введені значення зберігаються.

## Зображення й motion tokens

Hero landscape 16:10 або 3:2, mobile portrait 4:5; конкретні crops затвердити з
власницею. Groomer portrait 4:5, service/editorial 3:4, before-after пари одного
співвідношення (початково 4:5), gallery mixed ratios у заздалегідь визначених cells.
Certificates — фактичне співвідношення, contain у стабільному frame. OG 1200×630.

Motion: micro 160–240ms, state 280–400ms, reveal 600–900ms, hero 900–1400ms,
stagger 60–100ms, count-up 1500–2000ms, shimmer 650ms. Ease-out для entrance,
ease-in-out для transitions. Зміст не залежить від анімації; докладно в
[ANIMATIONS.md](ANIMATIONS.md).

## Перший дизайн-review

Перевірити реальний logo + українські заголовки, один hero, одну service card,
CTA/form states і typography specimen на 360/768/1440px та 200% zoom. Це перевірочні
viewport-и, не нові breakpoints. Макет і фото затверджуються до деталізації motion.

Джерела: [Cormorant metadata](https://github.com/google/fonts/blob/main/ofl/cormorantgaramond/METADATA.pb),
[Bodoni metadata](https://github.com/google/fonts/blob/main/ofl/bodonimoda/METADATA.pb),
[Manrope metadata](https://github.com/google/fonts/blob/main/ofl/manrope/METADATA.pb).

## Уточнення за макетами

Кремова surface, gold gradients і capsule CTA замінюють попередній більш холодний
напрям. Декоративні rays/paw outlines стримані, aria-hidden, без постійного glow
loop; основні тексти й controls не запечені у фото. Device frames із mobile PNG
не є частиною UI. Дрібний raster text і compressed section heights не копіюємо:
18px body, generous section spacing і великі touch targets зберігаються.

Hero 90svh — мінімальна cinematic орієнтація, не fixed height: довгі тексти/landscape
або zoom можуть розширювати секцію. Desktop art direction та mobile crop потребують
окремих originals. На desktop Groomer і Certificates можуть бути в одній grid-групі;
на mobile — незалежні послідовні секції. FAQ та повна booking form присутні на обох.

## Поточний proof Header/Hero

Реалізовано перший екран із AI demo photo; деталі/джерела/обмеження перевірок у
[HEADER_HERO_IMPLEMENTATION.md](HEADER_HERO_IMPLEMENTATION.md). Typography wordmark
і V favicon тимчасові, не замінюють approved logo. Header brand descriptor — 8px
як частина logo lockup; це локальна design exception, body/nav/controls ≥16px.

## Курсор золотої лапки

Звичайні області та текст мають стандартний системний курсор. Золота лапка
SVG32×32, hotspot16×16 використовується лише на активних links/buttons,
select, summary та radio/checkbox із labels. Disabled і drag cursors збережені.
Лише hover/fine, forced-colors:none; fallback pointer. Один локалізований
!important у shared cursor module перекриває scoped cursor:pointer, щоб
не змінювати десятки компонентів. Без JS, URL обробляє Vite.
