import React from 'react';
import { Link } from 'react-router-dom';
import { PageHead } from '../components';
import Seo, { BASE_URL } from '../seo';

export default function Learn() {
  return (
    <div>
      <Seo
        title="திருக்குறள் கற்றல் | அறிமுகம், அமைப்பு, நிலைகள்"
        description="திருக்குறள் கற்றல்: அறத்துப்பால், பொருட்பால், காமத்துப்பால் அமைப்பு, குறள் வெண்பாவின் இலக்கணம், இல்லறம், துறவறம் — தொடக்கநிலை முதல் மேம்பட்ட நிலை வரை."
        canonical={`${BASE_URL}/learn`}
      />
      <PageHead title="திருக்குறள் கற்றல்" note="தொடக்கநிலை → இடைநிலை → மேம்பட்ட நிலை" />

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="learn-grid">
            <div className="card info-card">
              <div className="num">133</div>
              <h3>அதிகாரங்கள்</h3>
              <p>திருக்குறள் 133 அதிகாரங்களாகப் பிரிக்கப்பட்டுள்ளது. ஒவ்வொன்றும் ஒரு தலைப்பைப் பேசுகிறது.</p>
            </div>
            <div className="card info-card">
              <div className="num">1330</div>
              <h3>குறள்கள்</h3>
              <p>ஒவ்வொரு அதிகாரத்திலும் 10 குறள்கள். மொத்தம் 1330 குறள்கள் — ஒவ்வொன்றும் 7 சீர்கள்.</p>
            </div>
            <div className="card info-card">
              <div className="num">3</div>
              <h3>பால்கள்</h3>
              <p>அறத்துப்பால், பொருட்பால், காமத்துப்பால் — வாழ்க்கையின் மூன்று பரிமாணங்கள்.</p>
            </div>
          </div>

          <h2 className="mt-3" style={{ fontSize: 24 }}>திருக்குறள் என்றால் என்ன?</h2>
          <p>
            திருக்குறள் என்பது திருவள்ளுவர் இயற்றிய ஒரு வாழ்வியல் நூல். இது அறம், பொருள், இன்பம் என
            வாழ்க்கையின் மூன்று அடிப்படை நோக்கங்களை விளக்குகிறது. குறள் என்பது வெண்பாவின் ஒரு வடிவம்;
            இரண்டு அடிகளில், முழுமையான பொருளைத் தருவது.
          </p>

          <h2 style={{ fontSize: 24 }}>குறளின் அமைப்பு (Structure)</h2>
          <p>
            ஒரு குறள் இரண்டு அடிகளைக் கொண்டது. முதல் அடி 4 சீர், இரண்டாவது அடி 3 சீர். ஏழு சீர்களால்
            ஆன இந்த வெண்பா "குறள் வெண்பா" எனப்படும். எடுத்துக்காட்டாக:
          </p>
          <div className="kural-slab" style={{ marginBottom: 14 }}>
            <p className="verse" style={{ fontSize: 22 }}>
              <span className="l1">அகர முதல எழுத்தெல்லாம் ஆதி</span>
              <span className="l2">பகவன் முதற்றே உலகு.</span>
            </p>
            <p className="muted" style={{ fontSize: 13.5 }}>
              குறள் 1 · அதிகாரம் 1: கடவுள் வாழ்த்து
            </p>
          </div>
          <p>
            இங்கு "அகர" 3 எழுத்துகள் (அ-க-ர), "முதல" — முதல் சீர். ஒவ்வொரு சீரும் 2-5 எழுத்துகள் கொண்டது.
          </p>

          <h2 style={{ fontSize: 24 }}>Learn by Level</h2>
          <div className="grid grid-3 mt-2">
            <div className="card info-card">
              <div className="num" style={{ color: 'var(--leaf-deep)' }}>A</div>
              <h3>தொடக்கநிலை</h3>
              <p>முக்கிய 100 குறள்களை எளிய பொருளுடன் படிக்கவும். தினம் ஒரு குறள் தொடங்குங்கள்.</p>
              <Link to="/chapters/1" className="btn btn-outline btn-sm">ஆரம்பம் →</Link>
            </div>
            <div className="card info-card">
              <div className="num" style={{ color: 'var(--terracotta-deep)' }}>B</div>
              <h3>இடைநிலை</h3>
              <p>45+ அதிகாரங்கள் முழுமையாக — அறத்துப்பாலின் இல்லறம், துறவறம்.</p>
              <Link to="/chapters?paal=1" className="btn btn-outline btn-sm">அறத்துப்பால் →</Link>
            </div>
            <div className="card info-card">
              <div className="num" style={{ color: 'var(--gold-deep)' }}>C</div>
              <h3>மேம்பட்ட நிலை</h3>
              <p>133 அதிகாரங்களும், ஆங்கில மொழிபெயர்ப்புகளும், வினாடி வினா வினாடி.</p>
              <Link to="/quiz" className="btn btn-outline btn-sm">வினாடி வினா →</Link>
            </div>
          </div>

          <h2 style={{ fontSize: 24 }} className="mt-3">மேலும் படிக்க</h2>
          <div className="grid grid-3">
            <Link to="/about-valluvar" className="card info-card">
              <div className="num">திரு</div>
              <h3>திருவள்ளுவர்</h3>
              <p>நூலாசிரியரின் வரலாறும் சிறப்பும்</p>
            </Link>
            <Link to="/learn/structure-overview" className="card info-card" style={{ textDecoration: 'none' }}>
              <div className="num">III</div>
              <h3>மூன்று பால்கள்</h3>
              <p>அறம், பொருள், காமம் — விரிவான கண்ணோட்டம்</p>
            </Link>
            <Link to="/quiz" className="card info-card">
              <div className="num">؟</div>
              <h3>வினாடி வினா</h3>
              <p>உங்கள் அறிவைப் பரிசோதியுங்கள்</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}