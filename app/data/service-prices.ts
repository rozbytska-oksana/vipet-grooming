import catalog from './price-catalog.json';
import type { PriceRange } from '../types/content';

export const priceCatalog = catalog;

/** Base procedure ranges; conditional surcharges and hourly work are separate. */
export function getServicePriceRange(id: string): PriceRange | null {
  const entries = catalog.entries.filter((entry) => {
    if (entry.unit !== 'procedure') return false;
    if (id === 'express-shedding') return entry.id.startsWith('large-');
    if (id === 'dogs') return entry.service === 'complex';
    if (id === 'hygiene') return entry.service === 'hygiene';
    if (id === 'cats') return entry.group === 'cats';
    if (id === 'bath') return entry.group === 'bathing';
    if (id === 'details') return entry.group === 'extras';
    return false;
  });
  if (!entries.length) return null;
  return {
    minMinor: Math.min(...entries.map((entry) => entry.range.minMinor)),
    maxMinor: Math.max(...entries.map((entry) => entry.range.maxMinor)),
    currency: 'UAH',
  };
}

export function formatServicePrice(id: string): string {
  const range = getServicePriceRange(id);
  if (!range) return 'Вартість уточнюйте';
  const number = new Intl.NumberFormat('uk-UA');
  const min = number.format(range.minMinor / 100);
  const max = number.format(range.maxMinor / 100);
  return `${min}${range.minMinor === range.maxMinor ? '' : `–${max}`} грн`;
}
