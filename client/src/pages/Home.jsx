import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, todayKuralNumber } from '../api';
import { Loading, SectionHead, KolamStrip } from '../components';
import { KuralRow, ShareButton, PaalCard, Verse } from '../components/Kural';
import Icon from '../components/Icon';
import Seo from '../seo';

const PAAL_KEYS = { 1: 'ara', 2: 'porul', 3: 'kamam' };

export default function Home() {
  const [chaptersData, setChaptersData] = useState(null);
  const [today, setToday] = useState(null);

  useEffect(() => {
    api('/chapters').then((d) => setChaptersData(d)).catch(() => setChaptersData({ chapters: [] }));
    api(`/kurals/${todayKuralNumber()}`).then((d) => setToday(d.kural)).catch(() => {});
    fetch(`/api/stats/visit`, { method: 'POST' }).catch(() => {});
  }, []);

  if (!chaptersData) return <Loading />;

  const paals = [];
  const map = {};
  for (const c of chaptersData.chapters) {
    if (!map[c.paal]) map[c.paal] = { number: c.paal, name: c.paalName, chapterCount: 0, translations: {} };
    map[c.paal].chapterCount += 1;
  }
  for (const k of Object.values(map)) paals.push(k);
  paals.sort((a, b) => a.number - b.number);

  return (
    <div>
      <Seo
        title="திருக்குறள் 1330 குறள்கள் | பொருள், விளக்கம் – குறளகம்"
        description="திருவள்ளுவரின் 1330 திருக்குறள்களையும் தமிழ் உரை, பொருள் மற்றும் விளக்கத்துடன் படிக்கலாம். அறத்துப்பால், பொருட்பால், காமத்துப்பால் என முழு திருக்குறள்களையும் ஒரே இடத்தில் காணுங்கள்."
        canonical="https://thirukural.heymovox.com/"
      />
      <Hero />
      <KolamStrip />

      <section className="section section-tight">
        <div className="container" style={{ maxWidth: 880, textAlign: 'center' }}>
          <p className="muted" style={{ fontSize: 15.5, lineHeight: 1.8 }}>
            திருவள்ளுவரின்{" "}
            <b>திருக்குறள் 1330 குறள்கள்</b>, ஒவ்வொன்றின் எளிய பொருள், விளக்கம், ஆங்கில
            மொழிபெயர்ப்பு மற்றும் மணக்குடவர், பரிமேலழகர், மு. வரதராசனார், கலைஞர் உள்ளிட்ட
            தமிழ் உரைகளுடன் இலவசமாக. மூன்று பால்கள், 133 அதிகாரங்கள் —{" "}
            <Link to="/learn">திருக்குறள் பற்றி அறிக</Link> ·{" "}
            <Link to="/about-valluvar">திருவள்ளுவர் வரலாறு</Link>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead
            kicker="மூன்று பால்கள்"
            title="திருக்குறளின் அமைப்பு"
            note="அறம், பொருள், காமம் — வாழ்க்கையின் முழு வரைபடம்."
          />
          <div className="grid grid-3">
            {paals.map((p) => {
              const icons = { 1: 'scale', 2: 'gem', 3: 'heart' };
              return (
                <PaalCard
                  key={p.number}
                  paal={p}
                  icon={icons[p.number]}
                  note={p.number === 1 ? 'அறம்' : p.number === 2 ? 'பொருள்' : 'காமம்'}
                  to={`/paal/${PAAL_KEYS[p.number]}`}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <SectionHead
            kicker="தினம் ஒரு குறள்"
            title="இன்றைய குறள்"
            right={
              <Link to="/today" className="btn btn-outline btn-sm">
                அனைத்தும் →
              </Link>
            }
          />
          {today && (
            <div className="kural-slab">
              <Verse kural={today} large />
              <div className="paala-rule">
                <span className="rule-line" />
                <span>
                  குறள் {today.number} · {today.chapterName}
                </span>
              </div>
              <div className="row mt-2">
                <ShareButton kural={today} />
                <Link to={`/kural/${today.number}`} className="btn btn-primary btn-sm">
                  முழு விளக்கம் →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead
            kicker="வாழ்க்கை சார்ந்த தேடல்"
            title="உங்களுக்கு தேவையான குறளை தேர்வு செய்யுங்கள்"
            right={
              <Link to="/categories" className="btn btn-outline btn-sm">
                எல்லா வகைகளும் →
              </Link>
            }
          />
          <div className="grid grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))' }}>
            {CATEGORY_SNIPPETS.map((c) => (
              <Link key={c.slug} to={`/categories/${c.slug}`} className="card category-card center" style={{ textAlign: 'center' }}>
                <span className="category-emoji"><Icon name={c.icon} size={26} /></span>
                <h3>{c.label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const CATEGORY_SNIPPETS = [
  { icon: 'heart', label: 'அன்பு', slug: 'anbu' },
  { icon: 'users', label: 'குடும்பம்', slug: 'family' },
  { icon: 'briefcase', label: 'வேலை / தொழில்', slug: 'work' },
  { icon: 'coins', label: 'பொருளாதாரம்', slug: 'wealth' },
  { icon: 'crown', label: 'தலைமைத்துவம்', slug: 'leadership' },
  { icon: 'bulb', label: 'அறிவு', slug: 'knowledge' },
  { icon: 'handshake', label: 'நட்பு', slug: 'friendship' },
  { icon: 'scale', label: 'நீதி', slug: 'justice' },
  { icon: 'sprout', label: 'ஒழுக்கம்', slug: 'righteousness' },
  { icon: 'bolt', label: 'முயற்சி', slug: 'effort' },
  { icon: 'grad', label: 'கல்வி', slug: 'education' },
  { icon: 'flame', label: 'காதல்', slug: 'love' },
];

function CountUp({ to, duration = 1500 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{n}</>;
}

function Hero() {
  return (
    <div className="hero">
      <div className="hero-glow glow-a" />
      <div className="hero-glow glow-b" />
      <span className="hero-particle p1" />
      <span className="hero-particle p2" />
      <span className="hero-particle p3" />
      <span className="hero-particle p4" />
      <span className="hero-particle p5" />
      <div className="hero-ornament">
        <span className="line" />
        <span className="hero-eyebrow">திருக்குறள்</span>
        <span className="line" />
      </div>
      <h1 className="hero-title">
        133 <span className="h">அதிகாரங்கள்</span> • 1330 <span className="h">குறள்கள்</span>
      </h1>
      <p className="hero-sub">
        வாழ்க்கையின் ஒவ்வொரு நிலையிலும் வழிகாட்டும் வள்ளுவத்தின் சொற்கள் — உங்கள் கைகளில்.
      </p>
      <div className="hero-actions">
        <Link to="/chapters" className="btn btn-primary">
          <Icon name="book-open" size={17} /> குறள்களை படிக்க
        </Link>
        <Link to="/today" className="btn btn-gold">
          <Icon name="sun" size={17} /> தினம் ஒரு குறள்
        </Link>
      </div>
      <div className="hero-stats">
        <div className="stat">
          <b><CountUp to={1330} /></b>
          <span>குறள்கள்</span>
        </div>
        <div className="stat">
          <b><CountUp to={133} /></b>
          <span>அதிகாரங்கள்</span>
        </div>
        <div className="stat">
          <b><CountUp to={3} /></b>
          <span>பால்கள்</span>
        </div>
      </div>
    </div>
  );
}