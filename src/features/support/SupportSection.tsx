'use client';

import React from 'react';

const cards = [
  {
    label: '사업지원팀',
    heading: '라이선스 갱신·관리',
    items: ['벤더사와 긴밀한 연결', '라이선스 정책 안내', '갱신 관리 자동화', '성능 향상 교육·세미나'],
    stat: '98%',
    statLabel: '재계약률',
  },
  {
    label: '기술팀',
    heading: '도입 후 기술지원',
    items: ['전담 엔지니어 배정', '원격지원 · 장애 처리', '유지보수 · 이슈 대응', '정기 방문 점검'],
    stat: '24/7',
    statLabel: '기술지원',
  },
  {
    label: '개발팀',
    heading: 'SI · 커스터마이징',
    items: ['기업 맞춤 시스템 구축', '데이터 연동 · 마이그레이션', '관리 콘솔 개발', 'API 연계 지원'],
    stat: '100+',
    statLabel: '구축 프로젝트',
  },
] as const;

/* ── Venn Diagram ── */
function VennDiagram() {
  const vennRef = React.useRef<HTMLDivElement>(null);
  const animated = React.useRef(false);

  React.useEffect(() => {
    const el = vennRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        import('@/lib/gsap-init').then(({ gsap }) => {
          const ctx = gsap.context(() => {
            gsap.from('.venn-circle', { scale: 0, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.3)' });
            gsap.from('.venn-label', { opacity: 0, y: 20, duration: 0.6, stagger: 0.15, delay: 0.6 });
            gsap.from('.venn-center', { scale: 0, opacity: 0, duration: 0.5, delay: 1.0, ease: 'back.out(1.5)' });
            gsap.to('.venn-orbit', { rotation: 360, duration: 30, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
          }, el);
          return () => ctx.revert();
        });
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const items = [
    { label: '기술', en: 'TECHNOLOGY', cx: 200, cy: 120 },
    { label: '보안', en: 'SECURITY', cx: 310, cy: 220 },
    { label: '데이터', en: 'DATA', cx: 90, cy: 220 },
    { label: '자산관리', en: 'MANAGEMENT', cx: 200, cy: 330 },
  ];

  return (
    <div ref={vennRef} style={{ position: 'relative' }}>
      <svg viewBox="0 0 400 400" fill="none" style={{ width: '100%', maxWidth: 480, margin: '0 auto', display: 'block' }}>
        <circle className="venn-orbit" cx="200" cy="210" r="140" stroke="rgba(245,51,63,.08)" strokeWidth="1" strokeDasharray="6 10" />
        <circle className="venn-circle" cx="200" cy="140" r="105" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" />
        <circle className="venn-circle" cx="280" cy="220" r="105" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" />
        <circle className="venn-circle" cx="120" cy="220" r="105" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" />
        <circle className="venn-circle" cx="200" cy="280" r="105" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" />
        <g className="venn-center">
          <circle cx="200" cy="210" r="28" fill="var(--accent)" />
          <text x="200" y="214" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="12" fontWeight="700" letterSpacing=".1em">UNION</text>
        </g>
        {items.map((item) => (
          <g key={item.en} className="venn-label">
            <text x={item.cx} y={item.cy} textAnchor="middle" fill="#fff" fontSize="24" fontWeight="800">{item.label}</text>
            <text x={item.cx} y={item.cy + 22} textAnchor="middle" fill="rgba(255,255,255,.5)" fontSize="12" fontWeight="500" letterSpacing=".1em">{item.en}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ── Component ── */
export default function SupportSection() {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
         WHY UNION — Viewport-first dark section
         ═══════════════════════════════════════════════════════════ */}
      <section style={{
        background: 'var(--charcoal)',
        padding: 'clamp(100px,12vw,160px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* ═══ EDITORIAL STYLE — 큰 인용구/타이포 중심 ═══ */}

        {/* Viewport-level: giant editorial stroke text */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontWeight: 900, fontSize: 'clamp(120px, 18vw, 300px)',
          lineHeight: 1, letterSpacing: '-.06em',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,.03)',
          whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none',
        }}>WHY UNION</div>

        {/* Editorial vertical rule — 좌측, 두꺼운 라인 (잡지 스타일) */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '15%', bottom: '15%',
          left: 'clamp(16px,2.5vw,40px)',
          width: 3, background: 'rgba(245,51,63,.15)',
          pointerEvents: 'none',
        }} />
        {/* Thin guide line alongside */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, bottom: 0,
          left: 'calc(clamp(16px,2.5vw,40px) + 12px)',
          width: 1, background: 'rgba(255,255,255,.04)',
          pointerEvents: 'none',
        }} />

        {/* Section number — 우상단 */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 'clamp(40px,5vw,80px)',
          right: 'clamp(20px,3vw,52px)',
          fontFamily: "'Newsreader', Georgia, serif",
          fontStyle: 'italic', fontSize: 64, fontWeight: 400,
          color: 'rgba(255,255,255,.08)',
          userSelect: 'none', pointerEvents: 'none',
        }}>03</div>

        {/* Editorial pull-quote decoration — 큰 따옴표 */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '8%', right: '10%',
          fontFamily: "'Newsreader', Georgia, serif",
          fontStyle: 'italic', fontSize: 'clamp(200px,20vw,400px)',
          lineHeight: .5, color: 'rgba(255,255,255,.025)',
          userSelect: 'none', pointerEvents: 'none',
        }}>&ldquo;</div>

        {/* Corner squares */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: 40, left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />

        {/* Ambient glow orbs — wine tint editorial */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '20%', left: '10%', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(148,53,67,.08) 0%, transparent 60%)',
          filter: 'blur(80px)', pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: '10%', right: '5%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(100,30,45,.05) 0%, transparent 60%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        {/* Full-width top line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        {/* Content — full viewport composition */}
        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* ── TOP ROW: eyebrow + headline — full width ── */}
          <div style={{
            maxWidth: 1300, margin: '0 auto', padding: '0 clamp(20px,4vw,52px)',
            display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end',
            gap: 32, marginBottom: 64,
          }} className="why-union-header">
            <div>
              <p style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                fontWeight: 500, fontSize: 12, letterSpacing: '.14em',
                color: 'rgba(255,255,255,.45)', textTransform: 'uppercase',
                margin: '0 0 16px',
              }}>Why Union</p>
              <h2 style={{
                fontWeight: 900, fontSize: 'clamp(32px,5vw,56px)',
                lineHeight: .95, letterSpacing: '-.05em',
                color: '#fff', margin: 0, whiteSpace: 'pre-line',
              }}>
                {"복잡한 기업 IT를\n하나로 연결합니다."}
              </h2>
            </div>
            {/* Right: mini stats */}
            <div style={{ display: 'flex', gap: 32 }}>
              {[
                { num: '16년+', label: '파트너십' },
                { num: '3팀', label: '전문 조직' },
                { num: '5대', label: '솔루션' },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <p style={{
                    fontFamily: "'Newsreader', Georgia, serif",
                    fontStyle: 'italic', fontSize: 28, fontWeight: 400,
                    color: '#fff', margin: 0, lineHeight: 1,
                  }}>{s.num}</p>
                  <p style={{
                    fontSize: 12, fontWeight: 500, letterSpacing: '.04em',
                    color: 'rgba(255,255,255,.4)', margin: '6px 0 0',
                  }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Full-width divider */}
          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,.08)', marginBottom: 64 }} />

          {/* ── MAIN: Diagram + Description + CTA — viewport 꽉 채움 ── */}
          <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 clamp(20px,4vw,52px)' }}>
            <div className="why-union-grid" style={{
              display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'center',
            }}>
              {/* LEFT — Venn diagram (큰 사이즈) */}
              <div style={{ position: 'relative' }}>
                <VennDiagram />
                {/* Floating annotation cards around diagram */}
                <div style={{
                  position: 'absolute', top: '5%', right: '-5%',
                  padding: '8px 14px', border: '1px solid rgba(255,255,255,.1)',
                  background: 'rgba(255,255,255,.03)',
                }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.5)', margin: 0 }}>원스톱 관리</p>
                </div>
                <div style={{
                  position: 'absolute', bottom: '10%', left: '-3%',
                  padding: '8px 14px', border: '1px solid rgba(255,255,255,.1)',
                  background: 'rgba(255,255,255,.03)',
                }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.5)', margin: 0 }}>전담 팀 배정</p>
                </div>
                {/* Center caption */}
                <div style={{
                  textAlign: 'center', marginTop: 20,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                  fontSize: 12, fontWeight: 500, letterSpacing: '.1em',
                  color: 'rgba(255,255,255,.25)',
                }}>
                  4 CORE CAPABILITIES · ONE PARTNER
                </div>
              </div>

              {/* RIGHT — description + features + CTA */}
              <div>
                <p style={{
                  fontWeight: 400, fontSize: 16, lineHeight: 1.75,
                  color: 'rgba(255,255,255,.55)', margin: '0 0 32px',
                }}>
                  기술·보안·데이터·자산관리 4대 역량을 하나의 창구에서 제공합니다.
                  비교견적부터 구축, 유지보수까지 전담 팀이 책임집니다.
                </p>

                {/* Feature pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 36 }}>
                  {['비교견적', '구축', '교육·세미나', '유지보수', '긴급 대응'].map((f) => (
                    <span key={f} style={{
                      padding: '8px 16px',
                      border: '1px solid rgba(255,255,255,.12)',
                      background: 'rgba(255,255,255,.03)',
                      fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,.6)',
                    }}>{f}</span>
                  ))}
                </div>

                {/* CTA row */}
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                  <a href="/contact" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '16px 36px', background: 'var(--accent)',
                    color: '#fff', fontWeight: 700, fontSize: 15,
                    textDecoration: 'none', transition: 'transform .15s',
                  }}>
                    도입 문의하기 <span>&rarr;</span>
                  </a>
                  <a href="tel:02-706-8999" style={{
                    padding: '16px 28px', border: '1px solid rgba(255,255,255,.2)',
                    color: 'rgba(255,255,255,.6)', fontWeight: 600, fontSize: 14,
                    textDecoration: 'none', transition: 'all .2s',
                  }}>
                    02-706-8999
                  </a>
                </div>

                {/* Trust signal */}
                <div style={{
                  marginTop: 32, padding: '14px 20px',
                  borderLeft: '2px solid var(--accent)',
                  background: 'rgba(255,255,255,.02)',
                }}>
                  <p style={{
                    fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,.5)',
                    margin: 0, lineHeight: 1.6, fontStyle: 'italic',
                  }}>
                    &ldquo;도입 상담부터 구축 완료까지 평균 2주. 200개 기업이 선택한 파트너십.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom floating annotation — 좌하단 */}
          <div style={{
            maxWidth: 1300, margin: '0 auto', padding: '0 clamp(20px,4vw,52px)',
            marginTop: 56,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.08)' }} />
              <span style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                fontSize: 12, fontWeight: 500, letterSpacing: '.08em',
                color: 'rgba(255,255,255,.25)',
              }}>
                TECHNOLOGY · SECURITY · DATA · ASSET MANAGEMENT
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.08)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         SUPPORT CARDS — Viewport-first light section
         ═══════════════════════════════════════════════════════════ */}
      <section style={{
        background: 'var(--soft)',
        padding: 'clamp(100px,12vw,160px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Viewport-level: large serif watermark */}
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: '-5%', right: '-3%',
          fontFamily: "'Newsreader', Georgia, serif",
          fontStyle: 'italic', fontWeight: 400,
          fontSize: 'clamp(160px, 20vw, 320px)',
          lineHeight: .85, color: 'var(--line)', opacity: .3,
          whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none',
          letterSpacing: '-.04em',
        }}>Support</div>

        {/* Dot pattern background */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, var(--line) 0.6px, transparent 0.6px)',
          backgroundSize: '48px 48px', opacity: .2, pointerEvents: 'none',
        }} />

        {/* Vertical guide — 우측 */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, bottom: 0,
          right: 'clamp(16px,2.5vw,40px)',
          width: 1, background: 'var(--line)', opacity: .25, pointerEvents: 'none',
        }} />

        {/* Full-width lines */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />

        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 clamp(20px,4vw,52px)', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: 56 }}>
            <p style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
              fontWeight: 500, fontSize: 12, letterSpacing: '.14em',
              color: 'var(--ink2)', textTransform: 'uppercase', margin: '0 0 14px',
            }}>Support</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px,3.5vw,40px)',
              lineHeight: 1.05, letterSpacing: '-.045em',
              color: 'var(--ink)', margin: 0,
            }}>
              유니온시스템즈와 함께해야 하는 이유
            </h2>
          </div>

          {/* Cards — 3×2 grid */}
          <div className="support-section-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
          }}>
            {cards.map((card, idx) => {
              const isHovered = hoveredIdx === idx;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="support-card"
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid var(--line)',
                    background: 'var(--surface)',
                    padding: 'clamp(36px, 4vw, 48px)',
                    transition: 'transform .3s cubic-bezier(.16,.84,.3,1), box-shadow .3s',
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                    boxShadow: isHovered
                      ? '0 24px 64px rgba(0,0,0,.12)'
                      : '0 4px 16px rgba(0,0,0,.03)',
                  }}
                >
                  {/* Background glow */}
                  <div aria-hidden="true" style={{
                    position: 'absolute', right: '-15%', top: '-20%', width: 200, height: 200,
                    background: 'radial-gradient(circle, rgba(245,51,63,.03) 0%, transparent 60%)',
                    filter: 'blur(40px)', pointerEvents: 'none',
                  }} />

                  {/* Large background number */}
                  <div aria-hidden="true" style={{
                    position: 'absolute', right: 12, bottom: -20,
                    fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic',
                    fontSize: 120, fontWeight: 300, lineHeight: 1,
                    color: 'var(--line)', opacity: .35, pointerEvents: 'none',
                  }}>{String(idx + 1).padStart(2, '0')}</div>

                  {/* Stat badge — 우상단 */}
                  <div style={{
                    position: 'absolute', top: 20, right: 20,
                    padding: '6px 12px', border: '1px solid var(--line)',
                    background: 'var(--bg)',
                  }}>
                    <p style={{
                      fontFamily: "'Newsreader', Georgia, serif",
                      fontStyle: 'italic', fontSize: 18, fontWeight: 400,
                      color: 'var(--ink)', margin: 0, lineHeight: 1,
                    }}>{card.stat}</p>
                    <p style={{
                      fontSize: 12, fontWeight: 500, color: 'var(--ink2)',
                      margin: '2px 0 0',
                    }}>{card.statLabel}</p>
                  </div>

                  {/* Label */}
                  <p style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                    fontWeight: 600, fontSize: 12, letterSpacing: '.12em',
                    textTransform: 'uppercase', color: 'var(--accent)',
                    margin: '0 0 16px',
                  }}>{card.label}</p>

                  {/* Heading */}
                  <h3 style={{
                    fontWeight: 900, fontSize: 22, letterSpacing: '-.02em',
                    lineHeight: 1.2, color: 'var(--ink)', margin: '0 0 28px',
                  }}>{card.heading}</h3>

                  {/* Divider */}
                  <div style={{ width: 40, height: 2, background: 'var(--accent)', opacity: .4, marginBottom: 24 }} />

                  {/* Items */}
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {card.items.map((item, i) => (
                      <li key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        fontWeight: 500, fontSize: 15, color: 'var(--ink2)',
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* ── Bottom area: process flow + CTA ── */}
          <div style={{ marginTop: 56 }}>

            {/* Divider with label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
              <span style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                fontSize: 12, fontWeight: 500, letterSpacing: '.08em',
                color: 'var(--ink2)', opacity: .6,
              }}>PROCESS</span>
              <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            </div>

            {/* Process flow — Timeline style: 5 steps with connecting line */}
            <div style={{ position: 'relative', marginBottom: 48 }}>
              {/* Horizontal timeline connector */}
              <div aria-hidden="true" style={{
                position: 'absolute', top: 22, left: '10%', right: '10%',
                height: 2, background: 'var(--line)',
              }} />
              <div className="support-process" style={{
                display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0,
                position: 'relative',
              }}>
                {[
                  { step: '01', label: '상담', desc: '요구사항 파악' },
                  { step: '02', label: '제안', desc: '맞춤 솔루션 설계' },
                  { step: '03', label: '구축', desc: '도입·설치·세팅' },
                  { step: '04', label: '교육', desc: '실무 교육·세미나' },
                  { step: '05', label: '유지보수', desc: '전담팀 상시 지원' },
                ].map((s, i) => (
                  <div key={i} style={{
                    textAlign: 'center', position: 'relative',
                    padding: '0 12px',
                  }}>
                    {/* Timeline node dot */}
                    <div style={{
                      width: 44, height: 44, margin: '0 auto 16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid var(--line)',
                      background: 'var(--surface)',
                      position: 'relative', zIndex: 1,
                    }}>
                      <span style={{
                        fontFamily: "'Newsreader', Georgia, serif",
                        fontStyle: 'italic', fontSize: 16, fontWeight: 400,
                        color: 'var(--accent)',
                      }}>{s.step}</span>
                    </div>
                    <p style={{
                      fontWeight: 800, fontSize: 16, color: 'var(--ink)',
                      margin: '0 0 4px',
                    }}>{s.label}</p>
                    <p style={{
                      fontSize: 13, fontWeight: 400, color: 'var(--ink2)',
                      margin: 0,
                    }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA row */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '28px 32px',
              background: 'var(--charcoal)',
              flexWrap: 'wrap', gap: 20,
            }}>
              <div>
                <p style={{
                  fontWeight: 800, fontSize: 17, color: '#fff', margin: '0 0 4px',
                }}>지금 바로 무료 상담 받으세요</p>
                <p style={{
                  fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,.5)', margin: 0,
                }}>평균 2주 내 도입 완료 · 200+ 기업이 선택</p>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <a href="/contact" style={{
                  padding: '14px 28px', background: 'var(--accent)',
                  color: '#fff', fontWeight: 700, fontSize: 15,
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>도입 문의 <span>&rarr;</span></a>
                <a href="tel:02-706-8999" style={{
                  padding: '14px 28px', border: '1px solid rgba(255,255,255,.2)',
                  color: 'rgba(255,255,255,.7)', fontWeight: 600, fontSize: 14,
                  textDecoration: 'none',
                }}>02-706-8999</a>
              </div>
            </div>

            {/* Bottom meta */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: 20, flexWrap: 'wrap', gap: 12,
            }}>
              <p style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                fontSize: 12, fontWeight: 500, letterSpacing: '.06em',
                color: 'var(--ink2)', opacity: .5, margin: 0,
              }}>3 DEDICATED TEAMS · 16+ YEARS EXPERIENCE</p>
              <a href="/support/tech" style={{
                fontWeight: 600, fontSize: 14, color: 'var(--ink2)',
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
                transition: 'color .2s',
              }}>전체 서비스 알아보기 <span>&rarr;</span></a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes cardFloat0 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes cardFloat1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes cardFloat2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @media (max-width: 960px) {
          .support-section-grid {
            grid-template-columns: 1fr !important;
          }
          .why-union-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .why-union-header {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
