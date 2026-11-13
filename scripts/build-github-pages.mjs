import { spawnSync } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const baseURL = process.env.NUXT_APP_BASE_URL || '/vipet-grooming/';

if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(baseURL)) {
  throw new Error('NUXT_APP_BASE_URL must be / or a slash-delimited repository path.');
}

const output = path.join(root, '.output-pages');
await rm(output, { recursive: true, force: true });

const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'generate'], {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    VIPET_DEPLOY_TARGET: 'github-pages',
    NUXT_APP_BASE_URL: baseURL,
    NUXT_PUBLIC_BOOKING_ENABLED: 'false',
    NUXT_PUBLIC_SITE_INDEXABLE: 'false',
    NUXT_PUBLIC_SITE_URL: process.env.VIPET_PAGES_ORIGIN || 'https://rozbytska-oksana.github.io',
    VIPET_TELEGRAM_BOT_TOKEN: '',
  },
});

if (result.error) {
  throw result.error;
}
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const publicDirectory = path.join(output, 'public');
await rm(path.join(publicDirectory, 'api'), { recursive: true, force: true });
// Apache rules and the canonical host belong to the HostPro build only.
await rm(path.join(publicDirectory, '.htaccess'), { force: true });
await mkdir(publicDirectory, { recursive: true });
await writeFile(path.join(publicDirectory, '.nojekyll'), '');
console.log(`GitHub Pages review build ready in ${publicDirectory} with base ${baseURL}`);
