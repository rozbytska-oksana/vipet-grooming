import { describe, expect, it } from 'vitest';
import { breeds } from '../app/data/breeds';
import { services } from '../app/data/services';
import { pricingRules, serviceExtras } from '../app/data/pricing';
import { calculatePrice } from '../app/utils/calculatePrice';
import type { PricingSelection } from '../app/types/content';
const catalog = { breeds, services, rules: pricingRules, extras: serviceExtras };
const price = (selection: Partial<PricingSelection>) =>
  calculatePrice(
    { petType: 'dog', breedId: 'yorkie', serviceId: 'complex', extraIds: [], ...selection },
    catalog,
  );

describe('confirmed catalog calculator', () => {
  it('uses exact breed and service prices', () => {
    expect(price({}).range).toMatchObject({ minMinor: 90000, maxMinor: 100000 });
    expect(price({ breedId: 'bichon', serviceId: 'hygiene' }).range).toMatchObject({
      minMinor: 90000,
      maxMinor: 100000,
    });
    expect(price({ breedId: 'doodles' }).range).toMatchObject({
      minMinor: 120000,
      maxMinor: 150000,
    });
  });
  it('does not guess weight or coat length', () => {
    expect(price({ breedId: 'mixed' }).status).toBe('quote-required');
    expect(price({ breedId: 'mixed', weightBand: '5-10' }).range).toMatchObject({
      minMinor: 100000,
      maxMinor: 100000,
    });
    expect(price({ breedId: 'large-0' }).status).toBe('quote-required');
    expect(price({ breedId: 'large-0', coatLength: 'short' }).range).toMatchObject({
      minMinor: 110000,
      maxMinor: 110000,
    });
    expect(price({ breedId: 'large-0', coatLength: 'long' }).range).toMatchObject({
      minMinor: 120000,
      maxMinor: 120000,
    });
  });
  it('uses weight bands only where provided', () => {
    expect(price({ serviceId: 'bath' }).status).toBe('quote-required');
    expect(price({ serviceId: 'bath', weightBand: 'under-5' }).range?.minMinor).toBe(60000);
    expect(price({ serviceId: 'bath', weightBand: '10-15' }).range?.minMinor).toBe(80000);
    expect(price({ breedId: 'mixed', weightBand: 'under-5' }).status).toBe('quote-required');
  });
  it('distinguishes Maine coon and general cat tariffs', () => {
    expect(
      price({ petType: 'cat', breedId: 'cat-general', serviceId: 'brush-bath' }).range?.maxMinor,
    ).toBe(110000);
    expect(
      price({ petType: 'cat', breedId: 'maine-coon', serviceId: 'brush-bath' }).range?.maxMinor,
    ).toBe(140000);
    expect(price({ petType: 'cat', breedId: 'maine-coon', serviceId: 'bath' }).status).toBe(
      'quote-required',
    );
    expect(price({ petType: 'cat', breedId: 'yorkie' }).status).toBe('unavailable');
  });
  it('keeps unknown breeds and services without a fabricated estimate', () => {
    expect(price({ breedId: null }).range).toBeNull();
    expect(price({ breedId: 'large-0', serviceId: 'hygiene' }).status).toBe('quote-required');
  });
  it('has a real source price for every generated rule', () => {
    expect(new Set(pricingRules.map((rule) => rule.id)).size).toBe(pricingRules.length);
    for (const rule of pricingRules) {
      expect(rule.range).not.toBeNull();
      expect(breeds.some((breed) => breed.id === rule.breedId)).toBe(true);
    }
    // Conditional fees/discounts must never be silently applied to the base tariff.
    expect(price({}).range?.minMinor).toBe(90000);
    expect(serviceExtras).toHaveLength(0);
  });
});
