import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { Loading, EmptyState, SectionHead, PageHead } from '../components';
import { KuralRow } from '../components/Kural';

export function Categories() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api('/categories').then((d) => setData(d)).catch(() => setData({ categories: [] }));
  }, []);

  if (!data) return <Loading />;

  return (
    <div>
      <PageHead title="வகைகள் / வாழ்க்கை சார்ந்த தேடல்" note="உங்களுக்கு தேவையான குறளை தேர்வு செய்யுங்கள்." />
      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {data.categories.map((c) => (
              <Link key={c.id} to={`/categories/${c.slug}`} className="card category-card">
                <span className="category-emoji">{c.emoji}</span>
                <h3>{c.label}</h3>
                <div className="tag-row">
                  {(c.taglines || []).map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
                <p className="muted" style={{ fontSize: 13.5, margin: '6px 0 0' }}>
                  {c.kuralCount} குறள்கள் · {c.chapterNumbers?.length} அதிகாரங்கள்
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function CategoryDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api(`/categories/${encodeURIComponent(slug)}`).then(setData).catch((e) => setErr(e.message));
  }, [slug]);

  if (err) return <EmptyState icon="search" title="வகை கிடைக்கவில்லை" note={err} />;
  if (!data) return <Loading />;

  const { category, kurals } = data;

  return (
    <div>
      <PageHead
        title={`${category.emoji} ${category.label}`}
        note={`${kurals.length} குறள்கள் · ${category.chapterNumbers?.length || 0} அதிகாரங்கள் வழியே`}
      />
      <section className="section">
        <div className="container">
          <div className="tag-row mb-2">
            {(category.taglines || []).map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
          {kurals.map((k, i) => (
            <KuralRow key={k.number || i} k={k} />
          ))}

          <div className="pager">
            <Link to="/categories" className="btn btn-outline">← அனைத்து வகைகள்</Link>
          </div>
        </div>
      </section>
    </div>
  );
}