import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import { Loading } from '../../components';
import Icon from '../../components/Icon';

export default function AdminQuiz() {
  const [attempts, setAttempts] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ text: '', options: '', correct: '', explanation: '' });

  const loadAttempts = () => api('/admin/quiz-attempts').then((d) => setAttempts(d.attempts)).catch(() => setAttempts([]));
  const loadQuestions = () => api('/quiz/manage').then((d) => setQuestions(d.questions)).catch(() => setQuestions([]));

  useEffect(() => {
    loadAttempts();
    loadQuestions();
  }, []);

  if (!attempts) return <Loading />;

  const saveQuestion = async (e) => {
    e.preventDefault();
    const options = form.options.split(',').map((s) => s.trim()).filter(Boolean);
    await api('/quiz/manage', {
      method: 'POST',
      body: { text: form.text, options, correct: form.correct, explanation: form.explanation },
    });
    setForm({ text: '', options: '', correct: '', explanation: '' });
    loadQuestions();
  };

  const delQuestion = async (id) => {
    if (!window.confirm('கேள்வியை நீக்கவா?')) return;
    await api(`/quiz/manage/${id}`, { method: 'DELETE' });
    loadQuestions();
  };

  return (
    <div>
      <h1 style={{ fontSize: 24 }}>Quiz Management</h1>
      <p className="muted" style={{ marginTop: -6 }}>தினம்தோறும் தானாக உருவாகும் வினாடி வினா + கூடுதல் கேள்விகள்</p>

      <div className="grid grid-2 mt-2" style={{ alignItems: 'start' }}>
        <div className="card admin-card">
          <h2 style={{ fontSize: 17 }}>நேற்றைய முயற்சிகள்</h2>
          {attempts.length === 0 ? (
            <p className="muted">இதுவரை முயற்சிகள் இல்லை</p>
          ) : (
            <table className="table">
              <thead><tr><th>தேதி</th><th>மதிப்பெண்</th><th>நேரம்</th></tr></thead>
              <tbody>
                {attempts.slice(0, 50).map((a) => (
                  <tr key={a.id}>
                    <td>{a.date}</td>
                    <td><b>{a.score}/{a.total}</b></td>
                    <td className="muted">{new Date(a.createdAt).toLocaleTimeString('ta-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card admin-card">
          <h2 style={{ fontSize: 17 }}>சொந்தக் கேள்விகள்</h2>
          <form onSubmit={saveQuestion}>
            <div className="field">
              <label>கேள்வி</label>
              <input className="input" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} required />
            </div>
            <div className="field">
              <label>விடைகள் (காற்புள்ளியால்: A, B, C, D)</label>
              <input className="input" value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} required />
            </div>
            <div className="field">
              <label>சரியான விடை</label>
              <input className="input" value={form.correct} onChange={(e) => setForm({ ...form, correct: e.target.value })} required />
            </div>
            <div className="field">
              <label>விளக்கம்</label>
              <input className="input" value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} />
            </div>
            <button className="btn btn-primary">+ கேள்வி சேர்</button>
          </form>

          <div className="mt-2">
            {questions.map((q) => (
              <div key={q.id} className="kural-row">
                <span style={{ flex: 1 }}>
                  <b>{q.text}</b>
                  <span className="m" style={{ display: 'block', fontSize: 12.5 }}>சரி: {q.correct}</span>
                </span>
                <button className="btn btn-sm btn-ghost" onClick={() => delQuestion(q.id)}>
                  <Icon name="trash" size={15} />
                </button>
              </div>
            ))}
            {questions.length === 0 && <p className="muted">சொந்தக் கேள்விகள் இல்லை — தானியங்கி கேள்விகளே பயன்படும்.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}