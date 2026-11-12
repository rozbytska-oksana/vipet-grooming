import type {
  Breed,
  PriceRange,
  PriceRule,
  PricingSelection,
  Service,
  ServiceExtra,
} from '../types/content';

export type PriceEstimate =
  | { status: 'incomplete' | 'quote-required' | 'unavailable'; range: null }
  | { status: 'available'; range: PriceRange; billingUnit?: 'hour' };

const validRange = (range: PriceRange) =>
  range.currency === 'UAH' &&
  Number.isSafeInteger(range.minMinor) &&
  Number.isSafeInteger(range.maxMinor) &&
  range.minMinor >= 0 &&
  range.maxMinor >= range.minMinor;

export function calculatePrice(
  selection: PricingSelection,
  catalog: {
    breeds: readonly Breed[];
    services: readonly Service[];
    rules: readonly PriceRule[];
    extras: readonly ServiceExtra[];
  },
): PriceEstimate {
  const result = (status: 'incomplete' | 'quote-required' | 'unavailable'): PriceEstimate => ({
    status,
    range: null,
  });
  if (!selection.petType) return result('incomplete');
  if (!selection.breedId || !selection.serviceId) return result('quote-required');
  const breed = catalog.breeds.find((item) => item.id === selection.breedId);
  const service = catalog.services.find((item) => item.id === selection.serviceId);
  if (breed?.petType !== selection.petType || !service?.petTypes.includes(selection.petType))
    return result('unavailable');
  const rules = catalog.rules.filter(
    (item) =>
      item.petType === selection.petType &&
      item.breedId === selection.breedId &&
      item.serviceId === selection.serviceId &&
      (!item.weightBand || item.weightBand === selection.weightBand) &&
      (!item.coatLength || item.coatLength === selection.coatLength),
  );
  if (rules.length === 0) return result('quote-required');
  if (rules.length !== 1) return result('unavailable');
  const rule = rules[0]!;
  if (!rule.range) return result('quote-required');
  if (!validRange(rule.range)) return result('unavailable');
  const range = { ...rule.range };
  const selected = new Set(selection.extraIds);
  if (selected.size !== selection.extraIds.length) return result('unavailable');
  for (const id of selected) {
    const extra = catalog.extras.find((item) => item.id === id);
    if (
      !extra ||
      !rule.eligibleExtraIds.includes(id) ||
      !extra.petTypes.includes(selection.petType) ||
      !extra.serviceIds.includes(selection.serviceId)
    )
      return result('unavailable');
    if (extra.pricing.kind === 'quote') return result('quote-required');
    if (extra.pricing.kind === 'additive') {
      if (!validRange(extra.pricing.range)) return result('unavailable');
      range.minMinor += extra.pricing.range.minMinor;
      range.maxMinor += extra.pricing.range.maxMinor;
    }
  }
  return validRange(range)
    ? { status: 'available', range, ...(rule.billingUnit ? { billingUnit: rule.billingUnit } : {}) }
    : result('unavailable');
}
