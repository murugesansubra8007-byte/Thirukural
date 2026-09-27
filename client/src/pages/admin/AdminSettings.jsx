import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import { Loading } from '../../components';
import Icon from '../../components/Icon';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api('/admin/settings').then((d) => {
      setSettings(d.settings);
      setForm({ ...d.settings });
    });
  }, []);

  if (!settings || !form) return <Loading />;

  const save = async () => {
    await api('/admin/settings', { method: 'PUT', body: form });
    setMsg('சேமிக்கப்பட்டது');
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div>
      <h1 style={{ fontSize: 24 }}>Settings & SEO</h1>
      <p className="muted" style={{ marginTop: -6 }}>தளப் பெயர், அறிவிப்பு, SEO, ஆடியோ இயல்புகள்</p>

      {msg && (
        <div className="alert-ok" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="check" size={15} /> {msg}
        </div>
      )}

      <div className="card admin-card" style={{ maxWidth: 640 }}>
        <div className="field"><label>தளப் பெயர்</label><input className="input" value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} /></div>
        <div className="field"><label>குறிக்கோள் வரி (Tagline)</label><input className="input" value={form.siteTagline} onChange={(e) => setForm({ ...form, siteTagline: e.target.value })} /></div>
        <div className="field"><label>அறிவிப்பு (Home banner, வெறுமையாக விடலாம்)</label><input className="input" value={form.announcement} onChange={(e) => setForm({ ...form, announcement: e.target.value })} /></div>
        <div className="field"><label>SEO Title</label><input className="input" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} /></div>
        <div className="field"><label>SEO Description</label><textarea className="textarea" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} /></div>
        <div className="grid grid-2">
          <div className="field">
            <label>ஆடியோ வேகம் (rate, 0.5–1.5)</label>
            <input className="input" type="number" step="0.05" min="0.5" max="1.5" value={form.audioRate} onChange={(e) => setForm({ ...form, audioRate: Number(e.target.value) })} />
          </div>
          <div className="field">
            <label>ஆடியோ மொழி</label>
            <input className="input" value={form.audioLang} onChange={(e) => setForm({ ...form, audioLang: e.target.value })} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={save}>சேமி</button>
      </div>

      <div className="card admin-card mt-2" style={{ maxWidth: 640 }}>
        <h2 style={{ fontSize: 17 }}>தரவு</h2>
        <p className="muted" style={{ fontSize: 13.5 }}>
          குறள் தரவு: {settingsDataNote()}. நிர்வாக மாற்றங்கள் <code>server/data/db.json</code>-இல்
          சேமிக்கப்படுகின்றன; அடிப்படை குறள் தரவு <code>server/data/kurals.json</code>.
        </p>
      </div>
    </div>
  );
}

function settingsDataNote() {
  return '1330 குறள்கள் · 133 அதிகாரங்கள் · 3 பால்கள்';
}