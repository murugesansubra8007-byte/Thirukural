import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDateKeys, todayKuralNumber } from '../api';
import { Loading, PaalBadge } from '../components';
import { Verse, AudioButton, SlowAudioButton, FavoriteButton, ShareButton, Tabs } from '../components/Kural';
import Icon from '../components/Icon';

export default function Today() {
  const [kural, setKural] = useState(null);
  const [error, setError] = useState(null);
  const number = todayKuralNumber();

  useEffect(() => {
    api(`/kurals/${number}`).then((d) => setKural(d.kural)).catch((e) => setError(e.message));
  }, [number]);

  if (error) return <div className="container"><p className="notice">{error}</p></div>;
  if (!kural) return <Loading />;

  const line = `${kural.line1}\n${kural.line2}`;
  const shareText = `குறள் ${kural.number} — ${kural.line1} ${kural.line2}\nhttps://kuralagam.in/kural/${kural.number}`;
  const shareLinks = [
    { name: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(shareText)}` },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://kuralagam.in/kural/${kural.number}`)}` },
    { name: 'Instagram', href: `https://www.instagram.com/?url=${encodeURIComponent(shareText)}` },
  ];

  return (
    <div>
      <div className="page-head">
        <h1>தினம் ஒரு குறள்</h1>
        <p>இன்றைய குறள் — {formatDateKeys()}</p>
      </div>

      <section className="section">
        <div className="container">
          <div className="today-wrap">
            <div className="today-card">
              <div className="today-date">இன்றைய குறள் · {kural.number}/1330</div>
              <div className="today-kural">
                <Verse kural={kural} large />
              </div>
              <p className="muted" style={{ fontSize: 14 }}>
                <Link to={`/chapters/${kural.chapterNumber}`}>{kural.chapterName}</Link>
                <span> · </span>
                {kural.paalName}
              </p>

              <div className="today-actions">
                <Link to={`/kural/${kural.number}`} className="btn btn-primary">
                  விளக்கத்தைப் பார்க்க →
                </Link>
                <ShareButton kural={kural} />
                <AudioButton text={line} />
              </div>

              <div className="share-row">
                <span>பகிர்:</span>
                {shareLinks.map((s) => (
                  <a key={s.name} className="share-btn" href={s.href} target="_blank" rel="noreferrer">
                    {s.name}
                  </a>
                ))}
                <CopyButton text={shareText} />
              </div>
            </div>

            <aside>
              <div className="kural-slab" style={{ borderLeftColor: 'var(--terracotta)' }}>
                <h3>எளிய பொருள்</h3>
                <p className="meaning-block" style={{ fontSize: 15 }}>{kural.simpleMeaning || kural.meaning}</p>
              </div>
              <div className="card mt-2" style={{ padding: 18 }}>
                <h3 style={{ fontSize: 17 }}>குறள் விவரங்கள்</h3>
                <p className="muted" style={{ fontSize: 14, marginBottom: 6 }}>
                  <b>அதிகாரம்:</b>{' '}
                  <Link to={`/chapters/${kural.chapterNumber}`}>{kural.chapterNumber} — {kural.chapterName}</Link>
                </p>
                <p className="muted" style={{ fontSize: 14, marginBottom: 6 }}>
                  <b>பால்:</b> <PaalBadge name={kural.paalName} />
                </p>
                <p className="muted" style={{ fontSize: 14, marginBottom: 14 }}>
                  <b>எண்:</b> {kural.number} / 1330
                </p>
                <div className="row">
                  <FavoriteButton number={kural.number} />
                  <SlowAudioButton text={line} />
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-3">
            <Tabs
              items={[
                { key: 'en', label: 'English Meaning' },
                ...(kural.wordMeanings && kural.wordMeanings.length ? [{ key: 'words', label: 'சொற்பொருள்' }] : []),
              ]}
            >
              {(tab) =>
                tab.key === 'en' ? (
                  <div className="english-block">
                    <p>{kural.englishTranslation}</p>
                    {kural.couplet && <p>{kural.couplet}</p>}
                  </div>
                ) : (
                  <table className="word-table">
                    <thead>
                      <tr><th>சொல்</th><th>பொருள்</th></tr>
                    </thead>
                    <tbody>
                      {kural.wordMeanings.map((w, i) => (
                        <tr key={i}>
                          <td style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}>{w.word}</td>
                          <td>{w.meaning}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              }
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}

function CopyButton({ text }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch (e) {
      window.prompt('நகலெடுக்க: ', text);
    }
  };
  return (
    <button className="share-btn" onClick={copy} disabled={done}>
      <Icon name={done ? 'check' : 'share'} size={15} /> {done ? 'நகலாயிற்று' : 'நகலெடு'}
    </button>
  );
}