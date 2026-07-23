'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const IMG = '/images/uploads/2022/06/';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SERIF = "'Newsreader', Georgia, serif";

const PRODUCTS = [
  { name: 'AutoCAD', img: 'software_autodesk_autocad.jpg', desc: '2D/3D CAD 설계의 글로벌 표준' },
  { name: 'Inventor', img: 'software_autodesk_inventor.jpg', desc: '3D 기계 설계 및 시뮬레이션' },
  { name: 'Revit', img: 'software_autodesk_revit.jpg', desc: 'BIM 기반 건축 설계' },
  { name: '3ds Max', img: 'software_autodesk_3ds-max.jpg', desc: '3D 모델링 및 렌더링' },
];

const STRENGTHS = [
  { num: '01', en: 'Quality', ko: '설계 품질', desc: 'Autodesk의 검증된 설계 도구로 정밀하고 신뢰할 수 있는 설계 결과물을 만들어 냅니다.' },
  { num: '02', en: 'Cooperation', ko: '팀 협업', desc: '클라우드 기반 공동 작업 환경으로 설계팀 간 실시간 데이터 공유와 리뷰가 가능합니다.' },
  { num: '03', en: 'Customizing', ko: '맞춤 솔루션', desc: '산업군과 프로젝트 규모에 맞는 최적의 제품 조합과 라이선스 구성을 제안합니다.', accent: true },
];

const COLLECTIONS = [
  { name: 'AEC Collection', desc: '건축, 엔지니어링, 시공', icons: [
    { name: 'Revit', img: 'software_autodesk_icon_revit.jpg' }, { name: 'Civil 3D', img: 'software_autodesk_icon_civil.jpg' },
    { name: 'AutoCAD', img: 'software_autodesk_icon_autocad.jpg' }, { name: 'InfraWorks', img: 'software_autodesk_icon_infraworks.jpg' },
    { name: 'Navisworks', img: 'software_autodesk_icon_navisworks.jpg' }, { name: 'Docs', img: 'software_autodesk_icon_docs.jpg' },
  ]},
  { name: 'Product Design', desc: '제품 설계 및 제조', icons: [
    { name: 'Inventor', img: 'software_autodesk_icon_inventor.jpg' }, { name: 'Fusion 360', img: 'software_autodesk_icon_fusion-360.jpg' },
    { name: 'AutoCAD', img: 'software_autodesk_icon_autocad.jpg' }, { name: 'Tolerance Analysis', img: 'software_autodesk_icon_inventor-tolerance-analysis.jpg' },
    { name: 'Nesting', img: 'software_autodesk_icon_inventor-nesting.jpg' },
  ]},
  { name: 'Media & Entertainment', desc: '미디어 및 엔터테인먼트', icons: [
    { name: 'Maya', img: 'software_autodesk_icon_maya.jpg' }, { name: '3ds Max', img: 'software_autodesk_icon_3ds-max.jpg' },
    { name: 'Arnold', img: 'software_autodesk_icon_arnold.jpg' }, { name: 'MotionBuilder', img: 'software_autodesk_icon_motionbuilder.jpg' },
    { name: 'Mudbox', img: 'software_autodesk_icon_mudbox.jpg' },
  ]},
];

