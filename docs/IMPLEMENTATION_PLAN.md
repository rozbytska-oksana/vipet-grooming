# V.I.Pet — план реалізації й запуску середовища

Актуальне уточнення Header/Hero v2: [стан реалізації та перевірки](HEADER_HERO_IMPLEMENTATION.md).
GSAP/ScrollTrigger вже підключені для hero; single photo + text/light layers,
справжній локальний курсив, JPEG preview після проблеми AVIF у браузері.
Попередні згадки CSS-only hero нижче описують історичну v1.

Документація Phase 0 створена 2026-11-03; нижче збережено roadmap і історію
ручної ініціалізації. Nuxt starter уже існує. Команди створення/перенесення не
повторювати. Користувач установив starter dependencies і Sass; Header/Hero preview реалізовано.

## Поточний стан — Header/Hero preview

Реалізовані SiteHeader/HeroSection, BaseButton/BaseContainer/BaseIcon,
BookingPreviewDialog, index route і NuxtPage. Global SCSS активний, Cormorant/Manrope
локальні; AI demo hero має AVIF/JPEG responsive variants. User встановив залежності
та Sass; агент не запускав install/update і не редагував lockfile.

Поточна реалізація та asset provenance:
[HEADER_HERO_IMPLEMENTATION.md](HEADER_HERO_IMPLEMENTATION.md).

Перевірки виконано на вже встановленому Node 24.22.0, resolved Nuxt 4.6.4:

- Root `npm run generate` — PASS.
- `NUXT_APP_BASE_URL=/vipet-preview/ npm run generate` — PASS.
- Обидва output artifacts: uk, один h1, noindex, валідні fragment targets,
  усі 17 image/script/head asset references і 5 зовнішніх font references
  розв’язуються; LCP candidate eager/high priority з width/height/alt; OFL notices
  присутні; temporary codec files відсутні.
- Native AVIF decoding/dimensions для 480/960/1536 та visual quality decoded 960px
  — перевірені; це перевірка картинки, не screenshot або performance audit сторінки.
- Фінальний output відновлено для root `/`, не залишено subpath build.
- UI screenshots/keyboard/hydration/reduced motion/CLS/INP не перевірені: browser
  access host unavailable, Computer Use permissions not granted.
- Full lint/format/typecheck не виконані: відповідні dev tools ще не встановлені;
  client/server compilation не замінює ці перевірки.

Наступне: browser QA першого екрана, затвердження композиції, approved real assets
і поступове додавання наступних секцій. Preview noindex, live booking відсутній.

## Історія — стан після аналізу референсів

Користувач створив Nuxt 4 starter вручну. За наступним дозволом шаблон перенесено
з `.nuxt-bootstrap` у корінь проєкту: усі 8 файлів звірено за SHA-256, тимчасову
папку видалено. AGENTS.md і docs збережені. Залежності ще не встановлені,
build/typecheck не запускалися. Після отримання desktop/mobile PNG створено
DESIGN_REFERENCE_ANALYSIS.md, CONTENT.md, style tokens і typed empty data;
папки ui/layout/sections/composables/pages містять README з контрактами, не
реалізовані SFC/interaction functions. main.scss ще не підключений до Nuxt,
щоб не вимагати відсутній Sass до ручної інсталяції. Команди створення й перенесення нижче вже виконані;
повторно запускати їх не потрібно. Залежності фактичного starter слід звірити перед
подальшою інсталяцією, не замінювати їх механічно запланованими версіями нижче.

## Результат огляду

Початково каталог був порожнім: не було package.json, package manager/lockfile,
scripts, application code, assets чи локальних project conventions. Git успадкований від
каталогу вище, а не локальний до цього проєкту: не використовувати `git add .`
з батьківського каталогу й не змінювати його конфігурацію.
Локальні версії на момент огляду: Node v20.20.2, npm 10.8.2.

Node 20 вже EOL за поточною офіційною таблицею. Рекомендований консервативний
runtime — актуальний Node 24 LTS (не нижче 24.11 для сучасного Nuxt CLI); перед
установкою перевірити engines обраних пакетів. Не змінювати Node автоматично.
Для CI згодом зафіксувати перевірений patch runtime/package manager і lockfile.
Nuxt залишається major 4, незалежно від того, на який major вказує latest creator.

## Команди, які виконує користувач (ініціалізація нижче — історична)

Рекомендований manager — npm. Creator/copy commands нижче збережені як історія
для початкового docs-only стану; не повторювати поверх нинішнього starter. Вони потребують
мережі; creator завантажує шаблон, а npm install встановлює пакети. Не застосовувати
`--force`. У prompts не вмикати git initialization або додаткові modules.

