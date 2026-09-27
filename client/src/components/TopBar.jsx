import React, { useEffect, useState } from 'react';
import Icon from './Icon';
import { tamilToday } from '../utils/tamilCal';

const GEO_CACHE = 'kg_geo';

function pad(n) {
  return String(n).padStart(2, '0');
}

function loadCachedGeo() {
  try {
    const raw = JSON.parse(localStorage.getItem(GEO_CACHE) || 'null');
    if (raw && raw.lat != null && raw.lon != null && Date.now() - (raw.at || 0) < 30 * 60 * 1000) {
      return raw;
    }
  } catch (e) {}
  return null;
}

function saveGeo(g) {
  try {
    localStorage.setItem(GEO_CACHE, JSON.stringify({ ...g, at: Date.now() }));
  } catch (e) {}
}

function wmoInfo(code) {
  if (code === 0) return { icon: 'sun', label: 'தெளிவான வானம்' };
  if (code <= 2) return { icon: 'sun', label: 'லேசான மேகம்' };
  if (code === 3) return { icon: 'cloud', label: 'மேகமூட்டம்' };
  if (code === 45 || code === 48) return { icon: 'cloud', label: 'மூடுபனி' };
  if (code >= 51 && code <= 67) return { icon: 'droplet', label: 'மழை' };
  if (code >= 71 && code <= 77) return { icon: 'snow', label: 'பனி' };
  if (code >= 80 && code <= 82) return { icon: 'droplet', label: 'மழை' };
  if (code >= 95) return { icon: 'bolt', label: 'இடி மின்னல்' };
  return { icon: 'sun', label: 'வானிலை' };
}

export default function TopBar() {
  const [now, setNow] = useState(() => new Date());
  const [geo, setGeo] = useState(() => loadCachedGeo());
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;
    if (loadCachedGeo()) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const g = { lat: pos.coords.latitude, lon: pos.coords.longitude, city: '' };
        saveGeo(g);
        setGeo(g);
      },
      () => {},
      { timeout: 7000, maximumAge: 600000 }
    );
  }, []);

  useEffect(() => {
    if (!geo || geo.city) return;
    let alive = true;
    fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${geo.lat}&longitude=${geo.lon}&localityLanguage=ta`
    )
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        const city = d.city || d.locality || d.principalSubdivision || '';
        if (city) {
          const g = { ...geo, city };
          saveGeo(g);
          setGeo(g);
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [geo]);

  useEffect(() => {
    if (!geo) return;
    let alive = true;
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${geo.lat}&longitude=${geo.lon}&current=temperature_2m,precipitation,weather_code`
    )
      .then((r) => r.json())
      .then((d) => {
        if (alive && d && d.current) setWeather(d.current);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [geo]);

  const t = tamilToday(now);
  const h24 = now.getHours();
  const clockHour = h24 % 12 === 0 ? 12 : h24 % 12;
  const ampm = h24 < 12 ? 'AM' : 'PM';
  const time = `${pad(clockHour)}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${ampm}`;
  const w = weather ? wmoInfo(weather.weather_code) : null;
  const hasRain = weather && weather.precipitation != null && weather.precipitation > 0;

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <span className="tb-item tb-tamil" title="தமிழ் நாட்காட்டி">
          <span className="tb-label">தமிழ்</span>
          {t.tamilMonth} {t.tamilDay} · {t.tamilWeekday}
        </span>
        <span className="tb-sep" />
        <span className="tb-item tb-eng" title="ஆங்கில நாட்காட்டி">
          {t.englishDate} · {t.englishWeekday}
        </span>
        <span className="tb-sep" />
        <span className="tb-item tb-clock" title="இப்போதைய நேரம்">
          <Icon name="clock" size={13} />
          {time}
        </span>
        {w && (
          <>
            <span className="tb-sep" />
            <span
              className="tb-item tb-weather"
              title={`${w.label}${hasRain ? ` · மழை ${weather.precipitation} மிமீ/ம` : ''}`}
            >
              {geo && geo.city && (
                <>
                  <Icon name="map-pin" size={13} />
                  {geo.city} ·
                </>
              )}
              <Icon name={w.icon} size={15} />
              {Math.round(weather.temperature_2m)}°C
              {hasRain && (
                <span className="tb-rain">
                  <Icon name="droplet" size={13} /> {Math.round(weather.precipitation)}மிமீ
                </span>
              )}
            </span>
          </>
        )}
      </div>
    </div>
  );
}