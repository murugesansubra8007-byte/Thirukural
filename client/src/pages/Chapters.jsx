import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { Loading, PageHead, PaalBadge } from '../components';
import Seo, { BASE_URL } from '../seo';

export default function Chapters() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState(null);
  const activePaal = params.get('paal') || '';

  useEffect(() => {
    api(`/chapters${activePaal ? `?paal=${activePaal}` : ''}`)
      .then(setData)
      .catch(() => setData({ chapters: [] }));
  }, [activePaal]);

  if (!data) return <Loading />;

  const paalTabs = [
    { v: '', label: 'அனைத்தும்' },
    { v: '1', label: 'அறத்துப்பால்' },
    { v: '2', label: 'பொருட்பால்' },
    { v: '3', label: 'காமத்துப்பால்' },
  ];

  return (
    <div>
      <Seo
        title="133 அதிகாரங்கள் | திருக்குறள்"
        description="திருக்குறளின் 133 அதிகாரங்களின் முழு பட்டியல் — ஒவ்வொன்றிலும் 10 குறள்கள். அறத்துப்பால், பொருட்பால், காமத்துப்பால் என பால் வாரியாக தேர்ந்தெடுத்து படிக்கலாம்."
        canonical={`${BASE_URL}/chapters`}
      />
      <PageHead title="133 அதிகாரங்கள்" note="ஒவ்வொரு அதிகாரமும் 10 குறள்கள் — மொத்தம் 1330 குறள்கள்." />

      <section className="section">
        <div className="container">
          <div className="filter-row" role="tablist">
            {paalTabs.map((t) => (
              <button
                key={t.v}
                className={`btn btn-sm ${activePaal === t.v ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setParams(t.v ? { paal: t.v } : {})}
              >
                {t.label}
              </button>
            ))}
          </div>

          <p className="muted mb-2">
            {data.total} அதிகாரங்கள் காட்டப்படுகின்றன
          </p>

          <div className="grid grid-2">
            {data.chapters.map((c) => (
              <div key={c.number} className="card chapter-card">
                <span className="chapter-num">{String(c.number).padStart(2, '0')}</span>
                <div className="chapter-body">
                  <h3>
                    <Link to={`/chapters/${c.number}`}>{c.name}</Link>
                  </h3>
                  <div className="chapter-meta">
                    <span>குறள்கள் {c.start}–{c.end}</span>
                    <span className="dot" />
                    <PaalBadge name={c.paalName} />
                    <span className="dot" />
                    <span>{c.kuralCount} குறள்கள்</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}