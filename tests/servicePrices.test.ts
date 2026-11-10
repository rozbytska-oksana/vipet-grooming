import { describe, expect, it } from 'vitest';
import { getServicePriceRange, priceCatalog } from '../app/data/service-prices';

describe('owner-provided service prices', () => {
  it.each([
    ['dogs', 90000, 150000],
    ['hygiene', 70000, 110000],
    ['cats', 70000, 140000],
    ['bath', 60000, 80000],
    ['details', 10000, 25000],
  ])('summarizes %s base prices without conditional fees', (id, min, max) => {
    expect(getServicePriceRange(id as string)).toEqual({
      minMinor: min,
      maxMinor: max,
      currency: 'UAH',
    });
  });
  it('keeps hourly dematting separate from per-procedure extras', () => {
    expect(priceCatalog.entries.find((entry) => entry.id === 'dematting')).toMatchObject({
      unit: 'hour',
      range: { minMinor: 50000, maxMinor: 50000 },
    });
    expect(priceCatalog.policies.dematting.billingUnit).toBe('minute');
  });
  it('has unique ids and valid ranges', () => {
    expect(new Set(priceCatalog.entries.map((entry) => entry.id)).size).toBe(
      priceCatalog.entries.length,
    );
    for (const entry of priceCatalog.entries) {
      expect(entry.range.minMinor).toBeGreaterThan(0);
      expect(entry.range.maxMinor).toBeGreaterThanOrEqual(entry.range.minMinor);
    }
    expect(getServicePriceRange('unknown')).toBeNull();
  });
});
