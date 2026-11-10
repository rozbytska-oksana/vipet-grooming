import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const logo = 'public/images/brand/logo-light-480.webp';
const destination = 'public/images/social-preview.jpg';
const background =
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="light"><stop stop-color="#5d5140" stop-opacity=".45"/><stop offset="1" stop-color="#29292b" stop-opacity="0"/></radialGradient>
    <linearGradient id="gold"><stop stop-color="#b79a52" stop-opacity="0"/><stop offset=".5" stop-color="#ecd18e"/><stop offset="1" stop-color="#b79a52" stop-opacity="0"/></linearGradient>
  </defs>
  <path fill="#29292b" d="M0 0h1200v630H0z"/>
  <ellipse cx="600" cy="285" rx="490" ry="310" fill="url(#light)"/>
  <path d="M240 470C480 420 720 505 960 450" fill="none" stroke="url(#gold)" stroke-width="2"/>
  <text x="600" y="540" text-anchor="middle" fill="#f6f0e6" font-family="Arial, sans-serif" font-size="32">Грумінг собак і котів у Житомирі</text>
</svg>`);
const logoBuffer = await sharp(logo).resize({ width: 380 }).toBuffer();
await sharp(background)
  .composite([{ input: logoBuffer, left: 410, top: 75 }])
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(destination);
await writeFile(
  'source-assets/social-preview.manifest.json',
  `${JSON.stringify(
    {
      source: logo,
      sourceSha256: createHash('sha256')
        .update(await readFile(logo))
        .digest('hex'),
      output: destination,
      width: 1200,
      height: 630,
      bytes: (await readFile(destination)).length,
      treatment: 'Original supplied logo on a code-rendered brand background, no AI reconstruction',
    },
    null,
    2,
  )}\n`,
);
console.log(`Exported ${destination}`);

const icon = await sharp('public/favicon.svg').resize(48, 48).png().toBuffer();
await writeFile('public/favicon-48.png', icon);
await sharp('public/favicon.svg').resize(180, 180).png().toFile('public/apple-touch-icon.png');
// ICO directory with a PNG payload, supported by current desktop browsers.
const directory = Buffer.alloc(22);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(1, 4);
directory[6] = 48;
directory[7] = 48;
directory.writeUInt16LE(1, 10);
directory.writeUInt16LE(32, 12);
directory.writeUInt32LE(icon.length, 14);
directory.writeUInt32LE(22, 18);
await writeFile('public/favicon.ico', Buffer.concat([directory, icon]));
