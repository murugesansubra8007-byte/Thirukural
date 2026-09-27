import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { isFavorite, toggleFavorite } from '../api';
import Icon from './Icon';

/* ---------- Audio (Web Speech API, Tamil) ---------- */
export function speak(text, { rate = 0.85, slow = false } = {}) {
  if (!('speechSynthesis' in window)) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const ta = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('ta'));
  if (ta) u.voice = ta;
  u.lang = ta ? ta.lang : 'ta-IN';
  u.rate = slow ? rate * 0.72 : rate;
  u.pitch = 0.95;
  window.speechSynthesis.speak(u);
  return true;
}

export function AudioButton({ text, label = 'கேளுங்கள்', rate = 0.85, slow = false, small = false }) {
  const [speaking, setSpeaking] = useState(false);
  const play = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (speaking) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const ok = speak(text, { rate, slow });
    setSpeaking(ok);
    if (ok && 'speechSynthesis' in window) {
      const done = () => setSpeaking(false);
      window.speechSynthesis.addEventListener('end', done, { once: true });
      window.speechSynthesis.addEventListener('error', done, { once: true });
    }
  };
  return (
    <button className={`btn btn-ghost${small ? ' btn-sm' : ''}`} onClick={play} title={label}>
      <Icon name={speaking ? 'pause' : slow ? 'clock' : 'volume'} size={16} />
      {speaking ? 'நிறுத்து' : slow ? 'மெதுவாகக் கேள்' : 'கேளுங்கள்'}
    </button>
  );
}

export function SlowAudioButton({ text, rate = 0.85 }) {
  return <AudioButton text={text} rate={rate} slow label="மெதுவான உச்சரிப்பு" />;
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
export function Verse({ kural, large = false }) {
  return (
    <p className={`verse${large ? ' verse-large' : ''}`}>
      <span className="l1">{kural.line1}</span>
      <span className="l2">{kural.line2}</span>
    </p>
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