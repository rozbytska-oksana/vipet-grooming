<template>
  <svg
    class="stat-laurel"
    viewBox="0 0 40 110"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient
        :id="goldId"
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1="110"
        x2="40"
        y2="0"
      >
        <stop
          offset="0"
          stop-color="#c99a43"
        />
        <stop
          offset="0.28"
          stop-color="#f4dc97"
        />
        <stop
          offset="0.46"
          stop-color="#fff3c4"
        />
        <stop
          offset="0.65"
          stop-color="#d6ad52"
        />
        <stop
          offset="0.86"
          stop-color="#f4dc97"
        />
        <stop
          offset="1"
          stop-color="#d3a64b"
        />
      </linearGradient>
    </defs>
    <path
      d="M35 103C0 82 0 29 34 6"
      :stroke="`url(#${goldId})`"
      stroke-width="0.75"
      stroke-linecap="round"
    />
    <g :fill="`url(#${goldId})`">
      <path d="M28 97C17.48 95.18 9.06 88.84 8 84C16.69 87.01 24.65 92.08 28 97Z" />
      <path d="M18 82C9.12 78.88 2.34 70.66 2 66C10.18 70.82 15.18 75.82 18 82Z" />
      <path d="M12 64C5.94 59.42 3.05 49.78 4 44C9.31 50.08 12.22 57.11 12 64Z" />
      <path d="M13 44C9.16 38 10.12 27 13 23C15.4 31 15.4 37 13 44Z" />
      <path d="M21 26C18.79 19.95 22.06 9.76 26 6C26.55 13.39 24.68 20.42 21 26Z" />
      <path d="M30 13C28.88 8.2 31.47 3.03 35 1C35.01 6.17 32.6 10.42 30 13Z" />
      <path d="M27 95C27.33 86.66 31.91 78.46 37 75C36.3 82.65 32.5 89.75 27 95Z" />
      <path d="M17 79C19.85 70.68 26.47 64.32 32 63C27.96 71.09 23.05 76.17 17 79Z" />
      <path d="M11 60C15.84 53.31 23.52 49.74 29 50C22.85 55.92 16.92 59.06 11 60Z" />
      <path d="M14 40C19.31 34.36 27.11 31.86 32 33C25.18 37.89 19.24 40.04 14 40Z" />
      <path d="M23 23C28.7 18.81 34.64 17.57 39 19C33.42 22.68 27.48 23.92 23 23Z" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue';
const goldId = `laurel-gold-${useId()}`;
</script>

<style scoped lang="scss">
.stat-laurel {
  display: block;
  width: clamp(0.8rem, 12cqi, 1.75rem);
  height: auto;
  flex-shrink: 0;
  color: var(--color-gold);
}
</style>