Якщо використовується вже встановлений nvm і немає підтримуваного runtime:

```sh
nvm install 24
nvm use 24
node --version
npm --version
```

Якщо nvm відсутній — встановити/обрати Node 24 LTS звичним для користувача способом;
не встановлювати ще один version manager лише для цього проєкту.

Створити шаблон у тимчасовому підкаталозі, щоб зберегти AGENTS.md і docs:

```sh
cd /Users/oksanarozbytska/Desktop/Work/Personal/vipet-grooming
npm create nuxt@latest .nuxt-bootstrap -- --template v4 --no-install --no-modules --packageManager npm
```

Перевірити повідомлення creator і вміст шаблону. Якщо creator не підтримує template
v4, зупинитися й перевірити офіційний starter; не переходити мовчки на інший Nuxt major.
Після успішного створення, поки у root досі лише документація:

```sh
cp -Rn .nuxt-bootstrap/app .
cp -n .nuxt-bootstrap/package.json .nuxt-bootstrap/nuxt.config.ts .nuxt-bootstrap/tsconfig.json .nuxt-bootstrap/.gitignore .
if [ -d .nuxt-bootstrap/public ]; then cp -Rn .nuxt-bootstrap/public .; fi
```

Це копіює лише визначені starter files, не AGENTS.md/docs і не .git. `-n` не
перезаписує наявні файли. При появі root application files перед цим кроком потрібне
ручне порівняння, а не повторне копіювання. Зберегти `.nuxt-bootstrap` до звірки;
після успішного перенесення користувач може видалити тільки цей temporary folder.
Не включати його у release, Git, lint чи format scans.

Перед інсталяцією перевірити сумісність latest tooling з Nuxt 4 і Node 24:

```sh
npm view nuxt@4 version engines
npm view @nuxt/image peerDependencies engines
npm view @nuxt/eslint peerDependencies engines
npm view @nuxt/test-utils peerDependencies engines
npm view vitest peerDependencies engines
```

Якщо peer ranges не сумісні — підібрати відповідний офіційно підтримуваний major
і виправити команду до інсталяції; не застосовувати `--legacy-peer-deps` чи force.
Це перевірка майбутнього registry state, не гарантія сумісності невстановлених latest.

Наступні dependency commands — актуальні для наявного starter. Nuxt/Vue/router
не перевстановлювати: фактичний starter містить Nuxt ^4.6.3, Vue ^3.5.44,
vue-router ^5.4.0. Попередню рекомендацію router@4 скасовано; не знижувати major
механічно. Перед інсталяцією звірити peers із цим наявним набором.

```sh
npm install @nuxt/image gsap embla-carousel-vue@8
npm install -D typescript vue-tsc @types/node sass eslint @nuxt/eslint eslint-config-prettier prettier vitest @nuxt/test-utils @vue/test-utils happy-dom
```

Після створення/погодженого merge конфігурації в milestone 1:

```sh
npm run dev
```

Не запускати наступні generation/type-generation processes одночасно з dev, якщо
вони пишуть у ту саму `.nuxt`; спочатку зупинити власний dev process.
Ініціалізація не публікує сайт. Не виконувати git init/commit/push/deploy автоматично.

## Залежності та обмеження

| Пакет                                        | Група           | Навіщо                                                              |
| -------------------------------------------- | --------------- | ------------------------------------------------------------------- |
| nuxt, vue, vue-router зі starter             | dependencies    | Зберегти наявні версії, не знижувати router major                   |
| @nuxt/image                                  | dependencies    | Responsive image URLs і static derivatives                          |
| gsap                                         | dependencies    | ScrollTrigger входить у пакет, окремого scrolltrigger package немає |
| embla-carousel-vue@8                         | dependencies    | Vue carousel, без autoplay plugins                                  |
| sass                                         | devDependencies | SCSS compile                                                        |
| typescript, vue-tsc, @types/node             | devDependencies | Type checking/config types                                          |
| eslint, @nuxt/eslint, eslint-config-prettier | devDependencies | Nuxt flat config, correctness без formatter conflicts               |
| prettier                                     | devDependencies | Єдиний formatter                                                    |
| vitest                                       | devDependencies | Pure domain/unit tests                                              |
| @nuxt/test-utils, @vue/test-utils, happy-dom | devDependencies | Цільові Nuxt/Vue component tests у сумісному test environment       |

Не потрібні зараз: Pinia, Tailwind/UI kit, Zod, form framework, axios, jQuery,
smooth-scroll library, CMS, carousel autoplay, paid animation plugins, повний SEO
suite. ImageMagick/sharp direct dependency або browser automation packages — лише
якщо конкретний pipeline/testing вимагає й користувач погодить інсталяцію.
Backend SDK/provider package оцінюється окремо після delivery decision.

