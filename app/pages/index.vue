<template>
  <div class="home-page">
    <SiteHeader @booking="openBooking" />
    <main
      id="main-content"
      tabindex="-1"
    >
      <HeroSection />
      <ServicesSection />
      <GroomerSection :hydrate-on-visible="{ rootMargin: '300px' }" />
      <BeforeAfterSection :hydrate-on-visible="{ rootMargin: '300px' }" />
      <PricingSection @booking="prefillBooking" />
      <PhilosophySection />
      <PetGallerySection :hydrate-on-visible="{ rootMargin: '300px' }" />
      <BeforeVisitSection />
      <BookingSection :prefill="selection" />
      <TestimonialsSection :hydrate-on-visible="{ rootMargin: '300px' }" />
      <SalonRulesSection />
      <FaqSection />
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
import PhilosophySection from '../components/sections/PhilosophySection.vue';
import ServicesSection from '../components/sections/ServicesSection.vue';
const GroomerSection = defineLazyHydrationComponent(
  'visible',
  () => import('../components/sections/GroomerSection.vue'),
);
const BeforeAfterSection = defineLazyHydrationComponent(
  'visible',
  () => import('../components/sections/BeforeAfterSection.vue'),
);
const PetGallerySection = defineLazyHydrationComponent(
  'visible',
  () => import('../components/sections/PetGallerySection.vue'),
);
import PricingSection from '../components/sections/PricingSection.vue';
const TestimonialsSection = defineLazyHydrationComponent(
  'visible',
  () => import('../components/sections/TestimonialsSection.vue'),
);
import FaqSection from '../components/sections/FaqSection.vue';
import BeforeVisitSection from '../components/sections/BeforeVisitSection.vue';
import SalonRulesSection from '../components/sections/SalonRulesSection.vue';
import BookingSection from '../components/sections/BookingSection.vue';
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
