import { useEffect } from 'react';

export const BASE_URL = 'https://thirukural.heymovox.com';
export const SITE_NAME = 'குறளகம்';
export const PAAL_ROUTE = { அறத்துப்பால்: 'ara', பொருட்பால்: 'porul', காமத்துப்பால்: 'kamam' };
const DEFAULT_IMAGE = `${BASE_URL}/banner.png`;

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  if (content) el.content = content;
}

export function setPageMeta({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex = false,
  jsonLd = null,
}) {
  const fullTitle = title ? `${title}` : SITE_NAME;
  document.title = fullTitle;

  upsertMeta('name', 'description', description || '');
  upsertMeta('property', 'og:title', fullTitle);
  upsertMeta('property', 'og:description', description || '');
  upsertMeta('property', 'og:type', type);
  upsertMeta('property', 'og:url', canonical || BASE_URL);
  upsertMeta('property', 'og:site_name', SITE_NAME);
  upsertMeta('property', 'og:locale', 'ta_IN');
  upsertMeta('property', 'og:image', image);
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', fullTitle);
  upsertMeta('name', 'twitter:description', description || '');

  let canon = document.head.querySelector('link[rel="canonical"]');
  if (!canon) {
    canon = document.createElement('link');
    canon.rel = 'canonical';
    document.head.appendChild(canon);
  }
  canon.href = canonical || BASE_URL;

  setNoIndex(noIndex);
  setJsonLd(jsonLd);
}

function setNoIndex(noIndex) {
  const selector = 'meta[name="robots"]';
  let el = document.head.querySelector(selector);
  if (noIndex) {
    if (!el) {
      el = document.createElement('meta');
      el.name = 'robots';
      el.content = 'noindex';
      document.head.appendChild(el);
    } else {
      el.content = 'noindex';
    }
  } else if (el && el.content === 'noindex') {
    el.remove();
  }
}

function setJsonLd(jsonLd) {
  let container = document.head.querySelector('script[data-seo-jsonld]');
  if (jsonLd && Array.isArray(jsonLd)) {
    if (!container) {
      container = document.createElement('script');
      container.type = 'application/ld+json';
      container.setAttribute('data-seo-jsonld', 'true');
      document.head.appendChild(container);
    }
    container.textContent = JSON.stringify(jsonLd);
  } else if (container) {
    container.remove();
  }
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function kuralTitle(k) {
  const words = String(k.line1 || '')
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join(' ');
  return `திருக்குறள் ${k.number} – ${words} | பொருள், விளக்கம்`;
}

export function kuralDescription(k) {
  return `திருக்குறள் ${k.number}: ${k.line1} ${k.line2}. இதன் தமிழ் பொருள், விளக்கம் மற்றும் அதிகார விவரங்களை குறளகத்தில் படியுங்கள்.`;
}

export default function Seo({ deps, ...props }) {
  useEffect(() => {
    setPageMeta(props);
  });
  return null;
}