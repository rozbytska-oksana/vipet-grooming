<template>
  <header class="site-header">
    <a
      class="site-header__skip"
      href="#main-content"
    >
      Перейти до вмісту
    </a>
    <BaseContainer class="site-header__inner">
      <a
        class="site-header__brand"
        href="#hero"
        aria-label="V.I.Pet — на головну"
      >
        <SiteLogo />
      </a>

      <nav
        class="site-header__desktop-nav"
        aria-label="Основна навігація"
      >
        <ul class="site-header__links">
          <li
            v-for="item in navigationItems"
            :key="item.href"
          >
            <a
              v-if="item.available"
              :href="item.href"
              class="site-header__link"
              :aria-current="activeHref === item.href ? 'location' : undefined"
            >
              {{ item.label }}
              <svg
                class="site-header__underline"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M2 8C24 3 64 12 98 3"
                  pathLength="1"
                />
              </svg>
            </a>
            <span
              v-else
              class="site-header__link site-header__link--unavailable"
              aria-disabled="true"
              :title="`${item.label}: розділ ще готується`"
            >
              {{ item.label }}
            </span>
          </li>
        </ul>
      </nav>

      <BaseButton
        class="site-header__booking"
        aria-describedby="booking-availability"
        @click="emit('booking')"
      >
        Записати улюбленця
      </BaseButton>

      <div class="site-header__mobile-menu">
        <button
          ref="menuTrigger"
          type="button"
          class="site-header__menu-trigger"
          aria-label="Відкрити навігаційне меню"
          aria-haspopup="dialog"
          @click="openMenu"
        >
          <BaseIcon name="menu" />
        </button>
        <dialog
          ref="menu"
          class="site-header__menu-dialog"
          aria-label="Меню V.I.Pet"
          @cancel.prevent="closeMenu"
        >
          <div class="site-header__menu-top">
            <p class="site-header__menu-label">Світ V.I.Pet</p>
            <button
              type="button"
              class="site-header__menu-trigger"
              aria-label="Закрити меню"
              @click="closeMenu"
            >
              <BaseIcon name="close" />
            </button>
          </div>
          <nav
            class="site-header__menu-panel"
            aria-label="Мобільна навігація"
          >
            <svg
              class="site-header__menu-wave"
              viewBox="0 0 180 520"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M170 -20C-40 145 225 270 24 550" />
              <path d="M184 -20C-26 145 239 270 38 550" />
            </svg>
            <ul class="site-header__mobile-links">
              <li
                v-for="(item, index) in navigationItems"
                :key="item.href"
              >
                <a
                  v-if="item.available"
                  :href="item.href"
                  :aria-current="activeHref === item.href ? 'location' : undefined"
                  @click="navigateFromMenu"
                >
                  <span
                    class="site-header__menu-number"
                    aria-hidden="true"
                  >
                    {{ String(index + 1).padStart(2, '0') }}
                  </span>
                  <span>{{ item.label }}</span>
                  <svg
                    class="site-header__mobile-underline"
                    viewBox="0 0 100 12"
                    preserveAspectRatio="none"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M2 8C24 3 64 12 98 3"
                      pathLength="1"
                    />
                  </svg>
                </a>
                <span
                  v-else
                  aria-disabled="true"
                >
                  {{ item.label }}
                  <span class="site-header__coming-soon">Незабаром</span>
                </span>
              </li>
            </ul>
            <BaseButton
              class="site-header__mobile-booking"
              aria-describedby="booking-availability"
              @click="openBooking"
            >
              Записати улюбленця
            </BaseButton>
          </nav>
        </dialog>
      </div>
    </BaseContainer>
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import BaseButton from '../ui/BaseButton.vue';
import BaseContainer from '../ui/BaseContainer.vue';
import BaseIcon from '../ui/BaseIcon.vue';
import SiteLogo from '../ui/SiteLogo.vue';
import { navigationItems } from '../../data/navigation';

const emit = defineEmits<{ booking: [] }>();
const menu = ref<HTMLDialogElement | null>(null);
const menuTrigger = ref<HTMLElement | null>(null);

const activeHref = ref<string | null>(null);
let frame = 0;
let stopTracking: (() => void) | undefined;

