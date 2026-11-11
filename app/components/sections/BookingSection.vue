<template>
  <section
    id="booking"
    ref="section"
    class="booking"
    data-surface="dark"
    aria-labelledby="booking-title"
  >
    <BaseContainer>
      <header
        class="booking__heading"
        data-reveal
      >
        <p class="booking__eyebrow">Знайомство починається тут</p>
        <h2
          id="booking-title"
          tabindex="-1"
        >
          Запишіть улюбленця на догляд
        </h2>
        <svg
          class="booking__accent"
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
      </header>
      <div class="booking__layout">
        <div
          class="booking__intro"
          data-reveal
        >
          <BaseIcon
            class="booking__paw"
            name="paw"
          />
          <p class="booking__lead">
            Трохи про вас.
            <br />
            <em>Трохи про вашого VIP.</em>
          </p>
          <p class="booking__description">
            Оберіть догляд і зручний канал зв’язку. Дату, час та деталі візиту погодимо окремо.
          </p>
          <a
            class="booking__rules-link"
            href="#salon-rules"
          >
            Правила салону
          </a>
          <p
            id="booking-unavailable"
            class="booking__notice"
          >
            Онлайн-надсилання ще недоступне. Ви можете заповнити й перевірити форму — дані нікуди не
            передаються.
          </p>
          <p
            v-if="prefilled"
            class="booking__prefill"
            role="status"
          >
            Параметри улюбленця перенесені з калькулятора.
          </p>
        </div>
        <form
          ref="form"
          class="booking__form"
          aria-label="Заявка на догляд"
          aria-describedby="booking-unavailable booking-required"
          novalidate
          @submit.prevent="checkForm"
        >
          <label
            class="booking__field"
            for="booking-name"
          >
            <span>
              Ваше ім’я
              <span aria-hidden="true">*</span>
            </span>
            <input
              id="booking-name"
              v-model="customerName"
              class="booking__control"
              name="customerName"
              autocomplete="given-name"
              required
              maxlength="100"
              placeholder="Як до вас звертатися"
              :aria-invalid="!!error('customerName')"
              :aria-describedby="error('customerName') ? 'booking-name-error' : undefined"
              @blur="touch('customerName')"
            />
            <span
              v-if="error('customerName')"
              id="booking-name-error"
              class="booking__error"
            >
              {{ error('customerName') }}
            </span>
          </label>
          <label
            class="booking__field"
            for="booking-pet-name"
          >
            <span>
              Ім’я улюбленця
              <span aria-hidden="true">*</span>
            </span>
            <input
              id="booking-pet-name"
              v-model="petName"
              class="booking__control"
              name="petName"
              required
              maxlength="100"
              placeholder="Ваш маленький VIP"
              :aria-invalid="!!error('petName')"
              :aria-describedby="error('petName') ? 'booking-pet-name-error' : undefined"
              @blur="touch('petName')"
            />
            <span
              v-if="error('petName')"
              id="booking-pet-name-error"
              class="booking__error"
            >
              {{ error('petName') }}
            </span>
          </label>
          <fieldset class="booking__pet">
            <legend>Хто ваш улюбленець?</legend>
            <PetTypeToggle
              v-model="petType"
              name="booking-pet"
              @change="resetPet"
            />
          </fieldset>
          <label
            class="booking__field"
            for="booking-breed"
          >
            <span>
              Порода
              <span aria-hidden="true">*</span>
            </span>
            <select
              id="booking-breed"
              v-model="breedId"
              class="booking__control booking__select"
              name="breedId"
              required
              :aria-invalid="!!error('breedId')"
              :aria-describedby="error('breedId') ? 'booking-breed-error' : undefined"
              @change="resetBreed"
              @blur="touch('breedId')"
            >
              <option value="">Оберіть породу</option>
              <option
                v-for="breed in availableBreeds"
                :key="breed.id"
                :value="breed.id"
              >
                {{ breed.label }}
              </option>
            </select>
            <span
              v-if="error('breedId')"
              id="booking-breed-error"
              class="booking__error"
            >
              {{ error('breedId') }}
            </span>
          </label>
          <label
            class="booking__field booking__wide"
            for="booking-service"
          >
            Бажаний догляд
            <select
              id="booking-service"
              v-model="serviceId"
              class="booking__control booking__select"
              name="serviceId"
            >
              <option value="">Допоможіть обрати</option>
              <option
                v-for="service in availableServices"
                :key="service.id"
                :value="service.id"
              >
                {{ service.title }}
              </option>
            </select>
          </label>
          <p
            v-if="extraNames.length"
            class="booking__wide booking__extras"
          >
            Додаткові побажання: {{ extraNames.join(', ') }}
          </p>
          <p
            v-if="pricingDetails"
            class="booking__wide booking__extras"
          >
            Параметри догляду: {{ pricingDetails }}
          </p>
          <label
            class="booking__field"
            for="booking-channel"
          >
            Як з вами зв’язатися
            <select
              id="booking-channel"
              v-model="channel"
              class="booking__control booking__select"
              name="channel"
              @change="resetContact"
            >
              <option
                v-for="item in channels"
                :key="item.id"
                :value="item.id"
              >
                {{ item.label }}
              </option>
            </select>
          </label>
          <label
            class="booking__field"
            for="booking-contact"
          >
            <span>
              {{ contactLabel }}
              <span aria-hidden="true">*</span>
            </span>
            <input
              id="booking-contact"
              v-model="contact"
              class="booking__control"
              name="contact"
              :type="channel === 'viber' ? 'tel' : 'text'"
              :autocomplete="channel === 'viber' ? 'tel' : 'off'"
              :inputmode="channel === 'viber' ? 'tel' : 'text'"
              autocapitalize="none"
              :spellcheck="false"
              required
              maxlength="200"
              :placeholder="contactPlaceholder"
              :aria-invalid="!!error('contact')"
              :aria-describedby="error('contact') ? 'booking-contact-error' : undefined"
              @blur="touch('contact')"
            />
            <span
              v-if="error('contact')"
              id="booking-contact-error"
              class="booking__error"
            >
              {{ error('contact') }}
            </span>
          </label>
          <label
            class="booking__field booking__wide"
            for="booking-comment"
          >
            <span>
              Коментар
              <span class="booking__optional">(необов’язково)</span>
            </span>
            <textarea
              id="booking-comment"
              v-model="comment"
              class="booking__control"
              name="comment"
              rows="4"
              maxlength="1500"
              placeholder="Побажання та особливості улюбленця"
              :aria-invalid="!!error('comment')"
              :aria-describedby="error('comment') ? 'booking-comment-error' : undefined"
              @blur="touch('comment')"
            />
            <span
              v-if="error('comment')"
              id="booking-comment-error"
              class="booking__error"
            >
              {{ error('comment') }}
            </span>
          </label>
          <BaseButton
            class="booking__wide"
            type="submit"
          >
            Перевірити дані
          </BaseButton>
          <p
            v-if="checked"
            class="booking__wide booking__prefill"
            role="status"
          >
            Дані заповнено коректно. Надсилання ще не підключене — заявку не відправлено.
          </p>
        </form>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import type { PetType, PricingSelection } from '../../types/content';
