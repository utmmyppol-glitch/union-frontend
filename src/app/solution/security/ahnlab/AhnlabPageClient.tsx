'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { E, safeParse, useEditMode, useEditableManifest, EDITABLE_STYLES } from '@/lib/editable';

const CRAWL = '/images/crawl/unionsystems';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SERIF = "'Newsreader', Georgia, serif";

const PRODUCTS = [
  { name: 'V3 / EPP', desc: '안티바이러스, 네트워크 보안, 행위 기반 탐지를 통합하여 PC와 서버를 보호합니다.', img: `${CRAWL}/solution_ahnlab_epp_201.jpg`, accent: false },
  { name: 'EDR', desc: '실시간 행위 분석과 포렌식 정보를 제공하여 알려지지 않은 위협까지 대응합니다.', img: `${CRAWL}/solution_ahnlab_edr_202.jpg`, accent: true },
  { name: 'MDS', desc: '샌드박스 기반 동적 분석으로 APT 공격, 랜섬웨어, 제로데이 위협을 사전 차단합니다.', img: `${CRAWL}/solution_ahnlab_mds_200.jpg`, accent: false },
];

const POINTS = [
  { title: '국내 1위 엔드포인트 보안', desc: '30년 이상 축적된 악성코드 분석 기술과 국내 최대 위협 인텔리전스 DB를 기반으로 정확한 탐지를 제공합니다.', img: `${CRAWL}/solution_ahnlab_point-01_203.jpg` },
  { title: '통합 보안 관리', desc: 'AhnLab ESA 중앙 관리 콘솔로 EPP, EDR, MDS를 하나의 화면에서 관리합니다.', img: `${CRAWL}/solution_ahnlab_point-02_204.jpg` },
  { title: '공공/금융 레퍼런스', desc: '공공기관, 금융권, 대기업 등 국내 보안 규제 환경에 최적화된 인증과 레퍼런스를 보유하고 있습니다.', img: `${CRAWL}/solution_ahnlab_point-03_205.jpg` },
];

const ICONS = [
  { label: '악성코드 탐지' }, { label: '행위 기반 분석' }, { label: '네트워크 보안' },
  { label: '랜섬웨어 차단' }, { label: '중앙 관리' }, { label: '실시간 모니터링' },
  { label: '위협 인텔리전스' }, { label: '취약점 관리' }, { label: '보안 리포트' },
];

const DEFAULT_HERO = { desc: 'V3, EDR, MDS, 방화벽 등 국내 1위 통합 보안 체계를 구축합니다.' };
const DEFAULT_PRODUCTS = PRODUCTS.map(p => ({ name: p.name, desc: p.desc }));
const DEFAULT_POINTS = POINTS.map(p => ({ title: p.title, desc: p.desc }));
const DEFAULT_ICONS = ICONS.map(ic => ({ label: ic.label }));
const DEFAULT_CTA = { title: '보안의 시작은\n안랩입니다.', desc: 'AhnLab 공인 파트너 유니온시스템즈' };

