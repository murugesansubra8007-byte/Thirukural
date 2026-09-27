import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { Loading, PageHead, PaalBadge } from '../components';
import Icon from '../components/Icon';

export default function LearnDeep() {
  const { section } = useParams();
  const [chapters, setChapters] = useState(null);

  useEffect(() => {
    api('/chapters').then((d) => setChapters(d.chapters)).catch(() => setChapters([]));
  }, []);

  if (!chapters) return <Loading />;

  const groups = {};
  for (const c of chapters) {
    (groups[c.paal] = groups[c.paal] || []).push(c);
  }

  const meta = {
    'structure-overview': {
      title: 'மூன்று பால்கள் — விரிவான கண்ணோட்டம்',
      note: 'அறம், பொருள், காமம்: வாழ்க்கையின் முழு வரைபடம்',
    },
    architecture: {
      title: '133 + 1330 + 3 — திருக்குறளின் அமைப்பு',
      note: 'நூலின் கட்டுமானத்தின் எளிய விளக்கம்',
    },
    structure: {
      title: 'குறளின் அமைப்பு (ரெண்டு அடி, ஏழு சீர்)',
      note: 'ஒரு குறளின் ஓசை, சீர், அமைப்பு',
    },
  };
  const m = meta[section] || meta['structure-overview'];

  return (
    <div>
      <PageHead title={m.title} note={m.note} />

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          {section === 'structure' ? (
            <>
              <div className="kural-slab" style={{ marginBottom: 20 }}>
                <p className="verse" style={{ fontSize: 24 }}>
                  <span className="l1">அகர முதல எழுத்தெல்லாம் ஆதி</span>
                  <span className="l2">பகவன் முதற்றே உலகு.</span>
                </p>
                <p className="muted" style={{ fontSize: 14 }}>குறள் 1</p>
              </div>
              <p>
                <b>முதல் அடி:</b> அகர / முதல / எழுத்தெல்லாம் / ஆதி — 4 சீர்கள்
              </p>
              <p>
                <b>இரண்டாம் அடி:</b> பகவன் / முதற்றே / உலகு — 3 சீர்கள்
              </p>
              <p>
                ஒரு குறள் இரண்டு அடிகளிலும் இரண்டாம் அடி முதல் அடியை விட ஒரு சீர் குறைந்து,
                மொத்தம் 7 சீர்கள் உடையது. நடுவில் "முதற்றே" — சந்தி இனிமைக்காக. இவ்வமைப்பே
                "குறள் வெண்பா" எனப்படுகிறது.
              </p>
              <p>
                அளவு முறை: கு–றள்–வெண்–பா. ஓசை நோக்கி எழுதப்பட்ட இலக்கியம் என்பதால்,
                வாசிக்கும்போது அழகான இசைநயம் தோன்றும்.
              </p>
              <div className="alert-ok" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="bulb" size={17} />
                <span>வார்த்தை வீழ்ச்சியிலும் ஓசை — தினம் ஒரு குறள் பக்கத்தில் </span>
                <Icon name="volume" size={16} />
                <span>பொத்தானை அழுத்திக் கேளுங்கள்!</span>
              </div>
            </>
          ) : (
            <div className="learn-paals">
              {[1, 2, 3].map((pnum) => {
                const list = groups[pnum] || [];
                const name = list[0]?.paalName;
                const titles = {
                  1: 'அறத்துப்பால் — அறத்தின் வழி நிற்றல்',
                  2: 'பொருட்பால் — மன்னன், நாடு, பொருள், நட்பு',
                  3: 'காமத்துப்பால் — காதலும் வாழ்க்கைத் துணையும்',
                };
                const notes = {
                  1: '38 அதிகாரங்கள் · கடவுள் வாழ்த்து முதல் ஊழ் வரை',
                  2: '70 அதிகாரங்கள் · இறைமாட்சி முதல் கயமை வரை',
                  3: '25 அதிகாரங்கள் · தகை அணங்குறுத்தல் முதல் ஊடலுவகை வரை',
                };
                return (
                  <div key={pnum} className="card" style={{ padding: 24, marginBottom: 18 }}>
                    <div className="row">
                      <h2 style={{ fontSize: 22, margin: 0 }}>{titles[pnum]}</h2>
                      <PaalBadge name={name} />
                    </div>
                    <p className="muted">{notes[pnum]}</p>
                    <div className="tag-row mt-1">
                      {list.map((c) => (
                        <Link key={c.number} to={`/chapters/${c.number}`} className="tag" style={{ padding: '5px 11px' }}>
                          {c.number}. {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div className="row">
                <Link to="/learn" className="btn btn-ghost">← கற்றல் முகப்பு</Link>
                <Link to="/chapters" className="btn btn-primary">அனைத்து அதிகாரங்கள் →</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}