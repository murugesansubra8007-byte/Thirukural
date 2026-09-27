const express = require('express');
const data = require('../data');
const db = require('../db');
const { adminOnly } = require('../middleware/auth');

const router = express.Router();

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function generateQuestion(rng, kurals, chapters) {
  const type = Math.floor(rng() * 3);
  if (type === 0) {
    const k = kurals[Math.floor(rng() * kurals.length)];
    const chapter = chapters.find((c) => c.number === k.chapterNumber);
    const options = [chapter.name];
    const used = new Set([chapter.name]);
    while (options.length < 4) {
      const c = chapters[Math.floor(rng() * chapters.length)];
      if (!used.has(c.name)) {
        used.add(c.name);
        options.push(c.name);
      }
    }
    return {
      id: `q${k.number}`,
      type: 'chapter',
      text: `"${k.line1} ${k.line2}" — இது எந்த அதிகாரம்?`,
      options: options.sort(() => rng() - 0.5),
      correct: chapter.name,
      kuralNumber: k.number,
    };
  }
  if (type === 1) {
    const k = kurals[Math.floor(rng() * kurals.length)];
    const fullLine = `${k.line1} ${k.line2}`;
    const wrongLines = [];
    const used = new Set([k.number]);
    while (wrongLines.length < 3) {
      const wk = kurals[Math.floor(rng() * kurals.length)];
      if (!used.has(wk.number)) {
        used.add(wk.number);
        wrongLines.push(`${wk.line1} ${wk.line2}`);
      }
    }
    const options = [fullLine, ...wrongLines].sort(() => rng() - 0.5);
    return {
      id: `q${k.number}m`,
      type: 'meaning',
      text: `"${k.englishTranslation}" — இதன் தமிழ் குறள் எது?`,
      options,
      correct: fullLine,
      kuralNumber: k.number,
    };
  }
  const paals = data.paals();
  const k = kurals[Math.floor(rng() * kurals.length)];
  const correctPaal = paals.find((p) => p.number === k.paalNumber);
  const options = paals.map((p) => p.name).sort(() => rng() - 0.5);
  return {
    id: `q${k.number}p`,
    type: 'paal',
    text: `"${k.line1} ${k.line2}" — இது எந்த பால் சார்ந்தது?`,
    options,
    correct: correctPaal.name,
    kuralNumber: k.number,
  };
}

router.get('/', (req, res) => {
  const todayKey = getTodayKey();
  const kurals = data.kuralSummaries();
  const chapters = data.chapters();
  const count = Math.min(Number(req.query.count) || 5, 20);
  const rng = seededRandom(
    todayKey.split('-').reduce((acc, v) => acc * 100 + Number(v), 0)
  );
  const questions = Array.from({ length: count }, () => generateQuestion(rng, kurals, chapters));
  res.json({ date: todayKey, total: questions.length, questions });
});

router.post('/attempt', (req, res) => {
  const { score, total, answers } = req.body || {};
  const record = db.collection('quizAttempts').insert({
    date: getTodayKey(),
    score: Number(score || 0),
    total: Number(total || 0),
    answers: Array.isArray(answers) ? answers : [],
  });
  res.json({ ok: true, attempt: record });
});

router.get('/leaderboard', (req, res) => {
  const attempts = db.collection('quizAttempts').all();
  const byDate = {};
  for (const a of attempts) {
    const d = a.date;
    if (!byDate[d]) byDate[d] = [];
    byDate[d].push(a);
  }
  const recent = Object.keys(byDate)
    .sort()
    .reverse()
    .slice(0, 7)
    .map((d) => ({
      date: d,
      top: byDate[d]
        .sort((a, b) => b.score / b.total - a.score / a.total)
        .slice(0, 10)
        .map((a) => ({ score: a.score, total: a.total, time: a.createdAt })),
    }));
  res.json({ leaderboard: recent });
});

router.get('/manage', adminOnly, (req, res) => {
  const questions = db.collection('quizQuestions').all();
  res.json({ total: questions.length, questions });
});

router.post('/manage', adminOnly, (req, res) => {
  const { text, options, correct, explanation } = req.body || {};
  if (!text || !options?.length || !correct) return res.status(400).json({ error: 'Invalid question' });
  const q = db.collection('quizQuestions').insert({ text, options, correct, explanation: explanation || '' });
  res.json({ question: q });
});

router.delete('/manage/:id', adminOnly, (req, res) => {
  const removed = db.collection('quizQuestions').remove((q) => q.id === req.params.id);
  res.json({ removed });
});

module.exports = router;