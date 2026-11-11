<template>
  <section
    id="hero"
    ref="hero"
    class="hero"
    aria-labelledby="hero-title"
  >
    <div
      class="hero__light"
      aria-hidden="true"
    />
    <picture
      class="hero__interior"
      aria-hidden="true"
    >
      <source
        media="(min-width: 1200px)"
        type="image/avif"
        :srcset="layerSources('interior', 'avif')"
        sizes="100vw"
      />
      <source
        media="(min-width: 1200px)"
        type="image/webp"
        :srcset="layerSources('interior', 'webp')"
        sizes="100vw"
      />
      <img
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E"
        width="1920"
        height="1200"
        alt=""
        decoding="async"
      />
    </picture>
    <BaseContainer class="hero__layout">
      <div class="hero__intro">
        <p
          class="hero__eyebrow"
          lang="en"
        >
          Grooming salon
        </p>
        <h1
          id="hero-title"
          class="hero__title"
        >
          <span
            class="hero__wordmark"
            lang="en"
          >
            <span class="visually-hidden">V.I.Pet</span>
            <span
              class="hero__letters"
              aria-hidden="true"
            >
              <span
                v-for="(clip, index) in wordmarkClips"
                :key="index"
                class="hero__letter"
                :style="{ clipPath: clip, '--letter-index': index }"
              >
                <img
                  :src="`${baseURL}images/brand/wordmark-original-768.webp`"
                  :srcset="
                    [384, 512, 768, 1536]
                      .map(
                        (width) =>
                          `${baseURL}images/brand/wordmark-original-${width}.webp ${width}w`,
                      )
                      .join(', ')
                  "
                  sizes="(min-width: 1200px) min(34vw, clamp(22.05rem, 31.5vw, 28.35rem)), (min-width: 768px) clamp(17.325rem, 47.25vw, 26.775rem), clamp(14.175rem, 64.575vw, 16.5375rem)"
                  width="2288"
                  height="620"
                  alt=""
                  loading="eager"
                  decoding="async"
                />
              </span>
            </span>
          </span>
          <span
            class="hero__divider"
            aria-hidden="true"
          />
          <span class="hero__description">
            Кожен улюбленець
            <span class="hero__description-line">особливий</span>
          </span>
        </h1>
        <p class="hero__lead">
          <span>Професійний грумінг у Житомирі,</span>
          <span>де дбають про красу й комфорт</span>
          <span>вашого улюбленця.</span>
        </p>
      </div>

      <figure class="hero__visual">
        <picture class="hero__picture">
          <source
            type="image/avif"
            :srcset="layerSources('foreground', 'avif')"
            :sizes="foregroundSizes"
          />
          <img
            class="hero__image"
            :src="`${baseURL}images/hero/foreground-v8-768.webp`"
            :srcset="layerSources('foreground', 'webp')"
            :sizes="foregroundSizes"
            width="1536"
            height="1024"
            alt="Демонстраційне AI-зображення: пудель із золотим метеликом і сірий кіт на темному оксамиті"
            loading="eager"
            fetchpriority="high"
          />
        </picture>
        <figcaption class="visually-hidden">
          Тимчасовий постановочний візуал, не фотографія робіт салону.
        </figcaption>
      </figure>

      <div class="hero__actions">
        <ul
          class="hero__values"
          aria-label="Наші цінності"
        >
          <li class="hero__value">
            <BaseIcon name="paw" />
            <span>Довіра</span>
          </li>
          <li class="hero__value">
            <BaseIcon name="heart" />
            <span>Турбота</span>
          </li>
          <li class="hero__value">
            <BaseIcon name="award" />
            <span>Професіоналізм</span>
          </li>
        </ul>
      </div>
    </BaseContainer>

    <svg
      class="hero__left-waves"
      viewBox="0 0 360 850"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id="hero-left-wave"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="180"
          y2="760"
        >
          <stop
            stop-color="#b59655"
            stop-opacity="0"
          />
          <stop
            offset="0.2"
            stop-color="#c4a365"
            stop-opacity="0.2"
          />
          <stop
            offset="0.3"
            stop-color="#ffe8ac"
            stop-opacity="0.85"
          />
          <stop
            offset="0.38"
            stop-color="#d4ad68"
            stop-opacity="0.25"
          />
          <stop
            offset="0.52"
            stop-color="#d6b475"
            stop-opacity="0.35"
          />
          <stop
            offset="0.59"
            stop-color="#fff2ca"
          />
          <stop
            offset="0.66"
            stop-color="#e4c17f"
            stop-opacity="0.4"
          />
          <stop
            offset="0.84"
            stop-color="#b69862"
            stop-opacity="0.12"
          />
          <stop
            offset="1"
            stop-color="#b69862"
            stop-opacity="0"
          />
        </linearGradient>
        <radialGradient id="hero-wave-flare">
          <stop stop-color="#fff7d4" />
          <stop
            offset="0.12"
            stop-color="#ffdb85"
            stop-opacity="0.9"
          />
          <stop
            offset="0.4"
            stop-color="#e9a63e"
            stop-opacity="0.25"
          />
          <stop
            offset="1"
            stop-color="#e9a63e"
            stop-opacity="0"
          />
        </radialGradient>
      </defs>
      <path
        d="M18 -45C-38 108 4 196 57 247S-8 353 47 444S159 569 344 722C145 610 34 516 25 441S66 304 42 255S-59 128 18 -45Z"
        fill="url(#hero-left-wave)"
        opacity="0.28"
        class="hero__wave-silk"
      />
      <path
        d="M-58 320C-21 399 18 439 94 476S202 541 365 618C177 566 108 518 72 498S-25 421 -58 320Z"
        fill="url(#hero-left-wave)"
        opacity="0.2"
        class="hero__wave-silk"
      />
      <path
        class="hero__wave-glow"
        d="M18 -45C-38 108 4 196 57 247S-8 353 47 444S159 569 344 722"
        stroke="url(#hero-left-wave)"
        stroke-width="12"
        pathLength="1"
      />
      <path
        d="M18 -45C-38 108 4 196 57 247S-8 353 47 444S159 569 344 722"
        stroke="url(#hero-left-wave)"
        stroke-width="1.2"
        pathLength="1"
      />
      <path
        d="M-42 112C-12 212 110 252 68 326S-4 423 75 498S205 612 314 762"
        stroke="url(#hero-left-wave)"
        stroke-width="0.6"
        opacity="0.35"
        pathLength="1"
      />
      <path
        d="M-58 320C-21 399 18 439 94 476S202 541 365 618"
        stroke="url(#hero-left-wave)"
        stroke-width="0.8"
        opacity="0.5"
        pathLength="1"
      />
      <ellipse
        cx="48"
        cy="445"
        rx="8"
        ry="46"
        transform="rotate(-34 48 445)"
        fill="url(#hero-wave-flare)"
      />
      <ellipse
        cx="49"
        cy="239"
        rx="6"
        ry="32"
        transform="rotate(-25 49 239)"
        fill="url(#hero-wave-flare)"
      />
    </svg>

    <div
      class="hero__particles"
      aria-hidden="true"
    >
      <i
        v-for="point in 7"
        :key="point"
      />
    </div>
    <svg
      class="hero__ribbon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 160"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id="hero-metal-gold"
          x1="0"
          y1="0"
          x2="0.35"
          y2="1"
        >
          <stop
            offset="0"
            stop-color="#fff0bf"
          />
          <stop
            offset="0.28"
            stop-color="#e5c779"
          />
          <stop
            offset="0.5"
            stop-color="#bfa05a"
          />
          <stop
            offset="0.68"
            stop-color="#fff0bf"
          />
          <stop
            offset="1"
            stop-color="#d8bb70"
          />
        </linearGradient>
        <linearGradient id="hero-ribbon-gold">
          <stop
            stop-color="#c7a668"
            stop-opacity="0"
          />
          <stop
            offset="0.3"
            stop-color="#c7a668"
            stop-opacity="0.55"
          />
          <stop
            offset="0.8"
            stop-color="#f6d797"
          />
          <stop
            offset="1"
            stop-color="#c7a668"
            stop-opacity="0.15"
          />
        </linearGradient>
      </defs>
      <path
        d="M-40 138C232 18 465 176 793 132S1220 90 1490 10"
        stroke="url(#hero-ribbon-gold)"
        stroke-width="1.2"
        pathLength="1"
      />
      <path
        d="M-40 153C243 42 487 185 806 144S1240 105 1490 26"
        stroke="url(#hero-ribbon-gold)"
        stroke-width="0.5"
        pathLength="1"
        opacity="0.45"
      />
    </svg>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useHeroMotion } from '../../composables/useHeroMotion';
