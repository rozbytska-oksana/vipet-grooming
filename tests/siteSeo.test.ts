import { describe, expect, it } from 'vitest';
import { createBusinessSchema, resolveSeoSite, serializeJsonLd } from '../app/utils/siteSeo';

describe('site SEO configuration', () => {
  it('keeps the domain-free review non-indexable', () => {
    expect(resolveSeoSite('', '/', false)).toEqual({ url: '', indexable: false });
    expect(() => resolveSeoSite('', '/', true)).toThrow('NUXT_PUBLIC_SITE_URL');
  });

  it('combines an HTTPS origin with the deployment base path', () => {
    expect(resolveSeoSite('https://example.test/', '/vipet-grooming/', true)).toEqual({
      url: 'https://example.test/vipet-grooming/',
      indexable: true,
    });
    expect(resolveSeoSite('https://example.test', '/', false).url).toBe('https://example.test/');
  });

  it.each([
    'http://example.test',
    'https://example.test/path',
    'https://example.test/?query=1',
    'https://example.test/#hero',
    'https://user:password@example.test',
    'not-a-url',
  ])('rejects an invalid site origin %s', (origin) => {
    expect(() => resolveSeoSite(origin, '/', true)).toThrow();
  });

  it('rejects unsafe deployment paths', () => {
    expect(() => resolveSeoSite('https://example.test', '//other.test/', true)).toThrow();
  });

  it('uses confirmed business data and connected service IDs', () => {
    const schema = createBusinessSchema('https://example.test/');
    const business = schema['@graph'][0];
    expect(business).toMatchObject({
      '@type': 'LocalBusiness',
      telephone: '+380635908730',
      address: { streetAddress: 'проїзд Академіка Тутковського, 12', postalCode: '10024' },
      openingHoursSpecification: [{ opens: '10:00', closes: '17:00' }],
    });
    const services = schema['@graph'].filter((item) => item['@type'] === 'Service');
    expect(services).toHaveLength(5);
    services.forEach((service) => {
      expect(service).toHaveProperty('provider', { '@id': 'https://example.test/#business' });
    });
    expect(JSON.stringify(schema)).not.toMatch(/aggregateRating|FAQPage|VeterinaryCare/);
  });

  it('escapes script termination while preserving valid JSON', () => {
    const input = { text: '</script><script>alert(1)</script>' };
    const output = serializeJsonLd(input);
    expect(output).not.toContain('<');
    expect(JSON.parse(output)).toEqual(input);
  });
});
