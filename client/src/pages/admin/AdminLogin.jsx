import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { user, isAdmin, login } = useAuth();
  const [email, setEmail] = useState('admin@kuralagam.in');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
          <img src="/logo.png" className="brand-logo" style={{ width: 72, height: 72 }} alt="குறளகம்" />
        </div>
        <h1 style={{ fontSize: 22, textAlign: 'center' }}>நிர்வாக உள்நுழைவு</h1>
        <p className="muted center" style={{ fontSize: 14, marginBottom: 20 }}>
          Admin Login — குறளகம் நிர்வாக பலகை
        </p>
        {error && <div className="alert-err">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>மின்னஞ்சல் / Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>கடவுச்சொல் / Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'உள்நுழைகிறது…' : 'உள்நுழை'}
          </button>
        </form>
        <p className="muted mt-2 center" style={{ fontSize: 12 }}>
          அமைவு: admin@kuralagam.in / admin123
        </p>
      </div>
    </div>
  );
}