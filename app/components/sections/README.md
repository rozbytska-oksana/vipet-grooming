# Секції сторінки

Поточний DOM-порядок задає app/pages/index.vue.

1. HeroSection — композиція першого екрана та єдиний h1.
2. ServicesSection — картки послуг із підтвердженими ціновими діапазонами.
3. GroomerSection — портрет, текст, підпис і статистика.
   CertificatesSection вкладено в блок грумерки праворуч на десктопі.
4. BeforeAfterSection — порівняння фото з range та альтернативним показом поруч.
5. PricingSection — розрахунок базової вартості й prefill форми.
6. PhilosophySection — об’єднаний блок підходу й цінностей.
7. PetGallerySection — карусель відео процесу грумінгу.
8. TestimonialsSection — реальні відгуки з наданих Google Maps скриншотів.
9. BookingSection — форма заявки з валідацією та окремою активацією Telegram.
10. FaqSection — доступні запитання й відповіді.

Контакти, години, соціальні посилання та логотип знаходяться в SiteFooter.
Кожна секція має semantic heading, anchor і scoped SCSS/BEM. Основний контент
присутній у SSR HTML. Поточні обмеження й перевірки — docs/FULL_PAGE_IMPLEMENTATION.md.
