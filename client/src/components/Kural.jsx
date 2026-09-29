import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { isFavorite, toggleFavorite } from '../api';
import Icon from './Icon';
import { assetUrl } from '../cdn';

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
      <img className="leaf-img" src={assetUrl('/olaichuvadi.png')} alt="" aria-hidden="true" draggable={false} loading="lazy" />
      <p className="verse verse-large leaf-verse">{lines}</p>
    </div>
  );
}

/* ---------- Urai (commentaries) ---------- */
const URAI_ORDER = [
  { key: 'manakkudavar', name: 'மணக்குடவர்', tag: 'மிகப் பழைய மரபுச் சுவடி · 10ம் நூற்றாண்டு', chip: 'ம', color: 'stone' },
  { key: 'parimelazhagar', name: 'பரிமேலழகர்', tag: 'முழுமையான மரபு உரை · 13ம் நூற்றாண்டு', chip: 'ப', color: 'terracotta' },
  { key: 'varadharasanar', name: 'மு. வரதராசனார்', tag: 'செந்தமிழ் தெளிவுரை · 20ம் நூற்றாண்டு', chip: 'வ', color: 'leaf' },
  { key: 'karunanidhi', name: 'கலைஞர்', tag: 'எளிய நடை உரை · 20ம் நூற்றாண்டு', chip: 'க', color: 'gold' },
];

export function UraiList({ urais }) {
  const present = URAI_ORDER.filter((u) => urais && urais[u.key]);
  const [open, setOpen] = useState(() => (present.length ? new Set([present[0].key]) : new Set()));
  if (!present.length) return null;

  const allOpen = open.size === present.length;

  const toggle = (key) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const toggleAll = () => setOpen(allOpen ? new Set() : new Set(present.map((u) => u.key)));

  return (
    <div className="urai-list">
      <div className="urai-toolbar">
        <span>
          <b>உரையாசிரியர்கள்</b> · {present.length} வகை
        </span>
        <button className="btn btn-ghost btn-sm" onClick={toggleAll}>
          <Icon name="layers" size={14} />
          {allOpen ? 'எல்லாம் மடக்கு' : 'எல்லாம் விரி'}
        </button>
      </div>
      {present.map((u) => {
        const isOpen = open.has(u.key);
        return (
          <div className={`urai-block urai-${u.color}${isOpen ? ' open' : ''}`} key={u.key}>
            <button className="urai-head" onClick={() => toggle(u.key)} aria-expanded={isOpen}>
              <span className="urai-chip">{u.chip}</span>
              <span className="urai-titles">
                <span className="urai-name">{u.name}</span>
                <span className="urai-tag">{u.tag}</span>
                {!isOpen && <span className="urai-preview">{urais[u.key].slice(0, 72)}…</span>}
              </span>
              <Icon name="chevron-down" className="urai-chev" size={18} />
            </button>
            <div className="urai-body">
              <div className="urai-body-inner">
                <p>{urais[u.key]}</p>
              </div>
            </div>
          </div>
        );
      })}
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