import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Loading, PageHead } from '../components';
import Icon from '../components/Icon';

export default function Quiz() {
  const [round, setRound] = useState(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [chosen, setChosen] = useState(null);
  const [done, setDone] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const start = async () => {
    setDone(false);
    setIdx(0);
    setAnswers([]);
    setSubmitted(false);
    setChosen(null);
    const d = await api('/quiz?count=5');
    setRound(d);
  };

  useEffect(() => {
    start();
  }, []);

  if (!round) return <Loading />;

  const question = round.questions[idx];
  const score = answers.filter((a) => a.ok).length;

  const choose = (opt) => {
    if (chosen) return;
    setChosen(opt);
    const ok = opt === question.correct;
    const nextAnswers = [...answers, { q: question.id, ok, correct: question.correct, chosen: opt }];
    setAnswers(nextAnswers);
    setTimeout(() => {
      if (idx + 1 < round.questions.length) {
        setIdx(idx + 1);
        setChosen(null);
      } else {
        setDone(true);
        api('/quiz/attempt', { method: 'POST', body: { score: nextAnswers.filter((a) => a.ok).length, total: round.questions.length, answers: nextAnswers } }).catch(() => {});
      }
    }, 900);
  };

  if (done) {
    return (
      <div>
        <PageHead title="வினாடி வினா — முடிவு" />
        <section className="section">
          <div className="container quiz-box">
            <div className="card score-ring">
              <div className="score-num">
                {score}/{round.questions.length}
              </div>
              <h2>
                {score === round.questions.length ? (
                  <>
                    <Icon name="trophy" size={20} /> சிறப்பு!
                  </>
                ) : score >= 3 ? (
                  <>
                    <Icon name="thumbs-up" size={20} /> நல்லது!
                  </>
                ) : (
                  <>
                    <Icon name="sprout" size={20} /> மேலும் படிக்கலாம்
                  </>
                )}
              </h2>
              <p className="muted">Your Score: {score}/{round.questions.length}</p>
              <div className="row" style={{ justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={start}>மீண்டும் முயற்சி</button>
                <Link to="/learn" className="btn btn-ghost">மேலும் கற்றல்</Link>
              </div>
              <p className="muted mt-2" style={{ fontSize: 13 }}>Leaderboard (இன்று)</p>
              <LeaderboardBrief />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHead
        title="தினம்தோறும் வினாடி வினா"
        note={`கேள்வி ${idx + 1} / ${round.questions.length} · ${round.date}`}
      />
      <section className="section">
        <div className="container quiz-box">
          <div className="card" style={{ padding: 26 }}>
            <p style={{ fontSize: 17, fontFamily: 'var(--font-serif)', fontWeight: 600, lineHeight: 1.7 }}>
              {question.text}
            </p>
            <div className="mt-2">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  className={`quiz-option${
                    chosen
                      ? opt === question.correct
                        ? ' correct'
                        : opt === chosen
                          ? ' wrong'
                          : ''
                      : ''
                  }`}
                  disabled={!!chosen}
                  onClick={() => choose(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            {chosen && (
              <p className="muted mt-2" style={{ fontSize: 14 }}>
                {chosen === question.correct ? (
                  <>
                    <Icon name="check" size={14} /> சரி!
                  </>
                ) : (
                  <>
                    <Icon name="x" size={14} /> பதில்: {question.correct}
                  </>
                )}
                {' '}
                <Link to={`/kural/${question.kuralNumber}`} style={{ textDecoration: 'underline' }}>
                  குறள் {question.kuralNumber} ஐப் பார்க்க →
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function LeaderboardBrief() {
  const [board, setBoard] = useState([]);
  useEffect(() => {
    api('/quiz/leaderboard').then((d) => setBoard(d.leaderboard)).catch(() => {});
  }, []);
  if (!board.length) return <p className="muted" style={{ fontSize: 13 }}>இன்று இன்னும் விளையாடவில்லை.</p>;
  return (
    <div className="mt-1" style={{ fontSize: 13, color: 'var(--muted)' }}>
      {board[0].top.slice(0, 3).map((a, i) => (
        <div key={i}>#{i + 1} — {a.score}/{a.total}</div>
      ))}
    </div>
  );
}