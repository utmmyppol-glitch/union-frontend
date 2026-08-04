'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { E, safeParse, useEditMode, useEditableManifest, EDITABLE_STYLES } from '@/lib/editable';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SERIF = "'Newsreader', Georgia, serif";

const PARTNERS = [
  { name: 'Microsoft', img: '/images/logo_microsoft.png' },
  { name: 'Adobe', img: '/images/logo_adobe.png' },
  { name: 'Autodesk', img: '/images/logo_autodesk.png' },
  { name: 'ESTsoft', img: '/images/logo_estsoft.png' },
];

const DEFAULT_HERO = {
  eyebrow: 'SOFTWARE PARTNERSHIP',
  desc: 'Microsoft, Adobe, Autodesk, ESTsoft —\n최적의 라이선스 컨설팅과 기술 지원을 제공합니다.',
};

const DEFAULT_PROCESS = [
  { num: '01', title: '상담', desc: '현재 IT 환경과 요구사항을 파악합니다' },
  { num: '02', title: '제안', desc: '최적의 라이선스 조합과 비용을 안내합니다' },
  { num: '03', title: '도입', desc: '설치, 마이그레이션, 교육을 지원합니다' },
  { num: '04', title: '운영', desc: '정기 점검과 기술 지원을 제공합니다' },
];

const DEFAULT_STATS = [
  { num: '4', label: '글로벌 파트너' },
  { num: '200+', label: '도입 기업' },
  { num: '20+', label: '년 컨설팅' },
  { num: '99.9%', label: '고객 만족도' },
];

const DEFAULT_CTA = {
  title: '어떤 소프트웨어가 필요하신지\n모르셔도 괜찮습니다.',
  desc: '유니온시스템즈가 귀사의 환경을 분석하고 최적의 조합을 찾아드립니다.',
};