import BaseContainer from '../ui/BaseContainer.vue';
import BaseIcon from '../ui/BaseIcon.vue';

const hero = ref<HTMLElement | null>(null);
useHeroMotion(hero);

const baseURL = useRuntimeConfig().app.baseURL;
// Original artwork partitions: V, paw, I, paw, P, e, t. Every layer shares
// the same canvas, preserving the exact original spacing and fine strokes.
const wordmarkClips = [
  'polygon(0 0, 26.5% 0, 26.5% 75%, 20% 75%, 20% 100%, 0 100%)',
  'polygon(20% 75%, 26.5% 75%, 26.5% 100%, 20% 100%)',
  'inset(0 65% 0 26.5%)',
  'inset(0 59.26% 0 35%)',
  'inset(0 36.32% 0 40.74%)',
  'inset(0 15.38% 0 63.68%)',
  'inset(0 0 0 84.62%)',
];
const layerSources = (layer: 'foreground' | 'interior', format: 'avif' | 'webp') =>
  (layer === 'foreground' ? [480, 768, 1200, 1536] : [1280, 1920])
    .map(
      (width) =>
        `${baseURL}images/hero/${layer}-${layer === 'foreground' ? 'v8' : 'v6'}-${width}.${format} ${width}w`,
    )
    .join(', ');
