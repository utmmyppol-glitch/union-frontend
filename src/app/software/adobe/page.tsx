'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

const IMG = '/images/uploads/2022/06/';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SERIF = "'Newsreader', Georgia, serif";

const PRODUCTS = [
  { name: 'Photoshop', img: 'software_adobe_photoshop.jpg', desc: '이미지 편집의 표준' },
  { name: 'Illustrator', img: 'software_adobe_illustrator.jpg', desc: '벡터 그래픽 디자인' },
  { name: 'Premiere Pro', img: 'software_adobe_premiere-pro.jpg', desc: '전문 영상 편집' },
  { name: 'After Effects', img: 'software_adobe_after-effects.jpg', desc: '모션 그래픽 제작' },
];

const STRENGTHS = [
  { num: '01', img: 'software_adobe_point-01.jpg', en: 'Creativity', ko: '창작 도구', desc: '사진 편집부터 영상 제작, 일러스트레이션까지 — 크리에이티브 워크플로우의 모든 것을 하나의 플랫폼에서 해결합니다.' },
  { num: '02', img: 'software_adobe_point-02.jpg', en: 'License', ko: '라이선스 관리', desc: 'Admin Console을 통해 팀원별 앱 배포, 사용 현황 모니터링, 라이선스 재할당을 중앙에서 간편하게 관리합니다.', accent: true },
  { num: '03', img: 'software_adobe_point-03.jpg', en: 'Cooperation', ko: '팀 협업', desc: 'Creative Cloud Libraries, 공유 프로젝트, 클라우드 문서로 팀 전체가 일관된 브랜드 에셋을 공유할 수 있습니다.' },
];

const ICONS = [
  { name: 'Photoshop', img: 'software_adobe_icon_photoshop.jpg' },
  { name: 'Illustrator', img: 'software_adobe_icon_illustrator.jpg' },
  { name: 'Premiere Pro', img: 'software_adobe_icon_premiere-pro.jpg' },
  { name: 'After Effects', img: 'software_adobe_icon_after-effects.jpg' },
  { name: 'InDesign', img: 'software_adobe_icon_indesign.jpg' },
  { name: 'Lightroom', img: 'software_adobe_icon_lightroom.jpg' },
  { name: 'XD', img: 'software_adobe_icon_xd.jpg' },
  { name: 'Audition', img: 'software_adobe_icon_audition.jpg' },
  { name: 'Spark', img: 'software_adobe_icon_spark.jpg' },
  { name: 'Premiere Rush', img: 'software_adobe_icon_premiere-rush.jpg' },
  { name: 'Character Animator', img: 'software_adobe_icon_character-animator.jpg' },
  { name: 'Illustrator', img: 'software_adobe_icon_Illustrator.jpg' },
];

const PLANS = [
  { name: '개인/가족', img: 'software_adobe_plan_personal.jpg', desc: '1인 크리에이터·프리랜서를 위한 전 앱 이용 플랜', badge: null, apps: 'Photoshop · Illustrator · Premiere Pro 외 20+' },
  { name: '비즈니스', img: 'software_adobe_plan_work.jpg', desc: '팀 협업 + 관리 콘솔 + 무제한 스토리지 포함', badge: 'RECOMMENDED', apps: '전 앱 + Admin Console + 100GB/인' },
  { name: '교육', img: 'software_adobe_plan_education.jpg', desc: '학교·학생 대상 최대 60% 할인 라이선스', badge: null, apps: '전 앱 동일 · 교육기관 인증 필요' },
];

