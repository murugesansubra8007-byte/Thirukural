import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getFavorites } from '../api';
import Icon from './Icon';
import TopBar from './TopBar';
import { assetUrl } from '../cdn';

/* ---------- Layout ---------- */
export function Layout({ children }) {
  return (
    <>
      <TopBar />
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </>
  );
}

/* ---------- Sticky header ---------- */
const NAV_LINKS = [
  { to: '/explore', label: 'தேடு', icon: 'search' },
  { to: '/chapters', label: 'அதிகாரம்', icon: 'book-open' },
  { to: '/today', label: 'தினம்', icon: 'sun' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState('');
  const [favCount, setFavCount] = useState(getFavorites().length);
  const location = useLocation();
  const navigate = useNavigate();
  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const refresh = () => setFavCount(getFavorites().length);
    window.addEventListener('kg:favorites', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('kg:favorites', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  useEffect(() => {
    if (searching) {
      const el = document.getElementById('header-search-input');
      if (el) setTimeout(() => el.focus(), 60);
    }
  }, [searching]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (searching) setSearching(false);
        else if (open) close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searching, open]);

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname === to || location.pathname.startsWith(to + '/');

  const submitSearch = (e) => {
    e.preventDefault();
    const query = q.trim();
    close();
    setSearching(false);
    setQ('');
    navigate(`/explore${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  };

  const openSearch = () => {
    setOpen(false);
    setSearching(true);
  };

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="header-inner">
        <Link to="/" className="brand" onClick={close} aria-label="குறளகம் முகப்பு">
          <img src={assetUrl('/logo.png')} className="brand-logo" alt="குறளகம்" />
        </Link>

        <nav className={`main-nav${open ? ' open' : ''}`}>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link${isActive(l.to) ? ' active' : ''}`}
              onClick={close}
            >
              <Icon name={l.icon} size={16} /> {l.label}
            </Link>
          ))}
          <Link className="nav-link" to="/favorites" onClick={close}>
            <Icon name="heart" size={16} /> என் குறள்கள்{favCount ? ` (${favCount})` : ''}
          </Link>
        </nav>

        <div className="header-tools">
          <button
            className="icon-btn search-toggle"
            aria-label="தேடு"
            title="தேடு"
            onClick={() => (searching ? setSearching(false) : openSearch())}
          >
            <Icon name={searching ? 'x' : 'search'} size={17} />
          </button>
          <Link className="fav-link" to="/favorites" title="என் குறள்கள்" onClick={close}>
            <Icon name="heart" size={19} />
            {favCount > 0 && <span className="fav-count">{favCount}</span>}
          </Link>
          <button
            className="nav-burger"
            aria-label="மெனு"
            aria-expanded={open}
            onClick={() => {
              setOpen(!open);
              setSearching(false);
            }}
          >
            <Icon name={open ? 'x' : 'menu'} size={19} />
          </button>
        </div>
      </div>

      <form
        className={`header-search${searching ? ' open' : ''}`}
        role="search"
        onSubmit={submitSearch}
        aria-hidden={!searching}
      >
        <input
          id="header-search-input"
          className="search-input"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="குறள், சொல் அல்லது அதிகாரம் தேடுங்கள்… (Enter)"
          autoComplete="off"
        />
      </form>
    </header>
  );
}

/* ---------- Footer ---------- */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-ornament" role="presentation">
        <span className="fo-line" />
        <span className="fo-mark">❖</span>
        <span className="fo-line" />
      </div>

      <div className="footer-inner">
        <div className="footer-brand-col">
          <Link to="/" className="footer-brand">குறளகம்</Link>
          <p className="footer-tagline">
            உலகின் 1330 குறள்களின் டிஜிட்டல் இல்லம். வாழ்க்கையின் ஒவ்வொரு நிலையிலும்
            வழிகாட்டும் வள்ளுவத்தின் சொற்கள் — இலவசமாக.
          </p>
          <Link to="/kural/1" className="footer-quote">
            <span className="fq-text">“அகர முதல எழுத்தெல்லாம் ஆதி…”</span>
            <span className="fq-cta">முழு விளக்கத்துடன் படிக்க →</span>
          </Link>
        </div>

        <div className="footer-col">
          <h5><Icon name="book-open" size={13} /> உலாவு</h5>
          <ul>
            <li><Link to="/">முகப்பு</Link></li>
            <li><Link to="/explore">குறள்களைத் தேடு</Link></li>
            <li><Link to="/chapters">133 அதிகாரங்கள்</Link></li>
            <li><Link to="/today">தினம் ஒரு குறள்</Link></li>
            <li><Link to="/categories">வாழ்க்கை வகைகள்</Link></li>
            <li><Link to="/quiz">வினாடி வினா</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5><Icon name="grad" size={13} /> கற்க</h5>
          <ul>
            <li><Link to="/learn">திருக்குறள் அறிமுகம்</Link></li>
            <li><Link to="/learn/structure-overview">133 + 1330 + 3 அமைப்பு</Link></li>
            <li><Link to="/about-valluvar">திருவள்ளுவர்</Link></li>
            <li><Link to="/methodology">உரைகளின் மூலங்கள்</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5><Icon name="layers" size={13} /> தளம்</h5>
          <ul>
            <li><Link to="/about">குறளகம் பற்றி</Link></li>
            <li><Link to="/contact">தொடர்புகொள்ள</Link></li>
            <li><Link to="/favorites">என் குறள்கள்</Link></li>
            <li><Link to="/kural/1330">கடைசி குறள்</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>குறளகம் © {new Date().getFullYear()} — அன்புடன் அனைவருக்கும்</span>
        <span className="footer-credit">
          Crafted with <Icon name="heart-fill" size={12} /> by{' '}
          <a href="https://www.heymovox.com" target="_blank" rel="noreferrer" className="movo-link">
            MovoX team
          </a>
        </span>
      </div>
    </footer>
  );
}

/* ---------- Shared bits ---------- */
export function Loading() {
  return <div className="spinner" />;
}

export function EmptyState({ icon = 'flower', title, note, children }) {
  return (
    <div className="fav-empty">
      <div className="big">
        {/^[a-z-]+$/.test(icon) ? <Icon name={icon} size={46} /> : icon}
      </div>
      <h3>{title}</h3>
      <p className="muted">{note}</p>
      {children}
    </div>
  );
}

export function SectionHead({ kicker, title, note, right }) {
  return (
    <div className="section-head">
      <div>
        {kicker && <p className="section-kicker">{kicker}</p>}
        <h2 className="section-title">{title}</h2>
        {note && <p className="section-note">{note}</p>}
      </div>
      {right}
    </div>
  );
}

export function PaalBadge({ name }) {
  const map = {
    அறத்துப்பால்: 'badge-ara',
    பொருட்பால்: 'badge-por',
    காமத்துப்பால்: 'badge-kam',
  };
  return <span className={`badge ${map[name] || 'badge-ara'}`}>{name}</span>;
}

export function KolamStrip() {
  return <img src={assetUrl('/kolamstrip.png')} alt="" width="10765" height="393" className="kolam-strip" decoding="async" />;
}

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function PageHead({ title, note, children }) {
  return (
    <div className="page-head">
      <h1>{title}</h1>
      {note && <p>{note}</p>}
      {children}
    </div>
  );
}