const fs = require('fs');
const path = require('path');
const { put, del, list } = require('@vercel/blob');

const UPLOAD_DIR = path.join(__dirname, '..', 'data', 'uploads');
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || '';

function useBlob() {
  return !!BLOB_TOKEN;
}

function extFor(mime) {
  const map = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'image/avif': '.avif',
  };
  return map[mime] || '.png';
}

function safeName(name) {
  return String(name || '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/\.+/g, '.')
    .slice(-80);
}

async function push(fileName, buffer, contentType) {
  const name = safeName(fileName);
  if (useBlob()) {
    const blob = await put(name, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: false,
      useDomain: true,
    });
    return { name, url: blob.url, backend: 'blob' };
  }
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const filePath = path.join(UPLOAD_DIR, name);
  fs.writeFileSync(filePath, buffer);
  return { name, url: `/cdn/${encodeURIComponent(name)}`, backend: 'disk' };
}

async function fetchStream(name, callback) {
  const safe = safeName(name);
  if (useBlob()) {
    const { blobs } = await list({ limit: 1000 });
    const hit = blobs.find((b) => b.pathname === safe);
    if (!hit) return null;
    const res = await fetch(hit.url);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    callback(buf, hit.contentType || 'application/octet-stream');
    return true;
  }
  const filePath = path.join(UPLOAD_DIR, safe);
  if (!fs.existsSync(filePath)) return null;
  callback(fs.readFileSync(filePath), 'application/octet-stream');
  return true;
}

async function remove(name) {
  const safe = safeName(name);
  if (useBlob()) {
    const { blobs } = await list({ limit: 1000 });
    const hit = blobs.find((b) => b.pathname === safe);
    if (hit) await del(hit.url);
    return !!hit;
  }
  const filePath = path.join(UPLOAD_DIR, safe);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}

module.exports = { useBlob, extFor, safeName, push, fetchStream, remove, UPLOAD_DIR };