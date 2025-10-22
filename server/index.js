// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cron = require('node-cron');

// ensure path to your autoPost module is correct
const { main: updateDrafts, generateSlug } = require('../scriptb/autopost.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads folder if missing
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, safe);
  }
});
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

const postsFile = path.join(__dirname, '..', 'src', 'data', 'posts.json');

function readPosts() {
  if (!fs.existsSync(postsFile)) return [];
  return JSON.parse(fs.readFileSync(postsFile));
}
function writePosts(posts) {
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
}

// GET all posts
app.get('/api/posts', (req, res) => {
  const posts = readPosts();
  res.json(posts);
});

// GET published only (helper)
app.get('/api/published', (req, res) => {
  const posts = readPosts().filter(p => p.status === 'published');
  res.json(posts);
});

// Upload images (accept multiple). returns array of URLs.
app.post('/api/upload', upload.array('images', 20), (req, res) => {
  if (!req.files || !req.files.length) return res.status(400).json({ error: 'No files uploaded' });
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const urls = req.files.map(f => `${baseUrl}/uploads/${path.basename(f.path)}`);
  res.json({ urls });
});

// Update a post (edit title/content/meta/category/images)
app.put('/api/posts/:id', (req, res) => {
  const posts = readPosts();
  const idx = posts.findIndex(p => p.id == req.params.id);
  if (idx === -1) return res.status(404).send('Post not found');
  // Only accept fields we expect
  const allowed = ['title','content','metaDescription','category','image','images','status','excerpt','readTime'];
  for (const key of allowed) {
    if (req.body[key] !== undefined) posts[idx][key] = req.body[key];
  }
  // update slug if title changed while published
  if (posts[idx].status === 'published') {
    const existing = posts.filter((p,i) => i !== idx && p.status === 'published').map(p => p.slug);
    posts[idx].slug = generateSlug(posts[idx].title, existing);
  }
  writePosts(posts);
  res.json(posts[idx]);
});

// Delete a post (draft or published)
app.delete('/api/posts/:id', (req, res) => {
  let posts = readPosts();
  const initial = posts.length;
  posts = posts.filter(p => p.id != req.params.id);
  writePosts(posts);
  res.json({ deleted: initial - posts.length });
});

// Publish a post (generates unique SEO-friendly slug)
app.post('/api/publish/:id', (req, res) => {
  const posts = readPosts();
  const idx = posts.findIndex(p => p.id == req.params.id);
  if (idx === -1) return res.status(404).send('Post not found');
  const publishedSlugs = posts.filter(p => p.status === 'published').map(p => p.slug);
  posts[idx].status = 'published';
  posts[idx].slug = generateSlug(posts[idx].title, publishedSlugs);
  // ensure metaDescription exists
  posts[idx].metaDescription = posts[idx].metaDescription || (posts[idx].excerpt || '').slice(0,160);
  writePosts(posts);
  res.json(posts[idx]);
});

// Trigger auto-drafts update (calls your scriptb autoPost main)
app.post('/api/update-drafts', async (req, res) => {
  try {
    await updateDrafts();
    res.send('Drafts updated!');
  } catch (err) {
    console.error('updateDrafts error:', err);
    res.status(500).send('Failed to update drafts');
  }
});

// Cron auto-update every 6 hours (optional)
cron.schedule('0 */6 * * *', async () => {
  try {
    console.log('Cron: updating drafts...');
    await updateDrafts();
    console.log('Cron: finished updating drafts.');
  } catch (e) {
    console.error('Cron update failed:', e);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Uploads served at /uploads`);
});
