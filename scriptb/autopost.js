require('dotenv').config();
const fs = require('fs');
const Parser = require('rss-parser');
const parser = new Parser();
const authors = ['Sarah Lawson','David Okoro','Emma Reed','Michael Tran'];

const rssFeeds = [
  // Finance
  'https://www.ft.com/rss/home',
  'https://fortune.com/feed/fortune-feed.xml',
  'https://seekingalpha.com/feed.xml',
  'https://www.fool.com/a/feeds/partner/google/stock-news-analysis.xml',
  'https://www.nasdaq.com/feed/rssoutbound',
  'https://finance.yahoo.com/rss',
  'https://www.cnbc.com/id/100003114/device/rss/rss.html',
  'https://www.investing.com/rss/news.rss',
  // Insurance
  'https://insurancebusinessmag.com/us/rss',
  'https://insurancejournal.com/feed',
  'https://allstatenewsroom.com/news/feed',
  'https://insuranceblog.accenture.com/feed',
  'http://rss.cnn.com/rss/money_pf_insurance.rss',
  'https://www.propertycasualty360.com/feed',
  'https://news.ambest.com/feed',
  'https://www.insurancenewsnet.com/rss'
];

function getImages(keyword) {
  const formattedKeyword = encodeURIComponent(keyword);
  return [
    `https://source.unsplash.com/800x600/?${formattedKeyword}`,
    `https://source.unsplash.com/800x600/?${formattedKeyword},finance`
  ];
}

function detectCategory(title, content) {
  const financeKeywords = ['stock','market','investment','crypto','finance','bank','money','forex','economy'];
  const insuranceKeywords = ['insurance','policy','coverage','premium','claims','life insurance','auto insurance'];

  const text = (title + ' ' + content).toLowerCase();
  if (insuranceKeywords.some(k => text.includes(k))) return 'Insurance';
  if (financeKeywords.some(k => text.includes(k))) return 'Finance';
  return 'General';
}

function generateSlug(title, existingSlugs = []) {
  let slug = title.toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-');
  let uniqueSlug = slug;
  let counter = 1;
  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter++}`;
  }
  return uniqueSlug;
}

async function fetchAllArticles() {
  let allArticles = [];
  for (const feedUrl of rssFeeds) {
    try {
      const feed = await parser.parseURL(feedUrl);
      allArticles.push(...feed.items.map(item => ({
        title: item.title,
        url: item.link,
        date: item.pubDate || new Date().toISOString(),
        content: item.contentSnippet || item.content || ''
      })));
    } catch (err) {
      console.error(`Failed to fetch RSS ${feedUrl}: ${err.message}`);
    }
  }
  return allArticles;
}

function filterRecent(articles, days = 7) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return articles.filter(a => new Date(a.date) >= cutoff);
}

async function main() {
  const postsFile = './src/data/posts.json';
  const posts = fs.existsSync(postsFile) ? JSON.parse(fs.readFileSync(postsFile)) : [];

  const allArticles = await fetchAllArticles();
  const recentArticles = filterRecent(allArticles);

  for (const article of recentArticles) {
    const slug = article.title.toLowerCase().replace(/\s+/g, '-');
    if (posts.some(p => p.slug === slug || p.url === article.url)) continue;

    try {
      const humanContent = article.content;
      const author = authors[Math.floor(Math.random() * authors.length)];
      const images = getImages(article.title);

      const post = {
        id: Date.now(),
        slug,
        title: article.title,
        url: article.url,
        date: article.date,
        category: detectCategory(article.title, article.content),
        author,
        readTime: '8 min',
        excerpt: humanContent.slice(0,150) + '...',
        image: images[0],
        status: 'draft',
        metaDescription: humanContent.slice(0,150),
        content: `<img src="${images[0]}" alt="${article.title} Image 1">
<p>${humanContent.split('\n\n').join('</p><p>')}</p>
<img src="${images[1]}" alt="${article.title} Image 2">`
      };

      posts.push(post);
      console.log(`Draft saved: ${post.title} [${post.category}]`);
    } catch (err) {
      console.error(`Failed processing ${article.title}: ${err.message}`);
    }
  }

  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
  console.log('All new drafts appended!');
}

module.exports = { main, generateSlug };
