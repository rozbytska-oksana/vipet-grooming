<template>
  <section
    id="groomer"
    ref="section"
    class="groomer"
    data-surface="dark"
    aria-labelledby="groomer-title"
  >
    <BaseContainer class="groomer__layout">
      <figure class="groomer__visual">
        <div
          class="groomer__paw"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 460 560"
            fill="none"
            focusable="false"
          >
            <defs>
              <linearGradient
                id="groomer-paw-gold"
                x1="0.1"
                y1="0"
                x2="0.85"
                y2="1"
              >
                <stop
                  offset="0"
                  stop-color="#a87930"
                  stop-opacity="0.25"
                />
                <stop
                  offset="0.2"
                  stop-color="#e4b95f"
                />
                <stop
                  offset="0.3"
                  stop-color="#fff4cb"
                />
                <stop
                  offset="0.4"
                  stop-color="#d9a54b"
                />
                <stop
                  offset="0.58"
                  stop-color="#9f722e"
                  stop-opacity="0.55"
                />
                <stop
                  offset="0.72"
                  stop-color="#f3d18a"
                />
                <stop
                  offset="1"
                  stop-color="#b68331"
                  stop-opacity="0.2"
                />
              </linearGradient>
              <radialGradient
                id="groomer-paw-glint"
                cx="0.27"
                cy="0.25"
                r="0.6"
              >
                <stop
                  offset="0"
                  stop-color="#fff8df"
                />
                <stop
                  offset="0.25"
                  stop-color="#ffe0a0"
                  stop-opacity="0.9"
                />
                <stop
                  offset="1"
                  stop-color="#d69d43"
                  stop-opacity="0"
                />
              </radialGradient>
              <filter
                id="groomer-paw-bloom"
                x="-40%"
                y="-40%"
                width="180%"
                height="180%"
              >
                <feGaussianBlur stdDeviation="8" />
              </filter>
              <filter
                id="groomer-paw-halo"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="2.5" />
              </filter>
              <g id="groomer-paw-shape">
                <ellipse
                  cx="86"
                  cy="225"
                  rx="44"
                  ry="65"
                  transform="rotate(-32 86 225)"
                />
                <ellipse
                  cx="174"
                  cy="120"
                  rx="41"
                  ry="67"
                  transform="rotate(-21 174 120)"
                />
                <ellipse
                  cx="275"
                  cy="119"
                  rx="37"
                  ry="62"
                  transform="rotate(12 275 119)"
                />
                <ellipse
                  cx="351"
                  cy="210"
                  rx="36"
                  ry="59"
                  transform="rotate(29 351 210)"
                />
                <path
                  d="M111 412C100 370 137 321 174 291C197 272 216 260 235 270C260 280 267 312 289 338C320 374 342 413 319 442C301 464 275 452 250 453C218 453 190 486 154 471C132 462 116 440 111 412Z"
                />
              </g>
            </defs>
            <use
              href="#groomer-paw-shape"
              stroke="#edb856"
              stroke-width="12"
              opacity="0.5"
              filter="url(#groomer-paw-bloom)"
            />
            <use
              href="#groomer-paw-shape"
              stroke="url(#groomer-paw-gold)"
              stroke-width="5"
              filter="url(#groomer-paw-halo)"
            />
            <use
              href="#groomer-paw-shape"
              stroke="url(#groomer-paw-gold)"
              stroke-width="2.4"
            />
            <use
              href="#groomer-paw-shape"
              stroke="url(#groomer-paw-glint)"
              stroke-width="1.1"
            />
          </svg>
        </div>
        <div class="groomer__float">
          <picture class="groomer__portrait">
            <source
              type="image/avif"
              :srcset="portraitSources('avif')"
              :sizes="portraitSizes"
            />
            <source
              type="image/webp"
              :srcset="portraitSources('webp')"
              :sizes="portraitSizes"
            />
            <img
              :src="`${baseURL}images/groomer/oksana-cutout-722.webp`"
              width="722"
              height="960"
              alt="Оксана, власниця та грумер V.I.Pet, зі шпіцом"
              loading="lazy"
              fetchpriority="low"
              decoding="async"
            />
          </picture>
        </div>
      </figure>
      <div class="groomer__story">
        <p
          class="groomer__eyebrow"
          data-groomer-copy
        >
          Власниця та грумер
        </p>
        <h2
          id="groomer-title"
          class="groomer__title"
          tabindex="-1"
          data-groomer-copy
        >
          Людина, якій довіряють найцінніше
        </h2>
        <p
          class="groomer__bio"
          data-groomer-copy
        >
          {{ groomer.bio }}
          <em>де кожен улюбленець особливий.</em>
        </p>
        <div
          class="groomer__signature"
          role="img"
          aria-label="Декоративний підпис: Оксана"
        >
          <svg
            viewBox="0 0 330 110"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <linearGradient
                id="groomer-signature-gold"
                x1="0"
                y1="0"
                x2="0.8"
                y2="1"
              >
                <stop
                  offset="0"
                  stop-color="#c99a43"
                />
                <stop
                  offset="0.32"
                  stop-color="#f4dc97"
                />
                <stop
                  offset="0.53"
                  stop-color="#fff3c4"
                />
                <stop
                  offset="0.72"
                  stop-color="#e2bb66"
                />
                <stop
                  offset="1"
                  stop-color="#c99a43"
                />
              </linearGradient>
            </defs>
            <g
              stroke="url(#groomer-signature-gold)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                v-for="(stroke, index) in signatureStrokes"
                :key="index"
                :d="stroke"
                pathLength="1"
                data-signature-stroke
              />
            </g>
          </svg>
          <BaseIcon
            name="paw"
            class="groomer__signature-paw"
          />
        </div>
        <div
          v-if="statistics.length"
          class="groomer__stats"
          role="group"
          aria-label="Оксана в цифрах"
        >
          <div
            v-for="statistic in statistics"
            :key="statistic.id"
            class="groomer__stat"
          >
            <BaseStat :statistic="statistic">
              <template #before><StatLaurel /></template>
              <template #after><StatLaurel class="groomer__laurel--right" /></template>
            </BaseStat>
          </div>
        </div>
      </div>
      <CertificatesSection class="groomer__certificates" />
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CertificatesSection from './CertificatesSection.vue';
import BaseContainer from '../ui/BaseContainer.vue';
import BaseIcon from '../ui/BaseIcon.vue';
import BaseStat from '../ui/BaseStat.vue';
import StatLaurel from '../ui/StatLaurel.vue';
import { groomer, statistics } from '../../data/salon';
import { useGroomerMotion } from '../../composables/useGroomerMotion';

