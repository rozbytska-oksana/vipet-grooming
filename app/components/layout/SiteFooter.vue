<template>
  <footer
    id="contacts"
    class="site-footer"
    data-surface="dark"
    aria-labelledby="contacts-title"
  >
    <svg
      class="site-footer__ornament"
      viewBox="0 0 1200 260"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          :id="ornamentId"
          x1="0"
          y1="0"
          x2="1200"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            stop-color="#e6c476"
            stop-opacity="0"
          />
          <stop
            offset=".28"
            stop-color="#c99a43"
            stop-opacity=".3"
          />
          <stop
            offset=".52"
            stop-color="#fff0bf"
            stop-opacity=".65"
          />
          <stop
            offset=".75"
            stop-color="#c99a43"
            stop-opacity=".2"
          />
          <stop
            offset="1"
            stop-color="#e6c476"
            stop-opacity="0"
          />
        </linearGradient>
      </defs>
      <path
        d="M-80 175C140 40 360 255 650 162S1040 58 1280 142"
        :stroke="`url(#${ornamentId})`"
        stroke-width="1"
      />
      <path
        d="M-60 190C180 90 375 253 660 180S1020 85 1280 155"
        :stroke="`url(#${ornamentId})`"
        stroke-width=".6"
        opacity=".55"
      />
      <path
        d="M-100 154C185 1 370 247 650 142S1040 35 1280 126"
        :stroke="`url(#${ornamentId})`"
        stroke-width="6"
        opacity=".1"
      />
    </svg>
    <BaseContainer class="site-footer__content">
      <div class="site-footer__main">
        <div class="site-footer__identity">
          <SiteLogo
            :width="128"
            loading="lazy"
          />
          <p class="site-footer__motto">
            Догляд з любов’ю
            <br />
            <em>до кожної деталі.</em>
          </p>
          <p class="site-footer__caption">Професійний грумінг собак і котів у Житомирі</p>
        </div>
        <div class="site-footer__contacts">
          <h2
            id="contacts-title"
            class="site-footer__heading"
          >
            Завітайте до V.I.Pet
          </h2>
          <address class="site-footer__address">
            <p v-if="business.address">{{ business.address }}</p>
            <p v-if="business.email">
              <a :href="`mailto:${business.email}`">{{ business.email }}</a>
            </p>
          </address>

          <div class="site-footer__socials">
            <a
              class="site-footer__social-icon"
              :href="googleMapsUrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Локація V.I.Pet у Google Maps"
              title="Локація V.I.Pet у Google Maps"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
                <circle
                  cx="12"
                  cy="10"
                  r="2.5"
                />
              </svg>
            </a>
            <a
              v-if="business.instagramUrl"
              class="site-footer__social-icon"
              :href="business.instagramUrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Наш Instagram"
              title="Наш Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
              >
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="4"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3.5"
                />
                <circle
                  cx="17"
                  cy="7"
                  r=".8"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
            <a
              v-if="business.phone"
              class="site-footer__social-icon"
              :href="`tel:${business.phone.replace(/[^+\d]/g, '')}`"
              :aria-label="`Зателефонувати ${business.phone}`"
              title="Зателефонувати"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m6 3 3 5-2 2a15 15 0 0 0 7 7l2-2 5 3-1 3C10 23 1 14 3 4Z" />
              </svg>
            </a>
            <a
              v-if="business.telegramUrl"
              :href="business.telegramUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram
            </a>
            <a
              v-if="business.viberUrl"
              :href="business.viberUrl"
            >
              Viber
            </a>
          </div>
        </div>
        <div class="site-footer__hours-block">
          <h3 class="site-footer__heading">Години роботи</h3>
          <dl class="site-footer__hours">
            <div
              v-for="row in businessHours"
              :key="row.days"
            >
              <dt>{{ row.days }}</dt>
              <dd>{{ row.hours }}</dd>
            </div>
          </dl>
        </div>
        <nav
          class="site-footer__nav"
          aria-label="Навігація у футері"
        >
          <h3 class="site-footer__heading">Світ V.I.Pet</h3>
          <ul class="site-footer__links">
            <li
              v-for="item in footerLinks"
              :key="item.href"
            >
              <a :href="item.href">{{ item.label }}</a>
            </li>
          </ul>
        </nav>
      </div>
      <div class="site-footer__bottom">
        <span>© V.I.Pet {{ currentYear }}</span>
        <p class="site-footer__credit">
          <a
            href="https://www.linkedin.com/in/oksana-rozbytska-4a29291a2/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Created by Oksana
          </a>
        </p>
      </div>
    </BaseContainer>
  </footer>
  <BackToTop />
</template>

