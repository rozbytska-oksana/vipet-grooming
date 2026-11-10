import sharp from 'sharp';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const destination = 'public/images/hero';
await mkdir(destination, { recursive: true });
const manifest = { kind: 'Authorized AI demo layers; originals preserved', assets: [] };
for (const [name, widths] of [
  ['foreground-v8', [480, 768, 1200, 1536]],
  ['interior-v6', [1280, 1920]],
]) {
  const source = `source-assets/generated/hero-${name}.png`;
  const metadata = await sharp(source).metadata();
  const outputs = [];
  for (const width of widths) {
    for (const format of ['avif', 'webp']) {
      const file = `${destination}/${name}-${width}.${format}`;
      await sharp(source)
        .resize({ width })
        .toFormat(format, {
          quality: format === 'avif' ? 60 : 84,
          effort: 4,
        })
        .toFile(file);
      const result = await sharp(file).metadata();
      if (metadata.hasAlpha && !result.hasAlpha) throw new Error(`Lost alpha: ${file}`);
      outputs.push({
        file,
        width: result.width,
        height: result.height,
        bytes: (await stat(file)).size,
      });
    }
  }
  manifest.assets.push({
    source,
    sha256: createHash('sha256')
      .update(await readFile(source))
      .digest('hex'),
    width: metadata.width,
    height: metadata.height,
    outputs,
  });
}
await writeFile(
  'source-assets/hero-layers.manifest.json',
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(JSON.stringify(manifest, null, 2));
