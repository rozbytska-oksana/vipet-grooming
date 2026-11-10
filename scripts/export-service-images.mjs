import sharp from 'sharp';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const destination = 'public/images/services';
await mkdir(destination, { recursive: true });
const manifest = {
  generator: 'Built-in image_gen',
  kind: 'Authorized AI service illustrations, not salon work',
  assets: [],
};
for (const name of ['complex', 'hygiene', 'cats', 'bath', 'extras']) {
  const source = `source-assets/generated/services-v2/${name}.png`;
  const metadata = await sharp(source).metadata();
  const outputs = [];
  for (const width of [384, 768]) {
    for (const format of ['avif', 'webp']) {
      const file = `${destination}/${name}-v2-${width}.${format}`;
      await sharp(source)
        .resize(width, width, { fit: 'cover' })
        .toFormat(format, { quality: format === 'avif' ? 58 : 82, effort: 4 })
        .toFile(file);
      outputs.push({ file, width, height: width, bytes: (await stat(file)).size });
    }
  }
  manifest.assets.push({
    source,
    width: metadata.width,
    height: metadata.height,
    sha256: createHash('sha256')
      .update(await readFile(source))
      .digest('hex'),
    outputs,
  });
}
await writeFile(
  'source-assets/services-v2.manifest.json',
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(`Exported ${manifest.assets.length} service images in AVIF/WebP`);
