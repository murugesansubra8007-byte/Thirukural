export const CDN_BASE = 'https://cdn.heymovox.com';

export function assetUrl(path) {
  const local =
    typeof window !== 'undefined' &&
    /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(window.location.hostname);
  if (import.meta.env.DEV || local) return path;
  return `${CDN_BASE}${path}`;
}