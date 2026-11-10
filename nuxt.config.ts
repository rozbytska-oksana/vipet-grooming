import process from 'node:process';
import { resolveSeoSite } from './app/utils/siteSeo';

const githubPages = process.env.VIPET_DEPLOY_TARGET === 'github-pages';
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || '';
const siteIndexable = !githubPages && process.env.NUXT_PUBLIC_SITE_INDEXABLE === 'true';
resolveSeoSite(siteUrl, process.env.NUXT_APP_BASE_URL || '/', siteIndexable);

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: !githubPages },
  buildDir: githubPages ? '.nuxt-pages' : '.nuxt',
  nitro: {
    ...(githubPages ? { output: { dir: '.output-pages' } } : {}),
    prerender: { routes: ['/robots.txt', ...(siteIndexable ? ['/sitemap.xml'] : [])] },
  },
  css: ['~/assets/styles/main.scss'],
  experimental: { prerenderErrorPages: true },
  runtimeConfig: {
    public: {
      siteUrl,
      siteIndexable,
      bookingEnabled: false,
      bookingEndpoint: 'api/booking.php',
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'uk' },
      meta: [{ name: 'robots', content: siteIndexable ? 'index,follow' : 'noindex,nofollow' }],
    },
  },
});