const foregroundSizes =
  '(min-width: 1200px) min(66vw, calc((max(780px, 100svh) - 128px) * 1.5)), 100vw';
useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      type: 'image/avif',
      imagesrcset: layerSources('foreground', 'avif'),
      imagesizes: foregroundSizes,
      fetchpriority: 'high',
    },
  ],
});
</script>

<style scoped lang="scss">
@use '../../assets/styles/breakpoints' as bp;

.hero {
  // Hero-only palette: the other sections retain their current approved work.
  --hero-deep: #232325;
  --hero-graphite: #303033;
  --hero-dark: #1c1c1e;
  --hero-gold: #c6a667;
  --hero-gold-light: #e8c98a;
  --hero-metal: linear-gradient(
    175deg,
    #fff0bf 5%,
    #e5c779 28%,
    #bfa05a 50%,
    #fff0bf 68%,
    #d8bb70 95%
  );

  position: relative;
  isolation: isolate;
  overflow: clip;
  min-height: 100svh;
  padding-top: calc(var(--header-height) + 0.25rem);

  @include bp.medium {
    padding-top: calc(var(--header-height) + 2.5rem);
  }
  background: var(--hero-deep);
  color: #f5f1ea;

  @include bp.x-large {
    display: grid;
    min-height: max(780px, 100svh);
    align-items: center;
    padding-block: calc(var(--header-height) + 2rem) 4rem;
  }

  &__light {
    position: absolute;
    z-index: -1;
    inset: 0;
    background:
      radial-gradient(ellipse at 60% 55%, rgb(198 166 103 / 5%), transparent 65%),
      linear-gradient(110deg, var(--hero-graphite), var(--hero-deep) 65%, var(--hero-dark));
    pointer-events: none;
  }

  &__layout {
    display: grid;
    grid-template-areas: '.' 'intro' 'actions' '.' 'visual';
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) auto auto minmax(0, 1fr) auto;
    min-height: calc(100svh - var(--header-height) - 0.25rem);
    justify-items: center;

    @include bp.medium {
      min-height: calc(100svh - var(--header-height) - 2.5rem);
    }

    @include bp.x-large {
      position: static;
      min-height: 0;
      grid-template-rows: auto;
      grid-template-areas: 'intro' 'actions';
      --container-max: 100%;
      grid-template-columns: minmax(0, max(380px, 34vw));
      align-content: center;
    }
  }

  &__intro {
    position: relative;
    z-index: 3;
    grid-area: intro;
    width: 100%;
    text-align: center;
  }

  &__eyebrow {
    margin: 0 0 0.5rem;
    color: var(--hero-gold-light);
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 0.875rem;
    letter-spacing: 0.28em;

    @include bp.medium {
      font-size: 1rem;
      letter-spacing: 0.32em;
    }
    text-transform: uppercase;
  }

  &__title {
    margin: 0;
    font-family: var(--font-editorial);
    font-weight: 400;
  }

  &__wordmark {
    position: relative;
    display: inline-block;
    max-width: 100%;
    font-size: clamp(4.5rem, 20.5vw, 5.25rem);

    @include bp.medium {
      font-size: clamp(5.5rem, 15vw, 8.5rem);
    }
    letter-spacing: -0.055em;
    line-height: 0.95;

    @include bp.x-large {
      font-size: clamp(7rem, 10vw, 9rem);
    }
  }

  &__letters {
    position: relative;
    display: block;
    width: 3.15em;
    max-width: 100%;
    aspect-ratio: 2288 / 620;
  }

  &__letter {
    position: absolute;
    inset: 0;
    display: block;
    img {
      display: block;
      width: 100%;
      height: 100%;
      max-width: none;
    }
  }

  &__divider {
    display: block;
    width: 70%;
    height: 1px;
    margin: 0.15rem auto 0.3rem;
    background: linear-gradient(90deg, transparent, var(--hero-gold), transparent);
    transform-origin: left center;
  }

  &__description {
    display: block;
    color: var(--hero-gold-light);
    font-style: italic;
    font-synthesis: none;
    font-size: clamp(2rem, 8.8vw, 2.375rem);

    @include bp.medium {
      font-size: clamp(2.5rem, 6vw, 3.5rem);
    }
    line-height: 1.04;

    @include bp.x-large {
      font-size: clamp(2.75rem, 3.7vw, 3.5rem);
    }
  }

  &__eyebrow,
  &__description {
    @supports (background-clip: text) {
      background: var(--hero-metal);
      background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 1px 1px rgb(0 0 0 / 45%));
    }

    @media (forced-colors: active) {
      background: none;
      color: CanvasText;
      -webkit-text-fill-color: CanvasText;
      filter: none;
    }
  }

  &__description-line {
    display: block;
  }

  &__lead {
    max-width: 38ch;
    margin: 0.5rem auto 0;
    font-family: var(--font-body);
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.4;

    span {
      display: block;
    }
    text-wrap: balance;

    @include bp.medium {
      margin-top: 1.125rem;
      font-size: 1.125rem;
    }
  }

  &__interior {
    display: none;
    pointer-events: none;

    @include bp.x-large {
      display: block;
      position: absolute;
      z-index: -1;
      inset: 0;
      opacity: 0.7;
      mask-image: linear-gradient(90deg, transparent 12%, #000 65%);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: right center;
    }
  }

  &__visual {
    position: relative;
    z-index: 0;
    grid-area: visual;
    align-self: end;
    width: calc(100% + 2 * var(--container-gutter));
    aspect-ratio: 3 / 2;
    margin: 1rem 0 0;

    @include bp.x-large {
      position: absolute;
      grid-area: auto;
      inset: auto 0 0 auto;
      width: min(66vw, calc((max(780px, 100svh) - 128px) * 1.5));
      margin: 0;
    }
  }

  &__picture {
    position: absolute;
    inset: 0;
    display: block;
  }

  &__image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center bottom;
  }

  &__actions {
    position: relative;
    z-index: 3;
    grid-area: actions;
    width: 100%;
    padding-top: 1.25rem;

    @include bp.medium {
      padding-top: 1.5rem;
    }
    text-align: center;
  }

  &__values {
    display: flex;
    align-items: stretch;
    justify-content: center;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__value {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.25rem clamp(0.5rem, 2.6vw, 0.75rem);
    font-size: 1rem;
    line-height: 1.3;

    @include bp.medium {
      flex-direction: row;
      gap: 0.5rem;
      padding: 0 0.75rem;
    }

    & + & {
      border-left: 1px solid rgb(198 166 103 / 45%);
    }

    svg {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      color: var(--hero-gold-light);
      stroke: url(#hero-metal-gold);
    }
  }

  &__left-waves {
    position: absolute;
    z-index: 2;
    inset: 0 auto 0 0;
    width: clamp(90px, 18vw, 350px);
    height: 100%;
    pointer-events: none;
    opacity: 0.65;

    @include bp.x-large {
      opacity: 1;
    }
  }

  &__wave-silk {
    filter: blur(2px);
  }

  &__wave-glow {
    opacity: 0.45;
    filter: blur(9px);
  }

  &__particles {
    position: absolute;
    z-index: 2;
    inset: 15% 0 5%;
    pointer-events: none;

    i {
      position: absolute;
      left: 42%;
      top: 20%;
      width: 2px;
      height: 2px;
      border-radius: 50%;
      background: var(--hero-gold-light);
      box-shadow: 0 0 8px 2px rgb(232 201 138 / 25%);

      &:nth-child(2) {
        left: 38%;
        top: 40%;
      }
      &:nth-child(3) {
        left: 49%;
        top: 12%;
      }
      &:nth-child(4) {
        left: 88%;
        top: 30%;
      }
      &:nth-child(5) {
        left: 94%;
        top: 51%;
      }
      &:nth-child(6) {
        left: 4%;
        top: 65%;
      }
      &:nth-child(7) {
        left: 32%;
        top: 75%;
      }
    }
  }

  &__ribbon {
    position: absolute;
    z-index: 2;
    inset: auto 0 0;
    width: 100%;
    height: 90px;
    pointer-events: none;
    filter: drop-shadow(0 0 5px rgb(232 201 138 / 40%));

    @include bp.x-large {
      height: 140px;
    }
  }
}

// Render-blocking component CSS starts the entrance before hydration or GSAP imports.
// Backwards fill covers each delay; the underlying styles restore final opacity/transform.
@media (prefers-reduced-motion: no-preference) {
  .hero {
    &__light {
      animation: hero-fade-in 1.2s ease-out backwards;
    }

    &__eyebrow {
      animation: hero-rise-in 1.25s ease-out 0.2s backwards;
    }

    &__letter {
      animation: hero-rise-in 0.95s ease-out backwards;
      animation-delay: calc(0.45s + var(--letter-index) * 0.17s);
    }

    &__divider {
      animation: hero-line-in 1.4s ease-out 1s backwards;
    }

    &__image {
      animation: hero-image-in 2s ease-out backwards;
    }

    &__description {
      animation: hero-rise-in 1.5s ease-out 1.15s backwards;
    }

    &__lead {
      animation: hero-rise-in 1.2s ease-out 1.55s backwards;
    }

    &__ribbon path,
    &__left-waves path {
      animation: hero-stroke-in 1.7s ease-out 1.3s backwards;
    }

    &__left-waves ellipse {
      animation: hero-fade-in 1.6s ease-out 1.5s backwards;
    }

    &__particles i {
      animation: hero-rise-in 1.1s ease-out backwards;

      @for $index from 1 through 7 {
        &:nth-child(#{$index}) {
          animation-delay: #{1.65 + ($index - 1) * 0.1}s;
        }
      }
    }

    &__value {
      animation: hero-rise-in 1.1s ease-out backwards;

      @for $index from 1 through 3 {
        &:nth-child(#{$index}) {
          animation-delay: #{1.9 + ($index - 1) * 0.16}s;
        }
      }
    }
  }
}

@keyframes hero-fade-in {
  from {
    opacity: 0;
  }
}

@keyframes hero-rise-in {
  from {
    opacity: 0;
    translate: 0 16px;
  }
}

@keyframes hero-image-in {
  from {
    opacity: 0;
    translate: 0 16px;
  }
}

@keyframes hero-line-in {
  from {
    scale: 0 1;
  }
}

@keyframes hero-stroke-in {
  from {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    opacity: 0;
  }
}
</style>