export default function AhnlabPageClient({ ssrContent }: { ssrContent: Record<string, string> }) {
  const editMode = useEditMode();
  useEditableManifest(editMode);
  const [hero, setHero] = useState(() => safeParse(ssrContent.ahnlab_hero, DEFAULT_HERO));
  const [products, setProducts] = useState(() => safeParse(ssrContent.ahnlab_products, DEFAULT_PRODUCTS));
  const [points, setPoints] = useState(() => safeParse(ssrContent.ahnlab_points, DEFAULT_POINTS));
  const [icons, setIcons] = useState(() => safeParse(ssrContent.ahnlab_icons, DEFAULT_ICONS));
  const [cta, setCta] = useState(() => safeParse(ssrContent.ahnlab_cta, DEFAULT_CTA));
  useEffect(() => {
    if (!editMode) return;
    const setters: Record<string, (v: unknown) => void> = {
      ahnlab_hero: setHero as (v: unknown) => void,
      ahnlab_products: setProducts as (v: unknown) => void,
      ahnlab_points: setPoints as (v: unknown) => void,
      ahnlab_icons: setIcons as (v: unknown) => void,
      ahnlab_cta: setCta as (v: unknown) => void,
    };
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

      {/* ═══ 1. Hero — "V3" 워터마크 + 블러 블롭 ═══ */}
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
          backgroundImage: `url(${CRAWL}/solution_ahnlab_visual_198.png)`,
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1,
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 70% 80%, rgba(148,53,67,.08) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {/* Blur blobs */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '12%', top: '20%', width: 350, height: 350,
          background: 'radial-gradient(circle, rgba(245,51,63,.06) 0%, transparent 60%)',
          filter: 'blur(70px)', pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', left: '5%', bottom: '15%', width: 250, height: 250,
          background: 'radial-gradient(circle, rgba(43,44,48,.15) 0%, transparent 60%)',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />
        {/* Large V3 */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '2%', bottom: '-10%',
          fontFamily: SERIF, fontStyle: 'italic',
          fontSize: 'clamp(200px, 28vw, 440px)', fontWeight: 300,
          color: 'rgba(255,255,255,.025)', lineHeight: .8, pointerEvents: 'none',
        }}>V3</div>

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 560, padding: '140px 0 80px' }}>
<p style={{
              fontFamily: MONO, fontWeight: 500, fontSize: 12, letterSpacing: '.14em',
              textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 16px',
            }}>AhnLab</p>
            <h1 style={{
              fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
              lineHeight: .88, letterSpacing: '-.05em', color: '#fff', margin: '0 0 16px',
            }}>
              국내 1위<br />
              <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400 }}>엔드포인트 보안</span>
            </h1>
            <p style={{
              fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,.45)',
              maxWidth: 420, margin: '0 0 28px',
            }}>
              <E id="ahnlab_hero.desc" editMode={editMode}>{hero.desc}</E>
            </p>
            {/* 30+ years badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              marginBottom: 28, padding: '8px 16px',
              border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.03)',
            }}>
              <span style={{
                fontFamily: SERIF, fontStyle: 'italic',
                fontSize: 22, fontWeight: 400, color: 'var(--accent)', lineHeight: 1,
              }}>30+</span>
              <span style={{
                fontFamily: MONO, fontSize: 12, fontWeight: 500, letterSpacing: '.06em',
                color: 'rgba(255,255,255,.35)',
              }}>YEARS OF SECURITY</span>
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

      {/* ═══ 2. 제품 — 3열 수직 카드 + accent 하이라이트 (KonsT) ═══ */}
      <section style={{ padding: 'clamp(100px, 9vw, 112px) 0' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="wrap">
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>PRODUCT LINEUP</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', margin: 0,
            }}>주요 제품</h2>
          </div>

          <div className="ah-prod-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
          }}>
            {PRODUCTS.map((p, i) => (
              <div key={p.name} className="reveal ah-prod-card" style={{
                overflow: 'hidden',
                background: p.accent ? 'var(--charcoal)' : 'var(--surface)',
                border: p.accent ? 'none' : '1px solid var(--line)',
                transition: 'transform .25s cubic-bezier(.16,.84,.3,1), box-shadow .25s',
                transitionDelay: `${i * 0.08}s`,
                position: 'relative',
              }}>
                {p.accent && (
                  <div aria-hidden="true" style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at 50% 100%, rgba(245,51,63,.06) 0%, transparent 50%)',
                    pointerEvents: 'none',
                  }} />
                )}
                {/* Image */}
                <div style={{ overflow: 'hidden', height: 200 }}>
                  <img src={p.img} alt={p.name} className="ah-prod-img" style={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    transition: 'transform .5s',
                  }} />
                </div>
                {/* Text */}
                <div style={{ padding: 28, position: 'relative', zIndex: 1 }}>
                  {/* Bg number */}
                  <div aria-hidden="true" style={{
                    position: 'absolute', right: 8, bottom: -8,
                    fontFamily: SERIF, fontStyle: 'italic',
                    fontSize: 80, fontWeight: 300, lineHeight: 1,
                    color: p.accent ? 'rgba(255,255,255,.05)' : 'rgba(20,18,16,.03)',
                    pointerEvents: 'none',
                  }}>{String(i + 1).padStart(2, '0')}</div>

                  <span style={{
                    fontFamily: SERIF, fontStyle: 'italic',
                    fontSize: 24, fontWeight: 400,
                    color: p.accent ? 'rgba(255,255,255,.4)' : 'var(--accent)',
                    display: 'block', marginBottom: 12,
                  }}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 style={{
                    fontWeight: 900, fontSize: 22, letterSpacing: '-.02em',
                    color: p.accent ? '#fff' : 'var(--ink)', margin: '0 0 10px',
                  }}><E id={`ahnlab_products.${i}.name`} editMode={editMode}>{products[i]?.name ?? p.name}</E></h3>
                  <p style={{
                    fontSize: 16, lineHeight: 1.7,
                    color: p.accent ? 'rgba(255,255,255,.55)' : 'var(--ink2)',
                    margin: 0,
                  }}><E id={`ahnlab_products.${i}.desc`} editMode={editMode}>{products[i]?.desc ?? p.desc}</E></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. 도입 효과 — 다크 + leisure row ═══ */}
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
          background: 'radial-gradient(ellipse at 30% 70%, rgba(148,53,67,.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', right: '8%', top: '15%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(245,51,63,.04) 0%, transparent 60%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,.4)', margin: '0 0 14px' }}>WHY AHNLAB</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', color: '#fff', margin: 0,
            }}>도입 효과</h2>
          </div>

          {POINTS.map((pt, i) => (
            <div key={i} className="reveal ah-point-row" style={{
              display: 'grid', gridTemplateColumns: '240px 1fr',
              gap: 32, alignItems: 'center',
              padding: '28px 0',
              borderBottom: i < POINTS.length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none',
              transition: 'padding-left .25s',
              transitionDelay: `${i * 0.08}s`,
            }}>
              <div style={{
                border: '1px solid rgba(255,255,255,.08)', overflow: 'hidden',
              }}>
                <img src={pt.img} alt={pt.title} className="ah-point-img" style={{
                  width: '100%', height: 160, objectFit: 'cover', display: 'block',
                  transition: 'transform .5s',
                }} />
              </div>
              <div>
                <span style={{
                  fontFamily: SERIF, fontStyle: 'italic',
                  fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,.15)',
                  marginRight: 10,
                }}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className="ah-point-title" style={{
                  fontWeight: 800, fontSize: 22, color: '#fff',
                  display: 'inline', letterSpacing: '-.02em', transition: 'color .2s',
                }}><E id={`ahnlab_points.${i}.title`} editMode={editMode}>{points[i]?.title ?? pt.title}</E></h3>
                <p style={{
                  fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,.45)',
                  margin: '10px 0 0',
                }}><E id={`ahnlab_points.${i}.desc`} editMode={editMode}>{points[i]?.desc ?? pt.desc}</E></p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 4. 주요 기능 — 3x3 그리드 ═══ */}
      <section style={{
        padding: 'clamp(100px, 9vw, 112px) 0', background: 'var(--soft)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div aria-hidden="true" style={{
          position: 'absolute', left: '5%', bottom: '10%', width: 280, height: 280,
          background: 'radial-gradient(circle, rgba(245,51,63,.025) 0%, transparent 60%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>FEATURES</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', margin: 0,
            }}>주요 기능</h2>
          </div>

          <div className="ah-feat-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
            maxWidth: 720, margin: '0 auto',
          }}>
            {ICONS.map((ic, i) => (
              <div key={i} className="reveal ah-feat-card" style={{
                textAlign: 'center', padding: '28px 16px',
                border: i === 4 ? '1px solid rgba(245,51,63,.15)' : '1px solid var(--line)',
                background: i === 4 ? 'rgba(245,51,63,.03)' : 'var(--surface)',
                transition: 'transform .2s, border-color .2s, box-shadow .2s',
                transitionDelay: `${i * 0.04}s`,
              }}>
                <span style={{
                  fontFamily: SERIF, fontStyle: 'italic',
                  fontSize: 22, fontWeight: 300,
                  color: i === 4 ? 'var(--accent)' : 'var(--line)',
                  display: 'block', marginBottom: 10, opacity: i === 4 ? .6 : 1,
                }}>{String(i + 1).padStart(2, '0')}</span>
                <p style={{
                  fontFamily: MONO, fontSize: 13, fontWeight: 600,
                  letterSpacing: '.04em', color: 'var(--ink)', margin: 0,
                }}><E id={`ahnlab_icons.${i}.label`} editMode={editMode}>{icons[i]?.label ?? ic.label}</E></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. CTA — 라이트 인용구 ═══ */}
      <section style={{
        padding: 'clamp(72px, 10vw, 128px) 0',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div aria-hidden="true" style={{
          position: 'absolute', right: '12%', top: '20%', width: 280, height: 280,
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
            <E id="ahnlab_cta.title" editMode={editMode}>
              {cta.title.split('\n').map((line: string, i: number) => (
                <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
              ))}
            </E>
          </h2>
          <p className="reveal" style={{
            fontSize: 16, color: 'var(--ink2)', margin: '0 0 32px', lineHeight: 1.7,
          }}>
            <E id="ahnlab_cta.desc" editMode={editMode}>{cta.desc}</E>
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

      <style dangerouslySetInnerHTML={{ __html: `
        .ah-prod-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px rgba(0,0,0,.08) !important; }
        .ah-prod-card:hover .ah-prod-img { transform: scale(1.06); }
        .ah-point-row:hover { padding-left: 12px !important; }
        .ah-point-row:hover .ah-point-title { color: var(--accent) !important; }
        .ah-point-row:hover .ah-point-img { transform: scale(1.05); }
        .ah-feat-card:hover { transform: translateY(-3px) !important; border-color: var(--accent) !important; box-shadow: 0 8px 28px rgba(0,0,0,.06) !important; }
        @media (max-width: 920px) {
          .ah-prod-grid { grid-template-columns: 1fr !important; }
          .ah-point-row { grid-template-columns: 1fr !important; }
          .ah-point-row > div:first-child { display: none; }
          .ah-feat-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .ah-feat-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      ` }} />
    </div>
  );
}
