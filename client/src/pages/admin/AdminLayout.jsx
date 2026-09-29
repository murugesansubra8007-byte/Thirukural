import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/Icon';
import Seo from '../../seo';

const LINKS = [
  { to: '/admin/dashboard', icon: 'gauge', label: 'Dashboard' },
  { to: '/admin/kurals', icon: 'file-text', label: 'Kurals' },
  { to: '/admin/chapters', icon: 'book-open', label: 'Chapters' },
  { to: '/admin/categories', icon: 'layers', label: 'Categories' },
  { to: '/admin/users', icon: 'users', label: 'Users' },
  { to: '/admin/quiz', icon: 'help', label: 'Quiz' },
  { to: '/admin/settings', icon: 'settings', label: 'Settings' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  return (
    <div style={{ background: 'var(--paper)' }}>
      <Seo title="நிர்வாகம் | குறளகம்" description="" canonical="https://thirukural.heymovox.com/" noIndex />
      <div className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <img src="/logo.png" className="brand-logo" alt="குறளகம்" />
          </Link>
          <nav className="main-nav">
            <Link to="/" className="nav-link">முகப்பு</Link>
            <span className="nav-link" style={{ cursor: 'default' }}>
              நிர்வாகி: {user?.name}
            </span>
            <button className="btn btn-sm btn-ghost" onClick={logout}>வெளியேறு</button>
          </nav>
        </div>
      </div>
      <div className="admin-shell">
        <aside className="admin-side">
          <div className="aside-title">நிர்வாகம்</div>
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/admin/dashboard'} className="admin-link">
              <Icon name={l.icon} size={17} /> {l.label}
            </NavLink>
          ))}
        </aside>
        <div className="admin-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}