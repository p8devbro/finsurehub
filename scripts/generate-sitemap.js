// scripts/generate-sitemap.js
const fs = require('fs');
const posts = require('../src/data/posts.json');

const base = 'https://finsurehub.info';
const urls = [
  `${base}/`,
  ...posts.map(p => `${base}/posts/${p.slug}`)
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;

if (!fs.existsSync('public')) fs.mkdirSync('public');
fs.writeFileSync('public/sitemap.xml', xml);
console.log('sitemap written to public/sitemap.xml');
