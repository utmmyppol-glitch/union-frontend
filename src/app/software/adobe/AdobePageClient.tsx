'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { E, stripHtml, useEditableContent, EDITABLE_STYLES } from '@/lib/editable';

const CRAWL = '/images/crawl/unionsystems/';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SERIF = "'Newsreader', Georgia, serif";

const PRODUCTS = [
  { name: 'Photoshop', img: 'software_adobe_photoshop_153.jpg', desc: '이미지 편집의 표준' },
  { name: 'Illustrator', img: 'software_adobe_illustrator_154.jpg', desc: '벡터 그래픽 디자인' },
  { name: 'Premiere Pro', img: 'software_adobe_premiere-pro_155.jpg', desc: '전문 영상 편집' },
  { name: 'After Effects', img: 'software_adobe_after-effects_156.jpg', desc: '모션 그래픽 제작' },
];

const DEFAULT_HERO = {
  badge: 'Adobe Creative Cloud',
  title: '디자인, 사진,\n영상편집',
  desc: 'Photoshop, Illustrator, Premiere Pro 등 크리에이티브 분야의 필수 소프트웨어.',
  heroBtn1: '도입 문의하기 →',
  heroBtn2: '견적 요청',
};

const DEFAULT_STRENGTHS = [
  { num: '01', img: 'software_adobe_point-01_157.jpg', en: 'Creativity', ko: '창작 도구', desc: '사진 편집부터 영상 제작, 일러스트레이션까지 — 크리에이티브 워크플로우의 모든 것을 하나의 플랫폼에서 해결합니다.', accent: false },
  { num: '02', img: 'software_adobe_point-02_158.jpg', en: 'License', ko: '라이선스 관리', desc: 'Admin Console을 통해 팀원별 앱 배포, 사용 현황 모니터링, 라이선스 재할당을 중앙에서 간편하게 관리합니다.', accent: true },
  { num: '03', img: 'software_adobe_point-03_159.jpg', en: 'Cooperation', ko: '팀 협업', desc: 'Creative Cloud Libraries, 공유 프로젝트, 클라우드 문서로 팀 전체가 일관된 브랜드 에셋을 공유할 수 있습니다.', accent: false },
];

const DEFAULT_CTA = {
  title: '크리에이티브 팀의\n생산성을 높여드립니다.',
  desc: 'Adobe 공식 리셀러 유니온시스템즈',
  btn1: '도입 문의하기',
  btn2: '견적 요청하기',
};

const ICONS = [
  { name: 'Photoshop', img: 'software_adobe_icon_photoshop_160.jpg' },
  { name: 'Illustrator', img: 'software_adobe_icon_Illustrator_161.jpg' },
  { name: 'Premiere Pro', img: 'software_adobe_icon_premiere-pro_163.jpg' },
  { name: 'After Effects', img: 'software_adobe_icon_after-effects_162.jpg' },
  { name: 'InDesign', img: 'software_adobe_icon_indesign_167.jpg' },
  { name: 'Lightroom', img: 'software_adobe_icon_lightroom_170.jpg' },
  { name: 'XD', img: 'software_adobe_icon_xd_164.jpg' },
  { name: 'Audition', img: 'software_adobe_icon_audition_169.jpg' },
  { name: 'Spark', img: 'software_adobe_icon_spark_168.jpg' },
  { name: 'Premiere Rush', img: 'software_adobe_icon_premiere-rush_165.jpg' },
  { name: 'Character Animator', img: 'software_adobe_icon_character-animator_166.jpg' },
  { name: 'Illustrator', img: 'software_adobe_icon_Illustrator_161.jpg' },
];

const PLANS = [
  { name: '개인/가족', img: 'software_adobe_plan_personal_171.jpg', desc: '1인 크리에이터·프리랜서를 위한 전 앱 이용 플랜', badge: null, apps: 'Photoshop · Illustrator · Premiere Pro 외 20+' },
  { name: '비즈니스', img: 'software_adobe_plan_work_172.jpg', desc: '팀 협업 + 관리 콘솔 + 무제한 스토리지 포함', badge: 'RECOMMENDED', apps: '전 앱 + Admin Console + 100GB/인' },
  { name: '교육', img: 'software_adobe_plan_education_173.jpg', desc: '학교·학생 대상 최대 60% 할인 라이선스', badge: null, apps: '전 앱 동일 · 교육기관 인증 필요' },
];

const DEFAULT_PRODUCTS_DATA = PRODUCTS.map(p => ({ name: p.name, desc: p.desc }));
const DEFAULT_PLANS_DATA = PLANS.map(p => ({ name: p.name, desc: p.desc, apps: p.apps }));

const DEFAULT_SECTIONS = {
  productsTitle: '주요 제품',
  strengthsTitle: 'Adobe CC의 강점',
  plansTitle: '환경에 맞는 라이선스를 선택하세요',
  plansDesc: '개인 크리에이터부터 기업 팀까지. 유니온시스템즈가 최적 견적을 안내합니다.',
  plansCta: '견적 요청',
  phone: '전화 상담 02-706-8999',
};
const DEFAULT_TRUST = ['Adobe 공인 리셀러', '즉시 발급', '세금계산서 발행'];

