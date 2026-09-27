import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import { Loading } from '../../components';
import Icon from '../../components/Icon';
import { Content } from '../Blog';

const EMPTY = { title: '', slug: '', excerpt: '', author: 'குறளகம்', coverColor: '#a0401f', tags: '', content: '' };

export default function AdminBlog() {
  const [posts, setPosts] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const load = () => api('/blog').then((d) => setPosts(d.posts)).catch(() => setPosts([]));
  useEffect(() => {
    load();
  }, []);

  if (!posts) return <Loading />;

  const startNew = () => {
    setForm(EMPTY);
    setEditing({ id: null });
  };
  const startEdit = (p) => {
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || '',
      author: p.author || 'குறளகம்',
      coverColor: p.coverColor || '#a0401f',
      tags: (p.tags || []).join(', '),
      content: p.content || '',
    });
    setEditing(p);
  };

  const save = async () => {
    const body = {
      ...form,
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
    };
    if (editing?.id) await api(`/blog/${editing.id}`, { method: 'PUT', body });
    else await api('/blog', { method: 'POST', body });
    load();
    setEditing(null);
  };

  const del = async (p) => {
    if (!window.confirm('கட்டுரையை நீக்கவா?')) return;
    await api(`/blog/${p.id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <h1 style={{ fontSize: 24 }}>Blog & Articles</h1>
      <p className="muted" style={{ marginTop: -6 }}>SEO கட்டுரைகள் — தொகுக்கவும், வெளியிடவும்</p>

      <div className="grid grid-2 mt-2" style={{ alignItems: 'start' }}>
        <div className="card admin-card">
          <div className="spread mb-2">
            <h2 style={{ fontSize: 17 }}>கட்டுரைகள் ({posts.length})</h2>
            <button className="btn btn-sm btn-primary" onClick={startNew}>+ புதிய கட்டுரை</button>
          </div>
          <div style={{ maxHeight: 560, overflow: 'auto' }}>
            {posts.map((p) => (
              <div key={p.id} className="kural-row">
                <span style={{ flex: 1 }}>
                  <b>{p.title}</b>
                  <span className="m" style={{ display: 'block', fontSize: 12.5 }}>
                    {new Date(p.publishedAt).toLocaleDateString('ta-IN')} · {p.slug}
                  </span>
                </span>
                <button className="btn btn-sm btn-ghost" onClick={() => startEdit(p)}>திருத்து</button>
                <button className="btn btn-sm btn-ghost" onClick={() => del(p)}>
                  <Icon name="trash" size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          {!editing ? (
            <div className="card admin-card center muted" style={{ padding: 50 }}>
              <Icon name="pen" size={40} />
              <p>புதிய கட்டுரை அல்லது ஒன்றைத் தேர்வு செய்க</p>
            </div>
          ) : (
            <form
              className="card admin-card"
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
            >
              <h2 style={{ fontSize: 17 }}>{editing.id ? 'திருத்து' : 'புதிய கட்டுரை'}</h2>
              <div className="field"><label>தலைப்பு</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="field"><label>Slug</label><input className="input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
              <div className="field"><label>சுருக்கம் (Excerpt)</label><input className="input" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
              <div className="grid grid-2">
                <div className="field"><label>ஆசிரியர்</label><input className="input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
                <div className="field"><label>Cover Color (hex)</label><input className="input" type="color" value={form.coverColor} onChange={(e) => setForm({ ...form, coverColor: e.target.value })} style={{ height: 44, padding: 4 }} /></div>
              </div>
              <div className="field"><label>Tags (காற்புள்ளியால்)</label><input className="input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
              <div className="field">
                <label>{'உள்ளடக்கம் (# தலைப்பு, - பட்டியல், > மேற்கோள்)'}</label>
                <textarea className="textarea" style={{ minHeight: 180 }} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
              </div>
              <div className="card" style={{ padding: 12, marginBottom: 10 }}>
                <b className="muted" style={{ fontSize: 13 }}>முன்னோட்டம்:</b>
                <div className="article-body" style={{ fontSize: 14 }}>
                  <Content text={form.content} />
                </div>
              </div>
              <div className="row">
                <button className="btn btn-primary">சேமி & வெளியிடு</button>
                <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>ரத்து</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}