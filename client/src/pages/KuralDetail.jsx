import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { Loading, EmptyState, PaalBadge } from '../components';
import { Verse, AudioButton, SlowAudioButton, FavoriteButton, ShareButton, Tabs } from '../components/Kural';
import Icon from '../components/Icon';

export default function KuralDetail() {
  const { number } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(null);
    setError(null);
    api(`/kurals/${number}`).then(setData).catch((e) => setError(e.message));
  }, [number]);

  useEffect(() => {
    if (!data) return;
    try {
      const visited = JSON.parse(localStorage.getItem('kg_visited') || '[]');
      localStorage.setItem('kg_visited', JSON.stringify([...visited, data.kural.number].slice(-50)));
    } catch (e) {
      /* ignore */
    }
  }, [data]);

  if (error) return <EmptyState icon="file-text" title="குறள் கிடைக்கவில்லை" note={error} />;
  if (!data) return <div className="container"><Loading /></div>;

  const { kural, prev, next } = data;
  const line = `${kural.line1}\n${kural.line2}`;

  return (
    <div>
      <div className="page-head">
        <div className="breadcrumbs" style={{ justifyContent: 'center' }}>
          <Link to="/explore">குறள்கள்</Link>
          <span>›</span>
          <Link to={`/chapters/${kural.chapterNumber}`}>{kural.chapterName}</Link>
          <span>›</span>
          <span>குறள் {kural.number}</span>
        </div>
        <h1>குறள் {kural.number}</h1>
        <p>
          <Link to={`/chapters/${kural.chapterNumber}`} style={{ color: '#e9dcb8' }}>
            {kural.chapterName}
          </Link>
          <span> · </span>
          {kural.paalName}
        </p>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="kural-slab">
            <Verse kural={kural} large />
            <div className="paala-rule">
              <span className="rule-line" />
              <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <PaalBadge name={kural.paalName} />
                <span className="dot" />
                {kural.chapterName}
              </span>
            </div>
            <div className="row mt-2" style={{ justifyContent: 'center' }}>
              <FavoriteButton number={kural.number} />
              <ShareButton kural={kural} />
              <AudioButton text={line} />
              <SlowAudioButton text={line} />
            </div>
          </div>

          <div className="mt-3">
            <Tabs
              items={[
                { key: 'simple', label: 'எளிய பொருள்' },
                { key: 'detail', label: 'விளக்கம்' },
                { key: 'en', label: 'English' },
                ...(kural.wordMeanings && kural.wordMeanings.length ? [{ key: 'words', label: 'சொற்பொருள்' }] : []),
              ]}
            >
              {(tab) => {
                if (tab.key === 'simple')
                  return <div className="meaning-block"><p>{kural.simpleMeaning || kural.meaning}</p></div>;
                if (tab.key === 'detail')
                  return (
                    <div className="meaning-block">
                      <p><b>விளக்கம்:</b> {kural.meaning}</p>
                      <p><b>சுருக்கம்:</b> {kural.abbreviationMeaning}</p>
                      {kural.explanation && (
                        <p><b>விரிவு:</b> {kural.explanation}</p>
                      )}
                    </div>
                  );
                if (tab.key === 'en')
                  return (
                    <div className="english-block">
                      <p>{kural.englishTranslation}</p>
                      {kural.couplet && <p>{kural.couplet}</p>}
                    </div>
                  );
                return (
                  <table className="word-table">
                    <thead>
                      <tr>
                        <th>சொல்</th>
                        <th>பொருள்</th>
                      </tr>
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
                );
              }}
            </Tabs>
          </div>

          <div className="pager mt-3">
            <Link to={`/kural/${prev.number}`} className="btn btn-ghost">
              <Icon name="chevron-left" size={16} /> குறள் {prev.number}
            </Link>
            <Link to="/explore" className="btn btn-outline">
              <Icon name="search" size={16} /> தேடு
            </Link>
            <Link to={`/kural/${next.number}`} className="btn btn-ghost">
              குறள் {next.number} <Icon name="chevron-right" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}