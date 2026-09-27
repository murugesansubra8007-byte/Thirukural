const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/visit', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const data = db.getData();
  data.visits[today] = (data.visits[today] || 0) + 1;
  db.save();
  res.json({ ok: true, visits: data.visits[today] });
});

router.post('/search', (req, res) => {
  const { q } = req.body || {};
  if (!q) return res.status(400).json({ error: 'q required' });
  const searches = db.collection('searchQueries');
  const existing = searches.findOne((s) => s.query.toLowerCase() === String(q).toLowerCase());
  if (existing) {
    searches.update((s) => s.id === existing.id, { count: existing.count + 1, lastAt: new Date().toISOString() });
  } else {
    searches.insert({ query: String(q), count: 1, lastAt: new Date().toISOString() });
  }
  res.json({ ok: true });
});

module.exports = router;