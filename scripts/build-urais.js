const fs = require('fs');
const path = require('path');

const OKF_DIR = 'C:/Users/sweas/AppData/Local/Temp/opencode/okf/kurals';
const OUT_FILE = path.join(__dirname, '..', 'server', 'data', 'urais.json');

const KEYS = ['manakkudavar', 'parimelazhagar', 'varadharasanar', 'karunanidhi'];
const LABELS = { manakkudavar: 'மணக்குடவர்', parimelazhagar: 'பரிமேலழகர்', varadharasanar: 'மு. வரதராசனார்', karunanidhi: 'கலைஞர்' };

function parseMd(text) {
  const kuralNumber = Number((text.match(/^kural_number:\s*(\d+)/m) || [])[1]);
  const body = text.slice(text.indexOf('## Commentary (Tamil)'), text.indexOf('## Context'));
  const urais = {};
  for (const key of KEYS) {
    const m = body.match(new RegExp(`- \\*\\*${key}\\*\\*:\\s*([\\s\\S]*?)(?=\\n- \\*\\*|\\n\\n|$)`));
    urais[key] = m ? m[1].trim() : '';
  }
  return { number: kuralNumber, urais };
}

const files = fs.readdirSync(OKF_DIR).filter((f) => /^\d{4}\.md$/.test(f));
const out = [];
const missing = [];

for (const f of files) {
  const { number, urais } = parseMd(fs.readFileSync(path.join(OKF_DIR, f), 'utf8'));
  if (!number) {
    console.error(`missing kural_number in ${f}`);
    continue;
  }
  for (const key of KEYS) {
    if (!urais[key]) missing.push(`${f}: ${LABELS[key]}`);
  }
  out.push({ number, ...urais });
}

out.sort((a, b) => a.number - b.number);

if (missing.length) {
  console.error(`WARN: ${missing.length} missing urai entries, e.g.:`);
  missing.slice(0, 15).forEach((m) => console.error('  ' + m));
}

fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 1), 'utf8');
console.log(`wrote ${OUT_FILE} — ${out.length} kurals (expected 1330)`);
console.log('sample 1:', JSON.stringify(out[0]).slice(0, 220));
console.log('sample 1330:', JSON.stringify(out[out.length - 1]).slice(0, 220));