const fs = require('fs');
const { randomUUID } = require('crypto');
const config = require('../config');

function defaults() {
  return {
    users: [],
    blogPosts: [],
    categories: [],
    quizAttempts: [],
    quizQuestions: [],
    favorites: [],
    searchQueries: [],
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

function save() {
  fs.writeFileSync(config.DB_FILE, JSON.stringify(data, null, 2), 'utf8');
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
    insert(doc) {
      doc.id = doc.id || randomUUID();
      doc.createdAt = doc.createdAt || new Date().toISOString();
      data[name].push(doc);
      save();
      return doc;
    },
    update(fn, changes) {
      const i = data[name].findIndex(fn);
      if (i === -1) return null;
      data[name][i] = { ...data[name][i], ...changes, updatedAt: new Date().toISOString() };
      save();
      return data[name][i];
    },
    remove(fn) {
      const before = data[name].length;
      data[name] = data[name].filter((x) => !fn(x));
      save();
      return before - data[name].length;
    },
  };
}

function setData(mutator) {
  load();
  mutator(data);
  save();
  return data;
}

function getData() {
  return load();
}

module.exports = { collection, getData, setData, defaults, save, load };