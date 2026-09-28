const express = require('express');
const data = require('../data');
const db = require('../db');
const { adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const list = db.collection('categories').all().map((c) => {
    const count = data.categoryKurals(c).length;
    return { ...c, kuralCount: count };
  });
  res.json({ total: list.length, categories: list });
});

router.get('/:id', (req, res) => {
  const category = db
    .collection('categories')
    .findOne((c) => String(c.id) === String(req.params.id) || String(c.slug) === String(req.params.id));
  if (!category) return res.status(404).json({ error: 'வகை கிடைக்கவில்லை' });
  const kurals = data.categoryKurals(category);
  res.json({ category, kuralCount: kurals.length, kurals });
});

router.post('/', adminOnly, async (req, res) => {
  const { emoji, label, description, taglines, chapterNumbers, slug } = req.body || {};
  if (!label) return res.status(400).json({ error: 'label required' });
  const category = await db.collection('categories').insert({
    emoji: emoji || '✦',
    label,
    slug: slug || String(label).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: description || '',
    taglines: taglines || [],
    chapterNumbers: Array.isArray(chapterNumbers) ? chapterNumbers : [],
  });
  res.json({ category });
});

router.put('/:id', adminOnly, async (req, res) => {
  const { emoji, label, slug, description, taglines, chapterNumbers } = req.body || {};
  const updates = {};
  if (emoji !== undefined) updates.emoji = emoji;
  if (label !== undefined) updates.label = label;
  if (slug !== undefined) updates.slug = slug;
  if (description !== undefined) updates.description = description;
  if (taglines !== undefined) updates.taglines = taglines;
  if (chapterNumbers !== undefined) updates.chapterNumbers = chapterNumbers;
  const category = await db.collection('categories').update((c) => String(c.id) === String(req.params.id), updates);
  if (!category) return res.status(404).json({ error: 'வகை கிடைக்கவில்லை' });
  res.json({ category });
});

router.delete('/:id', adminOnly, async (req, res) => {
  const removed = await db.collection('categories').remove((c) => String(c.id) === String(req.params.id));
  res.json({ removed });
});

module.exports = router;