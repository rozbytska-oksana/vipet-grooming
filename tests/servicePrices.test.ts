import { describe, expect, it } from 'vitest';
import { getServicePriceRange, priceCatalog } from '../app/data/service-prices';
import { breeds } from '../app/data/breeds';
import { services } from '../app/data/services';
import { pricingRules, serviceExtras } from '../app/data/pricing';
import { calculatePrice } from '../app/utils/calculatePrice';
import type { WeightBand } from '../app/types/content';

describe('owner-provided service prices', () => {
  it.each([
    ['dogs', 90000, 150000],
    ['hygiene', 70000, 110000],
    ['cats', 70000, 140000],
    ['bath', 60000, 80000],
    ['details', 10000, 25000],
    ['express-shedding', 90000, 110000],
    ['express-shedding-hourly', 110000, 120000],
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

// Independently transcribed from the four owner-provided sheets, 11 November 2026.
const dogTariffs = [
  ['maltipoo', 800, 900, 1000, 1300],
  ['poodle', 800, 900, 1000, 1300],
  ['bichon', 900, 1000, 1100, 1400],
  ['cavapoo-cockapoo', 800, 900, 1000, 1300],
  ['doodles', 1000, 1100, 1200, 1500],
  ['yorkie', 700, 800, 900, 1000],
  ['biewer', 700, 800, 900, 1000],
  ['maltese', 700, 800, 900, 1000],
  ['shih-tzu', 700, 800, 900, 1000],
  ['spitz', 900, 1100, 1100, 1300],
  ['pekingese', 700, 800, 900, 1000],
  ['long-chihuahua', 700, 700, 900, 900],
  ['spaniel', 1000, 1100, 1200, 1400],
  ['cavalier', 900, 900, 1100, 1100],
  ['corgi', 900, 900, 1100, 1100],
  ['mixed-5-10', 800, 800, 1000, 1000],
  ['mixed-10-15', 900, 900, 1100, 1100],
  ['french-bulldog', 800, 800, 1000, 1000],
  ['english-bulldog', 800, 800, 1000, 1000],
  ['pug', 800, 800, 1000, 1000],
  ['beagle', 900, 900, 1100, 1100],
  ['dachshund', 800, 800, 1000, 1000],
  ['toy-terrier', 700, 700, 900, 900],
  ['chihuahua', 700, 700, 900, 900],
  ['jack-russell', 800, 800, 1000, 1000],
] as const;

const otherTariffs = [
  ['large-short', 1100, 1100],
  ['large-medium', 1200, 1200],
  ['large-long', 1200, 1200],
  ['cat-bath', 700, 800],
  ['cat-brush', 800, 900],
  ['cat-brush-bath', 1000, 1100],
  ['maine-brush', 1000, 1100],
  ['maine-brush-bath', 1300, 1400],
  ['bath-under-5', 600, 600],
  ['bath-5-10', 700, 700],
  ['bath-10-15', 800, 800],
  ['shampoo', 250, 250],
  ['flea-bath', 250, 250],
  ['hygiene-shave', 250, 250],
  ['poodle-feet', 250, 250],
  ['teeth', 250, 250],
  ['cat-nails', 100, 100],
  ['small-nails', 150, 150],
  ['large-nails', 200, 200],
  ['ears', 100, 200],
  ['dematting', 500, 500],
] as const;

const sheetTariffs = [
  ...dogTariffs.flatMap(([breed, hygieneMin, hygieneMax, complexMin, complexMax]) => [
    [`${breed}-hygiene`, hygieneMin, hygieneMax] as const,
    [`${breed}-complex`, complexMin, complexMax] as const,
  ]),
  ...otherTariffs,
];

describe('complete latest owner price sheets', () => {
  it.each(sheetTariffs)('preserves %s tariff and billing unit', (id, min, max) => {
    expect(priceCatalog.entries.find((entry) => entry.id === id)).toMatchObject({
      range: { minMinor: min * 100, maxMinor: max * 100, currency: 'UAH' },
      unit: id === 'dematting' ? 'hour' : 'procedure',
    });
  });

  it.each(dogTariffs)(
    'calculates both published services for %s',
    (id, hygieneMin, hygieneMax, complexMin, complexMax) => {
      const mixed = id.startsWith('mixed-');
      const breedId = mixed ? 'mixed' : id;
      const weightBand = mixed ? (id.replace('mixed-', '') as WeightBand) : null;
      for (const [serviceId, min, max] of [
        ['hygiene', hygieneMin, hygieneMax],
        ['complex', complexMin, complexMax],
      ] as const) {
        expect(
          calculatePrice(
            { petType: 'dog', breedId, serviceId, weightBand, extraIds: [] },
            { breeds, services, rules: pricingRules, extras: serviceExtras },
          ),
        ).toEqual({
          status: 'available',
          range: { minMinor: min * 100, maxMinor: max * 100, currency: 'UAH' },
        });
      }
    },
  );

  it('covers every published tariff', () => {
    expect(priceCatalog.entries.map((entry) => entry.id).sort()).toEqual(
      sheetTariffs.map(([id]) => id).sort(),
    );
  });

  it('preserves all 17 breed durations from the latest sheet', () => {
    expect(priceCatalog.largeBreedDurations).toEqual(
      [
        ['Хаскі', 1.5, 2],
        ['Лабрадор', 1.5, 2],
        ['Акіта', 2, 3],
        ['Німецька вівчарка', 2, 2.5],
        ['Доберман', 1.5, 1.5],
        ['Кане-корсо', 1.5, 1.5],
        ['Американський буллі', 1.5, 1.5],
        ['Чау-чау', 2, 2.5],
        ['Маламут', 1.5, 2.5],
        ['Самоїд', 2, 4],
        ['Коллі', 2, 3],
        ['Бернський зенненхунд', 2, 3],
        ['Сенбернар', 2, 3],
        ['Стафордширський тер’єр', 1.5, 1.5],
        ['Шіба-іну', 1.5, 2.5],
        ['Ньюфаундленд', 2, 4],
        ['Чорний тер’єр', 2, 4],
      ].map(([label, minHours, maxHours]) => ({ label, minHours, maxHours })),
    );
  });
});
