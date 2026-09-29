const express = require('express');
const { randomUUID } = require('crypto');
const { adminOnly } = require('../middleware/auth');
const db = require('../db');
const storage = require('../storage');

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml'];

function rawImageBody(req, res, next) {
  if (req.is('application/json')) return next();
  const chunks = [];
  let bytes = 0;
  req.on('data', (c) => {
    bytes += c.length;
    if (bytes > MAX_BYTES) {
      req.destroy();
      return;
    }
    chunks.push(c);
  });
  req.on('end', () => {
    req.rawBody = Buffer.concat(chunks);
    req.rawSize = bytes;
    next();
  });
  req.on('error', next);
}

function extForMime(mime) {
  const map = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/avif': '.avif',
    'image/svg+xml': '.svg',
  };
  return map[mime] || '.png';
}

const uploadsRouter = express.Router();
uploadsRouter.use(rawImageBody);

/* POST /api/uploads — upload an image (admin). Body is raw bytes. */
uploadsRouter.post('/', adminOnly, async (req, res) => {
  try {
    const mime = (req.headers['content-type'] || '').split(';')[0].toLowerCase();
    if (!ALLOWED.includes(mime)) {
      return res.status(415).json({ error: 'Only PNG, JPEG, WEBP, GIF, AVIF or SVG images are allowed.' });
    }
    const body = req.rawBody || Buffer.alloc(0);
    if (!body.length) return res.status(400).json({ error: 'Empty file body' });
    if (body.length > MAX_BYTES) {
      return res.status(413).json({ error: 'File too large — max 8 MB' });
    }

    const base = storage.safeName(req.query.name || 'upload').replace(/\.[a-z0-9]+$/i, '') || 'upload';
    const name = `${randomUUID().slice(0, 8)}-${base}${extForMime(mime)}`;

    const saved = await storage.push(name, body, mime);
    const record = await db.collection('uploads').insert({
      name: saved.name,
      contentType: mime,
      size: body.length,
      url: saved.url,
      backend: saved.backend,
    });

    return res.json({
      id: record.id,
      name: record.name,
      contentType: record.contentType,
      size: record.size,
      url: record.url,
      cdn: saved.backend === 'blob',
    });
  } catch (e) {
    console.error('Upload failed:', e);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

/* GET /api/uploads — list uploads (admin). */
uploadsRouter.get('/', adminOnly, async (req, res) => {
  res.json({ uploads: db.collection('uploads').all() });
});

/* DELETE /api/uploads/:name — delete an image (admin). */
uploadsRouter.delete('/:name', adminOnly, async (req, res) => {
  try {
    const name = storage.safeName(req.params.name);
    const removed = await storage.remove(name);
    await db.collection('uploads').remove((u) => u.name === name);
    res.json({ ok: true, removed });
  } catch (e) {
    console.error('Delete failed:', e);
    return res.status(500).json({ error: 'Delete failed' });
  }
});

const cdnRouter = express.Router();

/* GET /cdn/:name — serve an uploaded image. */
cdnRouter.get('/:name', async (req, res) => {
  try {
    const name = storage.safeName(req.params.name);
    const hit = db.collection('uploads').findOne((u) => u.name === name);
    const found = await storage.fetchStream(name, (buf, fallbackMime) => {
      res.setHeader('Content-Type', (hit && hit.contentType) || fallbackMime);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.send(buf);
    });
    if (!found) return res.status(404).json({ error: 'File not found' });
  } catch (e) {
    console.error('Serving upload failed:', e);
    return res.status(500).json({ error: 'Failed to serve file' });
  }
});

module.exports = { uploadsRouter, cdnRouter };