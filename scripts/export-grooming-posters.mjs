import sharp from 'sharp';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const records = JSON.parse(await readFile('source-assets/grooming-videos.manifest.json', 'utf8'));
const titles = {
  img_2706: 'Мистецтво стрижки',
  img_4832: 'Делікатний догляд',
  img_5928: 'Час купання',
  img_7104: 'Знайомство з улюбленцями',
  img_7238: 'Котячий характер',
  img_7244: 'Турбота в кожному русі',
  img_7477: 'Результат вичісування',
  img_7478: 'Після купання',
  img_7535: 'Маленькі гості салону',
  img_7644: 'Догляд за котячою шерстю',
  img_7733: 'Завершальні штрихи',
  img_8579: 'Моменти в салоні',
  img_8722: 'Час вичісування',
  img_8960: 'Перерва на відпочинок',
};
await mkdir('public/images/grooming-process', { recursive: true });
for (const item of records) {
  item.originalSha256 = createHash('sha256')
    .update(await readFile(item.source))
    .digest('hex');
  item.poster = `images/grooming-process/${item.id}`;
  item.posterOutputs = [];
  for (const width of [384, 768]) {
    for (const format of ['avif', 'webp']) {
      const file = `public/${item.poster}-${width}.${format}`;
      await sharp(`source-assets/generated/grooming-posters/${item.id}.jpg`)
        .resize({ width, withoutEnlargement: true })
        .toFormat(format, { quality: format === 'avif' ? 58 : 82, effort: 4 })
        .toFile(file);
      const metadata = await sharp(file).metadata();
      item.posterOutputs.push({
        file,
        width: metadata.width,
        height: metadata.height,
        bytes: (await stat(file)).size,
      });
    }
  }
}
await writeFile(
  'source-assets/grooming-videos.manifest.json',
  JSON.stringify(records, null, 2) + '\n',
);
const data = records.map(({ id, src, poster, duration, width, height }) => ({
  id,
  src,
  poster,
  title: titles[id],
  duration,
  width,
  height,
}));
await writeFile(
  'app/data/grooming-videos.ts',
  '// Supplied salon videos; originals remain untouched in source-assets/videos/grooming.\nexport const groomingVideos = ' +
    JSON.stringify(data, null, 2) +
    ' as const;\n',
);
console.log(
  'Videos:',
  records.length,
  'Original bytes:',
  records.reduce((n, r) => n + r.originalBytes, 0),
  'MP4 bytes:',
  records.reduce((n, r) => n + r.bytes, 0),
);
