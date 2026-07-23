'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { Post } from '@/types';

interface PageData {
  content: Post[];
  totalPages: number;
  first: boolean;
  last: boolean;
}

export default function InsightsPageClient({ initialData }: { initialData: PageData }) {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PageData>(initialData);
  const pageRef = useRef<HTMLDivElement>(null);

  // Re-fetch when page changes (page > 0)
  useEffect(() => {
    if (page === 0) {
      setData(initialData);
      return;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
    fetch(`${apiUrl}/posts?category=INSIGHT&page=${page}&size=12`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData(d); })
      .catch(() => {});
  }, [page, initialData]);

  useEffect(() => {
    const els = pageRef.current?.querySelectorAll('.reveal');
    if (!els) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [data]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div ref={pageRef} style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ═══ Hero — charcoal ═══ */}
      <section style={{ position: 'relative', background: 'var(--charcoal)', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />
        <div className="blob blob-accent" aria-hidden="true" style={{ width: 370, height: 370, right: '3%', top: '10%' }} />
        <div className="blob blob-wine" aria-hidden="true" style={{ width: 250, height: 250, left: '7%', bottom: '8%', animationDelay: '10s' }} />
        <div aria-hidden="true" style={{ position: 'absolute', width: 15, height: 15, right: '20%', top: '28%', border: '1.5px solid rgba(255,255,255,.08)', transform: 'rotate(45deg)', animation: 'geoFloat1 13s ease-in-out infinite', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', right: '-5%', top: '10%', fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(120px, 22vw, 320px)', fontWeight: 300, color: 'rgba(255,255,255,.025)', lineHeight: 1, pointerEvents: 'none' }}>Insights</div>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 80%, rgba(148,53,67,.07) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1, padding: '120px clamp(20px,4vw,52px) 64px' }}>
          <p className="eyebrow" style={{ color: 'rgba(255,255,255,.4)', margin: '0 0 16px' }}>INSIGHTS</p>
          <h1 style={{ fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)', lineHeight: .92, letterSpacing: '-.045em', color: '#fff', margin: '0 0 16px' }}>인사이트</h1>
          <p style={{ fontWeight: 400, fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,.5)', maxWidth: 480, margin: 0 }}>IT 담당자를 위한 최신 트렌드, 활용 팁, 전문가 칼럼</p>
        </div>
      </section>

      {/* ═══ Featured / first post ═══ */}
      {data && data.content.length > 0 && page === 0 && (
        <section style={{ padding: 'clamp(80px, 7vw, 80px) 0', borderBottom: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
          <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />
          <div className="wrap">
            <Link href={`/insights/${data.content[0].id}`} className="reveal insight-featured" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, textDecoration: 'none', alignItems: 'center' }}>
              <div style={{ background: 'var(--charcoal)', minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(148,53,67,.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
                <span style={{ fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic', fontSize: 80, fontWeight: 300, color: 'rgba(255,255,255,.06)' }}>✦</span>
                <span style={{ position: 'absolute', top: 16, left: 16, padding: '5px 12px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize: 18, fontWeight: 600, letterSpacing: '.08em', background: 'var(--accent)', color: '#fff' }}>LATEST</span>
              </div>
              <div>
                <p style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontWeight: 500, fontSize: 18, letterSpacing: '.1em', color: 'var(--ink2)', margin: '0 0 12px' }}>{formatDate(data.content[0].createdAt)}</p>
                <h2 className="featured-title" style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', lineHeight: 1.2, letterSpacing: '-.03em', color: 'var(--ink)', margin: '0 0 12px', transition: 'color .2s' }}>{data.content[0].title}</h2>
                {data.content[0].excerpt && (
                  <p style={{ fontSize: 18, lineHeight: 1.7, color: 'var(--ink2)', margin: '0 0 20px', maxWidth: 440, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{data.content[0].excerpt}</p>
                )}
                <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize: 18, fontWeight: 600, letterSpacing: '.04em', color: 'var(--accent)' }}>READ MORE →</span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ═══ Post list ═══ */}
      <section style={{ padding: 'clamp(80px, 7vw, 80px) 0', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />
        <div className="blob blob-graphite" aria-hidden="true" style={{ width: 280, height: 280, left: '3%', top: '25%', animationDelay: '6s' }} />
        <div className="wrap">
          {data && (
            <>
              {data.content.length === 0 ? (
                <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--ink2)', fontSize: 18 }}>등록된 인사이트가 없습니다.</div>
              ) : (
                <div>
                  {(page === 0 ? data.content.slice(1) : data.content).map((post: Post, idx: number) => (
                    <Link key={post.id} href={`/insights/${post.id}`} className="reveal insight-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '22px 0', borderBottom: '1px solid var(--line)', textDecoration: 'none', transition: 'padding-left .2s', transitionDelay: `${idx * 0.03}s` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
                        <span style={{ fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic', fontSize: 18, fontWeight: 300, color: 'var(--line)', width: 32, flexShrink: 0, textAlign: 'right' }}>{String((page === 0 ? idx + 2 : idx + 1) + page * 12).padStart(2, '0')}</span>
                        <div style={{ flex: 1 }}>
                          <h3 className="row-title" style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.4, color: 'var(--ink)', margin: 0, transition: 'color .2s' }}>{post.title}</h3>
                          {post.excerpt && (
                            <p style={{ fontSize: 18, lineHeight: 1.5, color: 'var(--ink2)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{post.excerpt}</p>
                          )}
                        </div>
                      </div>
                      <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontWeight: 500, fontSize: 18, letterSpacing: '.06em', color: 'var(--ink2)', flexShrink: 0 }}>{formatDate(post.createdAt)}</span>
                      <span className="row-arrow" style={{ fontSize: 18, color: 'var(--accent)', opacity: 0, transition: 'opacity .2s', flexShrink: 0 }}>→</span>
                    </Link>
                  ))}
                </div>
              )}

              {data.totalPages > 1 && (
                <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <button disabled={data.first} onClick={() => setPage((p) => p - 1)} style={{ padding: '10px 20px', border: '1px solid var(--line)', background: 'transparent', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontWeight: 600, fontSize: 18, letterSpacing: '.04em', color: data.first ? 'var(--line)' : 'var(--ink2)', cursor: data.first ? 'default' : 'pointer' }}>PREV</button>
                  {Array.from({ length: data.totalPages }, (_, i) => (
                    <button key={i} onClick={() => setPage(i)} style={{ width: 36, height: 36, border: '1px solid var(--line)', background: page === i ? 'var(--charcoal)' : 'transparent', color: page === i ? '#fff' : 'var(--ink2)', fontWeight: 600, fontSize: 18, cursor: 'pointer', transition: 'background .15s, color .15s' }}>{i + 1}</button>
                  ))}
                  <button disabled={data.last} onClick={() => setPage((p) => p + 1)} style={{ padding: '10px 20px', border: '1px solid var(--line)', background: 'transparent', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontWeight: 600, fontSize: 18, letterSpacing: '.04em', color: data.last ? 'var(--line)' : 'var(--ink2)', cursor: data.last ? 'default' : 'pointer' }}>NEXT</button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <style>{`
        .insight-featured:hover .featured-title { color: var(--accent) !important; }
        .insight-row:hover { padding-left: 12px !important; }
        .insight-row:hover .row-title { color: var(--accent) !important; }
        .insight-row:hover .row-arrow { opacity: 1 !important; }
        @media (max-width: 920px) {
          .insight-featured { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
