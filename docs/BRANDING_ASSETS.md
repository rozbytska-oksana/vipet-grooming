# Оригінальні логотипи V.I.Pet

Користувач надав3 JPG та2 прозорі PNG. Byte-for-byte копії з оригінальними
назвами й SHA256: source-assets/branding/manifest.json. JPG архівні, у UI
не публікуються. PNG01 — темний напис для світлого фону; PNG02 — світлий
для темного. Оригінали не перемальовані, не перефарбовані й не оброблені AI.

Вебкопії: обрізано лише прозорі зовнішні поля (sharp trim threshold0),
зменшено до160/320/480px, lossless WebP із alpha; PNG320 як fallback.
SiteLogo резервує пропорції320/283 до завантаження. Header104px wide,
mobile menu112px, footer160px; native sizes/srcset узгоджені з цими ширинами.
Base URL береться з Nuxt runtime config. Header eager, footer lazy.
Маленький WebP160: light7678 байтів, dark8912 байтів.

Header і fullscreen menu використовують light, footer — dark. Тимчасовий
знак лапки, текстовий logo і дубль descriptor з header прибрані.

Hero тепер використовує сам оригінальний wordmark із PNG02, без шрифтової
імітації та CSS-перефарбування. Crop553/1895/2288/620 відокремлює лише напис
і лапки, із запасом навколо країв. Lossless WebP768/1536. Сім absolute-шарів
із CSS clip-path відокремлюють V, лапку, I, лапку, P, e, t на спільному canvas,
тому GSAP stagger зберігає точні пропорції, відстані й тонкі штрихи оригіналу.
Hero__letters резервує aspect-ratio2288/620. Весь напис — aria-hidden artwork,
доступний текст V.I.Pet збережений окремо. Немає реконструкції або ретуші.

Вебкопії переглянуто на графітовому та кремовому фоні. Prettier, isolated
nuxt generate та TypeScript перевірені; logo files та сім animation layers є в SSG.
Browser responsive та first-paint/CLS перевірки недоступні, не заявляються.

За наступним уточненням користувача ширину Hero wordmark зменшено на10%
(3.5em → 3.15em); image sizes узгоджені з новими fluid-розмірами.
