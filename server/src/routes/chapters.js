const express = require('express');
const data = require('../data');
const db = require('../db');
const { adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const { paal } = req.query;
  let list = data.chapters();
  if (paal) list = list.filter((c) => String(c.paal) === String(paal));
  const grouped = list.map((c) => ({
    ...c,
    kuralCount: c.end - c.start + 1,
    paalName: data.paals().find((p) => p.number === c.paal)?.name || c.paalName,
  }));
  res.json({ total: grouped.length, chapters: grouped });
});

router.get('/:number', (req, res) => {
  const chapter = data.chapterByNumber(req.params.number);
  if (!chapter) return res.status(404).json({ error: 'அதிகாரம் கிடைக்கவில்லை' });
  const kurals = data.kuralSummaries().filter((k) => k.chapterNumber === chapter.number);
  const paal = data.paals().find((p) => p.number === chapter.paal) || null;
  const prevChapter = chapter.number > 1 ? data.chapterByNumber(chapter.number - 1) : null;
  const nextChapter = chapter.number < 133 ? data.chapterByNumber(chapter.number + 1) : null;
  res.json({ chapter, paal, kurals, prevChapter, nextChapter });
});

router.put('/:number', adminOnly, (req, res) => {
  const n = String(req.params.number);
  const chapter = data.chapterByNumber(n);
  if (!chapter) return res.status(404).json({ error: 'அதிகாரம் கிடைக்கவில்லை' });
  const { name, translation, transliteration } = req.body || {};
  db.setData((d) => {
    d.chapterOverrides = d.chapterOverrides || {};
    d.chapterOverrides[n] = {
      number: n,
      name: name !== undefined ? String(name) : undefined,
      translation: translation !== undefined ? String(translation) : undefined,
      transliteration: transliteration !== undefined ? String(transliteration) : undefined,
    };
    for (const k of Object.keys(d.chapterOverrides[n])) {
      if (d.chapterOverrides[n][k] === undefined) delete d.chapterOverrides[n][k];
    }
  });
  res.json({ ok: true, chapter: data.chapterByNumber(n) });
});

module.exports = router;