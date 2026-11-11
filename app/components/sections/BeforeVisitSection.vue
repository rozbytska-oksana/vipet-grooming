<template>
  <section
    id="before-visit"
    class="before-visit"
    data-surface="light"
    aria-labelledby="before-visit-title"
  >
    <BaseContainer>
      <h2
        id="before-visit-title"
        class="before-visit__title"
      >
        Перед візитом
      </h2>
      <svg
        class="before-visit__accent"
        viewBox="0 0 260 20"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M2 15C70 -8 170 28 258 4"
          stroke="currentColor"
        />
        <path
          d="M45 16C122 2 189 20 240 9"
          stroke="currentColor"
          opacity=".4"
        />
      </svg>
      <ul class="before-visit__list">
        <li class="before-visit__item">
          <BaseIcon
            class="before-visit__icon"
            name="paw"
          />
          <div>
            <h3>Прогуляйтеся перед грумінгом</h3>
            <p>Дайте собаці справити потреби та витратити зайву енергію.</p>
          </div>
        </li>
        <li class="before-visit__item">
          <svg
            class="before-visit__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M12 3C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-12Z" />
            <path d="M8 15a4 4 0 0 0 4 4" />
          </svg>
          <div>
            <h3>Домашнє купання необов’язкове</h3>
            <p>Мити й розчісувати улюбленця перед салоном не потрібно.</p>
          </div>
        </li>
        <li class="before-visit__item">
          <BaseIcon
            class="before-visit__icon"
            name="heart"
          />
          <div>
            <h3>Розкажіть про особливості</h3>
            <p>Зазначте побажання та особливості улюбленця в коментарі до заявки.</p>
          </div>
        </li>
      </ul>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import BaseContainer from '../ui/BaseContainer.vue';
import BaseIcon from '../ui/BaseIcon.vue';
</script>

<style scoped lang="scss">
@use '../../assets/styles/breakpoints' as bp;

.before-visit {
  padding-block: clamp(1.75rem, 3vw, 2.75rem);
  color: var(--text-primary);
  background:
    radial-gradient(ellipse at top, rgb(255 253 246 / 65%), transparent 70%), var(--surface);

  &__title {
    margin: 0;
    text-align: center;
    font: 400 clamp(1.875rem, 2.8vw, 2.75rem)/1.1 var(--font-editorial);
  }

  &__accent {
    display: block;
    width: min(16rem, 65%);
    height: auto;
    margin: 0.875rem auto 1.5rem;
    color: #b5974b;
  }

  &__list {
    display: grid;
    gap: 1.25rem;
    margin: 0;
    padding: 0;
    list-style: none;

    @include bp.medium {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: clamp(1.25rem, 3vw, 3rem);
    }
  }

  &__item {
    display: grid;
    grid-template-columns: 2rem minmax(0, 1fr);
    align-items: start;
    gap: 0.875rem;

    @include bp.medium {
      grid-template-columns: minmax(0, 1fr);
      justify-items: center;
      text-align: center;
    }

    & h3 {
      margin: 0 0 0.375rem;
      font: 500 clamp(1.375rem, 1.8vw, 1.625rem)/1.2 var(--font-editorial);
      text-wrap: balance;
    }

    & p {
      max-width: 36ch;
      margin: 0;
      color: #57534f;
      font-size: 1rem;
      line-height: 1.6;

      @include bp.medium {
        margin-inline: auto;
      }
    }
  }

  &__icon {
    display: block;
    width: 2rem;
    height: 2rem;
    color: #b5974b;
  }
}
</style>
