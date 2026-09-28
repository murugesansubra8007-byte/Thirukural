const express = require('express');
const data = require('../data');
const db = require('../db');
const { adminOnly } = require('../middleware/auth');

const router = express.Router();

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .trim();
}

const SEARCH_FIELDS = [
  'line1',
  'line2',
  'meaning',
  'simpleMeaning',
  'abbreviationMeaning',
  'englishTranslation',
  'couplet',
  'explanation',
  'chapterName',
  'chapterTranslation',
  'paalName',
];

router.get('/search', async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.json({ query: q, count: 0, results: [] });

  const key = normalize(q);
  const numeric = /^\d+$/.test(q);

  let results = [];
  if (numeric) {
    results = data.kuralSummaries().filter((k) => k.number === Number(q));
  }

  if (results.length === 0) {
    results = data.kurals()
      .filter((k) =>
        SEARCH_FIELDS.some((f) => {
          const val = normalize(k[f]);
          if (!val) return false;
          return val.includes(key);
        })
      )
      .slice(0, 100)
      .map((k) => ({
        number: k.number,
        line1: k.line1,
        line2: k.line2,
        chapterNumber: k.chapterNumber,
        chapterName: k.chapterName,
        paalName: k.paalName,
        paalNumber: k.paalNumber,
        englishTranslation: k.englishTranslation,
      }));
  }

  const searches = db.collection('searchQueries');
  const existing = searches.findOne((s) => s.query.toLowerCase() === q.toLowerCase());
  if (existing) {
    await searches.update((s) => s.id === existing.id, { count: existing.count + 1, lastAt: new Date().toISOString() });
  } else {
    await searches.insert({ query: q, count: 1, lastAt: new Date().toISOString() });
  }

  res.json({ query: q, count: results.length, results });
});

router.get('/', (req, res) => {
  const { paal, chapter, from, to, category, numbers } = req.query;
  let list = data.kuralSummaries();

  if (numbers) {
    const set = new Set(String(numbers).split(',').filter(Boolean).map(Number));
    list = list.filter((k) => set.has(k.number));
  }
  if (paal) list = list.filter((k) => String(k.paalNumber) === String(paal));

  if (paal) list = list.filter((k) => String(k.paalNumber) === String(paal));
  if (chapter) list = list.filter((k) => String(k.chapterNumber) === String(chapter));
  if (category) {
    const cat = db
      .collection('categories')
      .findOne((c) => String(c.id) === String(category) || String(c.slug) === String(category));
    if (cat) {
      const set = new Set((cat.chapterNumbers || []).map(Number));
      list = list.filter((k) => set.has(k.chapterNumber));
    }
  }
  if (from && to) list = list.filter((k) => k.number >= Number(from) && k.number <= Number(to));

  res.json({ total: list.length, kurals: list });
});

router.get('/:number', (req, res) => {
  const kural = data.kuralByNumber(req.params.number);
  if (!kural) return res.status(404).json({ error: 'குறள் கிடைக்கவில்லை' });
  const prev = data.kuralByNumber(kural.number === 1 ? 1330 : kural.number - 1);
  const next = data.kuralByNumber(kural.number === 1330 ? 1 : kural.number + 1);
  res.json({ kural, prev: { number: prev.number, line1: prev.line1, line2: prev.line2 }, next: { number: next.number, line1: next.line1, line2: next.line2 } });
});

router.put('/:number', adminOnly, async (req, res) => {
  const n = String(req.params.number);
  const kural = data.kuralByNumber(n);
  if (!kural) return res.status(404).json({ error: 'குறள் கிடைக்கவில்லை' });

  const { line1, line2, meaning, simpleMeaning, englishTranslation, couplet, explanation, wordMeanings, audioUrl } =
    req.body || {};

  const allowed = {};
  if (line1 !== undefined) allowed.line1 = String(line1);
  if (line2 !== undefined) allowed.line2 = String(line2);
  if (meaning !== undefined) allowed.meaning = String(meaning);
  if (simpleMeaning !== undefined) allowed.simpleMeaning = String(simpleMeaning);
  if (englishTranslation !== undefined) allowed.englishTranslation = String(englishTranslation);
  if (couplet !== undefined) allowed.couplet = String(couplet);
  if (explanation !== undefined) allowed.explanation = String(explanation);
  if (wordMeanings !== undefined) allowed.wordMeanings = Array.isArray(wordMeanings) ? wordMeanings : [];
  if (audioUrl !== undefined) allowed.audioUrl = String(audioUrl);

  await db.setData((d) => {
    d.kuralOverrides = d.kuralOverrides || {};
    d.kuralOverrides[n] = { ...(d.kuralOverrides[n] || {}), ...allowed };
  });

  res.json({ ok: true, kural: data.kuralByNumber(n) });
});

module.exports = router;