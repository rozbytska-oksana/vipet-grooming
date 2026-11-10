<template>
  <main class="error-page">
    <p class="error-page__brand">V.I.Pet Grooming Salon</p>
    <h1>
      {{ error.statusCode === 404 ? 'Сторінку не знайдено' : 'Не вдалося відкрити сторінку' }}
    </h1>
    <p>Поверніться на головну сторінку салону.</p>
    <a :href="baseURL">На головну</a>
  </main>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps<{ error: NuxtError }>();
const baseURL = useRuntimeConfig().app.baseURL;
useSeoMeta({ title: 'V.I.Pet — сторінка недоступна', robots: 'noindex, nofollow' });
</script>

<style scoped lang="scss">
.error-page {
  display: grid;
  place-content: center;
  justify-items: center;
  min-height: 100svh;
  padding: 2rem;
  background: var(--color-ivory, #f6f0e6);
  color: #29292b;
  text-align: center;

  &__brand {
    color: #806026;
  }

  & h1 {
    max-width: 22ch;
    font: 400 clamp(2rem, 5vw, 3.5rem)/1.15 var(--font-editorial);
  }

  & a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 0.5rem 1rem;
    color: #806026;
    text-underline-offset: 0.25em;

    &:focus-visible {
      outline: 2px solid #a47a2c;
      outline-offset: 4px;
    }
  }
}
</style>
