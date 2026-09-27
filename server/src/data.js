const fs = require('fs');
const config = require('../config');
const db = require('./db');

let data = null;

function load() {
  if (!data) {
    data = JSON.parse(fs.readFileSync(config.DATA_FILE, 'utf8'));
  }
  return data;
}

function paals() {
  return load().paals;
}

function chapters() {
  const overrides = db.getData().chapterOverrides || {};
  return load().chapters.map((c) => {
    const o = overrides[String(c.number)];
    return o ? { ...c, ...o, number: c.number } : c;
  });
}

function kurals() {
  const overrides = db.getData().kuralOverrides || {};
  return load().kurals.map((k) => {
    const o = overrides[String(k.number)];
    return o ? { ...k, ...o, number: k.number } : k;
  });
}

function kuralByNumber(number) {
  const overrides = db.getData().kuralOverrides || {};
  const k = load().kurals.find((x) => x.number === Number(number));
  if (!k) return null;
  const o = overrides[String(k.number)];
  return o ? { ...k, ...o } : k;
}

function chapterByNumber(number) {
  return chapters().find((c) => c.number === Number(number)) || null;
}

function kuralSummaries() {
  return kurals().map((k) => ({
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

function categoryKurals(category) {
  const chNums = (category.chapterNumbers || []).map(Number);
  const map = new Set(chNums);
  return kuralSummaries().filter((k) => map.has(k.chapterNumber));
}

module.exports = {
  paals,
  chapters,
  kurals,
  kuralByNumber,
  chapterByNumber,
  kuralSummaries,
  categoryKurals,
};