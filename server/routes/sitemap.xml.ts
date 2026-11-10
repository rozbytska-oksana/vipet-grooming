import { resolveSeoSite } from '../../app/utils/siteSeo';

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const site = resolveSeoSite(
    String(config.public.siteUrl),
    config.app.baseURL,
    String(config.public.siteIndexable) === 'true',
  );
  if (!site.indexable) {
    setResponseStatus(event, 404);
    return '';
  }
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site.url}</loc></url></urlset>\n`;
});
