<template>
  <section
    id="pricing"
    ref="section"
    class="pricing"
    aria-labelledby="pricing-title"
  >
    <div
      class="pricing__ambience"
      aria-hidden="true"
    >
      <BaseIcon
        name="paw"
        class="pricing__watermark"
      />
      <svg
        class="pricing__waves"
        viewBox="0 0 760 360"
        fill="none"
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <linearGradient
            id="pricing-wave-gold"
            x1="0"
            y1="0"
            x2="1"
            y2="0.5"
          >
            <stop
              stop-color="#c3a268"
              stop-opacity="0"
            />
            <stop
              offset="0.3"
              stop-color="#e8c779"
              stop-opacity="0.3"
            />
            <stop
              offset="0.48"
              stop-color="#fff0bb"
              stop-opacity="0.8"
            />
            <stop
              offset="0.65"
              stop-color="#c6a667"
              stop-opacity="0.2"
            />
            <stop
              offset="1"
              stop-color="#c6a667"
              stop-opacity="0"
            />
          </linearGradient>
          <radialGradient id="pricing-wave-light">
            <stop
              stop-color="#fff1c4"
              stop-opacity="0.5"
            />
            <stop
              offset="0.2"
              stop-color="#d7b46c"
              stop-opacity="0.15"
            />
            <stop
              offset="1"
              stop-color="#d7b46c"
              stop-opacity="0"
            />
          </radialGradient>
        </defs>
        <path
          class="pricing__wave-glow"
          d="M-80 110C90 380 198 122 370 244S610 242 810 138"
          stroke="url(#pricing-wave-gold)"
          stroke-width="8"
        />
        <path
          d="M-80 110C90 380 198 122 370 244S610 242 810 138"
          stroke="url(#pricing-wave-gold)"
          stroke-width="1.1"
        />
        <path
          d="M-40 230C160 340 250 182 420 268S650 270 800 180"
          stroke="url(#pricing-wave-gold)"
          stroke-width="0.6"
          opacity="0.5"
        />
        <ellipse
          cx="283"
          cy="216"
          rx="74"
          ry="30"
          fill="url(#pricing-wave-light)"
        />
      </svg>
    </div>
    <BaseContainer class="pricing__layout">
      <header
        class="pricing__intro"
        data-reveal
      >
        <p class="pricing__eyebrow">Дізнайтеся вартість догляду</p>
        <h2
          id="pricing-title"
          tabindex="-1"
        >
          Розрахунок
          <br />
          вартості онлайн
        </h2>
        <svg
          class="pricing__flourish"
          viewBox="0 0 260 32"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 26C100 1 198 48 255 3"
            stroke="currentColor"
            stroke-width="1.5"
            pathLength="1"
          />
        </svg>
        <p class="pricing__description">
          Орієнтовна вартість залежить від виду улюбленця, породи та обраної послуги.
        </p>
      </header>
      <div
        class="pricing__panel"
        data-reveal
      >
        <div class="pricing__main">
          <div class="pricing__fields">
            <fieldset class="pricing__pet">
              <legend>Хто ваш улюбленець?</legend>
              <PetTypeToggle
                v-model="petType"
                name="price-pet"
                @change="resetPet"
              />
            </fieldset>
            <label
              class="pricing__field"
              for="price-breed"
            >
              Порода
              <select
                id="price-breed"
                v-model="breedId"
                class="pricing__control"
                @change="resetBreed"
              >
                <option value="">Оберіть породу</option>
                <option
                  v-for="breed in availableBreeds"
                  :key="breed.id"
                  :value="breed.id"
                >
                  {{ breed.label }}
                </option>
                <option value="other">Інша порода / не знаю</option>
              </select>
            </label>
            <label
              class="pricing__field pricing__service"
              :class="{ 'pricing__service--half': needsWeight || needsCoat }"
              for="price-service"
            >
              Послуга
              <select
                id="price-service"
                v-model="serviceId"
                class="pricing__control"
                @change="resetConditions"
              >
                <option
                  v-for="service in availableServices"
                  :key="service.id"
                  :value="service.id"
                >
                  {{ service.title }}
                </option>
              </select>
            </label>
            <Transition
              :css="false"
              @before-enter="expand.beforeEnter"
              @enter="expand.enter"
              @leave="expand.leave"
              @enter-cancelled="expand.cancelled"
              @leave-cancelled="expand.cancelled"
            >
              <div
                v-if="needsWeight || needsCoat"
                class="pricing__conditions"
              >
                <label
                  v-if="needsWeight"
                  class="pricing__field"
                  for="price-weight"
                >
                  Вагова категорія за прайсом
                  <select
                    id="price-weight"
                    v-model="weightBand"
                    class="pricing__control"
                    aria-describedby="price-weight-note"
                  >
                    <option value="">Оберіть категорію</option>
                    <option
                      v-if="serviceId === 'bath'"
                      value="under-5"
                    >
                      До 5 кг
                    </option>
                    <option value="5-10">5–10 кг</option>
                    <option value="10-15">10–15 кг</option>
                    <option value="other">Інша вага / уточнити</option>
                  </select>
                  <small id="price-weight-note">
                    Якщо вага на межі категорій, оберіть «Уточнити».
                  </small>
                </label>
                <label
                  v-if="needsCoat"
                  class="pricing__field"
                  for="price-coat"
                >
                  Довжина шерсті
                  <select
                    id="price-coat"
                    v-model="coatLength"
                    class="pricing__control"
                  >
                    <option value="">Оберіть довжину</option>
                    <option value="short">Коротка</option>
                    <option value="medium">Середня</option>
                    <option value="long">Довга</option>
                  </select>
                </label>
              </div>
            </Transition>
          </div>
          <div
            class="pricing__result"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span class="pricing__result-label">Орієнтовна вартість</span>
            <div class="pricing__amount">
              <Transition name="price-change">
                <p
                  :key="priceText"
                  :class="{ 'pricing__amount--prompt': !estimate.range }"
                >
                  {{ priceText }}
                </p>
              </Transition>
            </div>
            <span
              v-if="estimate.range"
              class="pricing__result-note"
            >
              Базова ціна, без доплат і знижок
            </span>
          </div>
        </div>
        <div class="pricing__actions">
          <p
            v-if="duration"
            class="pricing__duration"
          >
            Орієнтовна тривалість: {{ duration }} год.
          </p>
          <BaseButton
            class="pricing__booking"
            :disabled="!breedId"
            @click="emit('booking', selection)"
          >
            Перейти до заявки
          </BaseButton>
        </div>
      </div>
      <BaseDisclosure class="pricing__notes">
        <template #summary>Знижки та примітки до вартості</template>
        <ul>
          <li>
            Остаточна вартість залежить від ваги, розміру тварини та стану шерсті. Для інших порід і
            відсутніх у прайсі поєднань вартість уточнюється індивідуально.
          </li>
          <li>
            Вичісування ковтунів — {{ priceCatalog.policies.dematting.hourlyMinor / 100 }} грн/год
            із похвилинним розрахунком.
          </li>
          <li>
            За виражену агресивну поведінку собаки — доплата
            {{ priceCatalog.policies.dogAggressionSurchargeMinor / 100 }} грн.
          </li>
          <li>
            Знижки й доплати наведені для ознайомлення та не застосовуються автоматично до
            розрахунку.
          </li>
        </ul>
        <h3 class="pricing__discount-title">Знижки та спеціальні пропозиції</h3>
        <ul class="pricing__discounts">
          <li
            v-for="discount in discounts"
            :key="discount.id"
          >
            <strong>{{ discount.percent }}%</strong>
            — {{ discount.title }}
            <template v-if="discount.condition">. {{ discount.condition }}</template>
          </li>
        </ul>
        <p class="pricing__discount-policy">{{ discountPolicy.note }}</p>
      </BaseDisclosure>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { CoatLength, PetType, PricingSelection, WeightBand } from '../../types/content';
