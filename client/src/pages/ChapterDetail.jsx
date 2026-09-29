import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { Loading, EmptyState, PaalBadge } from '../components';
import { KuralRow } from '../components/Kural';
import Seo, { BASE_URL, SITE_NAME, PAAL_ROUTE, breadcrumbJsonLd } from '../seo';

export default function ChapterDetail() {
  const { number } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api(`/chapters/${number}`).then(setData).catch((e) => setError(e.message));
  }, [number]);

  if (error) return <EmptyState icon="book-open" title="அதிகாரம் கிடைக்கவில்லை" note={error} />;
  if (!data) return <Loading />;

  const { chapter, paal, kurals, prevChapter, nextChapter } = data;

  return (
    <div>
      <Seo
        title={`அதிகாரம் ${chapter.number} — ${chapter.name} | திருக்குறள்`}
        description={`திருக்குறள் அதிகாரம் ${chapter.number} “${chapter.name}” (குறள்கள் ${chapter.start}–${chapter.end}) ${paal?.name || ''}. 10 குறள்களின் எளிய பொருள், விளக்கம் மற்றும் தமிழ் உரைகளுடன் படிக்கலாம்.`}
        canonical={`${BASE_URL}/chapters/${chapter.number}`}
        jsonLd={[
          breadcrumbJsonLd([
            { name: SITE_NAME, url: `${BASE_URL}/` },
            { name: 'அதிகாரங்கள்', url: `${BASE_URL}/chapters` },
            {
              name: `அதிகாரம் ${chapter.number} — ${chapter.name}`,
              url: `${BASE_URL}/chapters/${chapter.number}`,
            },
          ]),
        ]}
      />
      <div className="page-head">
        <div className="breadcrumbs" style={{ justifyContent: 'center' }}>
          <Link to="/chapters">அதிகாரங்கள்</Link>
          <span>›</span>
          <span>{chapter.number}</span>
        </div>
        <h1>அதிகாரம் {chapter.number} — {chapter.name}</h1>
        <p>
          குறள்கள் {chapter.start}–{chapter.end} ·{' '}
          {paal?.name && (
            <Link to={`/paal/${PAAL_ROUTE[paal.name] || 'porul'}`} style={{ color: '#e9dcb8' }}>
              {paal.name}
            </Link>
          )}
          {chapter.translation && ` · “${chapter.translation}”`}
        </p>
        <div className="mt-2" style={{ display: 'flex', justifyContent: 'center' }}>
          <PaalBadge name={paal?.name} />
        </div>
      </div>

      <section className="section">
        <div className="container">
          {kurals.map((k) => (
            <KuralRow key={k.number} k={k} />
          ))}

          <div className="pager">
            {prevChapter ? (
              <Link to={`/chapters/${prevChapter.number}`} className="btn btn-ghost">
                ← முந்தைய அதிகாரம் · {prevChapter.name}
              </Link>
            ) : (
              <span />
            )}
            <Link to="/chapters" className="btn btn-outline">
              அதிகார பட்டியல்
            </Link>
            {nextChapter ? (
              <Link to={`/chapters/${nextChapter.number}`} className="btn btn-ghost">
                அடுத்த அதிகாரம் · {nextChapter.name} →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}