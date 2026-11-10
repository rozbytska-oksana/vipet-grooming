import { resolveSeoSite } from '../../app/utils/siteSeo';

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const site = resolveSeoSite(
    String(config.public.siteUrl),
    config.app.baseURL,
    String(config.public.siteIndexable) === 'true',
  );
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
  return `User-agent: *\nAllow: /\n${site.indexable ? `Sitemap: ${site.url}sitemap.xml\n` : ''}`;
});
