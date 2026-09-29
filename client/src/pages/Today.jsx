import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDateKeys, todayKuralNumber } from '../api';
import { Loading, PaalBadge } from '../components';
import { Verse, FavoriteButton, ShareButton, Tabs, UraiList } from '../components/Kural';
import Icon from '../components/Icon';
import Seo, { BASE_URL, SITE_NAME, breadcrumbJsonLd } from '../seo';

export default function Today() {
  const number = todayKuralNumber();
  const [kural, setKural] = useState(null);
  const [error, setError] = useState(null);
  const kuralUrl = `${BASE_URL}/kural/${kural ? kural.number : number}`;
  const shareText = `குறள் ${kural ? kural.number : number} — ${kural ? `${kural.line1} ${kural.line2}` : ''}\n${kuralUrl}`;
  const shareLinks = [
    { name: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(shareText)}` },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(kuralUrl)}` },
    { name: 'Instagram', href: `https://www.instagram.com/?url=${encodeURIComponent(shareText)}` },
  ];

  useEffect(() => {
    api(`/kurals/${number}`).then((d) => setKural(d.kural)).catch((e) => setError(e.message));
  }, [number]);

  if (error) return <div className="container"><p className="notice">{error}</p></div>;
  if (!kural) return <Loading />;

  return (
    <div>
      <Seo
        title={`தினம் ஒரு குறள் — குறள் ${kural.number} | ${kural.chapterName}`}
        description={`தினம்தோறும் ஒரு திருக்குறள்: குறள் ${kural.number} “${kural.line1} ${kural.line2}”. எளிய பொருளும் விளக்கமும் உரைகளுடன் — குறளகம்.`}
        canonical={`${BASE_URL}/today`}
        jsonLd={[
          breadcrumbJsonLd([
            { name: SITE_NAME, url: `${BASE_URL}/` },
            { name: 'தினம் ஒரு குறள்', url: `${BASE_URL}/today` },
          ]),
        ]}
      />
      <div className="page-head">
        <h1>தினம் ஒரு குறள்</h1>
        <p>இன்றைய குறள் — {formatDateKeys()}</p>
      </div>

      <section className="section">
        <div className="container">
          <div className="today-wrap">
            <div className="card fam-card today-star">
              <div className="fam-head">
                <span className="tag">இன்றைய குறள்</span>
                <span className="fam-num">{kural.number}</span>
              </div>
              <Verse kural={kural} large />
              <p className="muted fam-meta" style={{ marginTop: 12 }}>
                <Link to={`/chapters/${kural.chapterNumber}`}>
                  {kural.chapterNumber}. {kural.chapterName}
                </Link>
                <span> · </span>
                {kural.paalName}
              </p>
              <p className="meaning-block fam-meaning" style={{ maxWidth: 'none' }}>
                {kural.simpleMeaning || kural.meaning}
              </p>

              <div className="today-actions">
                <Link to={`/kural/${kural.number}`} className="btn btn-primary">
                  விளக்கத்தைப் பார்க்க →
                </Link>
                <ShareButton kural={kural} />
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
              <div className="card" style={{ padding: 18 }}>
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
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-3">
            <Tabs
              items={[
                { key: 'en', label: 'English Meaning' },
                ...(kural.urais ? [{ key: 'urais', label: 'உரைகள்' }] : []),
                ...(kural.wordMeanings && kural.wordMeanings.length ? [{ key: 'words', label: 'சொற்பொருள்' }] : []),
              ]}
            >
              {(tab) =>
                tab.key === 'en' ? (
                  <div className="english-block">
                    <p>{kural.englishTranslation}</p>
                    {kural.couplet && <p>{kural.couplet}</p>}
                  </div>
                ) : tab.key === 'urais' ? (
                  <UraiList urais={kural.urais} />
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