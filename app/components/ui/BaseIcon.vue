<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.4"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <template v-if="name === 'paw'">
      <ellipse cx="5" cy="9" rx="2" ry="2.7" transform="rotate(-24 5 9)" />
      <ellipse cx="10" cy="5.5" rx="2" ry="2.7" transform="rotate(-8 10 5.5)" />
      <ellipse cx="16" cy="5.5" rx="2" ry="2.7" transform="rotate(8 16 5.5)" />
      <ellipse cx="20" cy="10" rx="1.8" ry="2.5" transform="rotate(24 20 10)" />
      <path d="M6.5 17c0-3 3-6.5 6-6.5s6 3.5 6 6.5c0 4-4 2.3-6 2.3S6.5 21 6.5 17Z" />
    </template>
    <path
      v-else
      :d="paths[name]"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps<{ name: 'paw' | 'heart' | 'award' | 'close' | 'menu' }>();

const paths = {
  heart:
    'M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z',
  award:
    'M8.2 14.7 7 22l5-3 5 3-1.2-7.3M18 8a6 6 0 1 1-12 0 6 6 0 0 1 12 0ZM12 5l.9 1.8 2 .3-1.5 1.4.4 2-1.8-.9-1.8.9.4-2-1.5-1.4 2-.3L12 5Z',
  close: 'm6 6 12 12M18 6 6 18',
  menu: 'M4 7h16M4 12h16M4 17h16',
};
</script>
