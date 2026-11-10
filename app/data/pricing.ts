import type { PriceRange, PriceRule, ServiceExtra, WeightBand, CoatLength } from '../types/content';
import { breeds } from './breeds';
import { priceCatalog } from './service-prices';

const rangeFor = (id: string): PriceRange | null => {
  const range = priceCatalog.entries.find((entry) => entry.id === id)?.range;
  return range ? { ...range, currency: 'UAH' } : null;
};
const rule = (
  breedId: string,
  serviceId: string,
  entryId: string,
  conditions: Partial<Pick<PriceRule, 'weightBand' | 'coatLength'>> = {},
): PriceRule => ({
  id: `${breedId}-${serviceId}-${entryId}`,
  petType: breeds.find((breed) => breed.id === breedId)!.petType,
  breedId,
  serviceId,
  range: rangeFor(entryId),
  eligibleExtraIds: [],
  adjustmentNotes: [],
  ...conditions,
});

export const pricingRules: readonly PriceRule[] = breeds.flatMap((breed) => {
  if (breed.petType === 'cat') {
    const prefix = breed.id === 'maine-coon' ? 'maine' : 'cat';
    return [
      ...(breed.id === 'cat-general' ? [rule(breed.id, 'bath', 'cat-bath')] : []),
      rule(breed.id, 'brush', `${prefix}-brush`),
      rule(breed.id, 'brush-bath', `${prefix}-brush-bath`),
    ];
  }
  const bathing = (['under-5', '5-10', '10-15'] as WeightBand[]).map((band) =>
    rule(breed.id, 'bath', `bath-${band}`, { weightBand: band }),
  );
  if (breed.group === 'large') {
    return [
      ...bathing,
      ...(['short', 'medium', 'long'] as CoatLength[]).map((coat) =>
        rule(breed.id, 'complex', `large-${coat}`, { coatLength: coat }),
      ),
    ];
  }
  if (breed.group === 'mixed') {
    return [
      ...bathing,
      ...(['5-10', '10-15'] as WeightBand[]).flatMap((band) =>
        ['hygiene', 'complex'].map((service) =>
          rule(breed.id, service, `mixed-${band}-${service}`, { weightBand: band }),
        ),
      ),
    ];
  }
  return [
    ...bathing,
    ...['hygiene', 'complex'].map((service) => rule(breed.id, service, `${breed.id}-${service}`)),
  ];
});

// Conditional surcharges, hourly work and discounts remain explanatory notes
// until their application/rounding rules are confirmed by the owner.
export const serviceExtras: readonly ServiceExtra[] = [];
