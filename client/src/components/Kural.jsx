import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { isFavorite, toggleFavorite } from '../api';
import Icon from './Icon';

/* ---------- Audio (natural Google Tamil voice, per-line, clear) ---------- */
function gttsUrl(text) {
  return `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&q=${encodeURIComponent(text)}&tl=ta`;
}

function pickTamilVoice() {
  let voices = [];
  try {
    voices = window.speechSynthesis.getVoices();
  } catch (e) {
    return null;
  }
  const ta = voices.filter((v) => (v.lang || '').toLowerCase().startsWith('ta'));
  if (!ta.length) return null;
  const score = (v) => {
    const n = (v.name || '').toLowerCase();
    let s = 0;
    if (n.includes('google')) s += 100;
    if (n.includes('dhivya') || n.includes('kavya')) s += 95;
    if (n.includes('microsoft')) s += 60;
    if ((v.lang || '').toLowerCase() === 'ta-in') s += 35;
    if (n.includes('zira') || n.includes('heera')) s += 15;
    return s - n.length * 0.001;
  };
  return ta.sort((a, b) => score(b) - score(a))[0];
}

let speakToken = 0;
let currentAudio = null;

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function playMp3(url) {
  if (!('Audio' in window)) return Promise.resolve(false);
  return new Promise((resolve) => {
    const a = new window.Audio(url);
    currentAudio = a;
    const done = (v) => {
      if (currentAudio === a) currentAudio = null;
      resolve(v);
    };
    a.onended = () => done(true);
    a.onpause = () => done(false);
    a.onerror = () => done(false);
    a.play().catch(() => done(false));
  });
}

function speakTts(text, rate, slow, token) {
  if (!('speechSynthesis' in window)) return Promise.resolve(false);
  window.speechSynthesis.cancel();
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    const voice = pickTamilVoice();
    if (voice) u.voice = voice;
    u.lang = voice ? voice.lang : 'ta-IN';
    u.rate = slow ? rate * 0.68 : rate;
    u.pitch = 1;
    u.volume = 1;
    u.onend = () => (token === speakToken ? resolve(true) : resolve(false));
    u.onerror = () => resolve(false);
    window.speechSynthesis.speak(u);
  });
}

export function speak(text, { rate = 0.85, slow = false } = {}) {
  const lines = String(text)
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  if (!lines.length) return Promise.resolve(false);
  if (!('Audio' in window) && !('speechSynthesis' in window)) return Promise.resolve(false);

  const token = ++speakToken;
  const pauseMs = slow ? 460 : 260;

  return (async () => {
    for (const line of lines) {
      if (token !== speakToken) return false;
      const ok = await playMp3(gttsUrl(line));
      if (!ok && token === speakToken) {
        return speakTts(lines.join(' '), rate, slow, token);
      }
      if (pauseMs) await delay(pauseMs);
      if (token !== speakToken) return false;
    }
    return true;
  })();
}

export function stopSpeak() {
  speakToken += 1;
  if (currentAudio) {
    try {
      currentAudio.pause();
    } catch (e) {
      /* ignore */
    }
    currentAudio = null;
  }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

export function AudioButton({ text, label = 'கேளுங்கள்', rate = 0.85, slow = false, small = false }) {
  const [state, setState] = useState('idle');
  const runId = useRef(0);

  const play = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (state === 'speaking') {
      runId.current += 1;
      stopSpeak();
      setState('idle');
      return;
    }
    const id = ++runId.current;
    setState('speaking');
    const done = await speak(text, { rate, slow });
    if (id === runId.current) setState(done ? 'done' : 'idle');
  };

  const icon = state === 'speaking' ? 'pause' : state === 'done' ? 'play' : slow ? 'clock' : 'volume';
  const word = state === 'speaking' ? 'நிறுத்து' : state === 'done' ? 'மீண்டும் கேள்' : slow ? 'மெதுவாகக் கேள்' : label;
  const hint =
    state === 'speaking' ? 'நிறுத்து' : state === 'done' ? 'மீண்டும் கேளுங்கள்' : state === 'idle' && slow ? 'மெதுவான உச்சரிப்பு' : label;

  return (
    <button className={`btn btn-ghost${small ? ' btn-sm' : ''}`} onClick={play} title={hint}>
      <Icon name={icon} size={16} />
      {word}
    </button>
  );
}