## Підготовка архітектури за референсами — виконано

- Переглянуто обидва PNG; зафіксовано розміри, SHA-256 і section-by-section аналіз.
- Створено app/assets/styles із main/variables/animations/_breakpoints; palette тепла,
  CTA pill, motion tokens з reduced-motion overrides. Це ще не style integration.
- Створено types/content.ts та порожні services/breeds/pricing/faq collections.
- Створено папки компонентів, composables, pages і public/images. README описують
  майбутні файли, контракти та межі; порожні SFC/composables не створювалися.
- Синхронізовано порядок секцій: Groomer → Certificates → BeforeAfter, решта brief
  збережена. Додано CONTENT.md; дані макетів не перенесені в business content.
- Додано baseline .prettierrc.json/.editorconfig/.prettierignore; references/binary
  assets/lockfiles не форматуються. ESLint/scripts додаються у milestone 1 після install.
- Starter app.vue/nuxt.config.ts/package.json не змінені. Packages/lockfile відсутні.

Статичні перевірки scaffold: local Markdown links і JSON-приклади валідні;
relative imports data/types існують; 57 CSS tokens визначені без missing references;
нові cream/gold contrast pairs проходять визначені пороги; SHA-256 обох PNG
збігаються з початковими. Нові папки не мають macOS hidden flag.
Це не compiler/lint/typecheck/build/browser checks: потрібні залежності й глобальні
tsc/sass/prettier відсутні. Порожні каталоги не замінюють перевірки реального контенту.

## Milestone 1: technical foundation і дизайн-примітиви

Рекомендований наступний implementation milestone після підготовки архітектури. Це
обмежений фундамент, ще не повний сайт і не всі scroll-сцени.

Залежності: встановлені сумісні пакети; реальний logo/photo потрібні для hero
proof, але не блокують tooling, tokens і typography specimen.

Роботи:

1. Звірити створений Nuxt 4 starter, strict TypeScript, app directory, SSR/SSG; не ініціалізувати повторно.
2. Merge tooling нижче, підключити підготовлені tokens/breakpoints після Sass install; fonts лише з реальних assets, semantic shell/skip link.
3. Typography specimen з українськими літерами, primary/secondary CTA і form states;
   styles у scoped SCSS, shared variables — у assets/styles.
4. Image spike: одна дозволена фотографія, static AVIF/WebP/fallback, mobile crop,
   certificate full-size URL; перевірити `.output/public` без runtime image server.
5. Один static hero proof на реальних assets після їх отримання; без важкого motion.
6. Preview noindex, без реальної відправки заявки, без непідтверджених business claims.

Acceptance: scripts проходять; Nuxt 4 підтверджений; visible SSR/no-JS content;
немає hydration warnings; keyboard/focus і contrast перевірені; mobile/tablet/
desktop без overflow; delayed-font/image first paint перевірено; static image URLs
існують у output. Немає фіктивної форми success або опублікованого preview.

## Tooling contract для milestone 1

Prettier/EditorConfig/ignore baseline нижче вже створений. ESLint/scripts snippets
ще є планом. Merge із реальним starter, не перезаписувати сторонні зміни.

`.prettierrc.json`:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 100,
  "endOfLine": "lf",
  "singleAttributePerLine": true,
  "vueIndentScriptAndStyle": false,
  "overrides": [
    {
      "files": "*.vue",
      "options": {
        "htmlWhitespaceSensitivity": "ignore",
        "bracketSameLine": false
      }
    }
  ]
}
```

`.editorconfig`:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.py]
indent_size = 4

[*.md]
trim_trailing_whitespace = false
```

Додати `@nuxt/image` і `@nuxt/eslint` у Nuxt modules, explicit SSR, global SCSS entry;
після `nuxt prepare` Nuxt ESLint створює `.nuxt/eslint.config.mjs`.
Рекомендований `eslint.config.mjs`:

```js
import withNuxt from './.nuxt/eslint.config.mjs';
import prettier from 'eslint-config-prettier';

export default withNuxt(
  {
    ignores: [
      '.nuxt/**',
      '.output/**',
      '.nuxt-bootstrap/**',
      'node_modules/**',
      'source-assets/**',
      'coverage/**',
    ],
  },
  prettier,
  {
    files: ['**/*.vue'],
    rules: {
      'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
      'vue/block-lang': ['error', { script: { lang: 'ts' }, style: { lang: 'scss' } }],
      'vue/padding-line-between-blocks': ['error', 'always'],
    },
  },
);
```

