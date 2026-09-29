import React from 'react';
import { Link } from 'react-router-dom';
import { PageHead } from '../components';

export default function AboutValluvar() {
  return (
    <div>
      <PageHead title="திருவள்ளுவர்" note="தமிழின் போற்றுதலுக்குரிய முனிவரும், திருக்குறளின் ஆசிரியரும்" />

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="card" style={{ padding: 30 }}>
            <h2>வள்ளுவர் யார்?</h2>
            <p>
              திருவள்ளுவர் (திருவள்ளுவ நாயனார்) என்பவர் திருக்குறளை இயற்றிய தமிழ்ப் பெருந் தனித்
              தமிழ் முனிவர். அவரைப் பற்றிய வரலாற்று ஆதாரங்கள் குறைவு என்றாலும், "முப்பால் புலவன்"
              எனப் போற்றப்படுகிறார். வள்ளுவர் காலம் பல அறிஞர்களால் கி.மு. முதல் கி.பி. மூன்றாம்
              நூற்றாண்டுக்கு இடைப்பட்டதாக மதிப்பிடப்படுகிறது.
            </p>
            <p>
              வள்ளுவர் குறளில் அறம், பொருள், காமம் என மூன்று பால்களை வகுத்தார். இவரது நூல்
              வெறும் மத நூல் அல்ல; மனிதனின் வாழ்க்கையை முழுமையாக வழிகாட்டும் நூல்.
            </p>
          </div>

          <h2 className="mt-3" style={{ fontSize: 24 }}>வள்ளுவரின் இலக்கியப் பயணம்</h2>
          <div className="timeline mt-2">
            <div className="timeline-item">
              <h4>குறளின் தோற்றம்</h4>
              <p>திருநெல்வேலி எல்லையில் இன்றும் சான்றுகள். வள்ளுவர் அவையில் குறளை இயற்றினார்.</p>
            </div>
            <div className="timeline-item">
              <h4>முப்பால் அமைப்பு</h4>
              <p>அறத்துப்பால் 38, பொருட்பால் 70, காமத்துப்பால் 25 — மொத்தம் 133 அதிகாரங்கள்.</p>
            </div>
            <div className="timeline-item">
              <h4>மொழிபெயர்ப்புகள்</h4>
              <p>ஜி.யு. போப், எம்.எஸ். பர்னல், ஜான் லசான் உள்ளிட்டோர் ஆங்கிலத்தில் மொழிபெயர்த்தனர். இன்று 60+ உலக மொழிகளில் திருக்குறள் உள்ளது.</p>
            </div>
            <div className="timeline-item">
              <h4>உலகளாவிய தாக்கம்</h4>
              <p>திருக்குறள் ஐ.நா. பொதுச்சபையில் 2016-இல் தீர்மானங்களில் மேற்கோளாக இடம்பெற்றது.</p>
            </div>
          </div>

          <div className="grid grid-3 mt-3">
            <div className="card info-card">
              <div className="num">3</div>
              <h3>பால்கள்</h3>
              <p>அறம் · பொருள் · காமம்</p>
            </div>
            <div className="card info-card">
              <div className="num">60+</div>
              <h3>மொழிகள்</h3>
              <p>உலக மொழிகளில் மொழிபெயர்ப்பு</p>
            </div>
            <div className="card info-card">
              <div className="num">2000+</div>
              <h3>ஆண்டுகள்</h3>
              <p>வாழும் இலக்கியம்</p>
            </div>
          </div>

          <div className="row mt-3">
            <Link to="/learn" className="btn btn-primary">கற்றலைத் தொடங்கு →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}