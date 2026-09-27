import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { Loading, EmptyState, PaalBadge } from '../components';
import { KuralRow } from '../components/Kural';

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
      <div className="page-head">
        <div className="breadcrumbs" style={{ justifyContent: 'center' }}>
          <Link to="/chapters">அதிகாரங்கள்</Link>
          <span>›</span>
          <span>{chapter.number}</span>
        </div>
        <h1>அதிகாரம் {chapter.number} — {chapter.name}</h1>
        <p>
          குறள்கள் {chapter.start}–{chapter.end} · {paal?.name}
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