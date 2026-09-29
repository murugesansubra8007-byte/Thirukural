const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const config = require('../config');
const db = require('../src/db');

const DATA = JSON.parse(fs.readFileSync(config.DATA_FILE, 'utf8'));
const kural = (n) => DATA.kurals.find((k) => k.number === n) || {};

const CATEGORIES = [
  { emoji: '❤️', label: 'அன்பு', slug: 'anbu', taglines: ['அன்புடைமை', 'அருளுடைமை', 'கண்ணோட்டம்'], chapterNumbers: [8, 25, 58] },
  { emoji: '👨‍👩‍👧', label: 'குடும்பம்', slug: 'family', taglines: ['இல்லறம்', 'துணை', 'பிள்ளை', 'விருந்தோம்பல்'], chapterNumbers: [5, 6, 7, 9, 11] },
  { emoji: '💼', label: 'வேலை / தொழில்', slug: 'work', taglines: ['ஊக்கம்', 'முயற்சி', 'வினைத்தூய்மை'], chapterNumbers: [60, 61, 62, 63, 66, 67, 68] },
  { emoji: '💰', label: 'பொருளாதாரம்', slug: 'wealth', taglines: ['பொருள்', 'ஈகை', 'செல்வம்'], chapterNumbers: [23, 76, 101, 103, 104] },
  { emoji: '👑', label: 'தலைமைத்துவம்', slug: 'leadership', taglines: ['இறைமாட்சி', 'செங்கோல்', 'அமைச்சு'], chapterNumbers: [39, 55, 56, 64, 69, 70, 72, 73, 77] },
  { emoji: '🧠', label: 'அறிவு', slug: 'knowledge', taglines: ['கல்வி', 'கேள்வி', 'அறிவுடைமை'], chapterNumbers: [40, 41, 42, 43, 51] },
  { emoji: '🤝', label: 'நட்பு', slug: 'friendship', taglines: ['நட்பு', 'பழைமை', 'தீ நட்பு'], chapterNumbers: [46, 79, 80, 81, 82, 83] },
  { emoji: '⚖️', label: 'நீதி', slug: 'justice', taglines: ['நடுவுநிலை', 'செங்கோன்', 'வாய்மை'], chapterNumbers: [12, 18, 19, 29, 30, 55, 56] },
  { emoji: '🌱', label: 'ஒழுக்கம்', slug: 'righteousness', taglines: ['அடக்கம்', 'உறுதி', 'நாணம்'], chapterNumbers: [13, 14, 28, 30, 102] },
  { emoji: '🔥', label: 'முயற்சி', slug: 'effort', taglines: ['ஊக்கம்', 'வலிமை', 'வெற்றி'], chapterNumbers: [48, 60, 61, 62, 63, 76] },
  { emoji: '🎓', label: 'கல்வி', slug: 'education', taglines: ['கற்றல்', 'கேள்வி', 'சொல்வன்மை'], chapterNumbers: [40, 41, 42, 43, 65] },
  { emoji: '❤️‍🔥', label: 'காதல்', slug: 'love', taglines: ['புணர்ச்சி', 'புலவி', 'ஊடல்'], chapterNumbers: [110, 113, 115, 125, 131, 133] },
];


function quoteLines(...nums) {
  return nums
    .map((n) => {
      const k = kural(n);
      return `> **குறள் ${n}** — *${k.chapterName}*\n>\n> ${k.line1}\n> ${k.line2}\n>\n> *${k.simpleMeaning}*`;
    })
    .join('\n\n');
}


function main() {
  db.load();
  const users = db.collection('users');

  if (!users.findOne((u) => u.role === 'admin')) {
    users.insert({
      name: 'நிர்வாகி',
      email: config.ADMIN_EMAIL,
      passwordHash: bcrypt.hashSync(config.ADMIN_PASSWORD, 10),
      role: 'admin',
    });
    console.log('✓ Admin user seeded →', config.ADMIN_EMAIL, '/', config.ADMIN_PASSWORD);
  } else {
    console.log('• Admin user already exists');
  }

  const categories = db.collection('categories');
  if (categories.all().length === 0) {
    CATEGORIES.forEach((c) => categories.insert({ ...c, description: '' }));
    console.log(`✓ ${CATEGORIES.length} categories seeded`);
  } else {
    console.log('• Categories already present');
  }

  if (!db.getData().admin.createdAt) {
    db.setData((d) => {
      d.admin = { createdAt: new Date().toISOString() };
    });
  }
}

main();
