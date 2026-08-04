'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { E, safeParse, useEditMode, useEditableManifest, EDITABLE_STYLES } from '@/lib/editable';
import type { Insight, Page } from '@/types';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

type InsightPage = Pick<Page<Insight>, 'content' | 'totalPages' | 'first' | 'last'>;

export default function InsightsPageClient({
  initialData,
  ssrContent,
}: {
  initialData: InsightPage;
  ssrContent?: Record<string, string>;
}) {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<InsightPage>(initialData);
  const pageRef = useRef<HTMLDivElement>(null);
  const editMode = useEditMode();
  useEditableManifest(editMode);

  useEffect(() => {
    if (page === 0) { setData(initialData); return; }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
    fetch(`${apiUrl}/insights?page=${page}&size=12`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData(d); })
      .catch(() => {});
  }, [page, initialData]);

  /* scroll reveal */
  useEffect(() => {
    const els = pageRef.current?.querySelectorAll('.reveal');
    if (!els) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [data]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const items = data?.content ?? [];

  return (
    <div ref={pageRef} style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {editMode && <style>{EDITABLE_STYLES}</style>}

      {/* ═══ Hero ═══ */}
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
          <h1 style={{ fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)', lineHeight: .92, letterSpacing: '-.045em', color: '#fff', margin: '0 0 16px' }}>
            <E id="insights_hero_title" editMode={editMode}>{safeParse(ssrContent?.['insights_hero_title'], '인사이트')}</E>
          </h1>
          <p style={{ fontWeight: 400, fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,.5)', maxWidth: 640, margin: 0 }}>
            <E id="insights_hero_desc" editMode={editMode}>{safeParse(ssrContent?.['insights_hero_desc'], 'IT 업계 최신 뉴스와 트렌드를 한눈에 확인하세요')}</E>
          </p>
        </div>
      </section>

      {/* ═══ Card Grid ═══ */}
      <section style={{ padding: 'clamp(60px, 7vw, 100px) 0', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />
        <div className="blob blob-graphite" aria-hidden="true" style={{ width: 280, height: 280, left: '3%', top: '25%', animationDelay: '6s' }} />

        <div className="wrap">
          {items.length === 0 ? (
            <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--ink2)', fontSize: 16 }}>
              등록된 인사이트가 없습니다.
            </div>
          ) : (
            <div className="ins-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 28,
            }}>
              {items.map((item: Insight, idx: number) => (
                <a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reveal ins-card"
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    border: '1px solid var(--line)',
                    background: 'var(--surface)',
                    overflow: 'hidden',
                    transition: 'transform .25s cubic-bezier(.16,.84,.3,1), box-shadow .25s',
                    transitionDelay: `${idx * 0.04}s`,
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    position: 'relative',
                    aspectRatio: '16 / 9',
                    overflow: 'hidden',
                    background: 'var(--charcoal)',
                  }}>
                    {item.thumbnail ? (
                      <InsightThumbnail src={item.thumbnail} alt={item.title} />
                    ) : (
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'radial-gradient(ellipse at 50% 50%, rgba(148,53,67,.08) 0%, var(--charcoal) 60%)',
                      }}>
                        <span style={{
                          fontFamily: "'Newsreader', Georgia, serif",
                          fontStyle: 'italic', fontSize: 48, fontWeight: 300,
                          color: 'rgba(255,255,255,.08)',
                        }}>✦</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '20px 22px 24px' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      marginBottom: 10,
                    }}>
                      <span style={{
                        fontFamily: MONO, fontSize: 11, fontWeight: 600,
                        letterSpacing: '.04em', color: 'var(--accent)',
                        padding: '2px 7px', background: 'rgba(245,51,63,.06)',
                      }}>{item.source}</span>
                      <span style={{
                        fontFamily: MONO, fontSize: 11, fontWeight: 500,
                        letterSpacing: '.04em', color: 'var(--ink2)',
                      }}>{formatDate(item.pubDate)}</span>
                    </div>

                    <h3 className="ins-card-title" style={{
                      fontWeight: 700, fontSize: 17, lineHeight: 1.45,
                      color: 'var(--ink)', margin: '0 0 8px',
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      transition: 'color .2s',
                    }}>{item.title}</h3>

                    <p style={{
                      fontSize: 14, lineHeight: 1.6, color: 'var(--ink2)',
                      margin: 0,
                      display: '-webkit-box', WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{item.summary}</p>

                    <div style={{
                      marginTop: 16,
                      fontFamily: MONO, fontSize: 12, fontWeight: 600,
                      letterSpacing: '.04em', color: 'var(--accent)',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      원문 보기
                      <span className="ins-card-arrow" style={{ transition: 'transform .2s' }}>↗</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <button disabled={data.first} onClick={() => setPage((p) => p - 1)} style={{
                padding: '10px 20px', border: '1px solid var(--line)', background: 'transparent',
                fontFamily: MONO, fontWeight: 600, fontSize: 13, letterSpacing: '.04em',
                color: data.first ? 'var(--line)' : 'var(--ink2)',
                cursor: data.first ? 'default' : 'pointer',
              }}>PREV</button>
              {Array.from({ length: data.totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i)} style={{
                  width: 36, height: 36,
                  border: '1px solid var(--line)',
                  background: page === i ? 'var(--charcoal)' : 'transparent',
                  color: page === i ? '#fff' : 'var(--ink2)',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  transition: 'background .15s, color .15s',
                }}>{i + 1}</button>
              ))}
              <button disabled={data.last} onClick={() => setPage((p) => p + 1)} style={{
                padding: '10px 20px', border: '1px solid var(--line)', background: 'transparent',
                fontFamily: MONO, fontWeight: 600, fontSize: 13, letterSpacing: '.04em',
                color: data.last ? 'var(--line)' : 'var(--ink2)',
                cursor: data.last ? 'default' : 'pointer',
              }}>NEXT</button>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .ins-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,.08); }
        .ins-card:hover .ins-card-title { color: var(--accent) !important; }
        .ins-card:hover .ins-card-arrow { transform: translateX(3px); }
        @media (max-width: 960px) { .ins-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 580px) { .ins-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

/* ── Thumbnail with fallback ── */
function InsightThumbnail({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(148,53,67,.08) 0%, var(--charcoal) 60%)',
      }}>
        <span style={{
          fontFamily: "'Newsreader', Georgia, serif",
          fontStyle: 'italic', fontSize: 48, fontWeight: 300,
          color: 'rgba(255,255,255,.08)',
        }}>✦</span>
      </div>
    );
  }

  /* 외부 도메인 중 remotePatterns에 없는 경우 img 태그로 대체 */
  try {
    const url = new URL(src);
    const allowed = [
      'localhost', 'unionsystems.co.kr',
      'pstatic.net', 'daumcdn.net', 'mt.co.kr',
      'zdnet.co.kr', 'etnews.com', 'digitaltoday.co.kr', 'aitimes.com',
    ];
    const isAllowed = allowed.some(d => url.hostname === d || url.hostname.endsWith('.' + d));

    if (isAllowed) {
      return (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 580px) 100vw, (max-width: 960px) 50vw, 33vw"
          style={{ objectFit: 'cover', transition: 'transform .4s' }}
          className="ins-thumb"
          onError={() => setError(true)}
        />
      );
    }
  } catch {
    /* invalid URL → fall through to img */
  }

  /* eslint-disable-next-line @next/next/no-img-element */
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }}
      className="ins-thumb"
      onError={() => setError(true)}
    />
  );
}
