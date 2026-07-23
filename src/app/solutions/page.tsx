'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SERIF = "'Newsreader', Georgia, serif";

const SOLUTIONS = [
  {
    key: 'data',
    eyebrow: 'DATA PLATFORM',
    title: 'DA#',
    subtitle: '데이터 품질 관리',
    desc: '데이터 표준화, 품질 관리, 메타데이터 관리를 위한 통합 플랫폼.',
    href: 'https://uniondata.co.kr',
    external: true,
    tags: ['데이터 모델링', '품질 관리', '거버넌스'],
  },
  {
    key: 'netclient',
    eyebrow: 'IT ASSET',
    title: 'NetClient',
    subtitle: 'IT 자산 통합 관리',
    desc: 'PC 자산 관리(DMS), 패치 관리(PMS), 전력 관리(PC-OFF)를 하나의 에이전트로.',
    href: '/solution/asset-management/netclient',
    external: false,
    tags: ['DMS', 'PMS', 'PC-OFF'],
  },
  {
    key: 'ahnlab',
    eyebrow: 'SECURITY',
    title: 'AhnLab',
    subtitle: '엔드포인트 보안',
    desc: '국내 1위 보안 기업 안랩의 V3, EDR 등 기업 환경에 최적화된 보안.',
    href: '/solution/security/ahnlab',
    external: false,
    tags: ['V3', 'EDR', 'EPP'],
  },
  {
    key: 'estsecurity',
    eyebrow: 'SECURITY',
    title: 'ESTsecurity',
    subtitle: 'AI 보안 솔루션',
    desc: '알약 기반 악성코드 탐지, AI 위협 분석, 통합 보안 관제.',
    href: '/solution/security/estsecurity',
    external: false,
    tags: ['알약', 'ASM', 'AI 보안'],
  },
  {
    key: 'officekeeper',
    eyebrow: 'SECURITY',
    title: 'OfficeKeeper',
    subtitle: '정보유출방지(DLP)',
    desc: '기업 내부 정보의 무단 유출을 차단하고 문서 보안을 강화합니다.',
    href: '/solution/security/officekeeper',
    external: false,
    tags: ['DLP', '매체 제어', '문서 보안'],
  },
];

const STATS = [
  { num: '5', label: '솔루션 라인업' },
  { num: '200+', label: '도입 기업' },
  { num: '24/7', label: '기술 지원' },
];

