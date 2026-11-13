import process from 'node:process';
import { resolveSeoSite } from './app/utils/siteSeo';

const githubPages = process.env.VIPET_DEPLOY_TARGET === 'github-pages';
const hostpro = process.env.VIPET_DEPLOY_TARGET === 'hostpro';
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || '';
const siteIndexable = !githubPages && process.env.NUXT_PUBLIC_SITE_INDEXABLE === 'true';
resolveSeoSite(siteUrl, process.env.NUXT_APP_BASE_URL || '/', siteIndexable);

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: !githubPages },
  // Separate build dirs let deploy builds run while `nuxt dev` uses .nuxt.
  buildDir: githubPages ? '.nuxt-pages' : hostpro ? '.nuxt-hostpro' : '.nuxt',
  nitro: {
    ...(githubPages ? { output: { dir: '.output-pages' } } : {}),
    prerender: { routes: ['/robots.txt', ...(siteIndexable ? ['/sitemap.xml'] : [])] },
  },
  css: ['~/assets/styles/main.scss'],
  experimental: { prerenderErrorPages: true },
  features: { inlineStyles: true },
  hooks: {
    'build:manifest'(manifest) {
      // These chunks load when their visible-hydration boundary or motion needs them.
      for (const chunk of Object.values(manifest)) {
        if (
          [
            'gsap',
            'ScrollTrigger',
            'embla-carousel-vue.esm',
            'GroomerSection',
            'BeforeAfterSection',
            'PetGallerySection',
            'TestimonialsSection',
          ].includes(chunk.name || '')
        ) {
          chunk.preload = false;
          chunk.prefetch = false;
        }
      }
    },
  },
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
