'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { E, safeParse, useEditMode, useEditableManifest, EDITABLE_STYLES } from '@/lib/editable';

const CRAWL = '/images/crawl/unionsystems';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SERIF = "'Newsreader', Georgia, serif";

const PRODUCTS = [
  { name: '알약 (ALYac)', desc: '국내 PC 보안의 대표 솔루션. 바이러스, 악성코드, 스파이웨어를 실시간으로 탐지하고 치료합니다.', img: `${CRAWL}/solution_estsecurity_alyac_217.jpg` },
  { name: 'ASM', desc: '자산 기반 보안 관리 솔루션. IT 자산의 보안 상태를 통합적으로 파악하고 취약점을 관리합니다.', img: `${CRAWL}/solution_estsecurity_asm_219.jpg` },
  { name: 'EDR', desc: 'AI 기반 엔드포인트 위협 탐지 및 대응. 알려지지 않은 위협을 행위 분석으로 실시간 탐지합니다.', img: `${CRAWL}/solution_estsecurity_edr_218.jpg` },
];

const POINTS = [
  { num: '01', title: 'AI 기반 위협 탐지', desc: '머신러닝과 딥러닝 기술로 신종/변종 악성코드를 사전에 탐지합니다.', stat: '99.9%', statLabel: '탐지율' },
  { num: '02', title: '자동 대응 체계', desc: '위협 탐지부터 격리, 복구까지 자동화된 대응 프로세스를 제공합니다.', stat: '24/7', statLabel: '자동 대응' },
  { num: '03', title: '합리적인 도입 비용', desc: '중소·중견기업에 적합한 가격 정책으로 엔터프라이즈급 보안을 구축합니다.', stat: '40%', statLabel: '비용 절감' },
];

const FEATURES = [
  { label: 'AI 악성코드 탐지', desc: '딥러닝 엔진으로 신종 위협 사전 차단' },
  { label: '실시간 대응', desc: '위협 발생 즉시 자동 격리·치료' },
  { label: '자산 관리', desc: 'IT 자산 보안 상태 통합 모니터링' },
  { label: '중앙 관리', desc: '웹 콘솔에서 전사 정책 일괄 관리' },
];

const DEFAULT_HERO = { desc: '알약, ASM, AI EDR로 위협을 탐지하고 자동 대응하는 통합 보안.' };
const DEFAULT_CTA = { title: 'AI가 지키는 보안,\nESTsecurity.', desc: 'ESTsecurity 공인 파트너 유니온시스템즈' };

