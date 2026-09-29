import React from 'react';
import { Link } from 'react-router-dom';
import { PageHead } from '../components';
import Seo, { BASE_URL } from '../seo';

const CONTACT_EMAIL = 'admin@kuralagam.in';

export default function Contact() {
  return (
    <div>
      <Seo
        title="தொடர்பு | குறளகம்"
        description="குறளகம் தொடர்பான கருத்துகள், தகவல் பிழைத் திருத்தங்கள், பரிந்துரைகள் — எங்களை அணுகுங்கள்."
        canonical={`${BASE_URL}/contact`}
      />
      <PageHead title="தொடர்புகொள்ள" note="கருத்துகள், திருத்தங்கள், பரிந்துரைகள் அனைத்தும் வரவேற்கப்படுகின்றன" />

      <section className="section">
        <div className="container" style={{ maxWidth: 700 }}>
          <div className="card" style={{ padding: 28 }}>
            <h2>மின்னஞ்சல்</h2>
            <p>
              திருத்தங்கள், கூடுதல் உரைகள், அல்லது தளம் குறித்த கருத்துகளுக்கு:{' '}
              <a className="movo-link" href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--gold-deep)' }}>
                {CONTACT_EMAIL}
              </a>
            </p>
            <h2 className="mt-3" style={{ fontSize: 19 }}>எந்த விசயங்களுக்கு எழுதலாம்?</h2>
            <ul style={{ lineHeight: 2 }}>
              <li>ஒரு குறளின் பொருள்/உரை திருத்தம்</li>
              <li>புதிய உரைகள் அல்லது மொழிபெயர்ப்பு பரிந்துரை</li>
              <li>வகைகள் (categories) பரிந்துரைகள்</li>
              <li>வினாடி வினா கேள்விகள்</li>
            </ul>
            <p className="muted mt-2" style={{ fontSize: 14 }}>
              பதில் தர சில நாட்கள் ஆகலாம். தேவையற்ற மின்னஞ்சல்களை அனுப்ப வேண்டாம் — நாங்கள்
              விளம்பரங்களை அனுப்புவதில்லை.
            </p>
            <div className="row mt-3">
              <a className="btn btn-primary" href={`mailto:${CONTACT_EMAIL}`}>
                மின்னஞ்சல் அனுப்பு →
              </a>
              <Link to="/about" className="btn btn-ghost">குறளகம் பற்றி</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}