import BaseContainer from '../ui/BaseContainer.vue';
import BaseButton from '../ui/BaseButton.vue';
import BaseIcon from '../ui/BaseIcon.vue';
import PetTypeToggle from '../ui/PetTypeToggle.vue';
import { services } from '../../data/services';
import { breeds } from '../../data/breeds';
import { serviceExtras, pricingRules } from '../../data/pricing';
import {
  validateBooking,
  type BookingChannel,
  type BookingField,
} from '../../utils/validateBooking';
import { useScrollReveal } from '../../composables/useScrollReveal';

const props = defineProps<{ prefill: PricingSelection | null }>();
const section = ref<HTMLElement | null>(null);
const form = ref<HTMLFormElement | null>(null);
useScrollReveal(section);
const customerName = ref('');
const petName = ref('');
const petType = ref<PetType>('dog');
const breedId = ref('');
const serviceId = ref('');
const extras = ref<readonly string[]>([]);
const channel = ref<BookingChannel>('telegram');
const contact = ref('');
const comment = ref('');
const prefilled = ref(false);
const pricingDetails = ref('');
const touched = ref<Partial<Record<BookingField, boolean>>>({});
const submitted = ref(false);
const checked = ref(false);
const channels = [
  { id: 'telegram', label: 'Telegram' },
  { id: 'viber', label: 'Viber' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
] as const;
const availableBreeds = computed(() => breeds.filter((item) => item.petType === petType.value));
const selectedBreed = computed(() =>
  availableBreeds.value.find((item) => item.id === breedId.value),
);
const availableServices = computed(() =>
  services.filter(
    (item) =>
      item.petTypes.includes(petType.value) &&
      (!selectedBreed.value ||
        pricingRules.some((rule) => rule.breedId === breedId.value && rule.serviceId === item.id)),
  ),
);
const extraNames = computed(() =>
  extras.value.map((id) => serviceExtras.find((item) => item.id === id)?.title).filter(Boolean),
);
const contactLabel = computed(
  () =>
    ({
      telegram: 'Telegram: нікнейм або телефон',
      viber: 'Телефон для Viber',
      instagram: 'Ваш Instagram',
      facebook: 'Ваш Facebook',
    })[channel.value],
);
const contactPlaceholder = computed(
  () =>
    ({
      telegram: '@username або +380…',
      viber: '+380 63 123 45 67',
      instagram: '@username або посилання',
      facebook: 'Посилання на ваш профіль',
    })[channel.value],
);
const fields = computed(() => ({
  customerName: customerName.value,
  petName: petName.value,
  breedId: breedId.value,
  channel: channel.value,
  contact: contact.value,
  comment: comment.value,
}));
const errors = computed(() =>
  validateBooking(
    fields.value,
    availableBreeds.value.map((item) => item.id),
  ),
);
const error = (field: BookingField) =>
  submitted.value || touched.value[field] ? errors.value[field] : undefined;
const touch = (field: BookingField) => {
  touched.value[field] = true;
};
watch([fields, petType, serviceId], () => {
  checked.value = false;
});
const checkForm = async () => {
  submitted.value = true;
  checked.value = false;
  await nextTick();
  if (Object.keys(errors.value).length) {
    form.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return;
  }
  checked.value = true;
};
const clearPricing = () => {
  extras.value = [];
  prefilled.value = false;
  pricingDetails.value = '';
};
const resetPet = () => {
  breedId.value = '';
  serviceId.value = '';
  touched.value.breedId = false;
  clearPricing();
};
const resetBreed = () => {
  if (!availableServices.value.some((item) => item.id === serviceId.value)) serviceId.value = '';
  clearPricing();
};
const resetContact = () => {
  contact.value = '';
  touched.value.contact = false;
};
watch(
  () => props.prefill,
  (value) => {
    if (!value) return;
    petType.value = value.petType || 'dog';
    breedId.value = value.breedId || '';
    serviceId.value = value.serviceId || '';
    extras.value = [...value.extraIds];
    const weightLabels = { 'under-5': 'до 5 кг', '5-10': '5–10 кг', '10-15': '10–15 кг' };
    const coatLabels = { short: 'коротка шерсть', medium: 'середня шерсть', long: 'довга шерсть' };
    pricingDetails.value = [
      value.weightBand ? weightLabels[value.weightBand] : '',
      value.coatLength ? coatLabels[value.coatLength] : '',
    ]
      .filter(Boolean)
      .join(', ');
    prefilled.value = true;
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
@use '../../assets/styles/breakpoints' as bp;
@use '../../assets/styles/forms' as forms;
.booking {
  position: relative;
  overflow: clip;
  padding-block: clamp(2rem, 3vw, 3rem);
  background: radial-gradient(ellipse at 10% 60%, rgb(199 166 104 / 7%), transparent 55%), #29292b;
  color: #f6f2e9;

  &__heading {
    text-align: center;
    margin-bottom: 2rem;
  }
  &__heading h2 {
    margin: 0;
    font: 400 clamp(2rem, 3.2vw, 3.25rem)/1.08 var(--font-editorial);
    text-wrap: balance;
  }
  &__eyebrow {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    color: #f6d797;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }
  &__accent {
    display: block;
    width: min(15rem, 60%);
    height: auto;
    margin: 0.75rem auto 0;
    color: #c7a668;
  }
  &__layout {
    display: grid;
    gap: 2rem;
    @include bp.x-large {
      grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.4fr);
      gap: clamp(2rem, 4vw, 4rem);
      align-items: start;
    }
  }
  &__intro {
    position: relative;
    isolation: isolate;
    padding-block: 1rem;
  }
  &__paw {
    position: absolute;
    z-index: -1;
    width: min(70%, 17rem);
    height: auto;
    top: 1rem;
    right: 0;
    color: #c7a668;
    opacity: 0.06;
    transform: rotate(-15deg);
    pointer-events: none;
  }
  &__lead {
    margin: 0 0 1.25rem;
    font: 400 clamp(1.75rem, 2.6vw, 2.75rem)/1.15 var(--font-editorial);
    & em {
      color: #f6d797;
    }
  }
  &__description {
    max-width: 45ch;
    margin: 0 0 1.5rem;
    font-size: 1.125rem;
    color: #d1ceca;
  }
  &__rules-link {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    color: var(--color-gold-highlight);
    text-underline-offset: 0.2em;
  }
  &__notice {
    max-width: 46ch;
    padding: 1rem 1.125rem;
    border-left: 1px solid #c7a668;
    background: rgb(199 166 104 / 5%);
    color: #c6c3bd;
    font-size: 1rem;
  }
  &__prefill {
    margin: 0;
    color: #f6d797;
    font-size: 1rem;
  }
  &__form {
    min-width: 0;
    display: grid;
    gap: 1.25rem;
    padding: clamp(1rem, 2vw, 2rem);
    border: 1px solid rgb(199 166 104 / 75%);
    border-radius: 1rem;
    background: linear-gradient(130deg, rgb(255 255 255 / 2%), transparent 70%);
    box-shadow: inset 0 0 0 4px rgb(199 166 104 / 4%);
    @include bp.medium {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  &__field {
    min-width: 0;
    display: grid;
    align-content: start;
    gap: 0.65rem;
    font-size: 1rem;
  }
  &__pet {
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
    & legend {
      padding: 0;
      margin-bottom: 0.65rem;
      font-size: 1rem;
    }
  }
  &__control {
    @include forms.control;
    min-width: 0;
    background: #3a3a3b;
    color: #f6f2e9;
    &::placeholder {
      color: #b8b5b0;
      opacity: 1;
    }
    &:focus-visible {
      outline: 2px solid #f6d797;
      outline-offset: 3px;
    }
    &[aria-invalid='true'] {
      border-color: #efb39d;
    }
  }
  &__select {
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
  &__form textarea {
    resize: vertical;
  }
  &__wide {
    grid-column: 1 / -1;
  }
  &__optional,
  &__required {
    color: #c6c3bd;
    font-size: 1rem;
  }
  &__required,
  &__extras {
    margin: 0;
  }
  &__extras {
    color: #f6d797;
    font-size: 1rem;
  }
  &__error {
    margin: 0;
    color: #efb39d;
    font-size: 1rem;
  }
}
</style>
