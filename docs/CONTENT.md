# V.I.Pet — контракт контенту та джерела

Статус: дизайн-референси отримані, реальні бізнес-дані очікуються. PNG у
`docs/references/` задають композицію; їх тексти/числа/контакти не є verified data.
Детальний розбір — [DESIGN_REFERENCE_ANALYSIS.md](DESIGN_REFERENCE_ANALYSIS.md).
Список матеріалів для власниці — [CONTENT_CHECKLIST.md](CONTENT_CHECKLIST.md).

## Відповідальність і статус

| Джерело | Поля | Статус |
| --- | --- | --- |
| Brief користувача | V.I.Pet Grooming Salon, Житомир, Україна, uk | Підтверджено для планування |
| Desktop/mobile PNG | Layout, warm palette, gold CTA, photography direction | Отримані й переглянуті; originals збережені |
| BusinessProfile | address, phone, hours, URLs, verified contacts | Очікується окреме підтвердження |
| Services | IDs, titles, inclusions, pet types, media | Порожній typed catalog до отримання даних |
| Pricing | Breed/service ranges, extras, constraints | Порожні typed tables; жодних screenshot prices |
| FAQ | ID, question, answer | Порожній typed list до погоджених відповідей |
| Groomer/statistics | Name, portrait, bio, evidence for each number | Не переносити screenshot persona/counts |
| Certificates/gallery | Approved sources, dimensions, alt/captions, rights | Потрібні окремі publishable assets |
| Testimonials | Exact text, name display permission, source | Не переносити screenshot quotations/ratings |
| Booking | Approved endpoint, recipient, privacy/retention copy | Відправку не реалізовано |

## Правила моделей

Мінімальні code contracts живуть в `app/types/content.ts`, data — в `app/data/`.
`services.ts`, `pricing.ts`, `faq.ts` містять лише typed empty collections до
підтвердження. Не заводити фіктивні records для заповнення макета. Невідомий price
не дорівнює нулю. Missing optional content не створює empty live sections/anchors.

IDs стабільні й англійською; displayed titles/answers українською. Money — integer
minor units у UAH; min ≤ max, без floating math. Породи відокремлені від UI.
Additive/included/quote extras мають явну семантику. Не ховати quote-only extra
у неправдиво точному total. Runtime/build validation додається разом із calculator.

## Assets

`docs/references/` — лише незмінні reference snapshots, не deployable photos.
`public/images/` — майбутні погоджені publishable images/derivatives; не класти
туди originals з приватними полями. `source-assets/originals/` або погоджене приватне
сховище — untouched originals, manifest — checksum/rights/crop mapping.

Не копіювати logo/portrait/certificate із screenshot як готовий asset. Власниця
передає оригінали й підтверджує crop/redaction; генерація або реконструкція окремо.
Full-size documents мають окрему дозволену читабельну копію з contain.

## Редакційний процес

1. Власниця надає дані та підтвердження/права.
2. Розробник структурує записи, перевіряє IDs, media paths, розміри й доступність.
3. Власниця погоджує видимі тексти, тарифи та заяви; фіксується дата погодження.
4. Production check відхиляє placeholders/відсутні required publication fields.
5. Оновлення тарифів/контактів синхронізуються з видимим HTML і SEO, не лише UI.

У preview test fixtures, якщо знадобляться, живуть окремо від app/data і ніколи
не стають реальними цінами чи відгуками. На цьому етапі test fixtures не створені.

## Тимчасовий hero, дозволений користувачем

Для першого екрана дозволені fictional images. Згенеровано новий AI visual, без
змін supplied references/реальних фото: original/prompt/manifest у source-assets.
Hero alt/figcaption позначають demo; це не фото робіт салону. Реальні assets усе
ще очікуються. Типографічний wordmark і V favicon теж тимчасові. Source ownership
і правила заміни — [HEADER_HERO_IMPLEMENTATION.md](HEADER_HERO_IMPLEMENTATION.md).
