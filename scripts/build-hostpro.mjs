import { spawnSync } from 'node:child_process';
import { access, readFile, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Production build for HostPro: https://vipet-grooming.com.ua at the domain root.
// Keep the origin in sync with the canonical host in public/.htaccess.
const siteUrl = 'https://vipet-grooming.com.ua';
const indexable = process.argv.includes('--indexable');
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '.output', 'public');

const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'generate'], {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    VIPET_DEPLOY_TARGET: 'hostpro',
    NUXT_APP_BASE_URL: '/',
    NUXT_PUBLIC_SITE_URL: siteUrl,
    NUXT_PUBLIC_SITE_INDEXABLE: String(indexable),
    NUXT_PUBLIC_BOOKING_ENABLED: 'true',
    NUXT_PUBLIC_BOOKING_ENDPOINT: 'api/booking.php',
    // The token belongs only in vipet-booking-config.php on the server.
    VIPET_TELEGRAM_BOT_TOKEN: '',
  },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

// Finder metadata must not be uploaded.
async function removeDsStore(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await removeDsStore(target);
    else if (entry.name === '.DS_Store') await rm(target);
  }
}
await removeDsStore(output);

const required = [
  'index.html',
  '404.html',
  'robots.txt',
  '.htaccess',
  'api/booking.php',
  'api/booking-catalog.json',
];
if (indexable) required.push('sitemap.xml');
for (const file of required) {
  await access(path.join(output, file)).catch(() => {
    throw new Error(`HostPro build is missing ${file}`);
  });
}

const html = await readFile(path.join(output, 'index.html'), 'utf8');
const checks = [
  [html.includes(`property="og:url" content="${siteUrl}/"`), 'og:url uses the production origin'],
  [html.includes('Надіслати заявку'), 'booking form submits to the PHP handler'],
  [!html.includes('ПОТРІБНО'), 'no editorial placeholders'],
  [
    indexable ? html.includes(`rel="canonical" href="${siteUrl}/"`) : html.includes('noindex'),
    indexable ? 'canonical points to the production origin' : 'noindex until --indexable',
  ],
];
const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  throw new Error(`HostPro build checks failed: ${failed.map(([, name]) => name).join('; ')}`);
}

console.log(`\nHostPro build ready in ${output}`);
console.log('Upload the contents (including .htaccess and api/) to public_html.');
if (!indexable) {
  console.warn('Indexing is OFF (noindex). Rebuild with --indexable for the public launch.');
}
