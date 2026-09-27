const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const data = require('../data');
const { adminOnly } = require('../middleware/auth');

const router = express.Router();
router.use(adminOnly);

/* ---------------- Dashboard ---------------- */
router.get('/dashboard', (req, res) => {
  const d = db.getData();
  const visits = Object.entries(d.visits || {});
  const totalVisits = visits.reduce((acc, [, v]) => acc + v, 0);
  const last14 = visits
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .slice(0, 14)
    .reverse()
    .map(([date, count]) => ({ date, count }));

  const topSearches = d.searchQueries.slice().sort((a, b) => b.count - a.count).slice(0, 12);
  const today = new Date().toISOString().split('T')[0];
  const todayQuiz = d.quizAttempts.filter((a) => a.date === today);
  const avgScore = todayQuiz.length
    ? Math.round(
        (todayQuiz.reduce((acc, a) => acc + a.score, 0) / todayQuiz.reduce((acc, a) => acc + (a.total || 1), 0)) * 100
      ) / 100
    : 0;

  res.json({
    stats: {
      totalKurals: data.kurals().length,
      totalChapters: data.chapters().length,
      totalPaals: data.paals().length,
      totalUsers: d.users.length,
      totalVisits,
      visitsToday: d.visits[today] || 0,
      totalBlogPosts: d.blogPosts.length,
      totalCategories: d.categories.length,
      quizAttemptsToday: todayQuiz.length,
      quizAccuracyToday: avgScore,
    },
    visits: last14,
    topSearches,
    recentPosts: d.blogPosts.slice().sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, 5),
  });
});

/* ---------------- Users ---------------- */
router.get('/users', (req, res) => {
  const users = db
    .collection('users')
    .all()
    .map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt }));
  res.json({ total: users.length, users });
});

router.put('/users/:id', (req, res) => {
  const { role, password } = req.body || {};
  const updates = {};
  if (role !== undefined) updates.role = role;
  if (password) updates.passwordHash = bcrypt.hashSync(String(password), 10);
  const user = db.collection('users').update((u) => u.id === req.params.id, updates);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

router.delete('/users/:id', (req, res) => {
  const removed = db.collection('users').remove((u) => u.id === req.params.id);
  res.json({ removed });
});

/* ---------------- Settings ---------------- */
router.get('/settings', (req, res) => {
  res.json({ settings: db.getData().settings });
});

router.put('/settings', (req, res) => {
  const current = db.getData().settings || {};
  db.setData((d) => {
    d.settings = { ...current, ...req.body };
  });
  res.json({ settings: db.getData().settings });
});

/* ---------------- FAQ: history / audit ---------------- */
router.get('/quiz-attempts', (req, res) => {
  const attempts = db.collection('quizAttempts').all().slice().reverse().slice(0, 200);
  res.json({ total: db.collection('quizAttempts').all().length, attempts });
});

router.get('/search-queries', (req, res) => {
  const queries = db.collection('searchQueries').all().sort((a, b) => b.count - a.count);
  res.json({ total: queries.length, queries });
});

module.exports = router;