'use client';

import React, { useState, useEffect } from 'react';
import { E, useEditableContent, EDITABLE_STYLES } from '@/lib/editable';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const UP = '/images/uploads/';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface NoticePost { id: number; title: string; excerpt?: string; createdAt: string; img?: string; [key: string]: any; }

interface PageData {
  content: NoticePost[];
  totalPages: number;
  first: boolean;
  last: boolean;
}

const PER_PAGE = 6;

const DEFAULTS = {} as const;

export default function NoticesPageClient({ initialData }: { initialData: PageData }) {
  const [, editMode] = useEditableContent(DEFAULTS, {});
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PageData>(initialData);

  useEffect(() => {
    if (page === 0) {
      setData(initialData);
      return;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
    fetch(`${apiUrl}/posts?category=NOTICE&page=${page}&size=${PER_PAGE}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData(d); })
      .catch(() => {});
  }, [page, initialData]);

  const notices = data?.content ?? [];

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [data]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ═══ Hero ═══ */}
      <section style={{ position: 'relative', background: 'var(--soft)', overflow: 'hidden', borderBottom: '1px solid var(--line)' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />
        <div className="blob blob-accent" aria-hidden="true" style={{ width: 350, height: 350, right: '5%', top: '5%' }} />
        <div className="blob blob-lavender" aria-hidden="true" style={{ width: 250, height: 250, left: '10%', bottom: '5%', animationDelay: '8s' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1, padding: '120px clamp(20px,4vw,52px) 64px' }}>
          <p style={{ fontFamily: MONO, fontWeight: 500, fontSize: 18, letterSpacing: '.14em', color: 'var(--accent)', margin: '0 0 12px' }}>NOTICES</p>
          <h1 style={{ fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)', lineHeight: 1.05, letterSpacing: '-.04em', color: 'var(--ink)', margin: '0 0 8px' }}><E id="notices_hero.title" editMode={editMode}>공지사항</E></h1>
          <p style={{ fontWeight: 400, fontSize: 18, color: 'var(--ink2)', margin: 0 }}><E id="notices_hero.subtitle" editMode={editMode}>유니온시스템즈의 즐거운 최신 소식들을 만나보세요!</E></p>
        </div>
      </section>

      {/* ═══ 3열 이미지 카드 ═══ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />
        <div className="blob blob-accent" aria-hidden="true" style={{ width: 280, height: 280, left: '-3%', top: '20%', animationDelay: '4s' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          {notices.length > 0 && (
            <div className="ntc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {notices.map((post: NoticePost, idx: number) => {
                const img = post.img || `${UP}01_1.png`;
                return (
                  <div key={post.id} className="reveal ntc-card" style={{ border: '1px solid var(--line)', overflow: 'hidden', background: 'var(--surface)', cursor: 'pointer', transition: 'transform .3s cubic-bezier(.16,.84,.3,1), box-shadow .3s', transitionDelay: `${idx * 0.05}s` }}>
                    <div style={{ overflow: 'hidden', aspectRatio: '16/10' }}>
                      <img src={img} alt={post.title} className="ntc-img" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s' }} onError={(e) => { (e.target as HTMLImageElement).src = `${UP}01_1.png`; }} />
                    </div>
                    <div style={{ padding: '20px 22px' }}>
                      <h3 className="ntc-title" style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink)', margin: '0 0 8px', lineHeight: 1.4, transition: 'color .2s', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.title}</h3>
                      {post.excerpt && (
                        <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--ink2)', margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>
                      )}
                      <span style={{ fontFamily: MONO, fontSize: 18, color: 'var(--ink2)' }}>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {data && data.totalPages > 1 && (
            <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <button disabled={data.first} onClick={() => setPage(p => p - 1)} style={{ padding: '10px 20px', border: '1px solid var(--line)', background: 'transparent', fontFamily: MONO, fontWeight: 600, fontSize: 13, letterSpacing: '.04em', color: data.first ? 'var(--line)' : 'var(--ink2)', cursor: data.first ? 'default' : 'pointer' }}>PREV</button>
              {Array.from({ length: data.totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i)} style={{ width: 36, height: 36, border: '1px solid var(--line)', background: page === i ? 'var(--charcoal)' : 'transparent', color: page === i ? '#fff' : 'var(--ink2)', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'background .15s, color .15s' }}>{i + 1}</button>
              ))}
              <button disabled={data.last} onClick={() => setPage(p => p + 1)} style={{ padding: '10px 20px', border: '1px solid var(--line)', background: 'transparent', fontFamily: MONO, fontWeight: 600, fontSize: 13, letterSpacing: '.04em', color: data.last ? 'var(--line)' : 'var(--ink2)', cursor: data.last ? 'default' : 'pointer' }}>NEXT</button>
            </div>
          )}
        </div>
      </section>

      {editMode && <style>{EDITABLE_STYLES}</style>}

      <style>{`
        .ntc-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px rgba(0,0,0,.08) !important; }
        .ntc-card:hover .ntc-title { color: var(--accent) !important; }
        .ntc-card:hover .ntc-img { transform: scale(1.05); }
        @media (max-width: 920px) { .ntc-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .ntc-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
