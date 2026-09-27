const TAMIL_MONTHS = [
  'சித்திரை',
  'வைகாசி',
  'ஆனி',
  'ஆடி',
  'ஆவணி',
  'புரட்டாசி',
  'ஐப்பசி',
  'கார்த்திகை',
  'மார்கழி',
  'தை',
  'மாசி',
  'பங்குனி',
];

const TAMIL_DAYS = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];

function toJulian(y, m, d) {
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return (
    Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5
  );
}

function sunLongitude(jd) {
  const n = jd - 2451545.0;
  const L = (280.46 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360) * (Math.PI / 180);
  let lon = L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g);
  lon = lon % 360;
  if (lon < 0) lon += 360;
  return lon;
}

const AYANAMSA = 23.15;

function deltaAround(target, lon) {
  let d = (lon - target) % 360;
  if (d >= 180) return d - 360;
  if (d < -180) return d + 360;
  return d;
}

export function tamilToday(now = new Date()) {
  const ist = new Date(now.getTime() + (330 - now.getTimezoneOffset()) * 60000);
  const y = ist.getFullYear();
  const m = ist.getMonth() + 1;
  const d = ist.getDate();
  const jd = toJulian(y, m, d);
  const lon = sunLongitude(jd);
  const sidereal = (lon - AYANAMSA + 360) % 360;
  const month = Math.floor(sidereal / 30) % 12;
  const target = (month * 30 + AYANAMSA) % 360;

  let lo = jd - 32;
  let hi = jd;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (deltaAround(target, sunLongitude(mid)) >= 0) hi = mid;
    else lo = mid;
  }
  const tamilDay = Math.floor(jd - hi) + 1;

  return {
    tamilMonth: TAMIL_MONTHS[month],
    tamilDay,
    tamilWeekday: TAMIL_DAYS[now.getDay()],
    englishWeekday: now.toLocaleDateString('en-US', { weekday: 'long' }),
    englishDate: now.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  };
}