export default function SoftwarePageClient({ ssrContent }: { ssrContent: Record<string, string> }) {
  const editMode = useEditMode();
  useEditableManifest(editMode);

  const [hero, setHero] = useState(() => safeParse(ssrContent.software_hero, DEFAULT_HERO));
  const [process, setProcess] = useState(() => safeParse(ssrContent.software_process, DEFAULT_PROCESS));
  const [stats, setStats] = useState(() => safeParse(ssrContent.software_stats, DEFAULT_STATS));
  const [cta, setCta] = useState(() => safeParse(ssrContent.software_cta, DEFAULT_CTA));

  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editMode) return;
    const setters: Record<string, (v: unknown) => void> = {
      software_hero: setHero as (v: unknown) => void,
      software_process: setProcess as (v: unknown) => void,
      software_stats: setStats as (v: unknown) => void,
      software_cta: setCta as (v: unknown) => void,
    };
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'content-update') {
        const fn = setters[e.data.section];
        if (fn) fn(e.data.data);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [editMode]);

  useEffect(() => {
    const els = pageRef.current?.querySelectorAll('.reveal');
    if (!els) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={pageRef} style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {editMode && <style>{EDITABLE_STYLES}</style>}

      {/* ═══ 1. Hero ═══ */}
      <section style={{
        position: 'relative', background: 'var(--charcoal)', overflow: 'hidden',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 60% 80%, rgba(148,53,67,.07) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {/* Blob decorations */}
        <div className="blob blob-accent" aria-hidden="true" style={{ width: 400, height: 400, right: '2%', top: '5%' }} />
        <div className="blob blob-wine" aria-hidden="true" style={{ width: 280, height: 280, left: '5%', bottom: '10%', animationDelay: '7s' }} />
        <div aria-hidden="true" style={{
          position: 'absolute', width: 18, height: 18, left: '15%', top: '22%',
          border: '1.5px solid rgba(255,255,255,.08)', transform: 'rotate(45deg)',
          animation: 'geoFloat2 14s ease-in-out infinite', pointerEvents: 'none',
        }} />

        <div aria-hidden="true" style={{
          position: 'absolute', right: '-4%', bottom: '-15%',
          fontFamily: SERIF, fontStyle: 'italic',
          fontSize: 'clamp(200px, 30vw, 480px)', fontWeight: 300,
          color: 'rgba(255,255,255,.02)', lineHeight: .8, pointerEvents: 'none',
        }}>
          SW
        </div>

        <div className="wrap" style={{ position: 'relative', zIndex: 1, padding: '120px clamp(20px,4vw,52px) 64px' }}>
          <p className="eyebrow" style={{ color: 'rgba(255,255,255,.4)', margin: '0 0 16px' }}>
            <E id="software_hero.eyebrow" editMode={editMode}>{hero.eyebrow}</E>
          </p>
          <h1 style={{
            fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
            lineHeight: .88, letterSpacing: '-.05em', color: '#fff', margin: '0 0 20px',
          }}>
            글로벌 소프트웨어<br />
            <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, letterSpacing: '-.02em' }}>
              공식 파트너
            </span>
          </h1>
          <p style={{
            fontWeight: 400, fontSize: 16, lineHeight: 1.7,
            color: 'rgba(255,255,255,.45)', maxWidth: 440, margin: 0,
          }}>
            <E id="software_hero.desc" editMode={editMode}>
              {hero.desc.split('\n').map((line: string, i: number) => (
                <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
              ))}
            </E>
          </p>

          {/* Partner logo strip */}
          <div style={{
            display: 'flex', gap: 0, alignItems: 'stretch',
            marginTop: 48,
            borderTop: '1px solid rgba(255,255,255,.08)',
          }}>
            {PARTNERS.map((p, i) => (
              <div key={p.name} className="partner-logo-cell" style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 14, padding: '32px 16px',
                borderRight: i < PARTNERS.length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none',
                cursor: 'default', transition: 'background .3s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.04)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <Image src={p.img} alt={p.name} width={100} height={44} style={{
                  height: 44, width: 'auto', objectFit: 'contain', opacity: 1,
                  filter: 'brightness(0) invert(1)',
                  transition: 'opacity .3s, transform .3s',
                }}
                />
                <span style={{
                  fontFamily: MONO, fontSize: 13, fontWeight: 600,
                  letterSpacing: '.1em', color: 'rgba(255,255,255,.75)',
                  textTransform: 'uppercase',
                }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 2. 벤토 그리드 — 4개 소프트웨어 각각 다른 스타일 ═══ */}
      <section style={{ padding: 'clamp(100px, 9vw, 112px) 0', position: 'relative', overflow: 'hidden' }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="blob blob-graphite" aria-hidden="true" style={{ width: 320, height: 320, right: '4%', top: '12%', animationDelay: '5s' }} />
        <div className="wrap">
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>OUR LINEUP</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', margin: 0,
            }}>
              소프트웨어 라인업
            </h2>
          </div>

          <div className="sw-bento" style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 0.6fr',
            gridTemplateRows: 'auto auto',
            gap: 20,
          }}>

            {/* ── Microsoft — 큰 카드 (왼쪽, 2행 차지) ── */}
            <Link href="/software/microsoft" className="reveal sw-bento-card" style={{
              gridRow: '1 / 3',
              background: 'var(--charcoal)', border: 'none',
              padding: 'clamp(36px, 5.5vw, 64px)',
              position: 'relative', overflow: 'hidden',
              textDecoration: 'none', display: 'flex', flexDirection: 'column',
              justifyContent: 'flex-end', minHeight: 480,
            }}>
              <div aria-hidden="true" style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at 80% 20%, rgba(148,53,67,.06) 0%, transparent 50%)',
                pointerEvents: 'none',
              }} />
              <div aria-hidden="true" style={{
                position: 'absolute', right: -20, top: -20,
                fontFamily: SERIF, fontStyle: 'italic',
                fontSize: 240, fontWeight: 300,
                color: 'rgba(255,255,255,.03)', lineHeight: 1, pointerEvents: 'none',
              }}>365</div>
              {/* Product image */}
              <div style={{
                position: 'absolute', right: 40, top: '50%', transform: 'translateY(-55%)',
                opacity: .12,
              }}>
                <Image src="/images/crawl/unionsystems/main_software_microsoft_80.png" alt="" width={400} height={300} style={{
                  height: 300, width: 'auto', objectFit: 'contain',
                }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{
                  fontFamily: MONO, fontSize: 12, fontWeight: 500, letterSpacing: '.12em',
                  color: 'var(--accent)', margin: '0 0 14px',
                }}>MICROSOFT 365</p>
                <h3 style={{
                  fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
                  lineHeight: 1, letterSpacing: '-.04em', color: '#fff', margin: '0 0 14px',
                }}>
                  학교, 회사, 일상<br />어디에서나
                </h3>
                <p style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,.45)', margin: '0 0 20px', maxWidth: 360 }}>
                  Word, Excel, PowerPoint, Teams 등 업무에 필요한 모든 도구를 클라우드 기반으로 제공합니다.
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                  {['Office', 'Teams', 'OneDrive', 'Exchange'].map((t) => (
                    <span key={t} style={{
                      fontFamily: MONO, fontSize: 12, fontWeight: 500, letterSpacing: '.04em',
                      padding: '4px 10px', color: 'rgba(255,255,255,.3)',
                      border: '1px solid rgba(255,255,255,.08)',
                    }}>{t}</span>
                  ))}
                </div>
                <span style={{
                  fontFamily: MONO, fontSize: 13, fontWeight: 600,
                  letterSpacing: '.04em', color: 'var(--accent)',
                }}>
                  자세히 보기 →
                </span>
              </div>
            </Link>

            {/* ── Autodesk — accent 배경 카드 (오른쪽 위) ── */}
            <Link href="/software/autodesk" className="reveal sw-bento-card" style={{
              background: 'var(--accent)', border: 'none',
              padding: 'clamp(28px, 4vw, 40px)',
              position: 'relative', overflow: 'hidden',
              textDecoration: 'none', display: 'flex', flexDirection: 'column',
              justifyContent: 'flex-end',
              transitionDelay: '.08s',
            }}>
              <div aria-hidden="true" style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at 80% 20%, rgba(255,255,255,.1) 0%, transparent 40%)',
                pointerEvents: 'none',
              }} />
              <div aria-hidden="true" style={{
                position: 'absolute', right: -10, top: -10,
                fontFamily: SERIF, fontStyle: 'italic',
                fontSize: 100, fontWeight: 300,
                color: 'rgba(255,255,255,.1)', lineHeight: 1, pointerEvents: 'none',
              }}>3D</div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{
                  fontFamily: MONO, fontSize: 12, fontWeight: 600, letterSpacing: '.12em',
                  color: 'rgba(255,255,255,.6)', margin: '0 0 10px',
                }}>AUTODESK</p>
                <h3 style={{
                  fontWeight: 900, fontSize: 22, lineHeight: 1.1,
                  letterSpacing: '-.03em', color: '#fff', margin: '0 0 10px',
                }}>
                  건축설계<br />3D 디자인
                </h3>
                <span style={{
                  fontFamily: MONO, fontSize: 14, fontWeight: 600,
                  color: 'rgba(255,255,255,.7)',
                }}>→</span>
              </div>
            </Link>

            {/* ── ESTsoft + Adobe — 오른쪽 아래 2열 ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* ESTsoft */}
              <Link href="/software/estsoft" className="reveal sw-bento-card" style={{
                background: 'var(--surface)', border: '1px solid var(--line)',
                padding: 'clamp(24px, 3vw, 32px)',
                position: 'relative', overflow: 'hidden',
                textDecoration: 'none', display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-end',
                transitionDelay: '.12s',
              }}>
                <div aria-hidden="true" style={{
                  position: 'absolute', right: -10, top: -5,
                  fontFamily: SERIF, fontStyle: 'italic',
                  fontSize: 80, fontWeight: 300,
                  color: 'rgba(20,18,16,.03)', lineHeight: 1, pointerEvents: 'none',
                }}>AL</div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{
                    fontFamily: MONO, fontSize: 12, fontWeight: 500, letterSpacing: '.12em',
                    color: 'var(--accent)', margin: '0 0 10px',
                  }}>ESTSOFT</p>
                  <h3 style={{
                    fontWeight: 800, fontSize: 17, lineHeight: 1.2,
                    letterSpacing: '-.02em', color: 'var(--ink)', margin: '0 0 6px',
                  }}>알툴즈</h3>
                  <p style={{ fontSize: 14, color: 'var(--ink2)', margin: '0 0 12px', lineHeight: 1.5 }}>
                    3,000만 사용자의 유틸리티
                  </p>
                  <span style={{
                    fontFamily: MONO, fontSize: 13, fontWeight: 600,
                    color: 'var(--accent)',
                  }}>→</span>
                </div>
              </Link>

              {/* Adobe */}
              <Link href="/software/adobe" className="reveal sw-bento-card" style={{
                background: 'var(--charcoal)', border: 'none',
                padding: 'clamp(24px, 3vw, 32px)',
                position: 'relative', overflow: 'hidden',
                textDecoration: 'none', display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-end',
                transitionDelay: '.16s',
              }}>
                <div aria-hidden="true" style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(ellipse at 80% 80%, rgba(148,53,67,.08) 0%, transparent 50%)',
                  pointerEvents: 'none',
                }} />
                <div aria-hidden="true" style={{
                  position: 'absolute', right: -10, top: -5,
                  fontFamily: SERIF, fontStyle: 'italic',
                  fontSize: 80, fontWeight: 300,
                  color: 'rgba(255,255,255,.03)', lineHeight: 1, pointerEvents: 'none',
                }}>Cc</div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{
                    fontFamily: MONO, fontSize: 12, fontWeight: 500, letterSpacing: '.12em',
                    color: 'var(--accent)', margin: '0 0 10px',
                  }}>ADOBE CC</p>
                  <h3 style={{
                    fontWeight: 800, fontSize: 17, lineHeight: 1.2,
                    letterSpacing: '-.02em', color: '#fff', margin: '0 0 6px',
                  }}>Creative Cloud</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,.4)', margin: '0 0 12px', lineHeight: 1.5 }}>
                    디자인, 사진, 영상편집
                  </p>
                  <span style={{
                    fontFamily: MONO, fontSize: 13, fontWeight: 600,
                    color: 'var(--accent)',
                  }}>→</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. 도입 프로세스 — 수평 연결 흐름도 ═══ */}
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
          background: 'radial-gradient(ellipse at 50% 100%, rgba(148,53,67,.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,.4)', margin: '0 0 14px' }}>PROCESS</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', color: '#fff', margin: 0,
            }}>
              도입 프로세스
            </h2>
          </div>

          <div className="sw-process" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
            position: 'relative',
          }}>
            {/* Connecting line */}
            <div aria-hidden="true" style={{
              position: 'absolute', top: 28, left: '12.5%', right: '12.5%',
              height: 2,
              background: 'linear-gradient(to right, var(--accent), rgba(255,255,255,.15), rgba(255,255,255,.15), var(--accent))',
              zIndex: 0,
            }} />

            {process.map((step: { num: string; title: string; desc: string }, i: number) => (
              <div key={step.num} className="reveal" style={{
                textAlign: 'center', position: 'relative', zIndex: 1,
                transitionDelay: `${i * 0.1}s`,
              }}>
                {/* Node dot */}
                <div style={{
                  width: 56, height: 56, margin: '0 auto 20px',
                  background: i === 0 || i === 3 ? 'var(--accent)' : 'var(--graphite)',
                  border: i === 0 || i === 3 ? '3px solid rgba(245,51,63,.2)' : '3px solid rgba(255,255,255,.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: i === 0 || i === 3 ? '0 0 24px rgba(245,51,63,.2)' : 'none',
                }}>
                  <span style={{
                    fontFamily: SERIF, fontStyle: 'italic',
                    fontSize: 22, fontWeight: 400, color: '#fff',
                  }}>{step.num}</span>
                </div>
                <h3 style={{
                  fontWeight: 700, fontSize: 16, color: '#fff', margin: '0 0 6px',
                }}><E id={`software_process[${i}].title`} editMode={editMode}>{step.title}</E></h3>
                <p style={{
                  fontFamily: MONO, fontSize: 13, letterSpacing: '.02em',
                  color: 'rgba(255,255,255,.35)', margin: 0, padding: '0 8px',
                }}><E id={`software_process[${i}].desc`} editMode={editMode}>{step.desc}</E></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. 숫자 스트립 ═══ */}
      <section className="reveal" style={{
        padding: 'clamp(40px, 6vw, 64px) 0', borderBottom: '1px solid var(--line)',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="wrap">
          <div className="sw-stats" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
          }}>
            {stats.map((s: { num: string; label: string }, si: number) => (
              <div key={si} style={{ textAlign: 'center' }}>
                <p style={{
                  fontFamily: SERIF, fontStyle: 'italic',
                  fontSize: 'clamp(36px, 5.5vw, 64px)', fontWeight: 400,
                  color: 'var(--ink)', margin: '0 0 4px', lineHeight: 1,
                }}><E id={`software_stats[${si}].num`} editMode={editMode}>{s.num}</E></p>
                <p style={{
                  fontFamily: MONO, fontSize: 12, fontWeight: 500, letterSpacing: '.1em',
                  color: 'var(--ink2)', margin: 0,
                }}><E id={`software_stats[${si}].label`} editMode={editMode}>{s.label}</E></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. CTA ═══ */}
      <section style={{
        padding: 'clamp(72px, 10vw, 128px) 0',
        background: 'var(--soft)', position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div aria-hidden="true" style={{
          position: 'absolute', left: '10%', top: '20%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(245,51,63,.03) 0%, transparent 60%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', right: '15%', bottom: '20%', width: 250, height: 250,
          background: 'radial-gradient(circle, rgba(43,44,48,.03) 0%, transparent 60%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 640 }}>
          <div className="reveal" style={{
            fontFamily: SERIF, fontStyle: 'italic',
            fontSize: 56, fontWeight: 300, color: 'var(--accent)', lineHeight: 1,
            marginBottom: 16, opacity: .4,
          }}>&ldquo;</div>
          <h2 className="reveal" style={{
            fontFamily: SERIF, fontStyle: 'italic',
            fontWeight: 400, fontSize: 'clamp(26px, 3.5vw, 40px)',
            lineHeight: 1.35, color: 'var(--ink)', margin: '0 0 12px',
          }}>
            <E id="software_cta.title" editMode={editMode}>
              {cta.title.split('\n').map((line: string, i: number) => (
                <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
              ))}
            </E>
          </h2>
          <p className="reveal" style={{
            fontSize: 16, color: 'var(--ink2)', margin: '0 0 36px', lineHeight: 1.7,
          }}>
            <E id="software_cta.desc" editMode={editMode}>{cta.desc}</E>
          </p>
          <div className="reveal" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/contact" className="btn" style={{
              padding: '16px 40px', background: 'var(--accent)', color: '#fff',
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              도입 문의하기 <span>&rarr;</span>
            </Link>
            <Link href="/contact" style={{
              padding: '16px 40px', border: '1px solid var(--ink)',
              color: 'var(--ink)', fontWeight: 600, fontSize: 15, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center',
            }}>
              견적 요청하기
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .sw-bento-card {
          transition: transform .3s cubic-bezier(.16,.84,.3,1), box-shadow .3s;
        }
        .sw-bento-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,.1);
        }
        @media (max-width: 920px) {
          .sw-bento { grid-template-columns: 1fr !important; grid-template-rows: auto !important; }
          .sw-bento > a:first-child { grid-row: auto !important; min-height: 360px !important; }
          .sw-bento > div:last-child { grid-template-columns: 1fr !important; }
          .sw-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .sw-process { grid-template-columns: repeat(2, 1fr) !important; gap: 32px !important; }
          .sw-process > div:first-child ~ div::before { display: none; }
        }
        @media (max-width: 560px) {
          .sw-process { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
