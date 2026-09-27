import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, getToken, getUser, setSession, clearSession } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser());
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setReady(true);
      return null;
    }
    try {
      const { user } = await api('/auth/me');
      setUser(user);
      return user;
    } catch (e) {
      clearSession();
      setUser(null);
      return null;
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email, password) => {
    const res = await api('/auth/login', { method: 'POST', body: { email, password } });
    setSession(res.token, res.user);
    setUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await api('/auth/register', { method: 'POST', body: { name, email, password } });
    setSession(res.token, res.user);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const isAdmin = Boolean(user && user.role === 'admin');

  return (
    <AuthContext.Provider value={{ user, ready, isAdmin, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function RequireAdmin({ children }) {
  const { user, ready, isAdmin } = useAuth();
  if (!ready) return <Spinner />;
  if (!isAdmin) return <NotAdmin user={user} />;
  return children;
}

function NotAdmin({ user }) {
  return (
    <div className="login-wrap">
      <div className="login-card center">
        <h2>நிர்வாக அணுகல் தேவை</h2>
        <p className="muted">
          நீங்கள் நிர்வாகியாக பதிவு செய்யப்படவில்லை. வேறு கணக்கில் நுழையவும்.
        </p>
        <a href="/admin/login" className="btn btn-primary mt-2">
          நிர்வாக உள்நுழைவு
        </a>
        {user && (
          <div className="mt-2">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                clearSession();
                window.location.reload();
              }}
            >
              வெளியேறு
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="spinner" />;
}