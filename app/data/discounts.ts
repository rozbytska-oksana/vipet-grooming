import { priceCatalog } from './service-prices';

/** Owner-supplied offers. Informational only: never imported by calculatePrice. */
export const discounts = [
  {
    id: 'puppy',
    percent: priceCatalog.policies.puppyDiscount.percent,
    title: `На грумінг для цуценят до ${priceCatalog.policies.puppyDiscount.underMonths} місяців`,
    condition: null,
  },
  { id: 'military', percent: 15, title: 'Для військових', condition: null },
  { id: 'volunteers', percent: 15, title: 'Для зооволонтерів', condition: null },
  {
    id: 'birthday',
    percent: 10,
    title: 'До дня народження улюбленця',
    condition: 'Діє за тиждень до та тиждень після дня народження.',
  },
  {
    id: 'google-review',
    percent: 10,
    title: 'За відгук у Google',
    condition: 'На наступний візит.',
  },
] as const;

export const discountPolicy = {
  stackable: false,
  applyAutomatically: false,
  note: 'Усі знижки та спеціальні пропозиції діють окремо й не сумуються між собою.',
} as const;
