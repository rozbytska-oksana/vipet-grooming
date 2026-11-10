import { describe, expect, it } from 'vitest';
import { calculatePrice } from '../app/utils/calculatePrice';
import type {
  Breed,
  PriceRule,
  PricingSelection,
  Service,
  ServiceExtra,
} from '../app/types/content';

// Synthetic test fixtures only; these are never imported by the app.
const breeds: Breed[] = [{ id: 'breed-a', label: 'Test breed', petType: 'dog' }];
const services: Service[] = [
  {
    id: 'service-a',
    title: 'Test',
    description: '',
    inclusions: [],
    petTypes: ['dog'],
    mediaId: null,
  },
];
const rules: PriceRule[] = [
  {
    id: 'rule-a',
    petType: 'dog',
    breedId: 'breed-a',
    serviceId: 'service-a',
    range: { minMinor: 10000, maxMinor: 15000, currency: 'UAH' },
    eligibleExtraIds: ['extra-a', 'quote'],
    adjustmentNotes: [],
  },
];
const extras: ServiceExtra[] = [
  {
    id: 'extra-a',
    title: 'Test extra',
    petTypes: ['dog'],
    serviceIds: ['service-a'],
    pricing: { kind: 'additive', range: { minMinor: 1000, maxMinor: 2000, currency: 'UAH' } },
  },
  {
    id: 'quote',
    title: 'Quote',
    petTypes: ['dog'],
    serviceIds: ['service-a'],
    pricing: { kind: 'quote' },
  },
];
const catalog = { breeds, services, rules, extras };
const selection: PricingSelection = {
  petType: 'dog',
  breedId: 'breed-a',
  serviceId: 'service-a',
  extraIds: [],
};

describe('calculatePrice', () => {
  it('does not invent a price when a pet or tariff is absent', () => {
    expect(calculatePrice({ ...selection, petType: null }, catalog).status).toBe('incomplete');
    expect(calculatePrice(selection, { ...catalog, rules: [] }).status).toBe('quote-required');
    expect(calculatePrice({ ...selection, breedId: null }, catalog).range).toBeNull();
  });
  it('returns the exact breed-specific range and adds extras in minor units', () => {
    expect(calculatePrice({ ...selection, extraIds: ['extra-a'] }, catalog)).toEqual({
      status: 'available',
      range: { minMinor: 11000, maxMinor: 17000, currency: 'UAH' },
    });
    expect(rules[0]?.range?.minMinor).toBe(10000);
  });
  it('requires a quote for null tariff or quote-only extras', () => {
    expect(calculatePrice({ ...selection, extraIds: ['quote'] }, catalog).status).toBe(
      'quote-required',
    );
    expect(
      calculatePrice(selection, { ...catalog, rules: [{ ...rules[0]!, range: null }] }).status,
    ).toBe('quote-required');
  });
  it('rejects unknown or incompatible species, services and extras', () => {
    expect(calculatePrice({ ...selection, petType: 'cat' }, catalog).status).toBe('unavailable');
    expect(calculatePrice({ ...selection, serviceId: 'unknown' }, catalog).status).toBe(
      'unavailable',
    );
    expect(calculatePrice({ ...selection, extraIds: ['unknown'] }, catalog).status).toBe(
      'unavailable',
    );
  });
  it('does not charge twice for duplicate extras or choose an ambiguous rule', () => {
    expect(calculatePrice({ ...selection, extraIds: ['extra-a', 'extra-a'] }, catalog).status).toBe(
      'unavailable',
    );
    expect(calculatePrice(selection, { ...catalog, rules: [...rules, ...rules] }).status).toBe(
      'unavailable',
    );
  });
  it('rejects reversed, fractional and unsafe ranges', () => {
    for (const range of [
      { minMinor: 200, maxMinor: 100 },
      { minMinor: 1.2, maxMinor: 100 },
      { minMinor: 0, maxMinor: Number.MAX_SAFE_INTEGER + 1 },
    ]) {
      expect(
        calculatePrice(selection, {
          ...catalog,
          rules: [{ ...rules[0]!, range: { ...range, currency: 'UAH' } }],
        }).status,
      ).toBe('unavailable');
    }
  });
  it('keeps included extras free and allows explicitly configured zero prices', () => {
    expect(
      calculatePrice(
        { ...selection, extraIds: ['extra-a'] },
        { ...catalog, extras: [{ ...extras[0]!, pricing: { kind: 'included' } }] },
      ).range,
    ).toEqual(rules[0]?.range);
    expect(
      calculatePrice(selection, {
        ...catalog,
        rules: [{ ...rules[0]!, range: { minMinor: 0, maxMinor: 0, currency: 'UAH' } }],
      }).status,
    ).toBe('available');
  });
});
