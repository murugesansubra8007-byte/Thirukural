const fs = require('fs');
const { randomUUID } = require('crypto');
const config = require('../config');

const KV_URL = process.env.KV_REST_API_URL || '';
const KV_TOKEN = process.env.KV_REST_API_TOKEN || '';
const KV_KEY = 'kg:db.json';

function useKV() {
  return !!(KV_URL && KV_TOKEN);
}

function kvHeaders() {
  return { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' };
}

async function kvGet() {
  if (!useKV()) throw new Error('KV not configured');
  const r = await fetch(`${KV_URL}/get/${KV_KEY}`, { headers: kvHeaders() });
  const j = await r.json();
  return typeof j.result === 'string' ? JSON.parse(j.result) : null;
}

async function kvSet(doc) {
  if (!useKV()) return;
  await fetch(`${KV_URL}/set/${KV_KEY}`, {
    method: 'POST',
    headers: kvHeaders(),
    body: JSON.stringify(doc),
  });
}

function defaults() {
  return {
    users: [],
    categories: [],
    quizAttempts: [],
    quizQuestions: [],
    favorites: [],
    searchQueries: [],
    uploads: [],
    visits: {},
    kuralOverrides: {},
    chapterOverrides: {},
    settings: {
      siteName: 'குறளகம்',
      siteTagline: 'உலகின் 1330 குறள்களின் டிஜிட்டல் இல்லம்',
      announcement: '',
      seoTitle: 'குறளகம் — திருக்குறள்',
      seoDescription: 'திருக்குறள் — 133 அதிகாரங்கள் • 1330 குறள்கள்',
      audioRate: 0.85,
      audioLang: 'ta-IN',
    },
    admin: { createdAt: null },
  };
}

let data = null;

function load() {
  if (data) return data;
  const base = defaults();
  const parsed = fs.existsSync(config.DB_FILE)
    ? (() => {
        try {
          return JSON.parse(fs.readFileSync(config.DB_FILE, 'utf8'));
        } catch (e) {
          return {};
        }
      })()
    : {};
  data = { ...base, ...parsed };
  for (const k of Object.keys(base)) {
    if (data[k] === undefined || data[k] === null) data[k] = base[k];
  }
  data.settings = { ...base.settings, ...(parsed.settings || {}) };
  return data;
}

async function save() {
  if (!data) load();
  if (useKV()) {
    await kvSet(data);
  } else {
    fs.writeFileSync(config.DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  }
}

async function hydrate() {
  load();
  if (!useKV()) return data;
  try {
    const remote = await kvGet();
    if (remote) {
      data = { ...defaults(), ...remote };
      for (const k of Object.keys(defaults())) {
        if (data[k] === undefined || data[k] === null) data[k] = defaults()[k];
      }
      data.settings = { ...defaults().settings, ...(remote.settings || {}) };
    } else {
      await save();
    }
  } catch (e) {
    console.error('KV hydrate failed:', e.message);
  }
  return data;
}

function collection(name) {
  load();
  return {
    all() {
      return data[name];
    },
    find(fn) {
      return data[name].filter(fn);
    },
    findOne(fn) {
      return data[name].find(fn);
    },
    async insert(doc) {
      doc.id = doc.id || randomUUID();
      doc.createdAt = doc.createdAt || new Date().toISOString();
      data[name].push(doc);
      await save();
      return doc;
    },
    async update(fn, changes) {
      const i = data[name].findIndex(fn);
      if (i === -1) return null;
      data[name][i] = { ...data[name][i], ...changes, updatedAt: new Date().toISOString() };
      await save();
      return data[name][i];
    },
    async remove(fn) {
      const before = data[name].length;
      data[name] = data[name].filter((x) => !fn(x));
      await save();
      return before - data[name].length;
    },
  };
}

async function setData(mutator) {
  load();
  mutator(data);
  await save();
  return data;
}

function getData() {
  return load();
}

module.exports = { collection, getData, setData, defaults, save, load, hydrate };