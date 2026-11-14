<template>
  <div class="home-page">
    <SiteHeader @booking="openBooking" />
    <main
      id="main-content"
      tabindex="-1"
    >
      <HeroSection />
      <ServicesSection :hydrate-on-visible="{ rootMargin: '300px' }" />
      <GroomerSection :hydrate-on-visible="{ rootMargin: '300px' }" />
      <BeforeAfterSection :hydrate-on-visible="{ rootMargin: '300px' }" />
      <PricingSection
        :hydrate-on-visible="{ rootMargin: '300px' }"
        @booking="prefillBooking"
      />
      <PhilosophySection :hydrate-on-visible="{ rootMargin: '300px' }" />
      <PetGallerySection :hydrate-on-visible="{ rootMargin: '300px' }" />
      <BeforeVisitSection :hydrate-on-visible="{ rootMargin: '300px' }" />
      <BookingSection :prefill="selection" />
      <TestimonialsSection :hydrate-on-visible="{ rootMargin: '300px' }" />
      <SalonRulesSection :hydrate-on-visible="{ rootMargin: '300px' }" />
      <FaqSection :hydrate-on-visible="{ rootMargin: '300px' }" />
    </main>
    <SiteFooter />
    <span
      id="booking-availability"
      class="visually-hidden"
    >
      Відкриється форма заявки. Дату й час візиту погодимо окремо.
    </span>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { useHomeSeo } from '../composables/useHomeSeo';
import type { PricingSelection } from '../types/content';
import SiteHeader from '../components/layout/SiteHeader.vue';
import SiteFooter from '../components/layout/SiteFooter.vue';
import HeroSection from '../components/sections/HeroSection.vue';
// Header CTA and the calculator move focus into the form, so it hydrates eagerly.
import BookingSection from '../components/sections/BookingSection.vue';
// Below-the-fold sections stay in the SSR HTML; their JS loads near the viewport.
const ServicesSection = defineLazyHydrationComponent(
  'visible',
  () => import('../components/sections/ServicesSection.vue'),
);
const GroomerSection = defineLazyHydrationComponent(
  'visible',
  () => import('../components/sections/GroomerSection.vue'),
);
const BeforeAfterSection = defineLazyHydrationComponent(
  'visible',
  () => import('../components/sections/BeforeAfterSection.vue'),
);
const PricingSection = defineLazyHydrationComponent(
  'visible',
  () => import('../components/sections/PricingSection.vue'),
);
const PhilosophySection = defineLazyHydrationComponent(
  'visible',
  () => import('../components/sections/PhilosophySection.vue'),
);
const PetGallerySection = defineLazyHydrationComponent(
  'visible',
  () => import('../components/sections/PetGallerySection.vue'),
);
const BeforeVisitSection = defineLazyHydrationComponent(
  'visible',
  () => import('../components/sections/BeforeVisitSection.vue'),
);
const TestimonialsSection = defineLazyHydrationComponent(
  'visible',
  () => import('../components/sections/TestimonialsSection.vue'),
);
const SalonRulesSection = defineLazyHydrationComponent(
  'visible',
  () => import('../components/sections/SalonRulesSection.vue'),
);
const FaqSection = defineLazyHydrationComponent(
  'visible',
  () => import('../components/sections/FaqSection.vue'),
);
const selection = ref<PricingSelection | null>(null);
const openBooking = () => {
  const target = document.getElementById('booking-title');
  target?.focus({ preventScroll: true });
  document.getElementById('booking')?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    block: 'start',
  });
};
const prefillBooking = async (value: PricingSelection) => {
  selection.value = { ...value, extraIds: [...value.extraIds] };
  await nextTick();
  openBooking();
};
useHomeSeo();
</script>
