import { business } from '../data/salon';
import { serviceCards } from '../data/service-cards';
import { googleMapsUrl } from '../data/testimonials';

export const siteTitle = 'V.I.Pet — грумінг собак і котів у Житомирі';
export const siteDescription =
  'Грумінг собак і котів у V.I.Pet у Житомирі. Послуги, ціни, фото до і після та заявка на догляд. Проїзд Академіка Тутковського, 12.';

export function resolveSeoSite(origin: string, baseURL: string, indexable: boolean) {
  if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(baseURL)) {
    throw new Error('Site base path must begin and end with a slash.');
  }
  if (!origin.trim()) {
    if (indexable) throw new Error('Set NUXT_PUBLIC_SITE_URL before enabling indexing.');
    return { url: '', indexable: false };
  }
  const parsed = new URL(origin.trim());
  if (
    parsed.protocol !== 'https:' ||
    parsed.username ||
    parsed.password ||
    parsed.pathname !== '/' ||
    parsed.search ||
    parsed.hash
  ) {
    throw new Error('NUXT_PUBLIC_SITE_URL must be an HTTPS origin without a path or credentials.');
  }
  return { url: new URL(baseURL, parsed.origin).href, indexable };
}

export function createBusinessSchema(url: string) {
  const businessId = `${url}#business`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': businessId,
        name: business.name,
        url,
        description: 'Грумінг собак і котів у Житомирі.',
        telephone: business.phone?.replace(/\s/g, ''),
        address: { '@type': 'PostalAddress', ...business.postalAddress },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            ...business.openingHours,
            dayOfWeek: business.openingHours.dayOfWeek.map((day) => `https://schema.org/${day}`),
          },
        ],
        sameAs: [business.instagramUrl],
        hasMap: googleMapsUrl,
        logo: `${url}images/brand/logo-dark-320.png`,
        areaServed: { '@type': 'City', name: business.city },
      },
      {
        '@type': 'WebSite',
        '@id': `${url}#website`,
        url,
        name: business.name,
        inLanguage: 'uk-UA',
        publisher: { '@id': businessId },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: siteTitle,
        description: siteDescription,
        inLanguage: 'uk-UA',
        isPartOf: { '@id': `${url}#website` },
        about: { '@id': businessId },
      },
      ...serviceCards.map((service) => ({
        '@type': 'Service',
        '@id': `${url}#service-${service.id}`,
        name: service.title,
        serviceType: service.title,
        provider: { '@id': businessId },
        areaServed: { '@type': 'City', name: business.city },
      })),
    ],
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