onMounted(() => {
  const sections = navigationItems
    .filter((item) => item.available)
    .map((item) => ({ href: item.href, element: document.getElementById(item.href.slice(1)) }));
  const update = () => {
    frame = 0;
    const readingLine = window.innerHeight * 0.3;
    activeHref.value =
      sections.find(({ element }) => {
        if (!element) return false;
        const bounds = element.getBoundingClientRect();
        return bounds.top <= readingLine && bounds.bottom > readingLine;
      })?.href ?? null;
  };
  const schedule = () => {
    if (window.innerWidth >= 1200 && menu.value?.open) menu.value.close();
    if (!frame) frame = window.requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
  stopTracking = () => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    window.cancelAnimationFrame(frame);
  };
});

onBeforeUnmount(() => stopTracking?.());

let menuAnimation: Animation | undefined;
let closing = false;

const openMenu = () => {
  const dialog = menu.value;
  if (!dialog || dialog.open) return;
  dialog.showModal();
  dialog.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    menuAnimation = dialog.animate(
      [
        { opacity: 0, transform: 'translateY(-18px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    );
  }
};

const closeMenu = async () => {
  const dialog = menu.value;
  if (!dialog?.open || closing) return;
  closing = true;
  menuAnimation?.cancel();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    menuAnimation = dialog.animate(
      [
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(-12px)' },
      ],
      { duration: 350, easing: 'ease-in', fill: 'forwards' },
    );
    await menuAnimation.finished.catch(() => undefined);
  }
  dialog.close();
  menuAnimation?.cancel();
  closing = false;
  menuTrigger.value?.focus({ preventScroll: true });
};

const navigateFromMenu = async (event: MouseEvent) => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const hash = (event.currentTarget as HTMLAnchorElement).hash;
  if (!hash) return;
  event.preventDefault();
  if (closing) return;
  await closeMenu();
  // Start the anchor transition only after the modal releases background scrolling.
  if (window.location.hash !== hash) {
    window.location.hash = hash;
  } else {
    document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
  }
};

const openBooking = async () => {
  await closeMenu();
  emit('booking');
};

onBeforeUnmount(() => {
  menuAnimation?.cancel();
  menu.value?.close();
});
</script>

<style scoped lang="scss">
@use '../../assets/styles/breakpoints' as bp;

