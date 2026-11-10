# Page composition

Index.vue реалізований: SiteHeader, main з HeroSection і BookingPreviewDialog.
App.vue підключає NuxtPage. Імпорти явні. Preview metadata: uk/noindex, без fake
canonical/contacts. Діалог лише пояснює недоступність онлайн-запису, не надсилає дані.

Під час додавання PricingSection/BookingSection page володітиме typed selection
і prefill. Решта секцій ще не реалізовані; не додавати anchors без actual content.
