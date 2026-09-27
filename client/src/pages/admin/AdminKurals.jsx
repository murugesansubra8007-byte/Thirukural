import React, { useEffect, useRef, useState } from 'react';
import { api } from '../../api';
import Icon from '../../components/Icon';

const FIELDS = [
  ['line1', 'முதல் அடி (Line 1)'],
  ['line2', 'இரண்டாம் அடி (Line 2)'],
  ['simpleMeaning', 'எளிய பொருள் (sp)'],
  ['meaning', 'விளக்கம் (mv)'],
  ['abbreviationMeaning', 'சுருக்கம் (mk)'],
  ['englishTranslation', 'English Translation'],
  ['couplet', 'Couplet (English verse)'],
  ['explanation', 'Explanation'],
  ['audioUrl', 'Audio URL (optional)'],
];

export default function AdminKurals() {
  const [query, setQuery] = useState('1');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);
  const timer = useRef(null);

  const search = (q) => {
    if (!q || !q.trim()) return setResults([]);
    api(`/kurals/search?q=${encodeURIComponent(q.trim())}`)
      .then((d) => setResults(d.results.slice(0, 30)))
      .catch(() => setResults([]));
  };

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const pick = async (number) => {
    const d = await api(`/kurals/${number}`);
    setSelected(d.kural);
    setForm({
      line1: d.kural.line1,
      line2: d.kural.line2,
      simpleMeaning: d.kural.simpleMeaning || '',
      meaning: d.kural.meaning || '',
      abbreviationMeaning: d.kural.abbreviationMeaning || '',
      englishTranslation: d.kural.englishTranslation || '',
      couplet: d.kural.couplet || '',
      explanation: d.kural.explanation || '',
      audioUrl: d.kural.audioUrl || '',
      wordLines: (d.kural.wordMeanings || []).map((w) => `${w.word}|${w.meaning}`).join('\n'),
    });
    setSaved(false);
  };

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    const wordMeanings = (form.wordLines || '')
      .split('\n')
      .map((l) => l.split('|'))
      .filter((p) => p.length === 2 && p[0].trim())
      .map((p) => ({ word: p[0].trim(), meaning: p[1].trim() }));
    await api(`/kurals/${selected.number}`, {
      method: 'PUT',
      body: {
        ...form,
        wordMeanings,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    pick(selected.number);
  };

  return (
    <div>
      <h1 style={{ fontSize: 24 }}>Kurals Management</h1>
      <p className="muted" style={{ marginTop: -6 }}>1330 குறள்களின் பொருள், மொழிபெயர்ப்பு, சொற்பொருள் நிர்வகிப்பு</p>

      <div className="grid grid-2 mt-2" style={{ alignItems: 'start' }}>
        <div className="card admin-card">
          <h2 style={{ fontSize: 17 }}>குறளைத் தேடு</h2>
          <div className="search-bar" style={{ margin: '10px 0' }}>
            <span className="search-icon"><Icon name="search" size={16} /></span>
            <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="குறள் எண், சொல்…" style={{ paddingLeft: 40 }} />
          </div>
          <div style={{ maxHeight: 480, overflow: 'auto' }}>
            {results.map((k) => (
              <button key={k.number} className="kural-row" style={{ width: '100%', textAlign: 'left', cursor: 'pointer', border: selected?.number === k.number ? '1.5px solid var(--terracotta)' : '1px solid var(--line)' }} onClick={() => pick(k.number)}>
                <span className="no">{String(k.number).padStart(4, '0')}</span>
                <span className="lines t" style={{ fontSize: 14 }}>{k.line1} {k.line2}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          {!selected ? (
            <div className="card admin-card center muted" style={{ padding: 60 }}>
              <Icon name="file-text" size={42} />
              <p>திருத்த ஒரு குறளை இடப்பக்கத்தில் தேர்வு செய்க</p>
            </div>
          ) : (
            <form
              className="card admin-card"
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
            >
              <div className="spread">
                <h2 style={{ fontSize: 17 }}>
                  குறள் {selected.number} · {selected.chapterName}
                </h2>
                <span className="chip chip-admin">{selected.paalName}</span>
              </div>
              {FIELDS.map(([key, label]) => (
                <div className="field" key={key}>
                  <label>{label}</label>
                  {key === 'simpleMeaning' || key === 'meaning' || key === 'couplet' || key === 'explanation' ? (
                    <textarea className="textarea" value={form[key]} onChange={(e) => setField(key, e.target.value)} />
                  ) : (
                    <input className="input" value={form[key]} onChange={(e) => setField(key, e.target.value)} />
                  )}
                </div>
              ))}
              <div className="field">
                <label>சொற்பொருள் (ஒவ்வொரு வரியும்: சொல்|பொருள்)</label>
                <textarea
                  className="textarea"
                  style={{ minHeight: 110 }}
                  value={form.wordLines}
                  onChange={(e) => setField('wordLines', e.target.value)}
                  placeholder={'அகர|முதல் எழுத்து\nஆதி|முதன்மையானவர்'}
                />
              </div>
              <div className="row">
                <button className="btn btn-primary">
                  {saved ? (
                  <Icon name="check" size={15} />
                ) : null}
                {saved ? ' சேமிக்கப்பட்டது' : 'சேமி'}
                </button>
                <LinkKural number={selected.number} />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function LinkKural({ number }) {
  return (
    <a className="btn btn-ghost" href={`/kural/${number}`} target="_blank" rel="noreferrer">
      முகப்பில் பார்க்க ↗
    </a>
  );
}