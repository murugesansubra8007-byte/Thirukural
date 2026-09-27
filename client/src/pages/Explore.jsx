import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { Loading, PageHead, EmptyState } from '../components';
import { KuralRow } from '../components/Kural';
import Icon from '../components/Icon';

const DEBOUNCE = 350;

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const paal = params.get('paal') || '';
  const chapter = params.get('chapter') || '';
  const from = params.get('from') || '';
  const to = params.get('to') || '';

  const [query, setQuery] = useState(q);
  const [result, setResult] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    api('/chapters').then((d) => setChapters(d.chapters)).catch(() => {});
  }, []);

  const update = (key, val) => {
    const next = new URLSearchParams(params);
    if (val) next.set(key, val);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => chapters.filter((c) => !paal || String(c.paal) === paal), [chapters, paal]);

  useEffect(() => {
    setLoading(true);
    clearTimeout(timer.current);

    // Search text takes priority
    if (query && query.trim().length > 0) {
      timer.current = setTimeout(() => {
        api(`/kurals/search?q=${encodeURIComponent(query.trim())}`)
          .then((d) => setResult({ mode: 'search', ...d }))
          .catch(() => setResult({ mode: 'search', count: 0, results: [] }))
          .finally(() => setLoading(false));
      }, DEBOUNCE);
      return;
    }

    const qs = new URLSearchParams();
    if (paal) qs.set('paal', paal);
    if (chapter) qs.set('chapter', chapter);
    if (from && to) {
      qs.set('from', from);
      qs.set('to', to);
    }
    timer.current = setTimeout(() => {
      api(`/kurals?${qs.toString()}`)
        .then((d) => setResult({ mode: 'filter', ...d }))
        .catch(() => setResult({ mode: 'filter', total: 0, kurals: [] }))
        .finally(() => setLoading(false));
    }, DEBOUNCE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, paal, chapter, from, to]);

  const items = result?.mode === 'search' ? result.results : result?.kurals || [];

  return (
    <div>
      <PageHead title="குறள்களைத் தேடு" note="குறள் எண், அதிகாரம், தமிழ்ச் சொல் அல்லது ஆங்கிலச் சொல்லில் தேடலாம்." />

      <section className="section section-tight">
        <div className="container">
          <div className="search-bar mb-2">
            <span className="search-icon"><Icon name="search" size={17} /></span>
            <input
              type="search"
              autoFocus
              placeholder="குறள், அதிகாரம் அல்லது சொல் தேடுங்கள்..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && query.trim() && update('q', query.trim())}
            />
            {query && (
              <button className="clear" onClick={() => setQuery('')} aria-label="துடை">
                <Icon name="x" size={14} />
              </button>
            )}
          </div>

          <div className="filter-row">
            <select className="select" value={paal} onChange={(e) => { update('paal', e.target.value); update('chapter', ''); }}>
              <option value="">எல்லா பால்களும்</option>
              <option value="1">அறத்துப்பால்</option>
              <option value="2">பொருட்பால்</option>
              <option value="3">காமத்துப்பால்</option>
            </select>

            <select className="select" value={chapter} onChange={(e) => update('chapter', e.target.value)}>
              <option value="">எல்லா அதிகாரங்களும்</option>
              {list.map((c) => (
                <option key={c.number} value={c.number}>
                  {String(c.number).padStart(2, '0')} — {c.name}
                </option>
              ))}
            </select>

            <span className="muted" style={{ fontSize: 13 }}>குறள் எண்:</span>
            <input
              className="input"
              style={{ width: 96 }}
              type="number"
              min="1"
              max="1330"
              placeholder="முதல்"
              value={from}
              onChange={(e) => update('from', e.target.value)}
            />
            <span className="muted">–</span>
            <input
              className="input"
              style={{ width: 96 }}
              type="number"
              min="1"
              max="1330"
              placeholder="கடைசி"
              value={to}
              onChange={(e) => update('to', e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          {loading ? (
            <Loading />
          ) : result ? (
            items.length === 0 ? (
              <EmptyState icon="search" title="முடிவுகள் இல்லை" note="வேறு சொல்லில் முயற்சிக்கவும்." />
            ) : (
              <>
                <p className="muted mb-2">
                  {result.mode === 'search' ? `“${result.query}”` : 'காட்டப்படுவது'} · {result.count} குறள்கள்
                </p>
                {items.map((k, i) => (
                  <KuralRow key={k.number || i} k={k} />
                ))}
              </>
            )
          ) : (
            <EmptyState
              icon="sparkles"
              title="தேடத் தொடங்குங்கள்"
              note="எ.கா., “அன்பு”, “பொறுமை”, ‘wealth’, குறள் எண் 72 — அல்லது அதிகாரத்தைத் தேர்வு செய்க."
            />
          )}
        </div>
      </section>
    </div>
  );
}