const DEFAULTS = {
  adobe_hero: DEFAULT_HERO,
  adobe_strengths: DEFAULT_STRENGTHS,
  adobe_cta: DEFAULT_CTA,
  adobe_products: DEFAULT_PRODUCTS_DATA,
  adobe_plans: DEFAULT_PLANS_DATA,
  adobe_sections: DEFAULT_SECTIONS,
  adobe_trust: DEFAULT_TRUST,
} as const;

export default function AdobePageClient({ ssrContent }: { ssrContent: Record<string, string> }) {
  const [content, editMode] = useEditableContent(DEFAULTS, ssrContent);

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

      {/* ═══ 1. Hero — "Cc" 워터마크 + 그라데이션 블러 블롭 ═══ */}
      <section style={{
        position: 'relative', background: 'var(--charcoal)',
        minHeight: 540, display: 'flex', alignItems: 'center', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${CRAWL}software_adobe_visual_151.png)`,
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
            }}><E id="adobe_hero.badge" editMode={editMode}>{content.adobe_hero.badge}</E></p>
            <h1 style={{
              fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
              lineHeight: .88, letterSpacing: '-.05em', color: '#fff', margin: '0 0 16px',
            }}>
              <E id="adobe_hero.title" editMode={editMode}>
                {stripHtml(content.adobe_hero.title).split('\n').map((line: string, i: number) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {i > 0 ? <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400 }}>{line}</span> : line}
                  </React.Fragment>
                ))}
              </E>
            </h1>
            <p style={{
              fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,.45)',
              maxWidth: 600, margin: '0 0 28px',
            }}>
              <E id="adobe_hero.desc" editMode={editMode}>{content.adobe_hero.desc}</E>
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
              <Link href="/contact?product=Adobe" className="btn" style={{
                padding: '16px 32px', background: 'var(--accent)', color: '#fff',
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
              }}><E id="adobe_hero.heroBtn1" editMode={editMode}>{content.adobe_hero.heroBtn1}</E></Link>
              <Link href="/contact?product=Adobe" style={{
                padding: '16px 32px', border: '1px solid rgba(255,255,255,.45)',
                color: '#fff', fontWeight: 600, fontSize: 15, textDecoration: 'none',
              }}><E id="adobe_hero.heroBtn2" editMode={editMode}>{content.adobe_hero.heroBtn2}</E></Link>
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
            }}><E id="adobe_sections.productsTitle" editMode={editMode}>{content.adobe_sections.productsTitle}</E></h2>
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
              <div style={{ overflow: 'hidden', height: '70%', position: 'relative' }}>
                <Image src={`${CRAWL}${PRODUCTS[0].img}`} alt={PRODUCTS[0].name} className="ab-bento-img" fill style={{
                  objectFit: 'cover',
                  transition: 'transform .5s',
                }} />
              </div>
              <div style={{ padding: 28 }}>
                <span style={{
                  fontFamily: SERIF, fontStyle: 'italic',
                  fontSize: 18, color: 'var(--accent)', marginRight: 10,
                }}>01</span>
                <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-.02em' }}><E id="adobe_product0.name" editMode={editMode}>{content.adobe_products[0]?.name ?? PRODUCTS[0].name}</E></span>
                <div style={{ fontSize: 16, color: 'var(--ink2)', margin: '8px 0 0' }}><E id="adobe_product0.desc" editMode={editMode}>{content.adobe_products[0]?.desc ?? PRODUCTS[0].desc}</E></div>
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
                <div style={{ width: 120, height: '100%', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                  <Image src={`${CRAWL}${p.img}`} alt={p.name} className="ab-bento-img" fill style={{
                    objectFit: 'cover',
                    transition: 'transform .5s',
                  }} />
                </div>
                <div style={{ padding: '16px 20px 16px 0' }}>
                  <span style={{
                    fontFamily: SERIF, fontStyle: 'italic',
                    fontSize: 18, color: 'var(--ink2)', marginRight: 8,
                  }}>{String(i + 2).padStart(2, '0')}</span>
                  <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.02em' }}><E id={`adobe_product${i + 1}.name`} editMode={editMode}>{content.adobe_products[i + 1]?.name ?? p.name}</E></span>
                  <div style={{ fontSize: 16, color: 'var(--ink2)', margin: '4px 0 0' }}><E id={`adobe_product${i + 1}.desc`} editMode={editMode}>{content.adobe_products[i + 1]?.desc ?? p.desc}</E></div>
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
              <Image src={`${CRAWL}${ic.img}`} alt={ic.name} width={32} height={32} style={{
                objectFit: 'contain',
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
            }}><E id="adobe_sections.strengthsTitle" editMode={editMode}>{content.adobe_sections.strengthsTitle}</E></h2>
          </div>

          <div className="ab-str-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
          }}>
            {content.adobe_strengths.map((s: { num: string; img: string; en: string; ko: string; desc: string; accent?: boolean }, i: number) => (
              <div key={s.num} className="reveal ab-str-card" style={{
                overflow: 'hidden',
                background: s.accent ? 'var(--charcoal)' : 'var(--surface)',
                border: s.accent ? 'none' : '1px solid var(--line)',
                transition: 'transform .25s cubic-bezier(.16,.84,.3,1), box-shadow .25s',
                transitionDelay: `${i * 0.08}s`,
              }}>
                {/* Image top */}
                <div style={{ overflow: 'hidden', height: 200, position: 'relative' }}>
                  <Image src={`${CRAWL}${s.img}`} alt={s.en} className="ab-str-img" fill style={{
                    objectFit: 'cover',
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
                  }}><E id={`adobe_strengths[${i}].en`} editMode={editMode}>{s.en}</E></h3>
                  <p style={{
                    fontFamily: MONO, fontSize: 12, letterSpacing: '.06em',
                    color: s.accent ? 'rgba(255,255,255,.35)' : 'var(--ink2)',
                    margin: '0 0 12px',
                  }}><E id={`adobe_strengths[${i}].ko`} editMode={editMode}>{s.ko}</E></p>
                  <div style={{
                    fontSize: 16, lineHeight: 1.7,
                    color: s.accent ? 'rgba(255,255,255,.55)' : 'var(--ink2)',
                    margin: 0,
                  }}><E id={`adobe_strengths[${i}].desc`} editMode={editMode}>{s.desc}</E></div>
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
              <E id="adobe_sections.plansTitle" editMode={editMode}>{content.adobe_sections.plansTitle}</E>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink2)', margin: 0, maxWidth: 640 }}>
              <E id="adobe_sections.plansDesc" editMode={editMode}>{content.adobe_sections.plansDesc}</E>
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
                  }}><E id="adobe_plans.recommended" editMode={editMode}>{pl.badge}</E></div>
                )}

                {/* Image */}
                <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                  <Image src={`${CRAWL}${pl.img}`} alt={pl.name} className="ab-plan-img" fill style={{
                    objectFit: 'cover',
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
                    <E id={`adobe_plan${i}.name`} editMode={editMode}>{content.adobe_plans[i]?.name ?? pl.name}</E>
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink2)', margin: '0 0 16px' }}>
                    <E id={`adobe_plan${i}.desc`} editMode={editMode}>{content.adobe_plans[i]?.desc ?? pl.desc}</E>
                  </p>

                  {/* Apps included */}
                  <p style={{
                    fontFamily: MONO, fontSize: 12, fontWeight: 500,
                    letterSpacing: '.03em', color: 'var(--ink2)', opacity: .7,
                    margin: '0 0 20px', lineHeight: 1.5,
                  }}><E id={`adobe_plan${i}.apps`} editMode={editMode}>{content.adobe_plans[i]?.apps ?? pl.apps}</E></p>

                  {/* CTA */}
                  <Link href="/contact?product=Adobe" style={{
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
                    <E id={`adobe_sections.plansCta`} editMode={editMode}>{content.adobe_sections.plansCta}</E> <span>&rarr;</span>
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
              {content.adobe_trust.map((t: string, i: number) => (
                <span key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 14, fontWeight: 500, color: 'var(--ink2)',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <E id={`adobe_trust.${i}`} editMode={editMode}>{t}</E>
                </span>
              ))}
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <a href="tel:02-706-8999" style={{
                fontWeight: 600, fontSize: 14, color: 'var(--ink)',
                textDecoration: 'none',
              }}>
                <E id="adobe_sections.phone" editMode={editMode}>{content.adobe_sections.phone}</E>
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
            <E id="adobe_cta.title" editMode={editMode}>
              {stripHtml(content.adobe_cta.title).split('\n').map((line: string, i: number) => (
                <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
              ))}
            </E>
          </h2>
          <p className="reveal" style={{
            fontSize: 16, color: 'var(--ink2)', margin: '0 0 32px', lineHeight: 1.7,
          }}>
            <E id="adobe_cta.desc" editMode={editMode}>{content.adobe_cta.desc}</E>
          </p>
          <div className="reveal" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact?product=Adobe" className="btn" style={{
              padding: '16px 36px', background: 'var(--accent)', color: '#fff',
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
            }}><E id="adobe_cta.btn1" editMode={editMode}>{content.adobe_cta.btn1}</E></Link>
            <Link href="/contact?product=Adobe" style={{
              padding: '16px 36px', border: '1px solid var(--ink)',
              color: 'var(--ink)', fontWeight: 600, fontSize: 15, textDecoration: 'none',
            }}><E id="adobe_cta.btn2" editMode={editMode}>{content.adobe_cta.btn2}</E></Link>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
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
      ` }} />
    </div>
  );
}