const section = ref<HTMLElement | null>(null);
const baseURL = useRuntimeConfig().app.baseURL;
const portraitSizes = '(min-width: 1200px) 480px, (min-width: 768px) 42vw, min(86vw, 360px)';
const portraitSources = (format: string) =>
  [360, 540, 722]
    .map((width) => `${baseURL}images/groomer/oksana-cutout-${width}.${format} ${width}w`)
    .join(', ');
// Decorative lettering, not a reproduction of the owner's legal signature.
const signatureStrokes = [
  'M52 24C28 8 10 74 30 79C51 86 78 19 59 16C46 14 31 34 30 51',
  'M65 68 77 43C70 56 70 71 78 63L91 43C82 54 79 55 74 54C82 51 79 71 89 65L99 55',
  'M118 45C110 33 95 57 98 65C103 75 119 57 125 53',
  'M145 46C135 36 122 55 124 64C127 75 144 48 147 43L138 64C137 70 146 66 155 55',
  'M164 43 153 67M160 55 178 50M184 41C176 53 168 73 181 64L193 54',
  'M210 45C200 36 187 56 190 65C195 74 209 49 212 43L204 63C201 74 217 64 229 52',
  'M34 94C81 77 158 88 223 76C245 72 255 66 247 64',
];
useGroomerMotion(section);
</script>

