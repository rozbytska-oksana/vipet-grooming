import type { Statistic } from '../types/content';

// Address, phone and regular hours confirmed by owner screenshot, 2026-11-07.
const postalAddress = {
  streetAddress: 'проїзд Академіка Тутковського, 12',
  addressLocality: 'Житомир',
  addressRegion: 'Житомирська область',
  postalCode: '10024',
  addressCountry: 'UA',
};
const openingHours = {
  dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  opens: '10:00',
  closes: '17:00',
};
export const businessHours = [
  { days: 'Вівторок–субота', hours: `${openingHours.opens}–${openingHours.closes}` },
  { days: 'Неділя, понеділок', hours: 'Вихідні' },
] as const;
export const business = {
  name: 'V.I.Pet',
  city: postalAddress.addressLocality,
  postalAddress,
  openingHours,
  address:
    `${postalAddress.streetAddress}, ${postalAddress.addressLocality}, ${postalAddress.addressRegion}, ${postalAddress.postalCode}` as
      string | null,
  phone: '+380 63 590 87 30' as string | null,
  email: null as string | null,
  hours: businessHours.map((row) => `${row.days}: ${row.hours}`).join('. '),
  instagramUrl: 'https://www.instagram.com/vipet_grooming/',
  telegramUrl: null as string | null,
  viberUrl: null as string | null,
};
export const groomer = {
  name: 'Оксана',
  bio: 'Для мене грумінг — це увага до деталей і турбота про вашого улюбленця. Я прагну створити простір,',
};
// Confirmed by the owner on 2026-11-06; edit values here to update the counters.
export const statistics: readonly Statistic[] = [
  { id: 'experience', value: 2, suffix: '+', label: 'років досвіду' },
  { id: 'education', value: 7, suffix: '+', label: 'професійних навчань' },
  { id: 'pets', value: 1000, suffix: '+', label: 'улюбленців' },
];
