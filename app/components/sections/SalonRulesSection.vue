<template>
  <section
    id="salon-rules"
    class="salon-rules"
    data-surface="dark"
    aria-labelledby="salon-rules-title"
  >
    <BaseContainer class="salon-rules__layout">
      <header class="salon-rules__heading">
        <h2
          id="salon-rules-title"
          class="salon-rules__title"
        >
          Правила салону
        </h2>
        <svg
          class="salon-rules__accent"
          viewBox="0 0 260 20"
          fill="none"
          aria-hidden="true"
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
        <p>Якщо ваші плани змінюються, будь ласка, повідомте нас завчасно.</p>
        <BaseIcon
          class="salon-rules__paw"
          name="paw"
        />
      </header>

      <div class="salon-rules__grid">
        <BaseDisclosure class="salon-rules__rule">
          <template #summary>
            <span>Стан здоров’я тварини</span>
            <svg
              class="salon-rules__chevron"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="m6 9 6 6 6-6"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
          </template>
          <div class="salon-rules__answer">
            <p>
              Приймаємо лише клінічно здорових тварин без ознак захворювання, вакцинованих
              відповідно до віку. Щеплення від сказу обов’язкове.
            </p>
          </div>
        </BaseDisclosure>
        <BaseDisclosure class="salon-rules__rule">
          <template #summary>
            <span>Запис та скасування</span>
            <svg
              class="salon-rules__chevron"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="m6 9 6 6 6-6"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
          </template>
          <div class="salon-rules__answer">
            <p>
              Записуйтеся завчасно зручним для вас способом. Скасувати або перенести візит можна
              щонайменше за
              <strong>24 години.</strong>
              При скасуванні або перенесенні менш ніж за 24 години оплата становить
              <strong>50% вартості послуги.</strong>
            </p>
          </div>
        </BaseDisclosure>
        <BaseDisclosure class="salon-rules__rule">
          <template #summary>
            <span>Запізнення</span>
            <svg
              class="salon-rules__chevron"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="m6 9 6 6 6-6"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
          </template>
          <div class="salon-rules__answer">
            <p>
              Якщо ви запізнюєтеся більш ніж на
              <strong>15 хвилин,</strong>
              ми можемо скоротити або скасувати візит, щоб дотриматися графіка та подбати про
              комфорт інших клієнтів.
            </p>
          </div>
        </BaseDisclosure>
        <BaseDisclosure class="salon-rules__rule">
          <template #summary>
            <span>Поведінка тварини</span>
            <svg
              class="salon-rules__chevron"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="m6 9 6 6 6-6"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
          </template>
          <div class="salon-rules__answer">
            <p>У разі агресивної поведінки тварини майстер має право відмовити в обслуговуванні.</p>
          </div>
        </BaseDisclosure>
        <BaseDisclosure class="salon-rules__rule">
          <template #summary>
            <span>Вік тварини</span>
            <svg
              class="salon-rules__chevron"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="m6 9 6 6 6-6"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
          </template>
          <div class="salon-rules__answer">
            <p>
              Повну стрижку рекомендуємо після
              <strong>6 місяців.</strong>
              До цього віку проводимо гігієнічні процедури й допомагаємо улюбленцю звикнути до
              грумінгу.
            </p>
          </div>
        </BaseDisclosure>
        <BaseDisclosure class="salon-rules__rule">
          <template #summary>
            <span>Присутність власників</span>
            <svg
              class="salon-rules__chevron"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="m6 9 6 6 6-6"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
          </template>
          <div class="salon-rules__answer">
            <p>
              Для комфорту тварини проводимо процедури без присутності власників. Винятки
              обговорюємо індивідуально.
            </p>
          </div>
        </BaseDisclosure>
        <BaseDisclosure class="salon-rules__rule">
          <template #summary>
            <span>Оплата</span>
            <svg
              class="salon-rules__chevron"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="m6 9 6 6 6-6"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
          </template>
          <div class="salon-rules__answer">
            <p>
              Оплата після надання послуги. Вартість може змінюватися залежно від стану шерсті,
              поведінки тварини та складності роботи.
            </p>
          </div>
        </BaseDisclosure>
        <BaseDisclosure class="salon-rules__rule">
          <template #summary>
            <span>Обмеження стрижки</span>
            <svg
              class="salon-rules__chevron"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="m6 9 6 6 6-6"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
          </template>
          <div class="salon-rules__answer">
            <p>
              Котів не стрижемо машинкою. Собакам із подвійною шерстю не робимо коротких стрижок.
            </p>
          </div>
        </BaseDisclosure>
        <BaseDisclosure class="salon-rules__rule">
          <template #summary>
            <span>Неявка без попередження</span>
            <svg
              class="salon-rules__chevron"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="m6 9 6 6 6-6"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
          </template>
          <div class="salon-rules__answer">
            <p>
              Оплата за пропущений візит становить
              <strong>50% вартості послуги.</strong>
              Для наступного запису потрібна передоплата в розмірі
              <strong>50% вартості послуги.</strong>
            </p>
          </div>
        </BaseDisclosure>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import BaseDisclosure from '../ui/BaseDisclosure.vue';
