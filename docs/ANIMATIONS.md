# V.I.Pet — архітектура анімацій

Актуальне уточнення Header/Hero v2: [стан реалізації та перевірки](HEADER_HERO_IMPLEMENTATION.md).
GSAP/ScrollTrigger вже підключені для hero; single photo + text/light layers,
справжній локальний курсив, JPEG preview після проблеми AVIF у браузері.
Попередні згадки CSS-only hero нижче описують історичну v1.

Статус: специфікація після аналізу static design references. Таймінги є стартовими й уточнюються на реальному
контенті та мобільних пристроях. Motion підкреслює фото й ієрархію, не затримує доступ.

## Загальний контракт

SSR віддає видимий текст, фінальні числа й працездатні anchors. Анімація — client
progressive enhancement після mount. Не використовувати глобальний `.js { opacity: 0 }`
чи очікування завантаження всіх зображень перед показом сторінки. Hero LCP photo
не приховувати до завершення timeline. Декоративні layers можна розкривати окремо.

| Взаємодія                                     | Засіб                                   | Чому                                      |
| --------------------------------------------- | --------------------------------------- | ----------------------------------------- |
| Hover/shimmer/focus                           | CSS                                     | Немає потреби в JS timeline               |
| Прості reveals/count-up                       | IntersectionObserver + CSS / rAF        | Малі незалежні ефекти                     |
| Hero, portrait sequence, desktop storytelling | GSAP + ScrollTrigger                    | Узгоджена timeline та scroll progress     |
| Certificates/mobile gallery                   | Embla Vue                               | Swipe, snap, programmatic navigation      |
| Before/after                                  | Native range, за потреби Pointer Events | Keyboard/touch без окремої slider library |
| FAQ                                           | Native details/summary                  | Без залежності від JS                     |
| Pricing/form states                           | Vue state + CSS transition              | Підтримка focus і live announcements      |

Motion tokens: micro 160–240ms; state 280–400ms; reveal 600–900ms;
hero 900–1400ms; stagger 60–100ms; count-up 1500–2000ms; shimmer 650ms.
CSS ease-out приблизно `cubic-bezier(.22, 1, .36, 1)`; GSAP `power2.out`.
Transform/opacity — пріоритет. Layout animations лише локально й після вимірювання.
Не анімувати blur/filter на великих фото або background-position на всьому екрані.

## Lifecycle й адаптивність

1. `onMounted` отримує refs і motion preference. Dynamic import GSAP тільки для
   складних сцен; один cached import promise не створює глобального animation state.
2. `gsap.context` обмежує selectors поточним компонентом; `gsap.matchMedia` керує
   desktop/reduced-motion branches. Після async import перевірити, що компонент
   ще mounted; після unmount не створювати timeline.
3. Mobile <768px — прості entrances, без parallax/pin; tablet ≥768px — стримані
   reveals; desktop ≥1200px — storytelling за наявності місця. Числа узгоджені зі
   shared SCSS breakpoints, не вводити додаткових viewport-width conditions.
4. Init після DOM readiness. Зміни розміру/декодування потрібних media можуть
   спричинити один запланований `ScrollTrigger.refresh()`, не refresh кожного кадру.
   Зарезервовані розміри мають мінімізувати потребу в refresh.
5. Unmount: context/matchMedia revert, disconnect observers, cancelAnimationFrame,
   remove listeners і власні Embla subscriptions. Vue wrapper прибирає свій carousel.
   Не викликати `ScrollTrigger.getAll().forEach(kill)`.
6. Повернення client navigation створює нову сцену без дублікатів. Для one-time
   анімацій контракт — один запуск на mount, не повтор при scroll назад або resize.
   Персистентний storage для цього не потрібен.

Зміна reduced motion під час перегляду прибирає активні tweens/pins і показує фінальний
стан. Усі essential content/controls залишаються доступними. Scroll залишається native.
Hover motion тільки для `(hover: hover) and (pointer: fine)`.

## Секції

| Секція          | Тригер, рух і час                                                                                                                       | Mobile/tablet                                           | Reduced motion                                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------- |
| Hero            | Після mount: editorial text 700–1000ms, translateY 16–24px, stagger 80ms; dog/cat decorative layers 900–1200ms з overlap 200ms          | Текст 500–700ms, shift ≤12px; без scroll parallax       | Одразу фінальний стан                                |
| Hero scroll     | Лише ≥1200px: перші приблизно 70% висоти hero, translateY layers ≤32px, текст ≤16px, scrub близько .5s; без pin і без зникнення CTA     | Статична композиція                                     | Без scrub/parallax                                   |
| Philosophy      | При 15–20% видимості: opacity + Y 16px за 650ms, once                                                                                   | Shift 8px, 500ms                                        | Видимий текст без reveal                             |
| Services        | При вході grid: cards Y 20px/opacity за 650ms, stagger 80ms; hover image scale 1→1.035 за 400ms і gold border 240ms                     | Менший shift, без hover-zoom на touch                   | Без entrance/zoom, статичний border/focus            |
| Before/After    | Керований range 0–100; одноразова demo 50→60→50 за 900ms лише після появи й до першої взаємодії                                         | Native touch drag; не перехоплювати вертикальний scroll | Demo вимкнена, ручний range без tween                |
| Groomer         | Portrait reveal transform/маска 800–1000ms; editorial blocks 650ms зі stagger 80ms при 20% видимості                                    | Простий opacity/Y ≤12px                                 | Фото/текст одразу                                    |
| Signature       | Decorative SVG stroke-dashoffset за 1200ms після portrait; once                                                                         | Можлива та сама коротка послідовність                   | Готовий stroke                                       |
| Statistics      | Видимість ≥30%, 0→перевірене значення за 1500–2000ms, once                                                                              | Та сама логіка                                          | Фінальне значення одразу                             |
| Certificates    | Embla snap 350–500ms за відчуттям, controls без autoplay; preview dialog fade 180ms                                                     | Swipe та кнопки; document contain                       | Instant navigation/без modal entrance                |
| Fashion gallery | ≥1200px коротка ScrollTrigger scene: максимум близько одного додаткового viewport, transform panels, scrub .5s, pin тільки visual stage | <1200px Embla swipe, captions поза рухомою маскою       | Неприкріплений список/сітка, без scroll storytelling |
| Pricing         | Перехід selection/result opacity 180–240ms; новий range показується атомарно, без проміжних вигаданих чисел                             | Той самий сценарій, без стрибка result height           | Миттєве оновлення                                    |
| Why V.I.Pet     | Короткі text/photo reveals 600ms, stagger 80ms, once                                                                                    | Простий потік                                           | Статичний контент                                    |
| Testimonials    | Реальні цитати: opacity/Y 12px, 600ms, once; без auto-rotation                                                                          | Статичний список                                        | Статичний список                                     |
| FAQ             | Native disclosure; indicator rotate 180ms, відповідь без height tween за замовчуванням                                                  | Однаково на всіх екранах                                | Без indicator rotation                               |
| Booking         | Pending indicator лише під час реального запиту; feedback opacity 180ms                                                                 | Ті самі стани й focus                                   | Статичний текст pending/result                       |
| Contacts/footer | Стриманий reveal 600ms, once; contact links доступні з першого HTML                                                                     | Без складних сцен                                       | Статичний footer                                     |

