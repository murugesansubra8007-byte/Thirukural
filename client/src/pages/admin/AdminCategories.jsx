import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import { Loading } from '../../components';
import Icon from '../../components/Icon';

const EMPTY = { emoji: '✦', label: '', slug: '', description: '', taglines: '', chapterNumbers: '' };

export default function AdminCategories() {
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const load = () => api('/categories').then((d) => setData(d.categories)).catch(() => setData([]));
  useEffect(() => {
    load();
  }, []);

  if (!data) return <Loading />;

  const startNew = () => {
    setForm(EMPTY);
    setEditing({ id: null });
  };
  const startEdit = (c) => {
    setForm({
      emoji: c.emoji,
      label: c.label,
      slug: c.slug,
      description: c.description || '',
      taglines: (c.taglines || []).join(', '),
      chapterNumbers: (c.chapterNumbers || []).join(', '),
    });
    setEditing(c);
  };

  const save = async () => {
    const body = {
      emoji: form.emoji,
      label: form.label,
      slug: form.slug,
      description: form.description,
      taglines: form.taglines.split(',').map((s) => s.trim()).filter(Boolean),
      chapterNumbers: form.chapterNumbers.split(',').map((s) => Number(s.trim())).filter((n) => n >= 1 && n <= 133),
    };
    if (editing?.id) await api(`/categories/${editing.id}`, { method: 'PUT', body });
    else await api('/categories', { method: 'POST', body });
    load();
    setEditing(null);
  };

  const del = async (id) => {
    if (!window.confirm('வகையை நீக்கவா?')) return;
    await api(`/categories/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <h1 style={{ fontSize: 24 }}>Categories Management</h1>
      <p className="muted" style={{ marginTop: -6 }}>வாழ்க்கை சார்ந்த வகைகள் — அதிகாரங்களை இணைத்தல்</p>

      <div className="grid grid-2 mt-2" style={{ alignItems: 'start' }}>
        <div className="card admin-card">
          <div className="spread mb-2">
            <h2 style={{ fontSize: 17 }}>வகைகள்</h2>
            <button className="btn btn-sm btn-primary" onClick={startNew}>+ புதிய வகை</button>
          </div>
          {data.map((c) => (
            <div key={c.id} className="kural-row">
              <span style={{ fontSize: 26 }}>{c.emoji}</span>
              <span style={{ flex: 1 }}>
                <b>{c.label}</b>{' '}
                <span className="muted" style={{ fontSize: 13 }}>· {c.kuralCount} குறள்கள்</span>
              </span>
              <button className="btn btn-sm btn-ghost" onClick={() => startEdit(c)}>திருத்து</button>
              <button className="btn btn-sm btn-ghost" onClick={() => del(c.id)}>
              <Icon name="trash" size={15} />
            </button>
            </div>
          ))}
        </div>

        <div>
          {!editing ? (
            <div className="card admin-card center muted" style={{ padding: 50 }}>
              <p>புதிய வகை சேர்க்க அல்லது ஒன்றைத் தேர்வு செய்க</p>
            </div>
          ) : (
            <form
              className="card admin-card"
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
            >
              <h2 style={{ fontSize: 17 }}>{editing.id ? `திருத்து: ${editing.label}` : 'புதிய வகை'}</h2>
              <div className="field"><label>ஐகான் / Emoji</label><input className="input" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} /></div>
              <div className="field"><label>பெயர்</label><input className="input" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required /></div>
              <div className="field"><label>Slug (URL)</label><input className="input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
              <div className="field"><label>விளக்கம்</label><textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="field"><label>Taglines (காற்புள்ளியால் பிரி)</label><input className="input" value={form.taglines} onChange={(e) => setForm({ ...form, taglines: e.target.value })} /></div>
              <div className="field">
                <label>அதிகார எண்கள் (காற்புள்ளியால் பிரி, 1–133)</label>
                <textarea className="textarea" style={{ minHeight: 70 }} value={form.chapterNumbers} onChange={(e) => setForm({ ...form, chapterNumbers: e.target.value })} placeholder="8, 25, 58" />
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