export default function EstsecurityPageClient({ ssrContent }: { ssrContent: Record<string, string> }) {
  const editMode = useEditMode();
  useEditableManifest(editMode);
  const [hero, setHero] = useState(() => safeParse(ssrContent.estsecurity_hero, DEFAULT_HERO));
  const [cta, setCta] = useState(() => safeParse(ssrContent.estsecurity_cta, DEFAULT_CTA));
  useEffect(() => {
    if (!editMode) return;
    const setters: Record<string, (v: unknown) => void> = { estsecurity_hero: setHero as (v: unknown) => void, estsecurity_cta: setCta as (v: unknown) => void };
    const handler = (e: MessageEvent) => { if (e.data?.type === 'content-update') { const fn = setters[e.data.section]; if (fn) fn(e.data.data); } };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [editMode]);
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      {editMode && <style>{EDITABLE_STYLES}</style>}

      {/* ═══ 1. Hero — "AI" 워터마크 + 블러 블롭 ═══ */}
      <section style={{
        position: 'relative', background: 'var(--charcoal)',
        minHeight: 540, display: 'flex', alignItems: 'center', overflow: 'hidden',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${CRAWL}/solution_estsecurity_banner_img_227.png)`,
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1,
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 60% 80%, rgba(148,53,67,.08) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', left: '8%', top: '25%', width: 380, height: 380,
          background: 'radial-gradient(circle, rgba(245,51,63,.05) 0%, transparent 60%)',
          filter: 'blur(70px)', pointerEvents: 'none',
        }} />
        {/* Blob decorations */}
        <div className="blob blob-accent" aria-hidden="true" style={{ width: 350, height: 350, right: '4%', top: '6%' }} />
        <div className="blob blob-wine" aria-hidden="true" style={{ width: 240, height: 240, left: '12%', bottom: '10%', animationDelay: '8s' }} />
        <div aria-hidden="true" style={{
          position: 'absolute', width: 15, height: 15, right: '28%', top: '32%',
          border: '1.5px solid rgba(255,255,255,.08)', transform: 'rotate(45deg)',
          animation: 'geoFloat2 14s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', right: '5%', bottom: '10%', width: 280, height: 280,
          background: 'radial-gradient(circle, rgba(43,44,48,.15) 0%, transparent 60%)',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', right: '3%', bottom: '-12%',
          fontFamily: SERIF, fontStyle: 'italic',
          fontSize: 'clamp(220px, 30vw, 500px)', fontWeight: 300,
          color: 'rgba(255,255,255,.025)', lineHeight: .8, pointerEvents: 'none',
        }}>AI</div>

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 560, padding: '140px 0 80px' }}>
<p style={{
              fontFamily: MONO, fontWeight: 500, fontSize: 12, letterSpacing: '.14em',
              textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 16px',
            }}>ESTsecurity</p>
            <h1 style={{
              fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
              lineHeight: .88, letterSpacing: '-.05em', color: '#fff', margin: '0 0 16px',
            }}>
              AI 기반 차세대<br />
              <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400 }}>엔드포인트 보안</span>
            </h1>
            <p style={{
              fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,.45)',
              maxWidth: 420, margin: '0 0 28px',
            }}>
              <E id="estsecurity_hero.desc" editMode={editMode}>{hero.desc}</E>
            </p>
            {/* AI badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              marginBottom: 28, padding: '8px 16px',
              border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.03)',
            }}>
              <span style={{
                fontFamily: SERIF, fontStyle: 'italic',
                fontSize: 22, fontWeight: 400, color: 'var(--accent)', lineHeight: 1,
              }}>AI</span>
              <span style={{
                fontFamily: MONO, fontSize: 12, fontWeight: 500, letterSpacing: '.06em',
                color: 'rgba(255,255,255,.35)',
              }}>POWERED SECURITY</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/contact" className="btn" style={{
                padding: '16px 32px', background: 'var(--accent)', color: '#fff',
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
              }}>도입 문의하기 →</Link>
              <a href="tel:02-706-8999" style={{
                padding: '16px 32px', border: '1px solid rgba(255,255,255,.45)',
                color: '#fff', fontWeight: 600, fontSize: 15, textDecoration: 'none',
              }}>02-706-8999</a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. 제품 — accent 스트립 + 3개 가로 카드 ═══ */}
      <section style={{ padding: 'clamp(100px, 9vw, 112px) 0', position: 'relative', overflow: 'hidden' }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="blob blob-graphite" aria-hidden="true" style={{ width: 300, height: 300, left: '3%', top: '20%', animationDelay: '5s' }} />
        <div className="wrap">
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>PRODUCT LINEUP</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', margin: 0,
            }}>주요 제품</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {PRODUCTS.map((p, i) => (
              <div key={p.name} className="reveal est-prod-row" style={{
                display: 'grid', gridTemplateColumns: '280px 1fr',
                gap: 0, overflow: 'hidden',
                border: '1px solid var(--line)', background: 'var(--surface)',
                transition: 'transform .3s cubic-bezier(.16,.84,.3,1), box-shadow .3s',
                transitionDelay: `${i * 0.08}s`,
              }}>
                <div style={{ overflow: 'hidden' }}>
                  <img src={p.img} alt={p.name} className="est-prod-img" style={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    minHeight: 200, transition: 'transform .5s',
                  }} />
                </div>
                <div style={{
                  padding: 'clamp(26px, 3.5vw, 40px)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <div aria-hidden="true" style={{
                    position: 'absolute', right: 12, bottom: -4,
                    fontFamily: SERIF, fontStyle: 'italic',
                    fontSize: 80, fontWeight: 300, color: 'rgba(20,18,16,.03)',
                    lineHeight: 1, pointerEvents: 'none',
                  }}>{String(i + 1).padStart(2, '0')}</div>

                  <span style={{
                    fontFamily: SERIF, fontStyle: 'italic',
                    fontSize: 22, fontWeight: 400, color: 'var(--accent)',
                    display: 'block', marginBottom: 10,
                  }}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 style={{
                    fontWeight: 900, fontSize: 22, letterSpacing: '-.02em',
                    margin: '0 0 10px',
                  }}>{p.name}</h3>
                  <p style={{
                    fontSize: 16, lineHeight: 1.7, color: 'var(--ink2)', margin: 0,
                  }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. 도입 효과 — 3열 숫자 카드 (이미지 없이 깔끔) ═══ */}
      <section style={{
        padding: 'clamp(100px, 9vw, 112px) 0', background: 'var(--charcoal)',
        position: 'relative', overflow: 'hidden',
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
        <div aria-hidden="true" style={{
          position: 'absolute', left: '8%', top: '15%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(245,51,63,.04) 0%, transparent 60%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p style={{
              fontFamily: MONO, fontWeight: 500, fontSize: 12, letterSpacing: '.14em',
              color: 'rgba(255,255,255,.4)', margin: '0 0 14px',
            }}>WHY ESTSECURITY</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', color: '#fff', margin: 0,
            }}>도입 효과</h2>
          </div>

          <div className="est-why-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
          }}>
            {POINTS.map((pt, i) => (
              <div key={pt.num} className="reveal est-why-card" style={{
                padding: 32, background: 'rgba(255,255,255,.03)',
                border: '1px solid rgba(255,255,255,.08)',
                transition: 'transform .25s, background .25s',
                transitionDelay: `${i * 0.08}s`,
                position: 'relative', overflow: 'hidden',
              }}>
                <div aria-hidden="true" style={{
                  position: 'absolute', right: -8, bottom: -12,
                  fontFamily: SERIF, fontStyle: 'italic',
                  fontSize: 100, fontWeight: 300, color: 'rgba(255,255,255,.04)',
                  lineHeight: 1, pointerEvents: 'none',
                }}>{pt.num}</div>

                {/* Big stat number */}
                <p style={{
                  fontFamily: SERIF, fontStyle: 'italic',
                  fontSize: 40, fontWeight: 400, color: 'var(--accent)',
                  margin: '0 0 4px', lineHeight: 1,
                }}>{pt.stat}</p>
                <p style={{
                  fontFamily: MONO, fontSize: 12, fontWeight: 500, letterSpacing: '.08em',
                  color: 'rgba(255,255,255,.5)', margin: '0 0 20px',
                }}>{pt.statLabel}</p>

                <h3 style={{
                  fontWeight: 700, fontSize: 18, color: '#fff', margin: '0 0 8px',
                }}>{pt.title}</h3>
                <p style={{
                  fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,.6)', margin: 0,
                }}>{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. 기능 — 다크 2x2 대형 그리드 ═══ */}
      <section style={{
        padding: 'clamp(100px, 9vw, 112px) 0',
        background: 'var(--charcoal)', position: 'relative', overflow: 'hidden',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 40% 60%, rgba(148,53,67,.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', right: '10%', top: '15%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(245,51,63,.04) 0%, transparent 60%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,.4)', margin: '0 0 14px' }}>FEATURES</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', color: '#fff', margin: 0,
            }}>주요 기능</h2>
          </div>

          <div className="est-feat-grid" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
            maxWidth: 700, margin: '0 auto',
          }}>
            {FEATURES.map((f, i) => (
              <div key={f.label} className="reveal est-feat-card" style={{
                padding: 36, border: '1px solid rgba(255,255,255,.08)',
                background: 'rgba(255,255,255,.02)',
                transition: 'border-color .25s, transform .25s',
                transitionDelay: `${i * 0.06}s`,
                position: 'relative', overflow: 'hidden',
              }}>
                <div aria-hidden="true" style={{
                  position: 'absolute', right: 8, bottom: -6,
                  fontFamily: SERIF, fontStyle: 'italic',
                  fontSize: 64, fontWeight: 300, color: 'rgba(255,255,255,.04)',
                  lineHeight: 1, pointerEvents: 'none',
                }}>{String(i + 1).padStart(2, '0')}</div>

                <span style={{
                  fontFamily: SERIF, fontStyle: 'italic',
                  fontSize: 22, fontWeight: 400, color: 'var(--accent)', opacity: .6,
                  display: 'block', marginBottom: 16,
                }}>{String(i + 1).padStart(2, '0')}</span>
                <h3 style={{
                  fontWeight: 700, fontSize: 18, color: '#fff', margin: '0 0 8px',
                }}>{f.label}</h3>
                <p style={{
                  fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,.4)', margin: 0,
                }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. CTA — 다크 인용구 ═══ */}
      <section style={{
        padding: 'clamp(72px, 10vw, 128px) 0',
        background: 'var(--soft)', position: 'relative', overflow: 'hidden',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div aria-hidden="true" style={{
          position: 'absolute', left: '10%', top: '20%', width: 280, height: 280,
          background: 'radial-gradient(circle, rgba(245,51,63,.025) 0%, transparent 60%)',
          filter: 'blur(50px)', pointerEvents: 'none',
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
            lineHeight: 1.35, color: 'var(--ink)', margin: '0 0 12px',
          }}>
            <E id="estsecurity_cta.title" editMode={editMode}>
              {cta.title.split('\n').map((line: string, i: number) => (
                <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
              ))}
            </E>
          </h2>
          <p className="reveal" style={{
            fontSize: 16, color: 'var(--ink2)', margin: '0 0 32px', lineHeight: 1.7,
          }}>
            유니온시스템즈가 AI 기반 보안 체계를 설계합니다.
          </p>
          <div className="reveal" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn" style={{
              padding: '16px 36px', background: 'var(--accent)', color: '#fff',
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
            }}>도입 문의하기</Link>
            <Link href="/contact" style={{
              padding: '16px 36px', border: '1px solid var(--ink)',
              color: 'var(--ink)', fontWeight: 600, fontSize: 15, textDecoration: 'none',
            }}>견적 요청하기</Link>
          </div>
        </div>
      </section>

      <style>{`
        .est-prod-row:hover { transform: translateY(-4px) !important; box-shadow: 0 16px 48px rgba(0,0,0,.08) !important; }
        .est-prod-row:hover .est-prod-img { transform: scale(1.05); }
        .est-why-card:hover { transform: translateY(-3px) !important; background: rgba(255,255,255,.06) !important; border-color: rgba(245,51,63,.2) !important; }
        .est-feat-card:hover { border-color: var(--accent) !important; transform: translateY(-3px) !important; }
        @media (max-width: 920px) {
          .est-prod-row { grid-template-columns: 1fr !important; }
          .est-why-grid { grid-template-columns: 1fr !important; }
          .est-feat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