export default function SolutionsPage() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ═══ Hero ═══ */}
      <section style={{
        position: 'relative', background: 'var(--charcoal)', overflow: 'hidden',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 80%, rgba(148,53,67,.07) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {/* Blob decorations */}
        <div className="blob blob-accent" aria-hidden="true" style={{ width: 360, height: 360, right: '5%', top: '8%' }} />
        <div className="blob blob-wine" aria-hidden="true" style={{ width: 260, height: 260, left: '8%', bottom: '6%', animationDelay: '8s' }} />
        <div aria-hidden="true" style={{
          position: 'absolute', width: 16, height: 16, right: '22%', top: '30%',
          border: '1.5px solid rgba(255,255,255,.08)', transform: 'rotate(45deg)',
          animation: 'geoFloat1 15s ease-in-out infinite', pointerEvents: 'none',
        }} />

        <div aria-hidden="true" style={{
          position: 'absolute', right: '-3%', bottom: '-12%',
          fontFamily: SERIF, fontStyle: 'italic',
          fontSize: 'clamp(180px, 28vw, 440px)', fontWeight: 300,
          color: 'rgba(255,255,255,.02)', lineHeight: .8, pointerEvents: 'none',
        }}>
          Sol.
        </div>

        <div className="wrap" style={{ position: 'relative', zIndex: 1, padding: '120px clamp(20px,4vw,52px) 64px' }}>
          <p className="eyebrow" style={{ color: 'rgba(255,255,255,.4)', margin: '0 0 16px' }}>
            SOLUTIONS
          </p>
          <h1 style={{
            fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
            lineHeight: .88, letterSpacing: '-.05em', color: '#fff', margin: '0 0 20px',
          }}>
            기업 IT의<br />
            <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400 }}>핵심 솔루션</span>
          </h1>
          <p style={{
            fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,.45)',
            maxWidth: 440, margin: '0 0 32px',
          }}>
            데이터 · 자산관리 · 보안 — 기업 IT 환경에 필요한<br />
            모든 솔루션을 원스톱으로 제공합니다.
          </p>
          <Link href="/contact" className="btn" style={{
            display: 'inline-block', padding: '16px 36px',
            background: 'var(--accent)', color: '#fff',
            fontWeight: 700, fontSize: 15, textDecoration: 'none',
          }}>
            도입 상담 →
          </Link>
        </div>
      </section>

      {/* ═══ Stats ═══ */}
      <section className="reveal" style={{
        padding: '36px 0', borderBottom: '1px solid var(--line)',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="wrap">
          <div className="sol-stats" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
          }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p style={{
                  fontFamily: SERIF, fontStyle: 'italic',
                  fontSize: 'clamp(36px, 5.5vw, 64px)', fontWeight: 400,
                  color: 'var(--ink)', margin: '0 0 4px', lineHeight: 1,
                }}>{s.num}</p>
                <p style={{
                  fontFamily: MONO, fontSize: 12, fontWeight: 500, letterSpacing: '.1em',
                  color: 'var(--ink2)', margin: 0,
                }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Solution cards — leisure row 스타일 (각각 고유) ═══ */}
      <section style={{ padding: 'clamp(100px, 9vw, 112px) 0', position: 'relative', overflow: 'hidden' }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="blob blob-accent" aria-hidden="true" style={{ width: 300, height: 300, left: '2%', bottom: '15%', animationDelay: '3s' }} />
        <div className="wrap">
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>LINEUP</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', margin: 0,
            }}>솔루션 라인업</h2>
          </div>

          {SOLUTIONS.map((sol, idx) => {
            const isDark = idx === 0 || idx === 2;
            const LinkComp = sol.external ? 'a' : Link;
            const linkProps = sol.external
              ? { href: sol.href, target: '_blank', rel: 'noopener noreferrer' }
              : { href: sol.href };

            return (
              <LinkComp
                key={sol.key}
                {...linkProps}
                className="reveal sol-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr auto',
                  gap: 28,
                  alignItems: 'center',
                  padding: '32px 28px',
                  marginBottom: 8,
                  background: isDark ? 'var(--charcoal)' : 'var(--surface)',
                  border: isDark ? 'none' : '1px solid var(--line)',
                  textDecoration: 'none',
                  transition: 'transform .25s cubic-bezier(.16,.84,.3,1), box-shadow .25s',
                  position: 'relative',
                  overflow: 'hidden',
                  transitionDelay: `${idx * 0.05}s`,
                } as React.CSSProperties}
              >
                {/* Wine ambient for dark */}
                {isDark && (
                  <div aria-hidden="true" style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at 80% 50%, rgba(148,53,67,.06) 0%, transparent 50%)',
                    pointerEvents: 'none',
                  }} />
                )}

                {/* Left — big number */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span style={{
                    fontFamily: SERIF, fontStyle: 'italic',
                    fontSize: 48, fontWeight: 300,
                    color: isDark ? 'rgba(255,255,255,.08)' : 'rgba(20,18,16,.05)',
                    lineHeight: 1, display: 'block',
                  }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Center — text */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <p style={{
                      fontFamily: MONO, fontSize: 12, fontWeight: 600, letterSpacing: '.1em',
                      color: isDark ? 'var(--accent)' : 'var(--accent)', margin: 0,
                    }}>{sol.eyebrow}</p>
                  </div>
                  <h3 className="sol-row-title" style={{
                    fontWeight: 900, fontSize: 22, letterSpacing: '-.03em',
                    color: isDark ? '#fff' : 'var(--ink)', margin: '0 0 2px',
                    transition: 'color .2s',
                  }}>
                    {sol.title}
                    <span style={{
                      fontWeight: 400, fontSize: 16, color: isDark ? 'rgba(255,255,255,.35)' : 'var(--ink2)',
                      marginLeft: 10,
                    }}>{sol.subtitle}</span>
                  </h3>
                  <p style={{
                    fontSize: 16, lineHeight: 1.6,
                    color: isDark ? 'rgba(255,255,255,.4)' : 'var(--ink2)',
                    margin: '6px 0 0', maxWidth: 480,
                  }}>{sol.desc}</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                    {sol.tags.map((t) => (
                      <span key={t} style={{
                        fontFamily: MONO, fontSize: 12, fontWeight: 500, letterSpacing: '.04em',
                        padding: '3px 8px',
                        color: isDark ? 'rgba(255,255,255,.25)' : 'var(--ink2)',
                        border: isDark ? '1px solid rgba(255,255,255,.06)' : '1px solid var(--line)',
                      }}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* Right — arrow */}
                <span className="sol-row-arrow" style={{
                  fontSize: 22, flexShrink: 0, position: 'relative', zIndex: 1,
                  color: 'var(--accent)', opacity: 0,
                  transition: 'opacity .2s, transform .2s',
                }}>
                  {sol.external ? '↗' : '→'}
                </span>
              </LinkComp>
            );
          })}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{
        padding: 'clamp(72px, 10vw, 128px) 0',
        background: 'var(--charcoal)', position: 'relative', overflow: 'hidden',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 80%, rgba(148,53,67,.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 640 }}>
          <div className="reveal" style={{
            fontFamily: SERIF, fontStyle: 'italic',
            fontSize: 56, fontWeight: 300, color: 'var(--accent)', lineHeight: 1,
            marginBottom: 16, opacity: .35,
          }}>&ldquo;</div>
          <h2 className="reveal" style={{
            fontFamily: SERIF, fontStyle: 'italic',
            fontWeight: 400, fontSize: 'clamp(26px, 3.5vw, 40px)',
            lineHeight: 1.35, color: '#fff', margin: '0 0 12px',
          }}>
            어떤 솔루션이 필요한지<br />모르셔도 괜찮습니다.
          </h2>
          <p className="reveal" style={{
            fontSize: 16, color: 'rgba(255,255,255,.45)', margin: '0 0 32px', lineHeight: 1.7,
          }}>
            유니온시스템즈가 귀사의 환경을 분석하고 최적의 조합을 찾아드립니다.
          </p>
          <div className="reveal" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn" style={{
              padding: '16px 36px', background: 'var(--accent)', color: '#fff',
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
            }}>도입 상담하기</Link>
            <Link href="/contact" style={{
              padding: '16px 36px', border: '1px solid rgba(255,255,255,.45)',
              color: '#fff', fontWeight: 600, fontSize: 15, textDecoration: 'none',
            }}>견적 요청하기</Link>
          </div>
        </div>
      </section>

      <style>{`
        .sol-row:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,.08); }
        .sol-row:hover .sol-row-arrow { opacity: 1 !important; transform: translateX(4px); }
        .sol-row:hover .sol-row-title { color: var(--accent) !important; }
        @media (max-width: 920px) {
          .sol-row { grid-template-columns: 1fr !important; gap: 12px !important; }
          .sol-row > div:first-child { display: none !important; }
          .sol-stats { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
