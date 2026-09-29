import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'client', 'public', 'sitemap.xml');
const BASE = 'https://thirukural.heymovox.com';
const today = new Date().toISOString().slice(0, 10);

const kuralData = JSON.parse(readFileSync(join(root, 'server', 'data', 'kurals.json'), 'utf8'));
const db = JSON.parse(readFileSync(join(root, 'server', 'data', 'db.json'), 'utf8'));

const chapters = kuralData.chapters.map((c) => c.number);
const kurals = kuralData.kurals.map((k) => k.number);
const categories = (db.categories || []).map((c) => c.slug);

const staticPages = [
  ['/', 1.0],
  ['/explore', 0.5],
  ['/chapters', 0.8],
  ['/today', 0.6],
  ['/categories', 0.6],
  ['/learn', 0.7],
  ['/quiz', 0.5],
  ['/about-valluvar', 0.7],
  ['/about', 0.4],
  ['/contact', 0.3],
  ['/methodology', 0.4],
];

const urls = [];
const add = (loc, priority) => {
  urls.push(`  <url>\n    <loc>${BASE}${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`);
};

for (const [loc, p] of staticPages) add(loc, p);
for (const k of ['ara', 'porul', 'kamam']) add(`/paal/${k}`, 0.9);
for (const n of chapters) add(`/chapters/${n}`, 0.8);
for (const slug of categories) add(`/categories/${slug}`, 0.7);
for (const n of kurals) add(`/kural/${n}`, 0.6);

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
writeFileSync(out, xml, 'utf8');
console.log(`sitemap.xml: ${urls.length} urls -> ${out}`);

const swPath = join(root, 'client', 'public', 'sw.js');
writeFileSync(
  swPath,
  readFileSync(swPath, 'utf8').replace(/const CACHE_VERSION = '[^']*';/, `const CACHE_VERSION = '${Date.now().toString(36)}';`),
  'utf8'
);
console.log(`sw.js: build id stamped -> ${swPath}`);