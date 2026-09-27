import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import { Loading } from '../../components';
import Icon from '../../components/Icon';

export default function AdminChapters() {
  const [chapters, setChapters] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', translation: '', transliteration: '' });
  const [msg, setMsg] = useState('');

  const load = () => api('/chapters').then((d) => setChapters(d.chapters)).catch(() => setChapters([]));
  useEffect(() => {
    load();
  }, []);

  if (!chapters) return <Loading />;

  const edit = (c) => {
    setEditing(c);
    setForm({ name: c.name, translation: c.translation || '', transliteration: c.transliteration || '' });
    setMsg('');
  };

  const save = async () => {
    await api(`/chapters/${editing.number}`, { method: 'PUT', body: form });
    setMsg('சேமிக்கப்பட்டது');
    setEditing(null);
    load();
  };

  return (
    <div>
      <h1 style={{ fontSize: 24 }}>Chapters Management</h1>
      <p className="muted" style={{ marginTop: -6 }}>133 அதிகாரங்களின் பெயர் & மொழிபெயர்ப்பு</p>

      {msg && (
        <div className="alert-ok" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="check" size={15} /> {msg}
        </div>
      )}

      <div className="grid grid-2 mt-2" style={{ alignItems: 'start' }}>
        <div className="card admin-card">
          <div style={{ maxHeight: 560, overflow: 'auto' }}>
            {chapters.map((c) => (
              <button key={c.number} className="kural-row" style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => edit(c)}>
                <span className="no">{String(c.number).padStart(2, '0')}</span>
                <span style={{ flex: 1 }}>
                  <span className="t" style={{ fontSize: 15 }}>{c.name}</span>
                  {c.name !== c.translation && <span className="m" style={{ display: 'block' }}>{c.translation}</span>}
                </span>
                <span className="chip">{c.paalName}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          {!editing ? (
            <div className="card admin-card center muted" style={{ padding: 50 }}>
              <Icon name="book-open" size={40} />
              <p>திருத்த ஒரு அதிகாரத்தைத் தேர்வு செய்க</p>
            </div>
          ) : (
            <form
              className="card admin-card"
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
            >
              <h2 style={{ fontSize: 17 }}>அதிகாரம் {editing.number} — {editing.name}</h2>
              <div className="field">
                <label>தமிழ்ப் பெயர்</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="field">
                <label>English Translation</label>
                <input className="input" value={form.translation} onChange={(e) => setForm({ ...form, translation: e.target.value })} />
              </div>
              <div className="field">
                <label>Transliteration</label>
                <input className="input" value={form.transliteration} onChange={(e) => setForm({ ...form, transliteration: e.target.value })} />
              </div>
              <div className="row">
                <button className="btn btn-primary">சேமி</button>
                <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>ரத்து</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}