import BaseContainer from '../ui/BaseContainer.vue';
import PetTypeToggle from '../ui/PetTypeToggle.vue';
import BaseIcon from '../ui/BaseIcon.vue';
import { useStrokeReveal } from '../../composables/useStrokeReveal';
import BaseDisclosure from '../ui/BaseDisclosure.vue';
import { useExpandMotion } from '../../composables/useExpandMotion';
import BaseButton from '../ui/BaseButton.vue';
import { breeds } from '../../data/breeds';
import { services } from '../../data/services';
import { pricingRules, serviceExtras } from '../../data/pricing';
import { priceCatalog } from '../../data/service-prices';
import { discounts, discountPolicy } from '../../data/discounts';
import { calculatePrice } from '../../utils/calculatePrice';
import { useScrollReveal } from '../../composables/useScrollReveal';

const emit = defineEmits<{ booking: [selection: PricingSelection] }>();
const section = ref<HTMLElement | null>(null);
const expand = useExpandMotion();
useStrokeReveal(section, '.pricing__intro', '.pricing__flourish path');
useScrollReveal(section, { duration: 900, fromOpacity: 0, easing: 'ease-out' });
const petType = ref<PetType>('dog');
const breedId = ref('');
const serviceId = ref('complex');
const weightBand = ref<WeightBand | 'other' | ''>('');
const coatLength = ref<CoatLength | ''>('');
const availableBreeds = computed(() => breeds.filter((breed) => breed.petType === petType.value));
const selectedBreed = computed(() =>
  availableBreeds.value.find((breed) => breed.id === breedId.value),
);
const availableServices = computed(() =>
  services.filter((service) => {
    if (!service.petTypes.includes(petType.value)) return false;
    if (!selectedBreed.value) return true;
    return pricingRules.some(
      (rule) => rule.breedId === breedId.value && rule.serviceId === service.id,
    );
  }),
);
const resetConditions = () => {
  weightBand.value = '';
  coatLength.value = '';
};
const resetPet = () => {
  breedId.value = '';
  serviceId.value = petType.value === 'dog' ? 'complex' : 'bath';
  resetConditions();
};
const resetBreed = () => {
  resetConditions();
  if (!availableServices.value.some((service) => service.id === serviceId.value))
    serviceId.value = availableServices.value[0]?.id ?? '';
};
const needsWeight = computed(
  () =>
    petType.value === 'dog' &&
    !!selectedBreed.value &&
    (serviceId.value === 'bath' || selectedBreed.value.group === 'mixed'),
);
const needsCoat = computed(
  () => selectedBreed.value?.group === 'large' && serviceId.value === 'complex',
);
const selection = computed<PricingSelection>(() => ({
  petType: petType.value,
  breedId: breedId.value === 'other' ? null : breedId.value || null,
  serviceId: serviceId.value || null,
  extraIds: [],
  weightBand: needsWeight.value && weightBand.value !== 'other' ? weightBand.value || null : null,
  coatLength: needsCoat.value ? coatLength.value || null : null,
}));
const estimate = computed(() =>
  calculatePrice(selection.value, { breeds, services, rules: pricingRules, extras: serviceExtras }),
);
const money = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });
const priceText = computed(() => {
  if (!breedId.value) return 'Оберіть породу';
  if (needsWeight.value && !weightBand.value) return 'Оберіть вагу';
  if (needsCoat.value && !coatLength.value) return 'Оберіть шерсть';
  const value = estimate.value;
  if (value.status !== 'available') return 'Вартість уточнюється';
  const min = money.format(value.range.minMinor / 100);
  return `${min}${value.range.minMinor === value.range.maxMinor ? '' : `–${money.format(value.range.maxMinor / 100)}`} грн`;
});
const duration = computed(() => {
  if (selectedBreed.value?.group !== 'large' || serviceId.value !== 'complex') return null;
  const value = priceCatalog.largeBreedDurations.find(
    (item) => item.label === selectedBreed.value?.label,
  );
  return value
    ? `${money.format(value.minHours)}${value.minHours === value.maxHours ? '' : `–${money.format(value.maxHours)}`}`
    : null;
});
</script>

