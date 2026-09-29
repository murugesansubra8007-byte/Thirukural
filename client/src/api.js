const TOKEN_KEY = 'kg_token';
const USER_KEY = 'kg_user';

export async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, {
    ...options,
    headers,
    body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body,
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch (e) {
    /* non-json */
  }
  if (!res.ok) {
    const err = new Error((payload && payload.error) || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return payload;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function uploadImage(file, name) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch(`/api/uploads${name ? `?name=${encodeURIComponent(name)}` : ''}`, {
    method: 'POST',
    headers,
    body: file,
  }).then(async (res) => {
    let payload = null;
    try {
      payload = await res.json();
    } catch (e) {
      /* non-json */
    }
    if (!res.ok) throw new Error((payload && payload.error) || `Upload failed (${res.status})`);
    return payload;
  });
}

export function listUploads() {
  return api('/uploads');
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch (e) {
    return null;
  }
}

export function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/* ---- Favorites (localStorage) ---- */
const FAV_KEY = 'kg_favorites';

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

export function isFavorite(number) {
  return getFavorites().includes(Number(number));
}

export function toggleFavorite(number, onDone) {
  const favs = getFavorites();
  const n = Number(number);
  const next = favs.includes(n) ? favs.filter((x) => x !== n) : [...favs, n].sort((a, b) => a - b);
  localStorage.setItem(FAV_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('kg:favorites'));
  if (onDone) onDone(next);
  return next;
}

export function formatDateKeys(date = new Date()) {
  return date.toLocaleDateString('ta-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function todayKuralNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  return (dayOfYear % 1330) + 1;
}

export function paalMeta(name) {
  if (name === 'அறத்துப்பால்' || name === 'Virtue' || name === 1)
    return { key: 'ara', cls: 'badge-ara', short: 'அறம்' };
  if (name === 'காமத்துப்பால்' || name === 'Love' || name === 3)
    return { key: 'kam', cls: 'badge-kam', short: 'காமம்' };
  return { key: 'por', cls: 'badge-por', short: 'பொருள்' };
}

export function shareText(kural) {
  return `குறள் ${kural.number} — ${kural.line1} ${kural.line2}\n\nகுறளகம் — தினம் ஒரு குறள்`;
}

export function shareUrl(kural) {
  return `${window.location.origin}/kural/${kural.number}`;
}