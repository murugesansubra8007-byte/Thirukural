import React from 'react';

const stroke = {
  'stroke-width': 1.8,
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const S = {
  search: [
    <circle key="c" cx="11" cy="11" r="7.5" />,
    <path key="p" d="m20.5 20.5-4.3-4.3" />,
  ],
  x: [<path key="a" d="M18 6 6 18" />, <path key="b" d="m6 6 12 12" />],
  menu: [
    <line key="a" x1="4" x2="20" y1="6" y2="6" />,
    <line key="b" x1="4" x2="20" y1="12" y2="12" />,
    <line key="c" x1="4" x2="20" y1="18" y2="18" />,
  ],
  heart: [
    <path
      key="p"
      d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.51 4.04 3 5.5l7 7Z"
    />,
  ],
  'heart-fill': [
    <path
      key="p"
      d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.51 4.04 3 5.5l7 7Z"
    />,
  ],
  volume: [
    <path key="p" d="M11 5 6 9H2v6h4l5 4V5Z" />,
    <path key="w1" d="M15.54 8.46a5 5 0 0 1 0 7.07" />,
    <path key="w2" d="M19.07 4.93a10 10 0 0 1 0 14.14" />,
  ],
  pause: [
    <rect key="a" x="14" y="4" width="4" height="16" rx="1" />,
    <rect key="b" x="6" y="4" width="4" height="16" rx="1" />,
  ],
  clock: [
    <circle key="c" cx="12" cy="12" r="10" />,
    <polyline key="p" points="12 6 12 12 16 14" />,
  ],
  share: [
    <circle key="c1" cx="18" cy="5" r="3" />,
    <circle key="c2" cx="6" cy="12" r="3" />,
    <circle key="c3" cx="18" cy="19" r="3" />,
    <line key="l1" x1="8.59" x2="15.42" y1="13.51" y2="17.49" />,
    <line key="l2" x1="15.41" x2="8.59" y1="6.51" y2="10.49" />,
  ],
  check: [<path key="p" d="M20 6 9 17l-5-5" />],
  trash: [
    <path key="p1" d="M3 6h18" />,
    <path key="p2" d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />,
    <path key="p3" d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />,
    <line key="l1" x1="10" x2="10" y1="11" y2="17" />,
    <line key="l2" x1="14" x2="14" y1="11" y2="17" />,
  ],
  plus: [<path key="a" d="M5 12h14" />, <path key="b" d="M12 5v14" />],
  home: [
    <path key="p" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    <polyline key="pl" points="9 22 9 12 15 12 15 22" />,
  ],
  'book-open': [
    <path key="a" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />,
    <path key="b" d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />,
  ],
  book: [<path key="p" d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />],
  layers: [
    <polygon key="a" points="12 2 2 7 12 12 22 7 12 2" />,
    <polyline key="b" points="2 17 12 22 22 17" />,
    <polyline key="c" points="2 12 12 17 22 12" />,
  ],
  sun: [
    <circle key="c" cx="12" cy="12" r="4" />,
    <path key="t" d="M12 2v2" />,
    <path key="b" d="M12 20v2" />,
    <path key="tl" d="m4.93 4.93 1.41 1.41" />,
    <path key="br" d="m17.66 17.66 1.41 1.41" />,
    <path key="l" d="M2 12h2" />,
    <path key="r" d="M20 12h2" />,
    <path key="bl" d="m6.34 17.66-1.41 1.41" />,
    <path key="tr" d="m19.07 4.93-1.41 1.41" />,
  ],
  pen: [
    <path key="p1" d="M12 20h9" />,
    <path key="p2" d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />,
  ],
  help: [
    <circle key="c" cx="12" cy="12" r="10" />,
    <path key="p1" d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />,
    <path key="p2" d="M12 17h.01" />,
  ],
  'chevron-left': [<path key="p" d="m15 18-6-6 6-6" />],
  'chevron-right': [<path key="p" d="m9 18 6-6-6-6" />],
  'chevron-down': [<path key="p" d="m6 9 6 6 6-6" />],
  'arrow-right': [<path key="a" d="M5 12h14" />, <path key="b" d="m12 5 7 7-7 7" />],
  sparkles: [
    <path
      key="p"
      d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"
    />,
  ],
  trophy: [
    <path key="p1" d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />,
    <path key="p2" d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />,
    <path key="p3" d="M4 22h16" />,
    <path key="p4" d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />,
    <path key="p5" d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />,
    <path key="p6" d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />,
  ],
  'thumbs-up': [
    <path key="p1" d="M7 10v12" />,
    <path key="p2" d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />,
  ],
  sprout: [
    <path key="p1" d="M7 20h10" />,
    <path key="p2" d="M10 20c5.5-2.5.8-6.4 3-10" />,
    <path key="p3" d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />,
    <path key="p4" d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />,
  ],
  flower: [
    <circle key="c" cx="12" cy="12" r="3" />,
    <path
      key="p"
      d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5"
    />,
    <path key="a1" d="M12 7.5V9" />,
    <path key="a2" d="M7.5 12H9" />,
    <path key="a3" d="M16.5 12H15" />,
    <path key="a4" d="M12 16.5V15" />,
    <path key="a5" d="m8 8 1.88 1.88" />,
    <path key="a6" d="M14.12 9.88 16 8" />,
    <path key="a7" d="m8 16 1.88-1.88" />,
    <path key="a8" d="M14.12 14.12 16 16" />,
  ],
  'file-text': [
    <path key="p1" d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />,
    <path key="p2" d="M14 2v4a2 2 0 0 0 2 2h4" />,
    <path key="p3" d="M10 9H8" />,
    <path key="p4" d="M16 13H8" />,
    <path key="p5" d="M16 17H8" />,
  ],
  gauge: [
    <path key="p1" d="m12 14 4-4" />,
    <path key="p2" d="M3.34 19a10 10 0 1 1 17.32 0" />,
  ],
  settings: [
    <path
      key="p"
      d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
    />,
    <circle key="c" cx="12" cy="12" r="3" />,
  ],
  users: [
    <path key="p1" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />,
    <circle key="c" cx="9" cy="7" r="4" />,
    <path key="p2" d="M22 21v-2a4 4 0 0 0-3-3.87" />,
    <path key="p3" d="M16 3.13a4 4 0 0 1 0 7.75" />,
  ],
  user: [
    <path key="p" d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />,
    <circle key="c" cx="12" cy="7" r="4" />,
  ],
  shield: [
    <path
      key="p"
      d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"
    />,
  ],
  logout: [
    <path key="p" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />,
    <polyline key="pl" points="16 17 21 12 16 7" />,
    <line key="l" x1="21" x2="9" y1="12" y2="12" />,
  ],
  calendar: [
    <path key="p1" d="M8 2v4" />,
    <path key="p2" d="M16 2v4" />,
    <rect key="r" width="18" height="18" x="3" y="4" rx="2" />,
    <path key="p3" d="M3 10h18" />,
  ],
  scale: [
    <line key="l1" x1="12" y1="3" x2="12" y2="22" />,
    <path key="l2" d="M8 6h8" />,
    <path key="p1" d="M5 6 2 14h6z" />,
    <path key="p2" d="M19 6l-3 8h6z" />,
  ],
  gem: [
    <path key="p1" d="M6 3h12l4 6-10 13L2 9Z" />,
    <path key="p2" d="M11 3 8 9l4 13 4-13-3-6" />,
    <path key="p3" d="M2 9h20" />,
  ],
  briefcase: [
    <rect key="r" width="20" height="14" x="2" y="7" rx="2" />,
    <path key="p" d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />,
  ],
  coins: [
    <circle key="c" cx="8" cy="8" r="6" />,
    <path key="p" d="M18.09 10.37A6 6 0 1 1 10.34 18" />,
    <path key="s" d="M7 6h1v4" />,
    <path key="t" d="m16.71 13.88.7.71-2.82 2.82" />,
  ],
  crown: [
    <path
      key="p"
      d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.735H5.81a1 1 0 0 1-.957-.735L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"
    />,
    <path key="b" d="M5 21h14" />,
  ],
  bulb: [
    <path key="p1" d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />,
    <path key="p2" d="M9 18h6" />,
    <path key="p3" d="M10 22h4" />,
  ],
  handshake: [
    <path key="p1" d="m11 17 2 2a1 1 0 1 0 3-3" />,
    <path key="p2" d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />,
    <path key="p3" d="m21 3 1 11h-2" />,
    <path key="p4" d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />,
    <path key="p5" d="M3 4h8" />,
  ],
  bolt: [
    <path
      key="p"
      d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
    />,
  ],
  grad: [
    <path
      key="p"
      d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"
    />,
    <path key="t" d="M22 10v6" />,
    <path key="s" d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />,
  ],
  flame: [
    <path
      key="p"
      d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
    />,
  ],
  'map-pin': [
    <path key="p" d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />,
    <circle key="c" cx="12" cy="10" r="3" />,
  ],
  cloud: [
    <path
      key="p"
      d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"
    />,
  ],
  droplet: [
    <path
      key="p"
      d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
    />,
  ],
  snow: [
    <path key="l" d="M12 2v20" />,
    <path key="a" d="m4.93 4.93 14.14 14.14" />,
    <path key="b" d="m19.07 4.93-14.14 14.14" />,
  ],
};

const FILLED = new Set(['heart-fill']);

function renderIcon(name, size) {
  const paths = S[name];
  if (!paths) return null;
  const filled = FILLED.has(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...(filled ? { fill: 'currentColor', stroke: 'none' } : stroke)}
    >
      {paths}
    </svg>
  );
}

export default function Icon({ name, size = 18, className = '', style }) {
  return (
    <span className={`icon ${className}`} style={{ display: 'inline-flex', ...style }}>
      {renderIcon(name, size)}
    </span>
  );
}