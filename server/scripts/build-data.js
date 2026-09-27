const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(__dirname, '..', 'data', 'raw');
const OUT_FILE = path.join(__dirname, '..', 'data', 'kurals.json');

function build() {
  const k = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'thirukkural.json'), 'utf8'));
  const d = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'detail.json'), 'utf8'));
  const kurals = k.kural;
  const paalDetails = d[0].section.detail;

  const chapters = [];
  const paals = [];
  const chapByNumber = {};

  for (const p of paalDetails) {
    const list = [];
    for (const g of p.chapterGroup.detail) {
      for (const c of g.chapters.detail) list.push(c);
    }
    paals.push({
      number: p.number,
      name: p.name,
      transliteration: p.transliteration,
      translation: p.translation,
      chapterCount: list.length,
    });
    for (const c of list) {
      chapters.push({
        number: c.number,
        name: c.name,
        transliteration: c.transliteration,
        translation: c.translation,
        paal: p.number,
        paalName: p.name,
        start: c.start,
        end: c.end,
      });
      chapByNumber[c.number] = c;
    }
  }

  const out = kurals.map((kr) => {
    const n = kr.Number;
    const cand = Object.values(chapByNumber).find((c) => n >= c.start && n <= c.end);
    return {
      number: n,
      line1: kr.Line1,
      line2: kr.Line2,
      transliteration1: kr.transliteration1,
      transliteration2: kr.transliteration2,
      meaning: kr.mv,
      simpleMeaning: kr.sp,
      abbreviationMeaning: kr.mk,
      explanation: kr.explanation,
      couplet: kr.couplet,
      englishTranslation: kr.Translation,
      chapterNumber: cand ? cand.number : null,
      chapterName: cand ? cand.name : null,
      paalNumber: cand ? pFor(cand.number) : null,
      paalName: cand ? paals.find((x) => x.number === pFor(cand.number)).name : null,
      wordMeanings: [],
    };
  });

  fs.writeFileSync(OUT_FILE, JSON.stringify({ paals, chapters, kurals: out }));
  console.log('✓ kurals.json written:', KuralsInfo());
  function KuralsInfo() {
    const s = fs.statSync(OUT_FILE);
    return `${out.length} kurals, ${chapters.length} chapters, ${(s.size / 1024 / 1024).toFixed(2)} MB`;
  }
}

function pFor(chNum) {
  if (chNum <= 38) return 1;
  if (chNum <= 108) return 2;
  return 3;
}

if (fs.existsSync(RAW_DIR)) build();
else console.error('Raw data missing — run from server/data/raw.');