import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import { Loading } from '../../components';
import Icon from '../../components/Icon';

export default function AdminUsers() {
  const [data, setData] = useState(null);

  const load = () => api('/admin/users').then((d) => setData(d.users)).catch(() => setData([]));
  useEffect(() => {
    load();
  }, []);

  if (!data) return <Loading />;

  const setRole = async (u, role) => {
    await api(`/admin/users/${u.id}`, { method: 'PUT', body: { role } });
    load();
  };
  const del = async (u) => {
    if (!window.confirm('பயனரை நீக்கவா?')) return;
    await api(`/admin/users/${u.id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <h1 style={{ fontSize: 24 }}>Users Management</h1>
      <p className="muted" style={{ marginTop: -6 }}>{data.length} பயனர்கள்</p>

      <div className="card admin-card">
        <table className="table">
          <thead>
            <tr><th>பெயர்</th><th>மின்னஞ்சல்</th><th>பங்கு</th><th>உருவாக்கம்</th><th>செயல்</th></tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <tr key={u.id}>
                <td><b>{u.name}</b></td>
                <td className="mono">{u.email}</td>
                <td>
                  <span className={`chip ${u.role === 'admin' ? 'chip-admin' : 'chip-user'}`}>{u.role}</span>
                </td>
                <td className="muted">{new Date(u.createdAt).toLocaleDateString('ta-IN')}</td>
                <td>
                  <div className="row" style={{ gap: 6 }}>
                    {u.role === 'admin' ? (
                      <button className="btn btn-sm btn-ghost" onClick={() => setRole(u, 'user')}>user</button>
                    ) : (
                      <button className="btn btn-sm btn-ghost" onClick={() => setRole(u, 'admin')}>admin</button>
                    )}
                    <button className="btn btn-sm btn-ghost" onClick={() => del(u)}>
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}