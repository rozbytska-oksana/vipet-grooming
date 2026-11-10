import {
  createBusinessSchema,
  resolveSeoSite,
  serializeJsonLd,
  siteDescription,
  siteTitle,
} from '../utils/siteSeo';

export function useHomeSeo() {
  const config = useRuntimeConfig();
  const site = resolveSeoSite(
    String(config.public.siteUrl),
    config.app.baseURL,
    String(config.public.siteIndexable) === 'true',
  );
  const socialImage = site.url ? `${site.url}images/social-preview.jpg` : undefined;
  useSeoMeta({
    title: siteTitle,
    description: siteDescription,
    robots: site.indexable ? 'index, follow' : 'noindex, nofollow',
    ogType: 'website',
    ogTitle: siteTitle,
    ogDescription: siteDescription,
    ogSiteName: 'V.I.Pet Grooming Salon',
    ogLocale: 'uk_UA',
    ogUrl: site.url || undefined,
    ogImage: socialImage,
    ogImageType: socialImage ? 'image/jpeg' : undefined,
    ogImageWidth: socialImage ? 1200 : undefined,
    ogImageHeight: socialImage ? 630 : undefined,
    ogImageAlt: socialImage ? 'V.I.Pet — грумінг собак і котів у Житомирі' : undefined,
    twitterCard: 'summary_large_image',
    twitterTitle: siteTitle,
    twitterDescription: siteDescription,
    twitterImage: socialImage,
  });
  useHead({
    link: site.indexable ? [{ rel: 'canonical', href: site.url }] : [],
    script: site.indexable
      ? [
          {
            key: 'business-schema',
            type: 'application/ld+json',
            innerHTML: serializeJsonLd(createBusinessSchema(site.url)),
          },
        ]
      : [],
  });
}