export default function AdobePage() {
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

      {/* ═══ 1. Hero — "Cc" 워터마크 + 그라데이션 블러 블롭 ═══ */}
      <section style={{
        position: 'relative', background: 'var(--charcoal)',
        minHeight: 540, display: 'flex', alignItems: 'center', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${IMG}software_adobe_visual_bg.jpg)`,
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1,
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 70% 80%, rgba(148,53,67,.08) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {/* Gradient blur blob — 그라데이션 레퍼런스 반영 */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '10%', top: '15%', width: 350, height: 350,
          background: 'radial-gradient(circle, rgba(245,51,63,.06) 0%, rgba(148,53,67,.03) 50%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', left: '5%', bottom: '20%', width: 250, height: 250,
          background: 'radial-gradient(circle, rgba(43,44,48,.15) 0%, transparent 60%)',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />
        {/* Large "Cc" */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '2%', bottom: '-8%',
          fontFamily: SERIF, fontStyle: 'italic',
          fontSize: 'clamp(220px, 30vw, 480px)', fontWeight: 300,
          color: 'rgba(255,255,255,.03)', lineHeight: .8, pointerEvents: 'none',
        }}>Cc</div>

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 560, padding: '140px 0 80px' }}>
            <p style={{
              fontFamily: MONO, fontWeight: 500, fontSize: 13, letterSpacing: '.14em',
              textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 16px',
            }}>Adobe Creative Cloud</p>
            <h1 style={{
              fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
              lineHeight: .88, letterSpacing: '-.05em', color: '#fff', margin: '0 0 16px',
            }}>
              디자인, 사진,<br />
              <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400 }}>영상편집</span>
            </h1>
            <p style={{
              fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,.45)',
              maxWidth: 420, margin: '0 0 28px',
            }}>
              Photoshop, Illustrator, Premiere Pro 등 크리에이티브 분야의 필수 소프트웨어.
            </p>
            {/* 20+ apps badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              marginBottom: 28, padding: '8px 16px',
              border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.03)',
            }}>
              <span style={{
                fontFamily: SERIF, fontStyle: 'italic',
                fontSize: 22, fontWeight: 400, color: 'var(--accent)', lineHeight: 1,
              }}>20+</span>
              <span style={{
                fontFamily: MONO, fontSize: 12, fontWeight: 500, letterSpacing: '.06em',
                color: 'rgba(255,255,255,.35)',
              }}>CREATIVE APPS</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/contact" className="btn" style={{
                padding: '16px 32px', background: 'var(--accent)', color: '#fff',
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
              }}>도입 문의하기 →</Link>
              <Link href="/contact" style={{
                padding: '16px 32px', border: '1px solid rgba(255,255,255,.45)',
                color: '#fff', fontWeight: 600, fontSize: 15, textDecoration: 'none',
              }}>견적 요청</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. 주요 제품 — 2x2 벤토 그리드 (Photoshop 강조) ═══ */}
      <section style={{ padding: 'clamp(64px, 9vw, 112px) 0' }}>
        <div className="wrap">
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>PRODUCTS</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', margin: 0,
            }}>주요 제품</h2>
          </div>

          <div className="ab-bento" style={{
            display: 'grid',
            gridTemplateColumns: '1.3fr 0.7fr',
            gridTemplateRows: 'auto auto',
            gap: 20,
          }}>
            {/* Photoshop — 큰 카드 (좌측 2행) */}
            <div className="reveal ab-bento-card" style={{
              gridRow: '1 / 3', border: '1px solid var(--line)',
              overflow: 'hidden', background: 'var(--surface)',
              position: 'relative',
            }}>
              <div style={{ overflow: 'hidden', height: '70%' }}>
                <img src={`${IMG}${PRODUCTS[0].img}`} alt={PRODUCTS[0].name} className="ab-bento-img" style={{
                  width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                  transition: 'transform .5s',
                }} />
              </div>
              <div style={{ padding: 28 }}>
                <span style={{
                  fontFamily: SERIF, fontStyle: 'italic',
                  fontSize: 18, color: 'var(--accent)', marginRight: 10,
                }}>01</span>
                <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-.02em' }}>{PRODUCTS[0].name}</span>
                <p style={{ fontSize: 16, color: 'var(--ink2)', margin: '8px 0 0' }}>{PRODUCTS[0].desc}</p>
              </div>
            </div>

            {/* 나머지 3개 — 우측 2행 */}
            {PRODUCTS.slice(1).map((p, i) => (
              <div key={p.name} className="reveal ab-bento-card" style={{
                border: '1px solid var(--line)', overflow: 'hidden',
                background: 'var(--surface)',
                display: 'flex', alignItems: 'center', gap: 16, padding: 0,
                transitionDelay: `${(i + 1) * 0.06}s`,
              }}>
                <div style={{ width: 120, height: '100%', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={`${IMG}${p.img}`} alt={p.name} className="ab-bento-img" style={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    transition: 'transform .5s',
                  }} />
                </div>
                <div style={{ padding: '16px 20px 16px 0' }}>
                  <span style={{
                    fontFamily: SERIF, fontStyle: 'italic',
                    fontSize: 18, color: 'var(--ink2)', marginRight: 8,
                  }}>{String(i + 2).padStart(2, '0')}</span>
                  <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.02em' }}>{p.name}</span>
                  <p style={{ fontSize: 16, color: 'var(--ink2)', margin: '4px 0 0' }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. 포함된 앱 — 마퀴 스크롤 ═══ */}
      <section style={{
        padding: '28px 0', background: 'var(--charcoal)',
        overflow: 'hidden', position: 'relative',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
          background: 'linear-gradient(to right, var(--charcoal), transparent)', pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
          background: 'linear-gradient(to left, var(--charcoal), transparent)', pointerEvents: 'none',
        }} />

        <div className="ab-marquee" style={{
          display: 'flex', gap: 40, alignItems: 'center',
          animation: 'abMarquee 25s linear infinite', width: 'max-content',
        }}>
          {[...ICONS, ...ICONS].map((ic, idx) => (
            <div key={`${ic.name}-${idx}`} style={{
              display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
            }}>
              <img src={`${IMG}${ic.img}`} alt={ic.name} style={{
                width: 32, height: 32, objectFit: 'contain',
              }} />
              <span style={{
                fontFamily: MONO, fontSize: 13, fontWeight: 500,
                letterSpacing: '.04em', color: 'rgba(255,255,255,.4)', whiteSpace: 'nowrap',
              }}>{ic.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 4. 강점 — 3열 수직 카드 + accent 하이라이트 ═══ */}
      <section style={{
        padding: 'clamp(64px, 9vw, 112px) 0',
        background: 'var(--soft)', position: 'relative', overflow: 'hidden',
      }}>
        {/* Gradient blobs */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '8%', top: '10%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(245,51,63,.025) 0%, transparent 60%)',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', left: '5%', bottom: '15%', width: 250, height: 250,
          background: 'radial-gradient(circle, rgba(43,44,48,.025) 0%, transparent 60%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>WHY ADOBE CC</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', margin: 0,
            }}>Adobe CC의 강점</h2>
          </div>

          <div className="ab-str-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
          }}>
            {STRENGTHS.map((s, i) => (
              <div key={s.num} className="reveal ab-str-card" style={{
                overflow: 'hidden',
                background: s.accent ? 'var(--charcoal)' : 'var(--surface)',
                border: s.accent ? 'none' : '1px solid var(--line)',
                transition: 'transform .25s cubic-bezier(.16,.84,.3,1), box-shadow .25s',
                transitionDelay: `${i * 0.08}s`,
              }}>
                {/* Image top */}
                <div style={{ overflow: 'hidden', height: 200 }}>
                  <img src={`${IMG}${s.img}`} alt={s.en} className="ab-str-img" style={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    transition: 'transform .5s',
                  }} />
                </div>
                {/* Text bottom */}
                <div style={{ padding: 28, position: 'relative' }}>
                  {/* Bg number */}
                  <div aria-hidden="true" style={{
                    position: 'absolute', right: 8, bottom: -8,
                    fontFamily: SERIF, fontStyle: 'italic',
                    fontSize: 80, fontWeight: 300, lineHeight: 1,
                    color: s.accent ? 'rgba(255,255,255,.05)' : 'rgba(20,18,16,.03)',
                    pointerEvents: 'none',
                  }}>{s.num}</div>

                  <span style={{
                    fontFamily: SERIF, fontStyle: 'italic',
                    fontSize: 24, fontWeight: 400,
                    color: s.accent ? 'rgba(255,255,255,.4)' : 'var(--accent)',
                    display: 'block', marginBottom: 12,
                  }}>{s.num}</span>
                  <h3 style={{
                    fontWeight: 900, fontSize: 22, letterSpacing: '-.02em',
                    color: s.accent ? '#fff' : 'var(--ink)', margin: '0 0 4px',
                  }}>{s.en}</h3>
                  <p style={{
                    fontFamily: MONO, fontSize: 12, letterSpacing: '.06em',
                    color: s.accent ? 'rgba(255,255,255,.35)' : 'var(--ink2)',
                    margin: '0 0 12px',
                  }}>{s.ko}</p>
                  <p style={{
                    fontSize: 16, lineHeight: 1.7,
                    color: s.accent ? 'rgba(255,255,255,.55)' : 'var(--ink2)',
                    margin: 0,
                  }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. 플랜 — Viewport-first 풀 화면 ═══ */}
      <section style={{
        padding: 'clamp(80px, 10vw, 140px) 0',
        position: 'relative', overflow: 'hidden',
        background: 'var(--soft)',
      }}>
        {/* Viewport-level: watermark */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '10%', right: '-4%',
          fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
          fontSize: 'clamp(160px, 20vw, 320px)', lineHeight: .85,
          color: 'var(--line)', opacity: .25,
          whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none',
        }}>Plans</div>

        {/* Dot pattern */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)',
          backgroundSize: '36px 36px', opacity: .2, pointerEvents: 'none',
        }} />

        {/* Guide line — 좌측 */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, bottom: 0,
          left: 'clamp(16px,2.5vw,40px)', width: 1,
          background: 'var(--line)', opacity: .25, pointerEvents: 'none',
        }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>PLANS</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: 1.05, letterSpacing: '-.04em', margin: '0 0 14px',
            }}>
              환경에 맞는 라이선스를 선택하세요
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink2)', margin: 0, maxWidth: 480 }}>
              개인 크리에이터부터 기업 팀까지. 유니온시스템즈가 최적 견적을 안내합니다.
            </p>
          </div>

          {/* 3 Plan cards — 가로 풀 */}
          <div className="ab-plans-layout" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
          }}>
            {PLANS.map((pl, i) => (
              <div key={pl.name} className="reveal ab-plan-row" style={{
                position: 'relative', overflow: 'hidden',
                border: pl.badge ? '2px solid var(--ink)' : '1px solid var(--line)',
                background: 'var(--surface)',
                transition: 'transform .3s cubic-bezier(.16,.84,.3,1), box-shadow .3s',
                transitionDelay: `${i * 0.08}s`,
                display: 'flex', flexDirection: 'column',
              }}>
                {/* Badge */}
                {pl.badge && (
                  <div style={{
                    position: 'absolute', top: 16, right: 16, zIndex: 2,
                    padding: '4px 10px', background: 'var(--ink)', color: '#fff',
                    fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: '.06em',
                  }}>{pl.badge}</div>
                )}

                {/* Image */}
                <div style={{ height: 180, overflow: 'hidden' }}>
                  <img src={`${IMG}${pl.img}`} alt={pl.name} className="ab-plan-img" style={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    transition: 'transform .5s',
                  }} />
                </div>

                {/* Content */}
                <div style={{ padding: '28px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Number */}
                  <div aria-hidden="true" style={{
                    fontFamily: SERIF, fontStyle: 'italic',
                    fontSize: 48, fontWeight: 300, lineHeight: 1,
                    color: 'var(--line)', opacity: .4, marginBottom: 12,
                  }}>{String(i + 1).padStart(2, '0')}</div>

                  <h3 style={{ fontWeight: 900, fontSize: 22, margin: '0 0 8px', letterSpacing: '-.02em' }}>
                    {pl.name}
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink2)', margin: '0 0 16px' }}>
                    {pl.desc}
                  </p>

                  {/* Apps included */}
                  <p style={{
                    fontFamily: MONO, fontSize: 12, fontWeight: 500,
                    letterSpacing: '.03em', color: 'var(--ink2)', opacity: .7,
                    margin: '0 0 20px', lineHeight: 1.5,
                  }}>{pl.apps}</p>

                  {/* CTA */}
                  <Link href="/contact" style={{
                    marginTop: 'auto',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '14px 24px',
                    background: pl.badge ? 'var(--accent)' : 'transparent',
                    border: pl.badge ? 'none' : '1px solid var(--line)',
                    color: pl.badge ? '#fff' : 'var(--ink)',
                    fontWeight: 700, fontSize: 14,
                    textDecoration: 'none', transition: 'all .2s',
                    textAlign: 'center', justifyContent: 'center',
                  }}>
                    견적 요청 <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom trust strip */}
          <div style={{
            marginTop: 40, display: 'flex', alignItems: 'center', gap: 24,
            padding: '20px 28px', border: '1px solid var(--line)', background: 'var(--surface)',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Adobe 공인 리셀러', '즉시 발급', '세금계산서 발행'].map((t) => (
                <span key={t} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 14, fontWeight: 500, color: 'var(--ink2)',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {t}
                </span>
              ))}
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <a href="tel:02-706-8999" style={{
                fontWeight: 600, fontSize: 14, color: 'var(--ink)',
                textDecoration: 'none',
              }}>
                전화 상담 02-706-8999
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6. CTA — 라이트 배경 + 그라데이션 블롭 ═══ */}
      <section style={{
        padding: 'clamp(72px, 10vw, 128px) 0',
        background: 'var(--soft)', position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', right: '12%', top: '15%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(245,51,63,.03) 0%, transparent 60%)',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', left: '10%', bottom: '20%', width: 220, height: 220,
          background: 'radial-gradient(circle, rgba(43,44,48,.03) 0%, transparent 60%)',
          filter: 'blur(40px)', pointerEvents: 'none',
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
            크리에이티브 팀의<br />생산성을 높여드립니다.
          </h2>
          <p className="reveal" style={{
            fontSize: 16, color: 'var(--ink2)', margin: '0 0 32px', lineHeight: 1.7,
          }}>
            Adobe 공식 리셀러 유니온시스템즈
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
        @keyframes abMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ab-marquee:hover { animation-play-state: paused; }
        .ab-bento-card { transition: transform .25s cubic-bezier(.16,.84,.3,1), box-shadow .25s; }
        .ab-bento-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,.07); }
        .ab-bento-card:hover .ab-bento-img { transform: scale(1.05); }
        .ab-str-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px rgba(0,0,0,.08) !important; }
        .ab-str-card:hover .ab-str-img { transform: scale(1.06); }
        .ab-plan-row:hover { transform: translateX(8px) !important; box-shadow: 0 8px 32px rgba(0,0,0,.06) !important; }
        .ab-plan-row:hover .ab-plan-img { transform: scale(1.05); }
        @media (max-width: 920px) {
          .ab-bento { grid-template-columns: 1fr !important; grid-template-rows: auto !important; }
          .ab-bento > div:first-child { grid-row: auto !important; }
          .ab-bento > div:not(:first-child) { flex-direction: row !important; }
          .ab-str-grid { grid-template-columns: 1fr !important; }
          .ab-plans-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .ab-bento > div:not(:first-child) { flex-direction: column !important; }
          .ab-bento > div:not(:first-child) > div:first-child { width: 100% !important; height: 160px !important; }
        }
      `}</style>
    </div>
  );
}
