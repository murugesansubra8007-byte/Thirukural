import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { Loading, EmptyState, PaalBadge } from '../components';
import Seo, { BASE_URL, SITE_NAME, breadcrumbJsonLd } from '../seo';

const PAALS = {
  ara: {
    number: 1,
    name: 'அறத்துப்பால்',
    transliteration: 'Araththuppaal',
    translation: 'Virtue',
    icon: 'scale',
    counts: '38 அதிகாரங்கள் · 380 குறள்கள்',
    intro:
      'வாழ்க்கையின் அடித்தளமான அறம். இல்லறம், துறவறம் என இரு நிலைகளில் — கடவுள் வாழ்த்து முதல் ஊழ் வரை — 38 அதிகாரங்களில் 380 குறள்கள் வகுக்கின்றன.',
  },
  porul: {
    number: 2,
    name: 'பொருட்பால்',
    transliteration: 'Porutpaal',
    translation: 'Wealth',
    icon: 'gem',
    counts: '70 அதிகாரங்கள் · 700 குறள்கள்',
    intro:
      'மன்னன், அமைச்சு, நாடு, நட்பு, பொருள் ஆதாரம் என அரசியல்-பொருளியல் வாழ்க்கையின் நுட்பங்களை 70 அதிகாரங்களில் 700 குறள்கள் விளக்குகின்றன.',
  },
  kamam: {
    number: 3,
    name: 'காமத்துப்பால்',
    transliteration: 'Kaamaththuppaal',
    translation: 'Love',
    icon: 'heart',
    counts: '25 அதிகாரங்கள் · 250 குறள்கள்',
    intro:
      'காதலும் மனைவியும் இல்லற இன்பமும் — வாழ்க்கையின் இனிமையான பரிமாணத்தை 25 அதிகாரங்களில் 250 குறள்கள் பேசுகின்றன.',
  },
};

export default function PaalDetail() {
  const { key } = useParams();
  const meta = PAALS[key] || PAALS.ara;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api(`/chapters?paal=${meta.number}`).then(setData).catch((e) => setError(e.message));
  }, [meta.number]);

  if (error) return <EmptyState icon="book-open" title="பால் கிடைக்கவில்லை" note={error} />;
  if (!data) return <Loading />;

  const { chapters, total } = data;
  const next = Object.keys(PAALS);
  const others = next.filter((k) => k !== key);

  return (
    <div>
      <Seo
        title={`${meta.name} — 1330 குறள்களின் ஒரு பகுதி | திருக்குறள்`}
        description={`${meta.name} (${meta.translation}): ${meta.counts}. ${meta.intro} எளிய பொருள், விளக்கம் மற்றும் தமிழ் உரைகளுடன் அனைத்து குறள்களையும் குறளகத்தில் படிக்கலாம்.`}
        canonical={`${BASE_URL}/paal/${key}`}
        jsonLd={[
          breadcrumbJsonLd([
            { name: SITE_NAME, url: `${BASE_URL}/` },
            { name: 'அதிகாரங்கள்', url: `${BASE_URL}/chapters` },
            { name: meta.name, url: `${BASE_URL}/paal/${key}` },
          ]),
        ]}
      />
      <div className="page-head">
        <div className="breadcrumbs" style={{ justifyContent: 'center' }}>
          <Link to="/">முகப்பு</Link>
          <span>›</span>
          <Link to="/chapters">அதிகாரங்கள்</Link>
          <span>›</span>
          <span>{meta.name}</span>
        </div>
        <h1>{meta.name}</h1>
        <p>
          வள்ளுவத்தின் மூன்று பால்களில் ஒன்று · <em>{meta.translation}</em>
        </p>
        <div className="mt-2" style={{ display: 'flex', justifyContent: 'center' }}>
          <PaalBadge name={meta.name} />
        </div>
        <p className="mt-2 muted" style={{ maxWidth: 760, marginLeft: 'auto', marginRight: 'auto', fontSize: 15 }}>
          {meta.intro}
        </p>
      </div>

      <section className="section">
        <div className="container">
          <p className="muted mb-2">{total} அதிகாரங்கள் · {meta.counts}</p>
          <div className="grid grid-2">
            {chapters.map((c) => (
              <div key={c.number} className="card chapter-card">
                <span className="chapter-num">{String(c.number).padStart(2, '0')}</span>
                <div className="chapter-body">
                  <h3>
                    <Link to={`/chapters/${c.number}`}>{c.name}</Link>
                  </h3>
                  <div className="chapter-meta">
                    <span>குறள்கள் {c.start}–{c.end}</span>
                    <span className="dot" />
                    <span>{c.kuralCount} குறள்கள்</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pager">
            <Link to="/chapters" className="btn btn-outline">
              அதிகாரங்கள் பட்டியல் ←
            </Link>
            {others.map((k) => (
              <Link key={k} to={`/paal/${k}`} className="btn btn-ghost">
                {PAALS[k].name} →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}