export function SlowAudioButton({ text, rate = 0.85 }) {
  return <AudioButton text={text} rate={rate} slow label="மெதுவாகக் கேள்" />;
}

/* ---------- Favorites ---------- */
export function FavoriteButton({ number, small = false }) {
  const [faved, setFaved] = useState(() => isFavorite(number));
  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleFavorite(number);
    setFaved(next.includes(Number(number)));
  };
  return (
    <button
      className={`icon-btn${faved ? ' faved' : ''}${small ? ' btn-sm' : ''}`}
      onClick={toggle}
      title={faved ? 'விருப்பத்திலிருந்து நீக்கு' : 'விருப்பு சேர்'}
      aria-label="favorite"
    >
      <Icon name={faved ? 'heart-fill' : 'heart'} size={17} />
    </button>
  );
}

/* ---------- Share ---------- */
export function ShareButton({ kural, small = false, labelOnly = false }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/kural/${kural.number}`;
  const text = `குறள் ${kural.number} — ${kural.line1} ${kural.line2}\n${url}`;

  const share = async (e) => {
    e.preventDefault();
    if (navigator.share) {
      try {
        await navigator.share({ title: 'குறளகம்', text: text, url });
      } catch (err) {
        /* cancelled */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      window.prompt('இணைப்பை நகலெடுக்க: ', url);
    }
  };

  const label = copied ? 'நகலாயிற்று' : 'பகிர்';
  return (
    <button className={`btn btn-ghost${small ? ' btn-sm' : ''}`} onClick={share} title="பகிர்">
      <Icon name={copied ? 'check' : 'share'} size={16} />
      {label}
    </button>
  );
}

/* ---------- Kural verse ---------- */
function wordPills(text) {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((w, i) => (
      <span className="vword" key={i}>
        {w}
      </span>
    ));
}

export function Verse({ kural, large = false }) {
  const lines = (
    <>
      <span className="l1">{large ? wordPills(kural.line1) : kural.line1}</span>
      <span className="l2">{large ? wordPills(kural.line2) : kural.line2}</span>
    </>
  );
  if (!large) return <p className="verse">{lines}</p>;
  return (
    <div className="leaf-wrap">
      <img className="leaf-img" src="/olaichuvadi.png" alt="" aria-hidden="true" draggable={false} loading="lazy" />
      <p className="verse verse-large leaf-verse">{lines}</p>
    </div>
  );
}

/* ---------- Menu (tabs) ---------- */
export function Tabs({ items, children }) {
  const [active, setActive] = useState(items[0].key);
  const current = items.find((i) => i.key === active) || items[0];
  return (
    <div>
      <div className="tabs" role="tablist">
        {items.map((i) => (
          <button
            key={i.key}
            role="tab"
            aria-selected={active === i.key}
            className={`tab${active === i.key ? ' active' : ''}`}
            onClick={() => setActive(i.key)}
          >
            {i.label}
          </button>
        ))}
      </div>
      <div className="tab-panel" role="tabpanel">
        {typeof children === 'function' ? children(current) : children}
      </div>
    </div>
  );
}

/* ---------- Kural row (lists) ---------- */
export function KuralRow({ k }) {
  return (
    <Link to={`/kural/${k.number}`} className="kural-row">
      <span className="no">{String(k.number).padStart(4, '0')}</span>
      <span className="lines">
        <span className="t">
          {k.line1} {k.line2}
        </span>
        {k.englishTranslation && <span className="m"> — {k.englishTranslation}</span>}
      </span>
      <span className="chip">{k.chapterName}</span>
    </Link>
  );
}

/* ---------- Paal card ---------- */
export function PaalCard({ paal, icon, to, note }) {
  const cls = paal.number === 1 ? 'paal-arathu' : paal.number === 2 ? 'paal-porul' : 'paal-kamam';
  return (
    <Link to={to} className={`card paal-card ${cls}`}>
      <span className="paal-icon">
        {/^[a-z-]+$/.test(icon) ? <Icon name={icon} size={34} /> : icon}
      </span>
      <h3>{paal.name}</h3>
      <p>
        {paal.chapterCount} அதிகாரங்கள் · {paal.chapterCount * 10} குறள்கள் · {note}
      </p>
      <span className="go">உள்ளே செல்ல →</span>
    </Link>
  );
}