export default function AutodeskPage() {
  const [activeCol, setActiveCol] = useState(0);
  const [colFade, setColFade] = useState(true);

  const switchCol = useCallback((idx: number) => {
    if (idx === activeCol) return;
    setColFade(false);
    setTimeout(() => { setActiveCol(idx); setColFade(true); }, 180);
  }, [activeCol]);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const col = COLLECTIONS[activeCol];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>

      {/* ═══ 1. Hero — 대형 "CAD" 워터마크 + 사선 분위기 ═══ */}
      <section style={{
        position: 'relative', background: 'var(--charcoal)',
        minHeight: 540, display: 'flex', alignItems: 'center', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${IMG}software_autodesk_visual_bg.jpg)`,
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1,
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 80% 70%, rgba(148,53,67,.07) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {/* Blob decorations */}
        <div className="blob blob-accent" aria-hidden="true" style={{ width: 380, height: 380, right: '3%', top: '5%' }} />
        <div className="blob blob-wine" aria-hidden="true" style={{ width: 260, height: 260, left: '6%', bottom: '8%', animationDelay: '9s' }} />
        <div aria-hidden="true" style={{
          position: 'absolute', width: 17, height: 17, left: '20%', top: '25%',
          border: '1.5px solid rgba(255,255,255,.08)', transform: 'rotate(45deg)',
          animation: 'geoFloat1 13s ease-in-out infinite', pointerEvents: 'none',
        }} />

        {/* Diagonal accent strip */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: -100, top: -100, width: 500, height: 800,
          background: 'var(--accent)', opacity: .03,
          transform: 'rotate(-15deg)', pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', right: '5%', bottom: '-12%',
          fontFamily: SERIF, fontStyle: 'italic',
          fontSize: 'clamp(200px, 28vw, 440px)', fontWeight: 300,
          color: 'rgba(255,255,255,.025)', lineHeight: .8, pointerEvents: 'none',
        }}>
          CAD
        </div>

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 560, padding: '140px 0 80px' }}>
            <p style={{
              fontFamily: MONO, fontWeight: 500, fontSize: 12, letterSpacing: '.14em',
              textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 16px',
            }}>Autodesk</p>
            <h1 style={{
              fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
              lineHeight: .88, letterSpacing: '-.05em', color: '#fff', margin: '0 0 20px',
            }}>
              건축설계,<br />
              <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400 }}>3D 디자인</span>
            </h1>
            <p style={{
              fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,.45)',
              maxWidth: 400, margin: '0 0 32px',
            }}>
              AutoCAD, Revit, 3ds Max 등 건축·설계·디자인 분야의 글로벌 표준 소프트웨어.
            </p>
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

      {/* ═══ 2. 제품 — Leisure row 리스트 (수직 교차) ═══ */}
      <section style={{ padding: 'clamp(64px, 9vw, 112px) 0', position: 'relative', overflow: 'hidden' }}>
        <div className="blob blob-graphite" aria-hidden="true" style={{ width: 300, height: 300, right: '5%', top: '18%', animationDelay: '4s' }} />
        <div className="wrap">
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>PRODUCTS</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', margin: 0,
            }}>주요 제품</h2>
          </div>

          {PRODUCTS.map((p, i) => (
            <Link
              key={p.name}
              href="/contact"
              className="reveal ad-prod-row"
              style={{
                display: 'grid', gridTemplateColumns: '200px 1fr auto',
                gap: 24, alignItems: 'center',
                padding: '24px 0', borderBottom: '1px solid var(--line)',
                textDecoration: 'none', transition: 'padding-left .25s',
                transitionDelay: `${i * 0.05}s`,
              }}
            >
              {/* Image thumbnail */}
              <div style={{ overflow: 'hidden', border: '1px solid var(--line)' }}>
                <img src={`${IMG}${p.img}`} alt={p.name} className="ad-prod-img" style={{
                  width: '100%', height: 120, objectFit: 'cover', display: 'block',
                  transition: 'transform .4s',
                }} />
              </div>
              {/* Text */}
              <div>
                <span style={{
                  fontFamily: SERIF, fontStyle: 'italic',
                  fontSize: 18, fontWeight: 400, color: 'var(--ink2)',
                  marginRight: 12,
                }}>{String(i + 1).padStart(2, '0')}</span>
                <span className="ad-prod-title" style={{
                  fontWeight: 800, fontSize: 22, color: 'var(--ink)',
                  transition: 'color .2s', letterSpacing: '-.02em',
                }}>{p.name}</span>
                <p style={{ fontSize: 16, color: 'var(--ink2)', margin: '6px 0 0' }}>{p.desc}</p>
              </div>
              {/* Arrow */}
              <span className="ad-prod-arrow" style={{
                fontSize: 22, color: 'var(--accent)', opacity: 0,
                transition: 'opacity .2s, transform .2s',
              }}>→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ 3. 강점 — 3열 카드, 하나만 accent (KonsT 스타일) ═══ */}
      <section style={{
        padding: 'clamp(64px, 9vw, 112px) 0', background: 'var(--soft)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', left: '-5%', top: '30%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(245,51,63,.03) 0%, transparent 60%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>WHY AUTODESK</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', margin: 0,
            }}>Autodesk의 강점</h2>
          </div>

          <div className="ad-str-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
          }}>
            {STRENGTHS.map((s, i) => (
              <div
                key={s.num}
                className="reveal ad-str-card"
                style={{
                  padding: 32,
                  background: s.accent ? 'var(--accent)' : 'var(--surface)',
                  border: s.accent ? 'none' : '1px solid var(--line)',
                  position: 'relative', overflow: 'hidden',
                  transition: 'transform .25s cubic-bezier(.16,.84,.3,1), box-shadow .25s',
                  transitionDelay: `${i * 0.08}s`,
                }}
              >
                {/* Bg number */}
                <div aria-hidden="true" style={{
                  position: 'absolute', right: -8, bottom: -16,
                  fontFamily: SERIF, fontStyle: 'italic',
                  fontSize: 120, fontWeight: 300, lineHeight: 1,
                  color: s.accent ? 'rgba(255,255,255,.1)' : 'rgba(20,18,16,.03)',
                  pointerEvents: 'none',
                }}>{s.num}</div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span style={{
                    fontFamily: SERIF, fontStyle: 'italic',
                    fontSize: 28, fontWeight: 400,
                    color: s.accent ? 'rgba(255,255,255,.6)' : 'var(--accent)',
                    display: 'block', marginBottom: 16,
                  }}>{s.num}</span>
                  <h3 style={{
                    fontWeight: 900, fontSize: 22, letterSpacing: '-.02em',
                    color: s.accent ? '#fff' : 'var(--ink)',
                    margin: '0 0 4px',
                  }}>{s.en}</h3>
                  <p style={{
                    fontFamily: MONO, fontSize: 12, letterSpacing: '.04em',
                    color: s.accent ? 'rgba(255,255,255,.5)' : 'var(--ink2)',
                    margin: '0 0 14px',
                  }}>{s.ko}</p>
                  <p style={{
                    fontSize: 16, lineHeight: 1.7,
                    color: s.accent ? 'rgba(255,255,255,.7)' : 'var(--ink2)',
                    margin: 0,
                  }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. 컬렉션 — 탭 셀렉터 (가로 탭 + 아이콘 전환) ═══ */}
      <section style={{
        padding: 'clamp(64px, 9vw, 112px) 0',
        background: 'var(--charcoal)', position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 80%, rgba(148,53,67,.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,.4)', margin: '0 0 14px' }}>COLLECTIONS</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', color: '#fff', margin: 0,
            }}>컬렉션</h2>
          </div>

          {/* Collection tabs */}
          <div className="reveal" style={{
            display: 'flex', gap: 0, marginBottom: 40,
            borderBottom: '1px solid rgba(255,255,255,.06)',
          }}>
            {COLLECTIONS.map((c, i) => (
              <button
                key={c.name}
                onClick={() => switchCol(i)}
                style={{
                  padding: '16px 24px', border: 'none', background: 'transparent',
                  borderBottom: activeCol === i ? '2px solid var(--accent)' : '2px solid transparent',
                  cursor: 'pointer', transition: 'border-color .2s',
                  marginBottom: -1,
                }}
              >
                <span style={{
                  fontWeight: 700, fontSize: 16,
                  color: activeCol === i ? '#fff' : 'rgba(255,255,255,.3)',
                  transition: 'color .2s',
                }}>{c.name}</span>
              </button>
            ))}
          </div>

          {/* Active collection content */}
          <div style={{
            opacity: colFade ? 1 : 0,
            transform: colFade ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity .25s, transform .25s',
          }}>
            <p style={{
              fontFamily: MONO, fontSize: 16, letterSpacing: '.06em',
              color: 'rgba(255,255,255,.35)', margin: '0 0 28px',
            }}>{col.desc}</p>

            <div className="ad-col-icons" style={{
              display: 'grid', gridTemplateColumns: `repeat(${Math.min(col.icons.length, 6)}, 1fr)`,
              gap: 16, maxWidth: 600,
            }}>
              {col.icons.map((ic, idx) => (
                <div key={`${ic.name}-${idx}`} className="ad-col-icon" style={{
                  textAlign: 'center', padding: 20,
                  border: '1px solid rgba(255,255,255,.06)',
                  background: 'rgba(255,255,255,.02)',
                  transition: 'border-color .2s, transform .2s',
                }}>
                  <img src={`${IMG}${ic.img}`} alt={ic.name} style={{
                    width: 44, height: 44, objectFit: 'contain',
                    margin: '0 auto 10px', display: 'block',
                  }} />
                  <span style={{
                    fontFamily: MONO, fontSize: 13, fontWeight: 500,
                    color: 'rgba(255,255,255,.5)', letterSpacing: '.02em',
                  }}>{ic.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. 플랜 — Viewport-first 풀 화면 ═══ */}
      <section style={{
        padding: 'clamp(80px, 10vw, 140px) 0',
        position: 'relative', overflow: 'hidden', background: 'var(--soft)',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', top: '10%', right: '-4%',
          fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
          fontSize: 'clamp(160px, 20vw, 320px)', lineHeight: .85,
          color: 'var(--line)', opacity: .25,
          whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none',
        }}>Plans</div>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)',
          backgroundSize: '36px 36px', opacity: .2, pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, bottom: 0,
          left: 'clamp(16px,2.5vw,40px)', width: 1,
          background: 'var(--line)', opacity: .25, pointerEvents: 'none',
        }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>PLANS</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: 1.05, letterSpacing: '-.04em', margin: '0 0 14px',
            }}>환경에 맞는 라이선스를 선택하세요</h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink2)', margin: 0, maxWidth: 480 }}>
              개인·팀·교육기관까지. 유니온시스템즈가 최적 구성과 견적을 안내합니다.
            </p>
          </div>

          <div className="ad-plans-layout" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
          }}>
            {[
              { name: '단일 제품', img: `${IMG}software_autodesk_visual_bg.jpg`, desc: '특정 제품 하나를 집중 사용하는 개인·소규모 팀', badge: null, apps: 'AutoCAD · Revit · Inventor · 3ds Max 중 1개' },
              { name: '컬렉션', img: `${IMG}software_autodesk_visual_bg.jpg`, desc: '업무 분야에 최적화된 제품 묶음 — AEC·제품설계·M&E', badge: 'RECOMMENDED', apps: 'AEC · Product Design · M&E Collection' },
              { name: '교육 기관', img: `${IMG}software_autodesk_visual_bg.jpg`, desc: '학생·교직원 대상 무상/할인 라이선스', badge: null, apps: '전 제품 · 비상업적 사용 · 교육기관 인증' },
            ].map((pl, i) => (
              <div key={pl.name} className="reveal" style={{
                position: 'relative', overflow: 'hidden',
                border: pl.badge ? '2px solid var(--ink)' : '1px solid var(--line)',
                background: 'var(--surface)',
                transition: 'transform .3s cubic-bezier(.16,.84,.3,1), box-shadow .3s',
                display: 'flex', flexDirection: 'column',
              }}>
                {pl.badge && (
                  <div style={{
                    position: 'absolute', top: 16, right: 16, zIndex: 2,
                    padding: '4px 10px', background: 'var(--ink)', color: '#fff',
                    fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: '.06em',
                  }}>{pl.badge}</div>
                )}
                <div style={{ height: 180, overflow: 'hidden' }}>
                  <img src={pl.img} alt={pl.name} style={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    transition: 'transform .5s',
                  }} />
                </div>
                <div style={{ padding: '28px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div aria-hidden="true" style={{
                    fontFamily: SERIF, fontStyle: 'italic',
                    fontSize: 48, fontWeight: 300, lineHeight: 1,
                    color: 'var(--line)', opacity: .4, marginBottom: 12,
                  }}>{String(i + 1).padStart(2, '0')}</div>
                  <h3 style={{ fontWeight: 900, fontSize: 22, margin: '0 0 8px', letterSpacing: '-.02em' }}>{pl.name}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink2)', margin: '0 0 16px' }}>{pl.desc}</p>
                  <p style={{
                    fontFamily: MONO, fontSize: 12, fontWeight: 500,
                    letterSpacing: '.03em', color: 'var(--ink2)', opacity: .7,
                    margin: '0 0 20px', lineHeight: 1.5,
                  }}>{pl.apps}</p>
                  <Link href="/contact" style={{
                    marginTop: 'auto',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '14px 24px',
                    background: pl.badge ? 'var(--accent)' : 'transparent',
                    border: pl.badge ? 'none' : '1px solid var(--line)',
                    color: pl.badge ? '#fff' : 'var(--ink)',
                    fontWeight: 700, fontSize: 14,
                    textDecoration: 'none', transition: 'all .2s',
                    justifyContent: 'center',
                  }}>견적 요청 <span>&rarr;</span></Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 40, display: 'flex', alignItems: 'center', gap: 24,
            padding: '20px 28px', border: '1px solid var(--line)', background: 'var(--surface)', flexWrap: 'wrap',
          }}>
            {['Autodesk 공인 리셀러', '즉시 발급', '세금계산서 발행'].map((t) => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: 'var(--ink2)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                {t}
              </span>
            ))}
            <a href="tel:02-706-8999" style={{ marginLeft: 'auto', fontWeight: 600, fontSize: 14, color: 'var(--ink)', textDecoration: 'none' }}>02-706-8999</a>
          </div>
        </div>
      </section>

      {/* ═══ 6. CTA — 인용구 스타일 ═══ */}
      <section style={{
        padding: 'clamp(72px, 10vw, 128px) 0',
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', right: '15%', top: '20%', width: 280, height: 280,
          background: 'radial-gradient(circle, rgba(245,51,63,.025) 0%, transparent 60%)',
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
            산업별 맞춤 제품 구성을<br />안내해 드립니다.
          </h2>
          <p className="reveal" style={{
            fontSize: 16, color: 'var(--ink2)', margin: '0 0 32px', lineHeight: 1.7,
          }}>
            Autodesk 공인 리셀러 유니온시스템즈
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
        .ad-prod-row:hover { padding-left: 12px !important; }
        .ad-prod-row:hover .ad-prod-title { color: var(--accent) !important; }
        .ad-prod-row:hover .ad-prod-arrow { opacity: 1 !important; transform: translateX(4px); }
        .ad-prod-row:hover .ad-prod-img { transform: scale(1.05); }
        .ad-str-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px rgba(0,0,0,.08) !important; }
        .ad-col-icon:hover { border-color: var(--accent) !important; transform: translateY(-2px); }
        @media (max-width: 920px) {
          .ad-prod-row { grid-template-columns: 140px 1fr auto !important; }
          .ad-str-grid { grid-template-columns: 1fr !important; }
          .ad-col-icons { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .ad-prod-row { grid-template-columns: 1fr !important; }
          .ad-prod-row > div:first-child { display: none; }
        }
      `}</style>
    </div>
  );
}
