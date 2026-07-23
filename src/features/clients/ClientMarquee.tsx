'use client';

import { useEffect, useRef, useState } from 'react';

/* ── Featured clients (큰 로고 + 산업 태그) ── */
const FEATURED = [
  { name: '삼성SDS', industry: 'IT' },
  { name: '현대건설', industry: '제조' },
  { name: 'KB국민은행', industry: '금융' },
  { name: '한국도로공사', industry: '공공' },
  { name: '롯데마트', industry: '유통' },
  { name: '넥슨코리아', industry: 'IT' },
];

const INDUSTRY_TAGS = ['공공', '금융', '제조', 'IT', '유통'];

const STATS = [
  { value: 200, suffix: '+', label: '누적 고객사' },
  { value: 1200, suffix: '+', label: '완료 프로젝트' },
  { value: 98, suffix: '%', label: '재계약률' },
];

/* ── CountUp hook ── */
function useCountUp(end: number, duration = 1600) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [end, duration]);
  return { val, ref };
}

export default function ClientMarquee() {
  const stat1 = useCountUp(200);
  const stat2 = useCountUp(1200);
  const stat3 = useCountUp(98);
  const stats = [
    { ...STATS[0], val: stat1.val, ref: stat1.ref },
    { ...STATS[1], val: stat2.val, ref: stat2.ref },
    { ...STATS[2], val: stat3.val, ref: stat3.ref },
  ];

  return (
    <section
      style={{
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(80px,10vw,140px) 0',
      }}
    >
      {/* ═══ NETWORK STYLE — 네트워크 연결 시각화 배경 ═══ */}

      {/* Network node grid — hexagonal dot pattern */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, var(--line) 1.2px, transparent 1.2px)',
          backgroundSize: '60px 52px',
          opacity: .15,
          pointerEvents: 'none',
        }}
      />

      {/* Network connection lines — SVG overlay */}
      <svg aria-hidden="true" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', opacity: .12,
      }}>
        {/* Diagonal connections — network topology feel */}
        <line x1="10%" y1="20%" x2="35%" y2="45%" stroke="var(--ink2)" strokeWidth="1" strokeDasharray="6 12" />
        <line x1="35%" y1="45%" x2="65%" y2="30%" stroke="var(--ink2)" strokeWidth="1" strokeDasharray="6 12" />
        <line x1="65%" y1="30%" x2="90%" y2="55%" stroke="var(--ink2)" strokeWidth="1" strokeDasharray="6 12" />
        <line x1="20%" y1="70%" x2="50%" y2="80%" stroke="var(--ink2)" strokeWidth="1" strokeDasharray="6 12" />
        <line x1="50%" y1="80%" x2="80%" y2="65%" stroke="var(--ink2)" strokeWidth="1" strokeDasharray="6 12" />
        {/* Node dots at intersections */}
        <circle cx="10%" cy="20%" r="3" fill="var(--ink2)" opacity=".4" />
        <circle cx="35%" cy="45%" r="4" fill="var(--accent)" opacity=".25" />
        <circle cx="65%" cy="30%" r="3" fill="var(--ink2)" opacity=".4" />
        <circle cx="90%" cy="55%" r="3" fill="var(--ink2)" opacity=".4" />
        <circle cx="20%" cy="70%" r="3" fill="var(--ink2)" opacity=".3" />
        <circle cx="50%" cy="80%" r="4" fill="var(--accent)" opacity=".2" />
        <circle cx="80%" cy="65%" r="3" fill="var(--ink2)" opacity=".3" />
      </svg>

      {/* Large serif watermark — viewport 좌측, 잘림 */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '8%',
          left: '-3%',
          fontFamily: "'Newsreader', Georgia, serif",
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 'clamp(180px, 22vw, 360px)',
          lineHeight: .85,
          color: 'var(--line)',
          opacity: .2,
          whiteSpace: 'nowrap',
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: '-.04em',
        }}
      >
        Network
      </div>

      {/* Section number — viewport 우측 끝 */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 'clamp(40px, 5vw, 80px)',
          right: 'clamp(20px, 3vw, 48px)',
          fontFamily: "'Newsreader', Georgia, serif",
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 64,
          color: 'var(--line)',
          opacity: .5,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        04
      </div>

      {/* Vertical guide line — viewport 좌측 */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 'clamp(16px, 2.5vw, 40px)',
          width: 1,
          background: 'var(--line)',
          opacity: .3,
          pointerEvents: 'none',
        }}
      />

      {/* Corner squares */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 40, left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
      <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />

      {/* ═══ Content ═══ */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Top: Full-width line ── */}
        <div style={{ width: '100%', height: 1, background: 'var(--line)', opacity: .4, marginBottom: 48 }} />

        {/* ── Header row: left text + right stats ── */}
        <div style={{
          maxWidth: 1300, margin: '0 auto', padding: '0 clamp(20px,4vw,52px)',
          display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'end',
          marginBottom: 48,
        }} className="clients-header-grid">
          <div>
            <p style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
              fontWeight: 500, fontSize: 12, letterSpacing: '.14em',
              color: 'var(--ink2)', textTransform: 'uppercase', margin: '0 0 14px',
            }}>
              Clients
            </p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px,3.5vw,40px)',
              lineHeight: 1.05, letterSpacing: '-.045em',
              color: 'var(--ink)', margin: 0,
            }}>
              유니온시스템즈와 함께<br />
              자산관리·보안 솔루션을 구축한 고객사
            </h2>
          </div>

          {/* Stats cluster — 우측 */}
          <div style={{ display: 'flex', gap: 32 }}>
            {stats.map((s, i) => (
              <div key={i} ref={s.ref} style={{ textAlign: 'center' }}>
                <p style={{
                  fontFamily: "'Newsreader', Georgia, serif",
                  fontStyle: 'italic', fontSize: 36, fontWeight: 400,
                  color: 'var(--ink)', margin: 0, lineHeight: 1,
                }}>
                  {s.val}<span style={{ fontSize: 16, color: 'var(--accent)' }}>{s.suffix}</span>
                </p>
                <p style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                  fontSize: 12, fontWeight: 500, letterSpacing: '.06em',
                  color: 'var(--ink2)', margin: '6px 0 0',
                }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Featured logos — big cards ── */}
        <div style={{
          maxWidth: 1300, margin: '0 auto', padding: '0 clamp(20px,4vw,52px)',
          marginBottom: 40,
        }}>
          <div className="clients-featured-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
          }}>
            {FEATURED.map((c, i) => (
              <div key={c.name} className="featured-client-card" style={{
                padding: '24px 28px',
                border: '1px solid var(--line)',
                background: 'var(--surface)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex', alignItems: 'center', gap: 16,
                transition: 'transform .3s cubic-bezier(.16,.84,.3,1), box-shadow .3s',
              }}>
                {/* Index circle */}
                <div style={{
                  width: 40, height: 40, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--line)', background: 'var(--bg)',
                }}>
                  <span style={{
                    fontFamily: "'Newsreader', Georgia, serif",
                    fontStyle: 'italic', fontSize: 16, fontWeight: 400,
                    color: 'var(--ink2)',
                  }}>{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <p style={{
                    fontWeight: 700, fontSize: 16, color: 'var(--ink)',
                    margin: '0 0 2px',
                  }}>{c.name}</p>
                  <span style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                    fontSize: 12, fontWeight: 500, letterSpacing: '.06em',
                    color: 'var(--ink2)',
                  }}>{c.industry}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Industry tags — static display ── */}
        <div style={{
          maxWidth: 1300, margin: '0 auto', padding: '0 clamp(20px,4vw,52px)',
          marginBottom: 32,
        }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {INDUSTRY_TAGS.map((ind) => (
              <span key={ind} style={{
                padding: '6px 16px',
                border: '1px solid var(--line)',
                background: 'var(--surface)',
                fontSize: 13, fontWeight: 600, color: 'var(--ink2)',
              }}>{ind}</span>
            ))}
          </div>
        </div>

        {/* ── Marquee Row 1 — full viewport width ── */}
        <div
          className="marquee-row"
          style={{
            overflow: 'hidden',
            marginBottom: 20,
            maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          }}
        >
          <div
            className="marquee-track"
            style={{
              display: 'flex',
              width: 'max-content',
              animation: 'mqL 44s linear infinite',
            }}
          >
            {[0, 1, 2].map((i) => (
              <img
                key={`r1-${i}`}
                src="/images/main_clients-01.png"
                alt="고객사 로고"
                style={{ height: 72, marginRight: 64, flexShrink: 0, opacity: 0.7 }}
              />
            ))}
          </div>
        </div>

        {/* ── Marquee Row 2 — reverse ── */}
        <div
          className="marquee-row"
          style={{
            overflow: 'hidden',
            marginBottom: 40,
            maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          }}
        >
          <div
            className="marquee-track"
            style={{
              display: 'flex',
              width: 'max-content',
              animation: 'mqR 44s linear infinite',
            }}
          >
            {[0, 1, 2].map((i) => (
              <img
                key={`r2-${i}`}
                src="/images/main_clients-02.png"
                alt="고객사 로고"
                style={{ height: 72, marginRight: 64, flexShrink: 0, opacity: 0.7 }}
              />
            ))}
          </div>
        </div>

        {/* ── Bottom: Full-width line + floating badge ── */}
        <div style={{ width: '100%', height: 1, background: 'var(--line)', opacity: .4 }} />

        {/* Floating badge — bottom right */}
        <div style={{
          position: 'absolute',
          bottom: 48,
          right: 'clamp(40px, 6vw, 100px)',
          padding: '10px 20px',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          boxShadow: '0 8px 24px rgba(0,0,0,.04)',
        }}>
          <p style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            fontSize: 12, fontWeight: 600, letterSpacing: '.06em',
            color: 'var(--ink2)', margin: 0, textTransform: 'uppercase',
          }}>
            200+ Nodes · Enterprise Network
          </p>
        </div>

        {/* Connection line — bottom left to badge */}
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 56,
            left: 'clamp(16px,2.5vw,40px)',
            width: '60%',
            height: 2,
            pointerEvents: 'none',
          }}
        >
          <line x1="0" y1="1" x2="100%" y2="1" stroke="var(--line)" strokeWidth="1" strokeDasharray="4 8" opacity=".4" />
        </svg>
      </div>
    </section>
  );
}
