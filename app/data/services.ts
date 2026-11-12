import type { Service } from '../types/content';
import { priceCatalog } from './service-prices';

export const services: readonly Service[] = [
  {
    id: 'complex',
    title: 'Комплексний грумінг',
    description: 'Купання, гігієна та породна стрижка.',
    petTypes: ['dog'],
    inclusions: priceCatalog.inclusions.smallMedium,
    mediaId: null,
    durationMinutes: { min: 150, max: 180 },
  },
  {
    id: 'express-shedding',
    title: 'Експрес-линька',
    description: 'Догляд під час линьки та вичісування підшерстка.',
    petTypes: ['dog'],
    inclusions: [],
    mediaId: null,
  },
  {
    id: 'hygiene',
    title: 'Гігієнічний догляд',
    description: 'Гігієнічний догляд за прайсом.',
    petTypes: ['dog'],
    inclusions: [],
    mediaId: null,
  },
  {
    id: 'bath',
    title: 'Купання',
    description: 'Купання улюбленця.',
    petTypes: ['dog', 'cat'],
    inclusions: [],
    mediaId: null,
  },
  {
    id: 'brush',
    title: 'Вичісування без купання',
    description: 'Вичісування кішки без купання.',
    petTypes: ['cat'],
    inclusions: [],
    mediaId: null,
  },
  {
    id: 'brush-bath',
    title: 'Вичісування та купання',
    description: 'Вичісування та купання кішки.',
    petTypes: ['cat'],
    inclusions: [],
    mediaId: null,
  },
];
