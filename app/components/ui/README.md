# UI-компоненти

BaseButton та BaseContainer задають спільні кнопки й контейнер. BaseIcon містить
SVG-іконки. SiteLogo показує оригінальний логотип із responsive WebP/PNG.
BaseDisclosure відповідає за доступне плавне розгортання, PetTypeToggle — за
спільний вибір виду улюбленця. BaseStat та StatLaurel оформлюють статистику,
BackToTop повертає користувача до початку сторінки.

Зображення секцій використовують відповідні picture/srcset/sizes. Для фото
до/після є ComparisonPhoto. Старі невикористані BaseImage та BaseSection видалені.

Компоненти імпортуються явно в script setup. Focus, labels і текст зберігають
доступність, рух враховує prefers-reduced-motion.
