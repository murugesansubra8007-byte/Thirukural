const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const config = require('../config');

const app = express();

app.use(cors());
app.use(express.json({ limit: '4mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/kurals', require('./routes/kurals'));
app.use('/api/chapters', require('./routes/chapters'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'Kuralagam API' }));

const distDir = path.join(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/^\/(?!api\/).*/, (req, res) => res.sendFile(path.join(distDir, 'index.html')));
}

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;