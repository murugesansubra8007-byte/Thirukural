import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { Loading, PageHead, EmptyState } from '../components';

export function Blog() {
  const [data, setData] = useState(null);
  useEffect(() => {
    api('/blog').then((d) => setData(d)).catch(() => setData({ posts: [] }));
  }, []);
  if (!data) return <Loading />;

  return (
    <div>
      <PageHead title="எழுத்துகள் — வலைக்கட்டுரைகள்" note="திருக்குறள் தொடர்பான கட்டுரைகள், தொகுப்புகள், பகுப்பாய்வுகள்" />
      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {data.posts.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="card blog-card" style={{ borderTop: `5px solid ${p.coverColor || '#a0401f'}` }}>
                <div className="row">
                  <span className="tag">✦ {p.author}</span>
                  <span className="muted" style={{ fontSize: 12.5 }}>
                    {new Date(p.publishedAt).toLocaleDateString('ta-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <div className="blog-tags">
                  {(p.tags || []).map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function BlogArticle() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api(`/blog/${encodeURIComponent(slug)}`).then((d) => setPost(d.post)).catch((e) => setErr(e.message));
  }, [slug]);

  if (err) return <EmptyState icon="📄" title="கட்டுரை கிடைக்கவில்லை" note={err} />;
  if (!post) return <Loading />;

  return (
    <div>
      <PageHead
        title={post.title}
        note={`${post.author} · ${new Date(post.publishedAt).toLocaleDateString('ta-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`}
      />
      <section className="section">
        <div className="container">
          <article className="article-body">
            <Content text={post.content} />
          </article>
          <div className="row mt-3">
            <Link to="/blog" className="btn btn-ghost">← அனைத்து கட்டுரைகள்</Link>
            <Link to="/explore" className="btn btn-outline">குறளைத் தேடு</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Very small markdown-ish renderer: # heading, > blockquote, - list, otherwise paragraph. */
export function Content({ text }) {
  const lines = String(text || '').split('\n');
  const blocks = [];
  let list = null;
  let quote = null;
  let para = [];

  const flush = () => {
    if (para.length) {
      blocks.push(<p key={blocks.length}>{renderInline(para.join(' '))}</p>);
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push(
        <ul key={blocks.length}>
          {list.map((li, i) => (
            <li key={i}>{renderInline(li)}</li>
          ))}
        </ul>
      );
      list = null;
    }
  };
  const flushQuote = () => {
    if (quote.length) {
      blocks.push(<blockquote key={blocks.length}>{quote.map((q, i) => <p key={i}>{renderInline(q)}</p>)}</blockquote>);
      quote = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (line === '') {
      flush(); flushList(); flushQuote();
      continue;
    }
    if (line.startsWith('# ')) {
      flush(); flushList(); flushQuote();
      blocks.push(<h2 key={blocks.length}>{renderInline(line.slice(2))}</h2>);
      continue;
    }
    if (line.startsWith('- ')) {
      flushQuote();
      flush();
      if (!list) list = [];
      list.push(line.slice(2));
      continue;
    }
    if (line.startsWith('> ')) {
      flushList();
      flush();
      if (!quote) quote = [];
      quote.push(line.slice(2));
      continue;
    }
    flushList(); flushQuote();
    para.push(line);
  }
  flush(); flushList(); flushQuote();

  return <>{blocks}</>;
}

function renderInline(text) {
  const parts = [];
  const regex = /\*\*(.+?)\*\*|`(.+?)`/g;
  let last = 0;
  let m;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(m[1] ? <strong key={i++}>{m[1]}</strong> : <code key={i++}>{m[2]}</code>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  if (parts.length === 0) return text;
  if (parts.length === 1 && typeof parts[0] === 'string') return parts[0];
  return parts;
}