import { createJiti } from 'jiti';
import { mkdir, writeFile } from 'node:fs/promises';

const jiti = createJiti(import.meta.url);
const { breeds } = await jiti.import('../app/data/breeds.ts');
const { services } = await jiti.import('../app/data/services.ts');
const { pricingRules, serviceExtras } = await jiti.import('../app/data/pricing.ts');
const catalog = {
  breeds: breeds.map((breed) => ({
    ...breed,
    serviceIds: services
      .filter(
        (service) =>
          service.petTypes.includes(breed.petType) &&
          pricingRules.some((rule) => rule.breedId === breed.id && rule.serviceId === service.id),
      )
      .map((service) => service.id),
  })),
  services: services.map(({ id, title, petTypes }) => ({ id, title, petTypes })),
  extras: serviceExtras.map(({ id, title, petTypes, serviceIds }) => ({
    id,
    title,
    petTypes,
    serviceIds,
  })),
};
const directory = new URL('../public/api/', import.meta.url);
await mkdir(directory, { recursive: true });
await writeFile(
  new URL('booking-catalog.json', directory),
  `${JSON.stringify(catalog, null, 2)}\n`,
);
console.log('Booking catalog synchronized with breeds and services.');