import BaseContainer from '../ui/BaseContainer.vue';
import BaseIcon from '../ui/BaseIcon.vue';
</script>

<style scoped lang="scss">
@use '../../assets/styles/breakpoints' as bp;

.salon-rules {
  padding-block: clamp(2rem, 4vw, 4rem);
  border-block-start: 1px solid rgb(199 166 104 / 28%);
  color: var(--text-primary);
  background:
    radial-gradient(ellipse at 12% 35%, rgb(199 166 104 / 8%), transparent 52%),
    linear-gradient(135deg, var(--surface), #232325 72%);

  &__layout {
    display: grid;
    gap: clamp(1.5rem, 3vw, 3rem);

    @include bp.x-large {
      grid-template-columns: minmax(0, 1fr) minmax(0, 2.4fr);
      align-items: start;
    }
  }

  &__heading {
    text-align: center;

    @include bp.x-large {
      text-align: start;
    }

    & p {
      max-width: 36ch;
      margin: 0.875rem auto 0;
      color: var(--text-secondary);
      text-wrap: balance;

      @include bp.x-large {
        margin-inline: 0;
        text-wrap: pretty;
      }
    }
  }

  &__title {
    margin: 0;
    font: 400 clamp(2rem, 3.2vw, 3.25rem)/1.08 var(--font-editorial);
    text-wrap: balance;
  }

  &__accent {
    display: block;
    width: min(14rem, 60%);
    height: auto;
    margin: 0.75rem auto 0;
    color: var(--color-gold);

    @include bp.x-large {
      margin-inline: 0;
    }
  }

  &__paw {
    display: none;

    @include bp.x-large {
      display: block;
      width: 6rem;
      height: auto;
      margin: 2rem 0 0 1rem;
      color: var(--color-gold);
      opacity: 0.18;
      transform: rotate(-18deg);
    }
  }

  &__grid {
    min-width: 0;
  }

  &__rule {
    border-bottom: 1px solid rgb(199 166 104 / 32%);

    &:last-child {
      border-bottom: 0;
    }

    & :deep(summary) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      min-height: 56px;
      padding: 0.875rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 1.125rem;
      line-height: 1.5;
      cursor: pointer;
      list-style: none;

      &:focus-visible {
        outline: 2px solid var(--color-gold-highlight);
        outline-offset: 3px;
        box-shadow: 0 0 0 6px rgb(199 166 104 / 18%);
      }
    }

    & :deep(summary::-webkit-details-marker) {
      display: none;
    }

    & span {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    &[open] .salon-rules__chevron {
      transform: rotate(180deg);
    }
  }

  &__chevron {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    color: var(--color-gold-highlight);

    @media (prefers-reduced-motion: no-preference) {
      transition: transform 350ms ease;
    }
  }

  &__answer {
    max-width: 76ch;
    padding: 0 0.75rem 1.125rem;
    overflow-wrap: anywhere;
    color: var(--text-secondary);

    & p {
      margin: 0;
      line-height: 1.6;
    }

    & strong {
      color: var(--color-gold-highlight);
    }
  }

  @media (hover: hover) and (pointer: fine) {
    &__rule :deep(summary:hover) {
      color: var(--color-gold-highlight);
    }
  }

  @media (forced-colors: active) {
    &__rule :deep(summary:focus-visible) {
      outline-color: Highlight;
    }
  }
}
</style>