Prettier ignore: `.nuxt/`, `.output/`, `.nuxt-bootstrap/`, `node_modules/`,
`coverage/`, `source-assets/`, retained binary media/fonts і vendor/reference
snapshots, усі manager lockfiles. Не ігнорувати весь public: SVG/robots потребують
контролю за змістом. Під час реалізації перевірити pattern semantics інструментів.

Scripts для merge в package.json:

```json
{
  "dev": "nuxt dev",
  "build": "nuxt build",
  "generate": "nuxt generate",
  "preview": "nuxt preview",
  "postinstall": "nuxt prepare",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "lint": "npm run format:check && eslint .",
  "lint:fix": "eslint . --fix && npm run format",
  "typecheck": "nuxt typecheck",
  "test": "vitest run",
  "test:watch": "vitest",
  "check": "npm run lint && npm run typecheck && npm run test"
}
```

`vitest.config.ts` має відокремити node unit tests від Nuxt/happy-dom component
projects за API встановлених сумісних версій. Не писати тести, які лише повторюють
SCSS чи статичну розмітку. До появи змістовних test cases не заявляти tests passing
і не маскувати відсутність тестів blanket `passWithNoTests` у фінальному CI.
CI після ручного налаштування: npm ci → prepare/check → generate → artifact checks;
не автоматичний deploy. Lockfile/runtime фіксуються після реальної інсталяції.

## Наступні фази

| Фаза                        | Залежності                         | Роботи                                                                        | Acceptance / перевірки                                                       |
| --------------------------- | ---------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 0 — документація            | Поточний brief                     | 8 Markdown-файлів, рішення/ризики/команди                                     | Усі файли та local links, однакова структура/токени, без application files   |
| 1 — foundation              | Ручна ініціалізація                | Tooling, tokens, typography, image spike, static hero proof                   | Критерії вище, без release                                                   |
| 2 — semantic content        | Logo/photos/approved copy          | Усі 13 секцій, data models, native FAQ/nav, static gallery                    | SSR/no-JS, headings/alt, keyboard, mobile, немає placeholders у release      |
| 3 — pricing/form UI         | Погоджений pricing dataset         | Pure calculator, extras/ranges, prefill, validation; real submit disabled     | Unit cases, pet change reset, focus/live regions, збереження введених PII    |
| 4 — media interactions      | Реальні before-after/certificates  | Range slider, Embla, full-size dialog                                         | Touch/keyboard/Escape/focus return, no-JS links, static image completeness   |
| 5 — motion                  | Стабільний responsive layout       | Hero/Groomer/ScrollTrigger scenes, count-up з verified stats                  | Reduced motion, once, cleanup/remount, mobile perf, без scroll hijacking     |
| 6 — booking delivery        | Hosting/provider/одержувач/privacy | Endpoint/adapter, server validation, rate limits/idempotency                  | Реальна авторизована доставка, 422/429/5xx/timeout/retry, немає fake success |
| 7 — SEO/release preparation | Verified origin/NAP, весь контент  | Metadata/schema/sitemap/robots/404, performance audit, packaged static output | Артефакти, root/base paths, Lighthouse/trace, контент і права погоджені      |
| 8 — publication             | Окремий дозвіл власниці            | Deploy і live verification                                                    | TLS/redirects/headers/pages/assets/404/indexing, rollback copy поза public   |

Delivery decision можна досліджувати паралельно із static content, але live booking
не може випередити endpoint/privacy approval. Motion не повинен маскувати нестабільний
layout. Немає обов’язкових термінів або оцінки годин без реального content inventory.

## Перевірки реалізації та performance

Після milestone зі змістовними тестами, послідовно, без конкурентних Nuxt processes:

```sh
npm run lint
npm run typecheck
npm run test
npm run generate
```

Для release generation виставити explicit environment (`VIPET_INDEXING`, verified
`NUXT_PUBLIC_SITE_URL`, base URL) згідно з майбутньою конфігурацією. Bare generate
не є дозволом на indexable production build. Preview mode має бути безпечним default.
Build використовує одне й те саме environment під час generation, artifact QA й
packaging; для невідомого production origin — fail, не fallback на чужий домен.

Перевіряти з `.output/public` на static server: direct `/`, anchors, unknown route
з HTTP 404, fonts/images/srcsets/full-size modal, favicon/OG/robots/sitemap, canonical
та JSON-LD. Nuxt preview/dev не доводить поведінку plain static host. Остаточний
server command і 404 configuration залежать від hosting; не встановлювати preview
server через npx без делегування.