.site-header {
  position: absolute;
  inset: 0 0 auto;
  z-index: 10;
  background: linear-gradient(180deg, rgb(28 28 30 / 45%), transparent);

  &__skip {
    position: fixed;
    z-index: 30;
    top: 1rem;
    left: 1rem;
    padding: 0.75rem 1rem;
    transform: translateY(-200%);
    border-radius: 0.25rem;
    background: var(--color-ivory);
    color: var(--color-black);

    &:focus {
      transform: translateY(0);
    }
  }

  &__inner {
    position: relative;
    display: flex;
    min-height: var(--header-height);
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;

    @include bp.x-large {
      gap: 1.25rem;
    }
  }

  &__brand {
    display: grid;
    flex: 0 0 auto;
    justify-items: center;
    padding-block: 0.25rem;
    color: var(--color-ivory);
    text-decoration: none;
  }

  &__desktop-nav {
    display: none;

    @include bp.x-large {
      display: block;
    }
  }

  &__links {
    display: flex;
    align-items: center;
    gap: clamp(0.75rem, 1.3vw, 1.25rem);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__link {
    position: relative;
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    color: var(--color-ivory);
    font-size: clamp(1.25rem, 1.45vw, 1.375rem);
    font-family: var(--font-editorial);
    text-decoration: none;
    white-space: nowrap;

    &:focus-visible,
    &[aria-current='location'] {
      color: #f4dc97;

      .site-header__underline path {
        stroke-dashoffset: 0;
        opacity: 1;
      }
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        color: #f4dc97;

        .site-header__underline path {
          stroke-dashoffset: 0;
          opacity: 1;
        }
      }
    }

    &--unavailable {
      color: var(--color-silver);
      cursor: default;
    }
  }

  &__underline {
    position: absolute;
    inset: auto 0 -1px;
    width: 100%;
    height: 10px;
    overflow: visible;
    color: #e5c779;
    pointer-events: none;

    path {
      stroke: currentColor;
      stroke-width: 1.3;
      stroke-linecap: round;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      opacity: 0;
      transition:
        stroke-dashoffset 0.6s ease,
        opacity 0.2s ease;

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }
  }

  &__booking.base-button {
    display: none;
    min-height: 48px;
    padding-inline: 1.5rem;
    font-size: 1.25rem;

    @include bp.medium {
      display: inline-flex;
      margin-left: auto;
    }

    @include bp.x-large {
      margin-left: 0;
    }
  }

  &__mobile-menu {
    @include bp.x-large {
      display: none;
    }

    &[open] .site-header__menu-open-icon {
      display: none;
    }

    &[open] .site-header__menu-close-icon {
      display: block;
    }
  }

  &__menu-trigger {
    display: grid;
    width: 48px;
    height: 48px;
    place-items: center;
    border: 1px solid rgb(199 166 104 / 35%);
    border-radius: 50%;
    color: var(--color-gold-highlight);
    background: transparent;
    cursor: pointer;
    list-style: none;

    &::-webkit-details-marker {
      display: none;
    }

    svg {
      width: 25px;
      height: 25px;
    }
  }

  &__menu-close-icon {
    display: none;
  }

  &__menu-dialog {
    --menu-top-height: calc(5rem + env(safe-area-inset-top));
    position: fixed;
    inset: 0;
    width: 100%;
    max-width: none;
    height: 100dvh;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    color: #f5f1ea;
    background:
      radial-gradient(ellipse at 100% 45%, rgb(229 199 121 / 8%), transparent 65%),
      linear-gradient(135deg, #303033, #232325 60%, #1c1c1e);

    &::backdrop {
      background: #232325;
    }
  }

  &__menu-top {
    display: flex;
    min-height: var(--menu-top-height);
    align-items: center;
    justify-content: space-between;
    padding-top: env(safe-area-inset-top);
    padding-inline: 1.5rem;
  }

  &__menu-panel {
    position: relative;
    isolation: isolate;
    display: flex;
    min-height: calc(100dvh - var(--menu-top-height));
    flex-direction: column;
    max-width: 36rem;
    margin-inline: auto;
    padding: 0.25rem 1.5rem max(1.5rem, env(safe-area-inset-bottom));
  }

  &__menu-label {
    position: relative;
    margin: 0;
    color: #e5c779;
    font-size: 0.75rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
  }

  &__menu-wave {
    position: absolute;
    z-index: -1;
    top: 0;
    right: 0;
    width: 100px;
    height: 100%;
    pointer-events: none;
    stroke: #e5c779;
    stroke-width: 0.7;
    opacity: 0.18;
  }

  &__mobile-links {
    display: grid;
    margin: 0 0 1.25rem;
    padding: 0;
    list-style: none;

    li + li {
      border-top: 1px solid rgb(229 199 121 / 13%);
    }

    a,
    span[aria-disabled] {
      position: relative;
      display: flex;
      min-height: 46px;
      align-items: center;
      gap: 1rem;
      padding-block: 1.25rem;
      color: #f5f1ea;
      font-family: var(--font-editorial);
      font-size: 1.875rem;
      line-height: 1.2;
      text-decoration: none;
    }

    a:focus-visible,
    a[aria-current='location'] {
      color: #f4dc97;

      .site-header__mobile-underline path {
        stroke-dashoffset: 0;
        opacity: 1;
      }
    }

    @media (hover: hover) and (pointer: fine) {
      a:hover {
        color: #f4dc97;

        .site-header__mobile-underline path {
          stroke-dashoffset: 0;
          opacity: 1;
        }
      }
    }

    span[aria-disabled] {
      color: var(--color-silver);
    }
  }

  &__menu-number {
    min-width: 1.5rem;
    color: #e5c779;
    font-family: var(--font-body);
    font-size: 0.75rem;
    letter-spacing: 0.06em;
  }

  &__mobile-underline {
    position: absolute;
    inset: auto 0 0 2.5rem;
    width: calc(100% - 2.5rem);
    height: 8px;
    pointer-events: none;

    path {
      stroke: #e5c779;
      stroke-width: 1;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      opacity: 0;
      transition:
        stroke-dashoffset 0.6s ease,
        opacity 0.2s ease;

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }
  }

  &__coming-soon {
    font-size: 1rem;
    color: var(--color-silver);
  }

  &__mobile-booking.base-button {
    width: 100%;
    margin-top: auto;
    min-height: 52px;
    padding-inline: 1rem;
    font-size: 1.375rem;
  }
}
</style>
