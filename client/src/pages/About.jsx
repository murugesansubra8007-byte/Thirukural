import React from 'react';
import { Link } from 'react-router-dom';
import { PageHead } from '../components';
import Seo, { BASE_URL } from '../seo';

export default function About() {
  return (
    <div>
      <Seo
        title="குறளகம் பற்றி | திருக்குறள் படிக்க இலவச தளம்"
        description="குறளகம் — திருவள்ளுவரின் 1330 திருக்குறள்களை எளிய பொருள், விளக்கம், ஆங்கில மொழிபெயர்ப்பு மற்றும் தமிழ் உரைகளுடன் இலவசமாக வழங்கும் இணையத் தளம்."
        canonical={`${BASE_URL}/about`}
      />
      <PageHead title="குறளகம் பற்றி" note="1330 குறள்களின் டிஜிட்டல் இல்லம்" />

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="card" style={{ padding: 30 }}>
            <h2>நாங்கள் ஏன் குறளகம்</h2>
            <p>
              திருக்குறள் தமிழரின் உலகப் பொக்கிஷம். குறளகம் என்பது இந்த 1330 குறள்களை யார்
              வேண்டுமானாலும், எங்கிருந்தும் எளிதாகப் படிக்கும் வகையில் உருவாக்கிய இலவச இணையத்
              தளம். ஒவ்வொரு குறளுக்கும்:
            </p>
            <ul style={{ lineHeight: 2 }}>
              <li>எளிய தமிழ் பொருள் (சுருக்கம்)</li>
              <li>விரிவான விளக்கம்</li>
              <li>ஆங்கில மொழிபெயர்ப்பு</li>
              <li>மணக்குடவர், பரிமேலழகர், மு. வரதராசனார், கலைஞர் உள்ளிட்ட தமிழ் உரைகள்</li>
              <li>சொற்பொருள் விளக்கம்</li>
            </ul>
            <p>
              மேலும் தினம் ஒரு குறள், வாழ்க்கை வகைகள் வழியான குறள் தேடல், திருக்குறள்
              வினாடி வினா போன்ற வசதிகளும் இங்கே உள்ளன.
            </p>
          </div>

          <h2 className="mt-3" style={{ fontSize: 24 }}>அடிக்கடி எழும் கேள்விகள்</h2>
          <div className="card mt-2" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 17 }}>இந்தத் தளம் இலவசமா?</h3>
            <p className="muted">ஆம். அனைத்து குறள்கள், உரைகள், கருவிகள் இலவசம்.</p>
            <h3 style={{ fontSize: 17 }}>உரைகளின் மூலங்கள் என்ன?</h3>
            <p className="muted">
              உரைகளும் குறள்களும் பொது அறக்கட்டளை மற்றும் திறந்த தரவு மூலங்களிலிருந்து
              எடுக்கப்பட்டவை. விவரங்களுக்கு <Link to="/methodology">எங்கள் முறைமை பக்கம்</Link>.
            </p>
            <h3 style={{ fontSize: 17 }}>தகவல் பிழைகளை எப்படி திருத்தச் சொல்வது?</h3>
            <p className="muted">
              <Link to="/contact">தொடர்பு பக்கம்</Link> வழியே எங்களை அணுகுங்கள்.
            </p>
          </div>

          <div className="grid grid-3 mt-3">
            <Link to="/chapters" className="card info-card">
              <div className="num">133</div>
              <h3>அதிகாரங்கள்</h3>
              <p>முழு பட்டியலுடன் துவங்குங்கள்</p>
            </Link>
            <Link to="/learn" className="card info-card">
              <div className="num">1</div>
              <h3>கற்றல்</h3>
              <p>திருக்குறள் அறிமுகம்</p>
            </Link>
            <Link to="/about-valluvar" className="card info-card">
              <div className="num">திரு</div>
              <h3>திருவள்ளுவர்</h3>
              <p>நூலாசிரியரின் வரலாறு</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}