<style scoped lang="scss">
@use '../../assets/styles/breakpoints' as bp;
@use '../../assets/styles/forms' as forms;
.pricing {
  --pricing-control-background: #3a3a3b;
  position: relative;
  isolation: isolate;
  overflow: clip;
  padding-block: clamp(2.5rem, 5vw, 5rem);
  background: radial-gradient(ellipse at 70% 30%, #38383a, #242426 65%);
  color: var(--color-ivory);
  &__ambience {
    position: absolute;
    z-index: -1;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(ellipse at 8% 65%, rgb(199 166 104 / 7%), transparent 45%);
  }
  &__watermark {
    position: absolute;
    left: -2rem;
    bottom: 10%;
    width: clamp(10rem, 22vw, 23rem);
    height: auto;
    color: var(--color-gold);
    opacity: 0.045;
    transform: rotate(-18deg);
    stroke-width: 0.4;
  }
  &__waves {
    position: absolute;
    left: -8%;
    bottom: -2rem;
    width: min(65rem, 100%);
    height: clamp(12rem, 25vw, 22rem);
    opacity: 0.7;
  }
  &__wave-glow {
    filter: blur(8px);
    opacity: 0.45;
  }
  &__layout {
    display: grid;
    gap: 1.5rem;
    @include bp.x-large {
      grid-template-columns: minmax(0, 0.8fr) minmax(0, 2fr);
      gap: 1.5rem 2.5rem;
    }
  }
  &__intro h2 {
    margin: 0;
    font: 400 clamp(2rem, 3vw, 2.75rem) / 1 var(--font-editorial);
  }
  &__eyebrow {
    margin: 0 0 0.65rem;
    color: var(--color-gold-highlight);
    font-size: 1rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  &__description {
    margin: 0.75rem 0 0;
    max-width: 42ch;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--color-silver);
  }
  &__flourish {
    width: min(15rem, 75%);
    height: auto;
    display: block;
    color: var(--color-gold);
    @include bp.x-large {
      margin: -0.25rem 0 0 auto;
    }
  }
  &__panel {
    min-width: 0;
    padding: clamp(1rem, 2vw, 1.5rem);
    border: 1px solid #b89c60;
    border-radius: 1.25rem;
    background: linear-gradient(125deg, #303032, #242426);
    box-shadow:
      inset 0 0 0 3px rgb(199 166 104 / 5%),
      0 8px 30px rgb(0 0 0 / 12%);
  }
  &__main {
    display: grid;
    gap: 1.5rem;
    @include bp.x-large {
      grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    }
  }
  &__fields {
    display: grid;
    align-items: start;
    gap: 1.25rem;
    min-width: 0;
    @include bp.medium {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  &__service {
    @include bp.medium {
      grid-column: 1 / -1;
      &--half {
        grid-column: auto;
      }
    }
  }
  &__field,
  &__pet {
    display: grid;
    align-content: start;
    gap: 0.65rem;
    min-width: 0;
    font-size: 1rem;
  }
  &__pet {
    padding: 0;
    margin: 0;
    border: 0;
    legend {
      margin-bottom: 0.65rem;
      padding: 0;
    }
  }
  &__control {
    @include forms.control;
    background: var(--pricing-control-background);
    color: var(--color-ivory);
    min-width: 0;
    appearance: none;
    padding-right: 2.75rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23f6f2e9' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1rem;
    @media (forced-colors: active) {
      appearance: auto;
      background-image: none;
    }
  }
  &__result {
    min-width: 0;
    padding-top: 1.25rem;
    border-top: 1px solid rgb(199 166 104 / 45%);
    text-align: center;
    @include bp.x-large {
      padding: 0 0 0 1rem;
      border-top: 0;
      border-left: 1px solid rgb(199 166 104 / 55%);
    }
  }
  &__result-label,
  &__result-note {
    display: block;
    font-size: 1rem;
  }
  &__result-note {
    color: var(--color-silver);
    line-height: 1.4;
  }
  &__amount {
    display: grid;
    min-height: 5rem;
    align-items: center;
    p {
      grid-area: 1 / 1;
      margin: 0.5rem 0;
      font: 500 clamp(1.75rem, 2.4vw, 2.5rem) / 1.1 var(--font-editorial);
      color: var(--color-gold-highlight);
      overflow-wrap: anywhere;
    }
    p.pricing__amount--prompt {
      font-size: 1.5rem;
    }
  }
  &__conditions {
    display: grid;
    overflow: hidden;
    small {
      font-size: 1rem;
      color: var(--color-silver);
      line-height: 1.4;
    }
  }
  &__actions {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1.25rem;
    @include bp.x-large {
      justify-content: flex-end;
    }
  }
  &__booking {
    min-height: 44px;
    padding: 0.6rem 1.25rem;
    font-size: 1.25rem;
  }
  &__duration {
    margin: 0 auto 0 0;
    font-size: 1rem;
    color: var(--color-silver);
  }
  &__discount-title {
    margin: 1.5rem 0 0;
    font: 400 1.75rem / 1.1 var(--font-editorial);
    color: var(--color-ivory);
  }
  &__discounts strong {
    color: var(--color-gold-highlight);
    font-weight: 600;
  }
  &__discount-policy {
    margin: 1rem 0 0;
    padding-left: 1rem;
    border-left: 1px solid var(--color-gold);
    line-height: 1.6;
  }
  &__notes {
    @include bp.x-large {
      grid-column: 2;
    }
    font-size: 1rem;
    color: var(--color-silver);
    :deep(summary) {
      cursor: pointer;
      min-height: 44px;
      padding-block: 0.65rem;
      color: var(--color-gold-highlight);
    }
    ul {
      display: grid;
      gap: 0.75rem;
      margin: 1rem 0 0;
      padding-left: 1.25rem;
      line-height: 1.6;
    }
  }
}
@media (prefers-reduced-motion: no-preference) {
  .price-change-enter-active,
  .price-change-leave-active {
    transition:
      opacity 320ms ease,
      transform 320ms ease;
  }
  .price-change-enter-from {
    opacity: 0;
    transform: translateY(5px);
  }
  .price-change-leave-to {
    opacity: 0;
    transform: translateY(-5px);
  }
}
</style>
