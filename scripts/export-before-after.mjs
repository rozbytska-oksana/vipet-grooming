import sharp from 'sharp';
import { readFile, writeFile, mkdir, mkdtemp, rm, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = 'source-assets/before-after';
const manifest = JSON.parse(await readFile(`${root}/manifest.json`, 'utf8'));
const destination = 'public/images/before-after';
const temporary = await mkdtemp(join(tmpdir(), 'vipet-comparison-'));
const pairs = [];
await mkdir(destination, { recursive: true });
try {
  for (const pair of manifest.pairs) {
    const images = {};
    for (const [index, asset] of pair.files.entries()) {
      const role = index === 0 ? 'before' : 'after';
      const source = `${root}/${pair.folder}/${asset.file}`;
      const checksum = createHash('sha256')
        .update(await readFile(source))
        .digest('hex');
      if (checksum !== asset.sha256) throw new Error(`Original checksum mismatch: ${source}`);
      let input = source;
      if (/\.heic$/i.test(source)) {
        input = join(temporary, `${pair.folder}-${role}.jpg`);
        execFileSync('/usr/bin/sips', ['-s', 'format', 'jpeg', source, '--out', input], {
          stdio: 'ignore',
        });
      }
      const outputs = [];
      for (const width of [320, 640, 960]) {
        for (const format of ['avif', 'webp']) {
          const file = `${destination}/${pair.folder}-${role}-${width}.${format}`;
          const info = await sharp(input)
            .rotate()
            .resize({ width })
            .toFormat(format, { quality: format === 'avif' ? 58 : 82, effort: 4 })
            .toFile(file);
          outputs.push({
            file,
            width: info.width,
            height: info.height,
            bytes: (await stat(file)).size,
          });
        }
      }
      asset.role = role;
      asset.outputs = outputs;
      const preview = outputs.find(
        (output) => output.width === 960 && output.file.endsWith('.webp'),
      );
      images[role] = { width: preview.width, height: preview.height };
    }
    pairs.push({ id: pair.folder, ...images });
    console.log(`Exported ${pair.folder}`);
  }
  manifest.pairing =
    'User confirmed consecutive pairs in upload order. First image before, second image after.';
  manifest.processing =
    'Orientation and responsive resizing only, no retouching or cropping. Originals preserved.';
  await writeFile(`${root}/manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(
    'app/data/before-after.ts',
    `// Real salon photographs. Pair order confirmed by the owner.\nexport const beforeAfterPairs = ${JSON.stringify(pairs, null, 2)} as const;\n`,
  );
} finally {
  await rm(temporary, { recursive: true, force: true });
}
