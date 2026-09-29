import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getFavorites } from '../api';
import { Loading, PageHead, EmptyState } from '../components';
import { FavoriteButton, ShareButton, KuralRow } from '../components/Kural';
import Icon from '../components/Icon';

function readVisited() {
  try {
    return JSON.parse(localStorage.getItem('kg_visited') || '[]');
  } catch (e) {
    return [];
  }
}

export default function Favorites() {
  const [favNums, setFavNums] = useState(getFavorites());
  const [visited, setVisited] = useState(readVisited());
  const [faved, setFaved] = useState(null);
  const [visitedKurals, setVisitedKurals] = useState(null);
  const [tab, setTab] = useState('favorites');

  useEffect(() => {
    if (favNums.length === 0) {
      setFaved([]);
      return;
    }
    api(`/kurals?numbers=${favNums.join(',')}`)
      .then((d) => setFaved(d.kurals))
      .catch(() => setFaved([]));
  }, [favNums]);

  useEffect(() => {
    if (visited.length === 0) {
      setVisitedKurals([]);
      return;
    }
    api(`/kurals?numbers=${visited.join(',')}`)
      .then((d) => setVisitedKurals(d.kurals.sort((a, b) => b.number - a.number)))
      .catch(() => setVisitedKurals([]));
  }, [visited]);

  const remove = (n) => {
    setFavNums((prev) => prev.filter((x) => x !== n));
  };

  return (
    <div>
      <PageHead title="என் குறள்கள்" note="விருப்பமான குறள்களும், சமீபத்தில் பார்த்தவையும்" />

      <section className="section">
        <div className="container">
          <div className="tabs">
            <button className={`tab${tab === 'favorites' ? ' active' : ''}`} onClick={() => setTab('favorites')}>
              <Icon name="heart" size={15} /> விருப்பு ({favNums.length})
            </button>
            <button className={`tab${tab === 'visited' ? ' active' : ''}`} onClick={() => setTab('visited')}>
              <Icon name="clock" size={15} /> சமீபத்தில் ({visited.length})
            </button>
          </div>

          {tab === 'favorites' ? (
            !faved ? (
              <Loading />
            ) : faved.length === 0 ? (
              <EmptyState
                icon="heart"
                title="விருப்புகள் இன்னும் இல்லை"
                note="குறள் பக்கத்தில் இதயக் குறியை அழுத்தி விருப்புகளைச் சேருங்கள்."
              >
                <Link to="/chapters" className="btn btn-primary">குறள்களைப் படிக்க →</Link>
              </EmptyState>
            ) : (
              faved.map((k) => (
                <div key={k.number} className="kural-row">
                  <Link className="lines" to={`/kural/${k.number}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span className="t">
                      <span className="no" style={{ marginRight: 10, display: 'inline-flex' }}>{String(k.number).padStart(4, '0')}</span>
                      {k.line1} {k.line2}
                    </span>
                    <span className="m">{k.chapterName}</span>
                  </Link>
                  <ShareButton kural={k} small />
                  <button className="icon-btn" title="நீக்கு" onClick={() => remove(k.number)}>
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              ))
            )
          ) : !visitedKurals ? (
            <Loading />
          ) : visitedKurals.length === 0 ? (
            <EmptyState icon="clock" title="குறள் பார்க்கவில்லை" note="குறள் பக்கங்களை உலாவும்போது வரலாறு இங்கே சேமிக்கப்படும்." />
          ) : (
            visitedKurals.map((k) => <KuralRow key={k.number} k={k} />)
          )}
        </div>
      </section>
    </div>
  );
}