import React from 'react';
import { Link } from 'react-router-dom';
import { PageHead } from '../components';
import Seo, { BASE_URL } from '../seo';
import { img } from '../assets';

const TEAM = [
  {
    url: 'https://heymovox.com/team/1786858127803',
    photo: 'team/srinath.jpg',
    name: 'Srinath Perumal',
    role: 'Founder & Creative Director',
    tags: ['Graphic Design', 'UX/UI', 'Branding', 'Video Editing'],
    bio: '7+ ஆண்டுகள் அனுபவம் கொண்ட கிரியேட்டிவ் டைரக்டர்; மொத்த வடிவமைப்பு, பிராண்டிங் மற்றும் கிரியேட்டிவ் திசைக்கு பொறுப்பு.',
  },
  {
    url: 'https://heymovox.com/team/1786860155627',
    photo: 'team/santhosh.jpg',
    name: 'Santhosh Vijayakumar',
    role: 'Digital Marketer',
    tags: ['SEO', 'Digital Marketing', 'Ads Campaign'],
    bio: 'சமூக ஊடகம், பிராண்ட் மூலோபாயம், SEO மற்றும் டிஜிட்டல் கேம்பெயின்களில் வணிகங்களை வளரச் செய்யும் மார்க்கெட்டிங் நிபுணர்.',
  },
  {
    url: 'https://heymovox.com/team/1787069373384',
    photo: 'team/shahul.jpg',
    name: 'Shahul Hameed S',
    role: 'Animator & Video Editor',
    tags: ['Video Editor', 'Animation Creator'],
    bio: 'ஆக்கப்பூர்வமான காட்சி அனுபவங்களை உருவாக்கும் ஆர்வமுள்ள வீடியோ எடிட்டர் மற்றும் அனிமேட்டர்.',
  },
  {
    url: 'https://heymovox.com/team/1787069705808',
    photo: 'team/irfan.jpg',
    name: 'Irfan Rahmathulla',
    role: 'Marketing Manager',
    tags: ['Manager', 'Marketing'],
    bio: 'பிராண்ட் மூலோபாயங்கள், வாடிக்கையாளர் ஈடுபாடு மற்றும் நிலையான வணிக வளர்ச்சியில் கவனம் கொண்ட மார்க்கெட்டிங் மேலாளர்.',
  },
  {
    url: 'https://heymovox.com/team/1787578713793',
    photo: 'team/sathish.jpg',
    name: 'Sathish Kumar K',
    role: 'App Developer',
    tags: ['React', 'JS', 'Android'],
    bio: 'ஹோசூரைச் சேர்ந்த மென்பொருள் உருவாக்குனர்; தெளிவான குறியீடு, திட்டமிட்ட அமைப்பில் பயனுள்ள டிஜிட்டல் தீர்வுகளை உருவாக்குபவர்.',
  },
];

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

          <h2 className="mt-3" style={{ fontSize: 24 }}>எங்கள் குழு</h2>
          <p className="muted mb-2">
            குறளகத்தை உருவாக்கி வழிநடத்தும் MOVOX Digital Growth குழுவினர்.
          </p>
          <div className="team-grid">
            {TEAM.map((m) => (
              <a className="card team-card" href={m.url} target="_blank" rel="noopener noreferrer" key={m.name}>
                <img className="team-photo" src={img(m.photo)} alt={m.name} loading="lazy" />
                <div className="team-info">
                  <h3 className="team-name">{m.name}</h3>
                  <div className="team-role">{m.role}</div>
                  <div className="team-tags">
                    {m.tags.map((t) => (
                      <span className="tag" key={t}>{t}</span>
                    ))}
                  </div>
                  <p className="team-bio">{m.bio}</p>
                </div>
              </a>
            ))}
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