<script setup lang="ts">
import { useId } from 'vue';
import BaseContainer from '../ui/BaseContainer.vue';
import SiteLogo from '../ui/SiteLogo.vue';
import BackToTop from '../ui/BackToTop.vue';
import { business, businessHours } from '../../data/salon';
import { navigationItems } from '../../data/navigation';
import { googleMapsUrl } from '../../data/testimonials';
const currentYear = new Date().getFullYear();
const ornamentId = `footer-gold-${useId()}`;
const footerLinks = navigationItems.filter((item) => item.available && item.href !== '#contacts');
</script>

<style scoped lang="scss">
@use '../../assets/styles/breakpoints' as bp;
.site-footer {
  position: relative;
  isolation: isolate;
  overflow: clip;
  --surface: #252527;
  --text-primary: var(--color-ivory);
  --text-secondary: #c9c5bd;
  --focus-ring: var(--color-gold-highlight);
  padding-block: clamp(2.5rem, 4vw, 4rem) 1.25rem;
  background:
    radial-gradient(ellipse at 0 0, rgb(230 196 118 / 5%), transparent 60%), var(--surface);
  border-top: 1px solid rgb(230 196 118 / 25%);
  color: var(--text-primary);
  color-scheme: dark;
  &__content {
    position: relative;
    z-index: 1;
  }
  &__ornament {
    position: absolute;
    width: 100%;
    height: clamp(10rem, 17vw, 17rem);
    bottom: 2rem;
    left: 0;
    pointer-events: none;
    opacity: 0.45;
    @include bp.medium {
      opacity: 0.7;
    }
  }
  &__contacts,
  &__hours-block,
  &__nav {
    padding-top: 1.5rem;
    border-top: 1px solid rgb(230 196 118 / 15%);
    @include bp.medium {
      padding-top: 0;
      border-top: 0;
    }
    @include bp.x-large {
      padding-left: clamp(1rem, 1.5vw, 1.5rem);
    }
  }
  &__main {
    display: grid;
    gap: 2rem;
    padding-bottom: 2rem;
    @include bp.medium {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    @include bp.x-large {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 0.8fr);
      gap: clamp(1.5rem, 3vw, 3rem);
    }
  }
  &__identity,
  &__contacts {
    min-width: 0;
  }
  &__motto {
    margin: 1rem 0 0;
    font: 400 1.75rem/1.1 var(--font-editorial);
  }
  &__motto em {
    color: var(--color-gold-highlight);
  }
  &__caption {
    max-width: 42ch;
    margin: 0.75rem 0 0;
    font-size: 1rem;
    color: var(--text-secondary);
  }
  &__heading {
    color: var(--color-gold-highlight);
    margin: 0 0 1rem;
    font: 400 1.625rem/1.15 var(--font-editorial);
    &::after {
      content: '';
      display: block;
      width: 3rem;
      height: 1px;
      margin-top: 0.75rem;
      background: linear-gradient(90deg, #f6d797, #c99a43 60%, transparent);
    }
  }
  &__address,
  &__socials {
    font: 400 1rem/1.6 var(--font-body);
    color: var(--text-primary);
  }
  &__address {
    color: var(--text-secondary);
  }
  &__address p {
    margin: 0 0 0.75rem;
  }
  &__social-icon {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 1px solid rgb(230 196 118 / 50%);
    border-radius: 50%;
    color: var(--color-gold-highlight);
    @media (prefers-reduced-motion: no-preference) {
      transition:
        background-color 250ms ease,
        border-color 250ms ease,
        box-shadow 250ms ease;
    }
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background: rgb(230 196 118 / 8%);
        border-color: var(--color-gold-highlight);
        box-shadow: 0 0 16px rgb(230 196 118 / 12%);
      }
    }
    svg {
      width: 20px;
      height: 20px;
    }
  }
  &__socials {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1rem;
    font-size: 1rem;
  }
  &__hours {
    margin: 0;
    font-size: 1rem;
    color: var(--text-secondary);
  }
  &__hours div + div {
    margin-top: 1rem;
  }
  &__hours dd {
    margin: 0.25rem 0 0;
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
  }
  &__links {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    @include bp.x-large {
      grid-template-columns: 1fr;
    }
    gap: 0.35rem;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 1rem;
  }
  &__links a {
    display: inline-block;
    padding-block: 0.25rem;
    color: var(--text-secondary);
    text-decoration: none;
  }
  a {
    font-weight: 400;
    text-decoration: none;
    text-underline-offset: 0.25em;
    overflow-wrap: anywhere;
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        color: var(--color-gold-highlight);
      }
    }
  }
  &__credit {
    margin: 0;
    color: inherit;
    font: inherit;
    white-space: nowrap;
    & a {
      color: inherit;
      @media (hover: hover) and (pointer: fine) {
        &:hover {
          color: inherit;
          text-decoration: underline;
        }
      }
    }
  }
  &__bottom {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgb(230 196 118 / 20%);
    padding-right: 3.5rem;
    color: var(--text-secondary);
    font-size: 0.875rem;
    line-height: 1.5;
    @include bp.medium {
      justify-content: flex-end;
    }
  }
}
</style>
