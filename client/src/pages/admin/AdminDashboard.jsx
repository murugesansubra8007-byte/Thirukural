import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import { Loading } from '../../components';
import Icon from '../../components/Icon';

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api('/admin/dashboard').then(setData).catch((e) => console.error(e));
  }, []);

  if (!data) return <Loading />;
  const { stats, visits, topSearches, recentPosts } = data;
  const maxVisits = Math.max(1, ...visits.map((v) => v.count));

  const tiles = [
    { label: 'Total Kurals', value: stats.totalKurals, icon: 'file-text' },
    { label: 'Total Chapters', value: stats.totalChapters, icon: 'book-open' },
    { label: 'Paals', value: stats.totalPaals, icon: 'scale' },
    { label: 'Total Users', value: stats.totalUsers, icon: 'users' },
    { label: 'Categories', value: stats.totalCategories, icon: 'layers' },
    { label: 'Blog Posts', value: stats.totalBlogPosts, icon: 'pen' },
    { label: 'Visits Today', value: stats.visitsToday, icon: 'search' },
    { label: 'Quiz Today', value: stats.quizAttemptsToday, icon: 'help' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24 }}>Dashboard</h1>
      <p className="muted" style={{ marginTop: -6 }}>திருக்குறள் தளத்தின் ஒட்டுமொத்த நிலை</p>

      <div className="stat-grid mt-2">
        {tiles.map((t) => (
          <div key={t.label} className="stat-tile">
            <b>
              <Icon name={t.icon} size={18} /> {t.value}
            </b>
            <span>{t.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-2 mt-3" style={{ alignItems: 'start' }}>
        <div className="card admin-card">
          <h2 style={{ fontSize: 18 }}>கடந்த 14 நாட்களில் வருகை</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140, paddingTop: 12 }}>
            {visits.map((v) => (
              <div key={v.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div
                  style={{
                    width: '100%',
                    background: 'linear-gradient(180deg, var(--terracotta), var(--terracotta-deep))',
                    height: `${Math.round((v.count / maxVisits) * 110)}px`,
                    borderRadius: '5px 5px 0 0',
                    minHeight: 3,
                    opacity: 0.95,
                  }}
                  title={`${v.date}: ${v.count}`}
                />
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>{v.date.slice(5)}</span>
              </div>
            ))}
          </div>
          <p className="muted mt-1" style={{ fontSize: 13 }}>மொத்தம் {stats.totalVisits} வருகைகள்</p>
        </div>

        <div>
          <div className="card admin-card">
            <h2 style={{ fontSize: 18 }}>முதன்மை தேடல்கள்</h2>
            {topSearches.length === 0 ? (
              <p className="muted">இதுவரை தேடல்கள் இல்லை</p>
            ) : (
              <table className="table">
                <thead><tr><th>சொல்</th><th>முறை</th><th>கடைசி</th></tr></thead>
                <tbody>
                  {topSearches.map((s) => (
                    <tr key={s.id}>
                      <td><b>{s.query}</b></td>
                      <td>{s.count}</td>
                      <td className="muted">{new Date(s.lastAt).toLocaleDateString('ta-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card admin-card mt-2">
            <div className="spread">
              <h2 style={{ fontSize: 18 }}>சமீபத்திய கட்டுரைகள்</h2>
              <Link to="/admin/blog" className="btn btn-sm btn-ghost">நிர்வகி</Link>
            </div>
            {recentPosts.length === 0 ? (
              <p className="muted">கட்டுரைகள் இல்லை</p>
            ) : (
              recentPosts.map((p) => (
                <div key={p.id} className="kural-row" style={{ marginBottom: 6 }}>
                  <span className="lines t" style={{ flex: 1 }}>{p.title}</span>
                  <span className="muted" style={{ fontSize: 13 }}>{new Date(p.publishedAt).toLocaleDateString('ta-IN')}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}