import type { Breed } from '../types/content';
import { priceCatalog } from './service-prices';

const regular = priceCatalog.entries
  .filter((entry) => entry.service === 'hygiene' && !entry.id.startsWith('mixed-'))
  .map((entry): Breed => ({
    id: entry.id.replace(/-hygiene$/, ''),
    label: entry.label,
    petType: 'dog',
    group: 'regular',
  }));
export const breeds: readonly Breed[] = [
  ...regular,
  { id: 'mixed', label: 'Метис', petType: 'dog', group: 'mixed' },
  ...priceCatalog.largeBreedDurations.map((entry, index): Breed => ({
    id: `large-${index}`,
    label: entry.label,
    petType: 'dog',
    group: 'large',
  })),
  { id: 'cat-general', label: 'Кіт / кішка (крім мейн-куна)', petType: 'cat' },
  { id: 'maine-coon', label: 'Мейн-кун', petType: 'cat' },
];