<style scoped lang="scss">
@use '../../assets/styles/breakpoints' as bp;
.groomer {
  --surface: #29292b;
  --text-primary: var(--color-ivory);
  --text-secondary: #dedbd5;
  --focus-ring: var(--color-gold-highlight);

  position: relative;
  overflow: clip;
  color: var(--text-primary);
  background:
    radial-gradient(ellipse at 18% 65%, rgb(255 255 255 / 5%), transparent 58%), var(--surface);
  padding-block: clamp(3rem, 5vw, 5rem);
  &__layout {
    display: grid;
    align-items: center;
    gap: 1.75rem;
    @include bp.medium {
      grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
      gap: clamp(2rem, 4vw, 4rem);
    }
  }
  &__certificates {
    grid-column: 1 / -1;
    min-width: 0;
    @include bp.x-large {
      grid-column: 3;
      grid-row: 1;
      padding-left: clamp(1rem, 2vw, 2rem);
      border-left: 1px solid rgb(230 196 118 / 35%);
    }
  }
  &__layout {
    @include bp.x-large {
      width: min(1800px, calc(100% - 4rem));
      max-width: none;
      grid-template-columns: minmax(0, 0.7fr) minmax(0, 1fr) minmax(0, 1.2fr);
      gap: clamp(1rem, 2vw, 2rem);
    }
  }
  &__visual {
    position: relative;
    isolation: isolate;
    width: min(86vw, 22.5rem);
    margin: 0 auto;
    @include bp.medium {
      width: 100%;
      max-width: 30rem;
    }
    @include bp.x-large {
      width: 112%;
      max-width: none;
      margin-left: -8%;
      margin-right: -4%;
    }
  }
  &__float {
    position: relative;
  }
  &__portrait {
    display: block;
    position: relative;
    mask-image: linear-gradient(#000 0% 90%, transparent 100%);
  }
  &__portrait img {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 722 / 960;
    object-fit: contain;
  }
  &__paw {
    position: absolute;
    z-index: -1;
    pointer-events: none;
    width: 106%;
    aspect-ratio: 460 / 560;
    top: 0;
    left: -22%;
    opacity: 0.95;
    transform: rotate(-12deg);
    &::before {
      content: '';
      position: absolute;
      inset: 4% -8% 2% -12%;
      background: radial-gradient(
        ellipse closest-side at 50% 50%,
        rgb(229 174 75 / 18%),
        rgb(217 159 61 / 7%) 42%,
        transparent 100%
      );
      filter: blur(18px);
      mask-image: radial-gradient(ellipse closest-side, #000 60%, transparent 100%);
    }
    > svg {
      position: relative;
      display: block;
      width: 100%;
      height: auto;
      overflow: visible;
    }
  }
  &__story {
    min-width: 0;
    max-width: 43rem;
  }
  &__eyebrow {
    margin: 0 0 0.9rem;
    font-size: 0.875rem;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--color-gold-highlight);
  }
  &__title {
    margin: 0 0 1.5rem;
    max-width: 17ch;
    font: 400 clamp(2.25rem, 3.7vw, 3.75rem)/1.04 var(--font-editorial);
    text-wrap: balance;
  }
  &__bio {
    max-width: 49ch;
    color: var(--text-secondary);
    font-size: clamp(1.125rem, 1.35vw, 1.25rem);
    line-height: 1.7;
  }
  &__bio {
    margin: 0;
  }
  &__bio em {
    font: italic 500 1.35em/1.2 var(--font-editorial);
    color: var(--color-gold-highlight);
  }
  &__signature {
    display: flex;
    align-items: center;
    width: min(100%, 20rem);
    margin-top: 1.25rem;
  }
  &__signature > svg:first-child {
    display: block;
    width: 85%;
    height: auto;
    overflow: visible;
  }
  &__signature-paw {
    flex: 0 0 2rem;
    width: 2rem;
    height: 2rem;
    color: var(--color-gold);
    fill: var(--color-gold-highlight);
    stroke-width: 0.6;
    transform: rotate(14deg);
    margin-left: -2rem;
  }
  &__stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(0.5rem, 1.5vw, 1.25rem);
    margin-top: 1.75rem;
  }
  &__stat {
    position: relative;
    container-type: inline-size;
    min-width: 0;
    padding-inline: 0.25rem;
    text-align: center;
    color: var(--color-gold);
  }
  &__stat + &__stat {
    border-left: 1px solid rgb(199 166 104 / 45%);
  }
  &__laurel--right {
    transform: scaleX(-1);
  }
  &__stat :deep(.base-stat__number) {
    color: var(--color-gold-highlight);
    min-width: 0;
    font-size: clamp(1.25rem, 23cqi, 3.25rem);
    line-height: 1.2;
  }
  &__stat :deep(.base-stat__label) {
    max-width: 14ch;
    margin: 0.5rem auto 0;
    color: var(--text-secondary);
    font-size: 1rem;
    line-height: 1.4;
    text-wrap: balance;
  }
}
</style>
