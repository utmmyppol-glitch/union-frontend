'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Insight } from '@/types';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

/* ── Thumbnail with fallback (shared logic) ── */
function DetailThumbnail({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) return null;

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
          sizes="(max-width: 580px) 100vw, (max-width: 960px) 80vw, 800px"
          style={{ objectFit: 'cover' }}
          priority
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
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      onError={() => setError(true)}
    />
  );
}

/* ── Card Thumbnail (small) ── */
function CardThumbnail({ src, alt }: { src: string; alt: string }) {
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
          fontStyle: 'italic', fontSize: 36, fontWeight: 300,
          color: 'rgba(255,255,255,.08)',
        }}>✦</span>
      </div>
    );
  }

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
          src={src} alt={alt} fill
          sizes="(max-width: 580px) 100vw, (max-width: 960px) 50vw, 25vw"
          style={{ objectFit: 'cover', transition: 'transform .4s' }}
          className="ins-thumb"
          onError={() => setError(true)}
        />
      );
    }
  } catch { /* fall through */ }

  /* eslint-disable-next-line @next/next/no-img-element */
  return (
    <img
      src={src} alt={alt} loading="lazy"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }}
      className="ins-thumb"
      onError={() => setError(true)}
    />
  );
}

export default function InsightDetailClient({
  item,
  related,
}: {
  item: Insight;
  related: Insight[];
}) {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = pageRef.current?.querySelectorAll('.reveal');
    if (!els) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const dateStr = formatDate(item.publishedAt);

  return (
    <div ref={pageRef} style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ═══ Hero Image ═══ */}
      {item.thumbnailUrl && (
        <section style={{
          position: 'relative',
          width: '100%',
          maxHeight: 480,
          aspectRatio: '21 / 9',
          overflow: 'hidden',
          background: 'var(--charcoal)',
        }}>
          <DetailThumbnail src={item.thumbnailUrl} alt={item.title} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
        </section>
      )}

      {/* ═══ Article Content ═══ */}
      <section style={{
        padding: item.thumbnailUrl ? 'clamp(48px, 6vw, 80px) 0' : '120px 0 clamp(48px, 6vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="wrap" style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Back nav */}
          <Link href="/insights" className="reveal" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 14, fontWeight: 600, color: 'var(--ink2)',
            textDecoration: 'none', marginBottom: 32,
            transition: 'color .2s',
          }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            인사이트 목록
          </Link>

          {/* Meta line */}
          <div className="reveal" style={{
            display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
            marginBottom: 16,
          }}>
            {item.sourceName && (
              <span style={{
                fontFamily: MONO, fontSize: 12, fontWeight: 600,
                letterSpacing: '.04em', color: 'var(--accent)',
                padding: '3px 8px', background: 'rgba(245,51,63,.06)',
              }}>{item.sourceName}</span>
            )}
            {dateStr && (
              <span style={{
                fontFamily: MONO, fontSize: 12, fontWeight: 500,
                letterSpacing: '.04em', color: 'var(--ink2)',
              }}>{dateStr}</span>
            )}
          </div>

          {/* Title */}
          <h1 className="reveal" style={{
            fontWeight: 900,
            fontSize: 'clamp(26px, 3.5vw, 40px)',
            lineHeight: 1.2,
            letterSpacing: '-.04em',
            color: 'var(--ink)',
            margin: '0 0 32px',
          }}>{item.title}</h1>

          {/* Summary */}
          <div className="reveal" style={{
            fontSize: 17, lineHeight: 1.8, color: 'var(--ink)',
            padding: '24px 0 24px',
            borderTop: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
          }}>
            <p style={{ margin: 0 }}>{item.summary}</p>
          </div>

          {/* Disclaimer */}
          <p className="reveal" style={{
            fontSize: 13, lineHeight: 1.6, color: 'var(--ink2)',
            margin: '20px 0 0',
            fontStyle: 'italic',
          }}>
            본 요약은 원문 기사의 일부이며, 전체 내용은 원문에서 확인하세요.
          </p>

          {/* CTA Button */}
          {item.sourceUrl && (
            <div className="reveal" style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-cta"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '16px 36px',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontSize: 16, fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'background .2s, transform .2s',
                }}
              >
                원문 전체 보기
                <span style={{ fontSize: 18 }}>↗</span>
              </a>
            </div>
          )}

          {/* Bottom nav */}
          <div className="reveal" style={{
            marginTop: 56, paddingTop: 32,
            borderTop: '1px solid var(--line)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12,
          }}>
            <Link href="/insights" style={{
              padding: '12px 24px', border: '1px solid var(--line)',
              background: 'transparent', fontWeight: 600, fontSize: 14,
              color: 'var(--ink)', textDecoration: 'none',
            }}>목록으로 돌아가기</Link>
            <Link href="/contact" style={{
              padding: '12px 24px', background: 'var(--charcoal)',
              color: '#fff', fontWeight: 700, fontSize: 14,
              textDecoration: 'none',
            }}>도입문의 하기</Link>
          </div>
        </div>
      </section>

      {/* ═══ Related Insights ═══ */}
      {related.length > 0 && (
        <section style={{
          padding: 'clamp(48px, 6vw, 80px) 0',
          borderTop: '1px solid var(--line)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .1, pointerEvents: 'none' }} />

          <div className="wrap">
            <h2 className="reveal" style={{
              fontWeight: 800, fontSize: 'clamp(22px, 3vw, 32px)',
              letterSpacing: '-.03em', color: 'var(--ink)',
              margin: '0 0 32px',
            }}>다른 인사이트</h2>

            <div className="related-grid reveal" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 24,
            }}>
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/insights/${r.id}`}
                  className="ins-card"
                  style={{
                    display: 'block', textDecoration: 'none',
                    border: '1px solid var(--line)',
                    background: 'var(--surface)',
                    overflow: 'hidden',
                    transition: 'transform .25s cubic-bezier(.16,.84,.3,1), box-shadow .25s',
                  }}
                >
                  <div style={{
                    position: 'relative', aspectRatio: '16 / 9',
                    overflow: 'hidden', background: 'var(--charcoal)',
                  }}>
                    {r.thumbnailUrl ? (
                      <CardThumbnail src={r.thumbnailUrl} alt={r.title} />
                    ) : (
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'radial-gradient(ellipse at 50% 50%, rgba(148,53,67,.08) 0%, var(--charcoal) 60%)',
                      }}>
                        <span style={{
                          fontFamily: "'Newsreader', Georgia, serif",
                          fontStyle: 'italic', fontSize: 36, fontWeight: 300,
                          color: 'rgba(255,255,255,.08)',
                        }}>✦</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '16px 18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      {r.sourceName && (
                        <span style={{
                          fontFamily: MONO, fontSize: 10, fontWeight: 600,
                          letterSpacing: '.04em', color: 'var(--accent)',
                          padding: '2px 6px', background: 'rgba(245,51,63,.06)',
                        }}>{r.sourceName}</span>
                      )}
                      {formatDate(r.publishedAt) && (
                        <span style={{
                          fontFamily: MONO, fontSize: 10, fontWeight: 500,
                          letterSpacing: '.04em', color: 'var(--ink2)',
                        }}>{formatDate(r.publishedAt)}</span>
                      )}
                    </div>
                    <h3 className="ins-card-title" style={{
                      fontWeight: 700, fontSize: 15, lineHeight: 1.4,
                      color: 'var(--ink)', margin: 0,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      transition: 'color .2s',
                    }}>{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        .detail-cta:hover { background: var(--accent-dark) !important; transform: translateY(-2px); }
        .ins-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,.08); }
        .ins-card:hover .ins-card-title { color: var(--accent) !important; }
        @media (max-width: 960px) { .related-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 580px) { .related-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