Gallery pin — необов’язкове enhancement: якщо content/focus, zoom або viewport-height
роблять сцену незручною, перейти до звичайної сітки. Не вкладати carousel у pinned
horizontal scroller. Клавіатура повинна послідовно досягати всіх captions/actions;
позаекранні інтерактивні елементи не залишати непомітно focusable. До реалізації
pin перевірити статичний варіант. Це не scroll hijacking і не wheel interception.

Video previews у services — optional після отримання реальних відео й performance
review: poster-first, preload none, user-initiated playback з controls, pause при
виході/закритті; captions/transcript для змістовного звуку. Не додавати autoplay loop.

## Count-up: точний контракт

Конфігурація статистики містить stable id, label, числовий value або null, suffix,
precision та evidence reference. Немає перевіреного value — немає statistic block,
не підставляти нуль як реальний факт. Фінальні значення не визначені у Phase 0.

SSR містить фінальний текст. Animated span має `aria-hidden`, screen-reader copy
завжди містить фінальний факт, без `aria-live` на кожен кадр. Після mount, лише при
дозволеному motion, видимий span починає з 0; його ширина зарезервована під фінальне
значення, tabular-nums. Observer запускає rAF з timestamp-based progress і ease-out,
форматуванням `Intl.NumberFormat('uk-UA')`. Наприкінці точно присвоїти final value,
unobserve; повторний scroll не перезапускає. При background tab/reduced-motion
перейти до кінця, при unmount скасувати rAF. Не рахувати «роки досвіду» від
непідтвердженої дати.

## Before/after та accessible alternatives

Native `<input type="range">` з label «Показати більше фото після», min 0/max 100,
початково 50; Arrow/Home/End підтримуються браузером. Для великих кроків можна дати
текстові кнопки «До»/«Після». Альтернатива — показ обох повних фото поруч/одне під
одним. Range не змінює focus і не запускає screen-reader announcement кожен pixel.
Intro скасовується при pointerdown/keydown/focus; не воює з користувачем. Фото мають
однакову геометрію й фактичні підписи; clip-path comparison — локальна область,
без анімації layout. Без JS показати обидві фотографії з captions.

## Перевірка motion

Перевірити 360/768/1440px, touch, keyboard, 200% zoom, reduced motion при старті
й під час сцени, no-JS, повільний import, route leave/re-entry, resize, image decode,
відсутні/порожні статистики. Контролювати retained listeners/ScrollTriggers після
повторного mount. Performance trace має не показувати довгих JS tasks/постійного
layout у scroll handler; не обіцяти стабільний FPS без вимірювання на пристрої.

Офіційні джерела: [GSAP matchMedia](<https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>),
[Embla Vue v8](https://www.embla-carousel.com/docs/v8/get-started/vue).

## Уточнення за desktop/mobile PNG

PNG не підтверджує sticky header, autoplay або рух gold rays. Rays залишаються
переважно статичними decorative SVG/CSS; gold CTA має короткий shimmer, а не loop.
Mobile testimonials може бути Embla замість одного довгого списку за наявності
реальних відгуків: prev/next і slide indicators, no autoplay, reduced motion без
інерційного переходу, no-JS list fallback. Services «Всі послуги» за потреби —
accessible disclosure, а не link на неіснуючий route. Before/after і carousel
порівнянь не повинні одночасно захоплювати той самий drag gesture.

Загальні motion durations підготовлено в app/assets/styles/animations.scss;
useReducedMotion/useScrollReveal/useCountUp поки мають лише задокументовані
контракти, їх реалізація й перевірки належать наступним milestones.

## Реалізований перший екран

Header/Hero v1 використовує CSS: text translateY 16px без opacity blocking,
приблизно 1200ms; image видиме відразу, shimmer лише hover/fine-pointer/no-preference.
Halo/ribbon статичні. GSAP/parallax/layered photo reveal наразі не реалізовані:
тимчасова фотографія є одним зображенням. Actual reduced-motion/browser rendering
ще не перевірене через недоступність Computer Use; це не виконаний motion QA.
