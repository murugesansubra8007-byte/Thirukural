const express = require('express');
const db = require('../db');
const { adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const posts = db.collection('blogPosts').all().sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  res.json({ total: posts.length, posts });
});

router.get('/:slug', (req, res) => {
  const post = db.collection('blogPosts').findOne((p) => p.slug === req.params.slug);
  if (!post) return res.status(404).json({ error: 'கட்டுரை கிடைக்கவில்லை' });
  res.json({ post });
});

router.post('/', adminOnly, async (req, res) => {
  const { title, slug, excerpt, content, coverColor, author, tags } = req.body || {};
  if (!title || !content) return res.status(400).json({ error: 'title, content required' });
  const post = await db.collection('blogPosts').insert({
    title,
    slug: slug || String(title).toLowerCase().replace(/[^a-z0-9\u0b80-\u0bff]+/g, '-'),
    excerpt: excerpt || '',
    content,
    coverColor: coverColor || '#a0401f',
    author: author || 'குறளகம்',
    tags: Array.isArray(tags) ? tags : [],
    publishedAt: new Date().toISOString(),
  });
  res.json({ post });
});

router.put('/:id', adminOnly, async (req, res) => {
  const { title, slug, excerpt, content, coverColor, author, tags } = req.body || {};
  const updates = {};
  if (title !== undefined) updates.title = title;
  if (slug !== undefined) updates.slug = slug;
  if (excerpt !== undefined) updates.excerpt = excerpt;
  if (content !== undefined) updates.content = content;
  if (coverColor !== undefined) updates.coverColor = coverColor;
  if (author !== undefined) updates.author = author;
  if (tags !== undefined) updates.tags = tags;
  updates.updatedAt = new Date().toISOString();
  const post = await db.collection('blogPosts').update((p) => p.id === req.params.id, updates);
  if (!post) return res.status(404).json({ error: 'Not found' });
  res.json({ post });
});

router.delete('/:id', adminOnly, async (req, res) => {
  const removed = await db.collection('blogPosts').remove((p) => p.id === req.params.id);
  res.json({ removed });
});

module.exports = router;