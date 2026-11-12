export type PetType = 'dog' | 'cat';

export interface Service {
  id: string;
  title: string;
  description: string;
  petTypes: readonly PetType[];
  inclusions: readonly string[];
  mediaId: string | null;
  durationMinutes?: { min: number; max: number };
}

export type CoatLength = 'short' | 'medium' | 'long';
export type WeightBand = 'under-5' | '5-10' | '10-15';

export interface Breed {
  id: string;
  label: string;
  petType: PetType;
  group?: 'regular' | 'large' | 'mixed';
}

export interface PriceRange {
  minMinor: number;
  maxMinor: number;
  currency: 'UAH';
}

export interface PriceRule {
  id: string;
  petType: PetType;
  breedId: string;
  serviceId: string;
  range: PriceRange | null;
  eligibleExtraIds: readonly string[];
  adjustmentNotes: readonly string[];
  billingUnit?: 'hour';
  coatLength?: CoatLength;
  weightBand?: WeightBand;
}

export type ExtraPricing =
  { kind: 'included' } | { kind: 'additive'; range: PriceRange } | { kind: 'quote' };

export interface ServiceExtra {
  id: string;
  title: string;
  petTypes: readonly PetType[];
  serviceIds: readonly string[];
  pricing: ExtraPricing;
}

export interface PricingSelection {
  petType: PetType | null;
  breedId: string | null;
  serviceId: string | null;
  extraIds: readonly string[];
  coatLength?: CoatLength | null;
  weightBand?: WeightBand | null;
}

export interface FaqItem {
  points?: readonly string[];
  id: string;
  question: string;
  answer: string;
}

export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  fullSrc?: string;
}

export interface Statistic {
  id: string;
  value: number;
  label: string;
  suffix: string;
}

export interface Testimonial {
  excerpt?: boolean;
  rating?: 1 | 2 | 3 | 4 | 5;
  id: string;
  name: string;
  text: string;
  sourceUrl?: string;
}