Manual/browser matrix: 360/390px mobile, 768px tablet, 1200/1440px desktop,
landscape/короткий viewport, 200% zoom, keyboard, touch, reduced motion, no-JS,
client navigation/re-entry й hydration. Ці test viewports не створюють нових CSS
breakpoints. Form error/success — лише після endpoint, authorized test recipient.

Performance methodology: production-generated static output, однаковий URL,
Lighthouse/browser version, viewport/device, throttling, cold cache та дата.
Зберегти baseline до motion й порівняти після; щонайменше 3 comparable mobile runs
для оцінки розкиду, огляд LCP element/CLS attribution/long tasks. Для CLS окремо
cold first paint із delayed images/fonts та incremental HTML на mobile/desktop.
Тимчасові probes/затримки не потрапляють у release.

Стартові внутрішні бюджети, що уточнюються після real assets: initial JS ≤180KB gzip,
critical fonts ≤120KB transferred, mobile LCP photo приблизно ≤250KB при прийнятній
якості. Це engineering budgets, не фактичні вимірювання чи гарантія score.
Targets: mobile Lighthouse Performance ≥90, Accessibility/SEO ≥95; LCP ≤2.5s,
CLS ≤0.1, INP ≤200ms. Lighthouse TBT лише proxy, INP перевіряти за interactions
і, за наявності достатнього traffic, польовим 75-м percentile. Економія bytes окремо
від виміряного покращення loading time. Нічого не обіцяти щодо search ranking.

## Ризики й невирішені рішення

| Питання / ризик                                    | Коли блокує                             | Власник / наступна дія                                                     |
| -------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------- |
| Hosting, origin, base path, true 404/cache headers | Image/release proof, live booking       | Власниця надає hosting/domain; розробник перевіряє можливості              |
| Node 20 EOL / mutable latest tooling               | Ініціалізацію на підтримуваному runtime | Користувач обирає Node 24, звіряє engines/peers                            |
| Empty folder успадковує parent Git                 | Version-control setup                   | Користувач вирішує окремий repo; не чіпати parent                          |
| Немає logo/hero/portrait/gallery assets            | Візуальне затвердження                  | Власниця надає originals/права, погоджує crops                             |
| Три font families і тонкі serifs                   | Читабельність/CLS/performance           | Розробник перевіряє actual glyphs, subset і fallback; Bodoni лише латиниця |
| Static image discovery пропускає modal/source URLs | Deployable media                        | Manifest-driven prerender + artifact URL checks; fallback pre-generation   |
| Unknown prices/extra compatibility                 | Calculator data integration             | Власниця підтверджує матрицю, не вставляти mock prices                     |
| Немає verified statistics/testimonials             | Відповідні content sections             | Не показувати вигаданих фактів; затвердити контент або відкласти секцію    |
| Booking delivery/provider/recipient/privacy        | Real submission                         | Власниця обирає з варіантів ARCHITECTURE; developer перевіряє контракт     |
| Schema subtype не відповідає грумінгу              | Structured data                         | Базовий LocalBusiness + Service, не вигадувати subtype                     |
| Heavy motion / pin / delayed LCP                   | Motion acceptance                       | Progressive enhancement, mobile simplify, trace/profile                    |
| Preview accidentally indexable або fake success    | Будь-який public preview                | Explicit noindex і disabled real submit, artifact gate                     |

Жоден із цих пунктів не блокує завершення Phase 0. Не потрібно зараз переривати
документацію питаннями про ціни/контакти; збирати їх до відповідного milestone.

## Наступний крок після Header/Hero

Запустити `nvm use` і `npm run dev`, перевірити Header/Hero на mobile/desktop,
menu/Escape/focus/CTA та actual responsive rendering. Наявна .nvmrc обирає вже
встановлений Node 24.22.0. Повторна ініціалізація не потрібна. Типи/formatter/lint
підключаються після ручної інсталяції відповідного tooling, а не автоматичного npx.
Після погодження першого екрана — наступні секції та реальні assets за CONTENT_CHECKLIST.

Офіційні джерела, звірені для плану:
[Nuxt creator](https://nuxt.com/docs/4.x/api/commands/init),
[Nuxt v4 starter](https://github.com/nuxt/starter),
[Nuxt 4 package](https://github.com/nuxt/nuxt/blob/4.x/packages/nuxt/package.json),
[Node release status](https://nodejs.org/en/about/previous-releases),
[Nuxt testing](https://nuxt.com/docs/4.x/getting-started/testing),
[Nuxt ESLint](https://eslint.nuxt.com/packages/module).
Ініціалізацію вручну виконав користувач; install/build/browser перевірки ще не виконувалися.
