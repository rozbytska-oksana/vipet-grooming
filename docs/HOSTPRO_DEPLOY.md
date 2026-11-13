# Деплой на HostPro

Домен: https://vipet-grooming.com.ua. Тариф: Linux-хостинг «Простий» (10 ГБ SSD,
PHP 5.2–8.4, Nginx + Apache, `.htaccess`, Let's Encrypt, cPanel). Сайт займає
близько 170 МБ. Оплата від 12 місяців дає `.com.ua` у подарунок на перший рік.
Ціни й умови станом на 2026-11-13 треба звірити в кошику HostPro.

## 1. До оплати (тестовий період 5 днів)

Уточнити в підтримці HostPro:

1. Чи дозволені вихідні HTTPS-запити до `api.telegram.org`.
2. Чи отримує PHP реальну IP-адресу відвідувача в `REMOTE_ADDR` за Nginx.
   Від цього залежить ліміт 5 заявок за 10 хвилин.
3. Ліміти трафіку та inodes (відео займають 138 МБ).

Протягом тестового періоду завантажити сайт і виконати перевірки з розділу 5.

## 2. Налаштування хостингу

- Локація сервера — Україна.
- PHP для сайту: 8.1 або новіше, з модулями `curl` та `iconv` (cPanel → Select PHP Version).
- SSL: Let's Encrypt / AutoSSL для `vipet-grooming.com.ua` і `www.vipet-grooming.com.ua`.
- DNS домену вказує на HostPro (для домену, зареєстрованого в HostPro, — автоматично).

## 3. Приватна конфігурація Telegram

Детально — [BOOKING_TELEGRAM_SETUP.md](BOOKING_TELEGRAM_SETUP.md).

1. Власниця натискає Start у боті. Локально отримати chat ID:
   `node --env-file=.env scripts/telegram-chat-id.mjs`.
2. Скопіювати `deployment/vipet-booking-config.example.php` як
   `vipet-booking-config.php` на рівень вище `public_html`
   (наприклад, `/home/<акаунт>/vipet-booking-config.php`).
3. Заповнити `bot_token`, `chat_id`, `enabled => true`. `allowed_origin` уже
   `https://vipet-grooming.com.ua`. Права доступу — 600.
4. Каталог із конфігом має дозволяти PHP створити `vipet-booking-state.json`.

Токен не потрапляє у збірку: скрипт очищає `VIPET_TELEGRAM_BOT_TOKEN`.

## 4. Збірка та завантаження

```sh
npm run generate:hostpro
```

Скрипт використовує окремий каталог `.nuxt-hostpro`, тому не конфліктує з `nuxt dev`.
Він задає домен, вмикає форму, прибирає `.DS_Store` і перевіряє наявність
`index.html`, `404.html`, `robots.txt`, `.htaccess`, `api/booking.php`,
`api/booking-catalog.json`, og:url, кнопку «Надіслати заявку», відсутність
редакційних placeholders та режим індексації.

Без прапорця збірка має `noindex`. Для публічного запуску:

```sh
npm run generate:hostpro -- --indexable
```

Тоді додаються canonical, JSON-LD і `sitemap.xml`.

Завантажити **вміст** `.output/public` у `public_html`, включно з прихованим
`.htaccess` і каталогом `api/`. У файловому менеджері cPanel увімкнути показ
прихованих файлів.

## 5. Перевірка після завантаження

- `http://vipet-grooming.com.ua` і `https://www.vipet-grooming.com.ua` одним
  редиректом 301 ведуть на `https://vipet-grooming.com.ua/`.
- Неіснуюча сторінка повертає 404 з українським текстом.
- `/.htaccess` повертає 403.
- `/api/booking.php` у браузері (GET) повертає JSON з помилкою 405, а не PHP-код.
- Одна тестова заявка, погоджена з власницею, приходить у Telegram з усіма полями.
- Після `--indexable`: `robots.txt` містить Sitemap, `sitemap.xml` відкривається,
  [Rich Results Test](https://search.google.com/test/rich-results) бачить LocalBusiness.
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95.

## Що робить public/.htaccess

- Канонічний origin: HTTPS без www; враховує `X-Forwarded-Proto` від Nginx,
  щоб не зациклити редирект. `/.well-known/` лишається доступним по HTTP для SSL.
- `/index.html` і `/200.html` → `/`; `ErrorDocument 404 /404.html`.
- Приховані файли закриті, крім `.well-known`; `Options -Indexes`.
- Заголовки: nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy, HSTS
  (лише на HTTPS, без includeSubDomains/preload).
- Кеш: `/_nuxt/` — рік, immutable; зображення, відео, шрифти — 30 днів;
  HTML, payload, robots, sitemap — no-cache; `/api/` — no-store. Gzip для тексту.

Перевірено 2026-11-13 на локальному Apache 2.4.66 з тими самими модулями
(rewrite, headers, deflate, mime, dir, authz_core). На HostPro можуть бути
інші налаштування `AllowOverride`: якщо після завантаження сайт віддає 500,
перевірити error log у cPanel. Найімовірніша причина — заборонена директива `Options`.

У GitHub Pages збірку `.htaccess` не потрапляє: `generate:pages` його видаляє.
