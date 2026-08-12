'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { E, stripHtml, useEditableContent, EDITABLE_STYLES } from '@/lib/editable';

const CRAWL = '/images/crawl/unionsystems/';

const PRODUCTS = [
  { name: 'Word', img: 'software_microsoft_word_58.jpg', desc: '문서 작성 및 편집' },
  { name: 'Excel', img: 'software_microsoft_excel_59.jpg', desc: '스프레드시트 및 데이터 분석' },
  { name: 'PowerPoint', img: 'software_microsoft_powerpoint_60.jpg', desc: '프레젠테이션 제작' },
  { name: 'Outlook', img: 'software_microsoft_outlook_61.jpg', desc: '이메일 및 일정 관리' },
];

const DEFAULT_HERO = {
  badge: 'Microsoft 365',
  desc: 'Word, Excel, PowerPoint, Teams 등 업무에 필요한 모든 도구를 클라우드 기반으로 제공합니다.',
};

const DEFAULT_STRENGTHS = [
  { num: '01', img: 'software_microsoft_point_office-tool_62.jpg', title: 'Office Tool', sub: '어디서나 동일한 환경', desc: '한 개의 ID로 최대 15개 디바이스 접속 가능. PC, 태블릿, 스마트폰 어디서나 동일한 환경에서 업무를 이어갈 수 있습니다.' },
  { num: '02', img: 'software_microsoft_point_smart-work_63.jpg', title: 'Smart Work', sub: '실시간 클라우드 협업', desc: 'Teams, OneDrive 등 클라우드 협업 도구로 실시간 공동 작업, 화상 회의, 파일 공유가 가능합니다.' },
  { num: '03', img: 'software_microsoft_point_security_64.jpg', title: 'Security', sub: '엔터프라이즈급 보안', desc: 'Microsoft Defender, Azure AD 통합 보안으로 기업 데이터를 안전하게 보호합니다.' },
];

const DEFAULT_CTA = {
  title: '200여 기업이 선택한\n이유가 있습니다.',
  desc: '유니온시스템즈가 최적의 Microsoft 365 라이선스와 마이그레이션을 지원합니다.',
};

const ICONS = [
  { name: 'Word', img: 'software_microsoft_icon_01_65.jpg' },
  { name: 'Excel', img: 'software_microsoft_icon_02_66.jpg' },
  { name: 'PowerPoint', img: 'software_microsoft_icon_03_67.jpg' },
  { name: 'Outlook', img: 'software_microsoft_icon_04_68.jpg' },
  { name: 'Teams', img: 'software_microsoft_icon_05_69.jpg' },
  { name: 'OneDrive', img: 'software_microsoft_icon_06_70.jpg' },
  { name: 'SharePoint', img: 'software_microsoft_icon_07_71.jpg' },
  { name: 'Exchange', img: 'software_microsoft_icon_08_72.jpg' },
];

const PLANS = [
  { name: '개인/가족', img: 'software_microsoft_plan_personal-family_73.jpg', highlight: false, desc: '가정용 Word, Excel, PowerPoint + 1TB OneDrive', apps: 'Office 앱 + OneDrive 1TB', price: '연간 구독' },
  { name: '비즈니스', img: 'software_microsoft_plan_work_74.jpg', highlight: true, desc: '팀 협업 + 보안 + 관리 콘솔. 기업 환경에 최적화된 올인원.', apps: '전 앱 + Teams + SharePoint + Exchange', price: '사용자당/월' },
  { name: '교육', img: 'software_microsoft_plan_education_75.jpg', highlight: false, desc: '학교·학생 무료 또는 할인 라이선스. A1/A3/A5 플랜.', apps: 'Office 앱 + Teams + Intune for Education', price: '교육기관 인증' },
];

const DEFAULT_SECTIONS = {
  hero_title1: '학교, 회사, 일상',
  hero_title2: '어디에서나',
  products_title: '주요 제품',
  strengths_title: 'Microsoft 365의 강점',
  plans_title: '환경에 맞는 플랜을 선택하세요',
  plans_desc: '개인부터 기업 팀까지. 유니온시스템즈가 최적 견적과 마이그레이션을 지원합니다.',
};
const DEFAULT_ACCENTS = [
  { num: '15+', label: '디바이스', sub: '동시 접속' },
  { num: '1TB', label: '클라우드', sub: '사용자당 저장' },
  { num: '99.9%', label: '가동률', sub: 'SLA 보장' },
  { num: '300+', label: '기업 고객', sub: '유니온 구축' },
];
const DEFAULT_PRODUCTS_DATA = PRODUCTS.map(p => ({ name: p.name, desc: p.desc }));
const DEFAULT_PLANS_DATA = PLANS.map(p => ({ name: p.name, desc: p.desc, apps: p.apps, price: p.price }));
const DEFAULT_BUTTONS = {
  hero_cta: '도입 문의하기 →',
  hero_quote: '견적 요청',
  detail: '자세히 보기',
  plan_quote: '견적 요청',
  cta_primary: '도입 문의하기',
  cta_secondary: '견적 요청하기',
};
const DEFAULT_TRUST = ['Microsoft CSP 파트너', '즉시 활성화', '마이그레이션 지원', '세금계산서'];

const DEFAULTS = {
  microsoft_hero: DEFAULT_HERO,
  microsoft_strengths: DEFAULT_STRENGTHS,
  microsoft_cta: DEFAULT_CTA,
  microsoft_sections: DEFAULT_SECTIONS,
  microsoft_accents: DEFAULT_ACCENTS,
  microsoft_products: DEFAULT_PRODUCTS_DATA,
  microsoft_plans: DEFAULT_PLANS_DATA,
  microsoft_buttons: DEFAULT_BUTTONS,
  microsoft_trust: DEFAULT_TRUST,
} as const;

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SERIF = "'Newsreader', Georgia, serif";

export default function MicrosoftPageClient({ ssrContent }: { ssrContent: Record<string, string> }) {
  const [content, editMode] = useEditableContent(DEFAULTS, ssrContent);

  const [activeStrength, setActiveStrength] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const switchStrength = useCallback((idx: number) => {
    if (idx === activeStrength) return;
    setFadeIn(false);
    setTimeout(() => {
      setActiveStrength(idx);
      setFadeIn(true);
    }, 200);
  }, [activeStrength]);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const s = content.microsoft_strengths[activeStrength];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      {editMode && <style>{EDITABLE_STYLES}</style>}

      {/* ═══ 1. Hero — 대형 "365" 오버레이 (Norway 스타일) ═══ */}
      <section style={{
        position: 'relative', background: 'var(--charcoal)',
        minHeight: 560, display: 'flex', alignItems: 'center', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${CRAWL}software_microsoft_powerpoint_60.jpg)`,
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12,
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 70% 80%, rgba(148,53,67,.07) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {/* 대형 365 타이포 오버레이 */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '-2%', bottom: '-10%',
          fontFamily: SERIF, fontStyle: 'italic',
          fontSize: 'clamp(240px, 35vw, 520px)', fontWeight: 300,
          color: 'rgba(255,255,255,.035)', lineHeight: .8, pointerEvents: 'none',
        }}>
          365
        </div>

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 580, padding: '140px 0 80px' }}>
            <p style={{
              fontFamily: MONO, fontWeight: 500, fontSize: 12, letterSpacing: '.14em',
              textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 16px',
            }}>
              <E id="microsoft_hero.badge" editMode={editMode}>{content.microsoft_hero.badge}</E>
            </p>
            <h1 style={{
              fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
              lineHeight: .88, letterSpacing: '-.05em', color: '#fff', margin: '0 0 20px',
            }}>
              <E id="microsoft_sections.hero_title1" editMode={editMode}>{content.microsoft_sections.hero_title1}</E><br />
              <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, letterSpacing: '-.02em' }}>
                <E id="microsoft_sections.hero_title2" editMode={editMode}>{content.microsoft_sections.hero_title2}</E>
              </span>
            </h1>
            <p style={{
              fontWeight: 400, fontSize: 16, lineHeight: 1.7,
              color: 'rgba(255,255,255,.5)', maxWidth: 600, margin: '0 0 32px',
            }}>
              <E id="microsoft_hero.desc" editMode={editMode}>{content.microsoft_hero.desc}</E>
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/contact?product=Microsoft%20365" className="btn" style={{
                padding: '16px 32px', background: 'var(--accent)', color: '#fff',
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
              }}>
                <E id="microsoft_buttons.hero_cta" editMode={editMode}>{content.microsoft_buttons.hero_cta}</E>
              </Link>
              <Link href="/contact?product=Microsoft%20365" style={{
                padding: '16px 32px', border: '1px solid rgba(255,255,255,.45)',
                color: '#fff', fontWeight: 600, fontSize: 15, textDecoration: 'none',
              }}>
                <E id="microsoft_buttons.hero_quote" editMode={editMode}>{content.microsoft_buttons.hero_quote}</E>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. 앱 아이콘 마퀴 스트립 ═══ */}
      <section style={{
        padding: '28px 0', borderBottom: '1px solid var(--line)',
        overflow: 'hidden', position: 'relative',
      }}>
        {/* Edge fade masks */}
        <div aria-hidden="true" style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
          background: 'linear-gradient(to right, var(--bg), transparent)', pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
          background: 'linear-gradient(to left, var(--bg), transparent)', pointerEvents: 'none',
        }} />

        <div className="ms-marquee" style={{
          display: 'flex', gap: 48, alignItems: 'center',
          animation: 'msMarquee 20s linear infinite',
          width: 'max-content',
        }}>
          {[...ICONS, ...ICONS].map((ic, idx) => (
            <div key={`${ic.name}-${idx}`} style={{
              display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
            }}>
              <Image src={`${CRAWL}${ic.img}`} alt={ic.name} width={36} height={36} style={{
                objectFit: 'contain',
              }} />
              <span style={{
                fontFamily: MONO, fontSize: 13, fontWeight: 500,
                letterSpacing: '.04em', color: 'var(--ink2)', whiteSpace: 'nowrap',
              }}>{ic.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 3. 풀블리드 숫자 블록 (accent 배경 — Metal Roof 스타일) ═══ */}
      <section className="reveal" style={{
        background: 'var(--accent)', padding: 'clamp(48px, 7vw, 80px) 0',
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 20% 30%, rgba(255,255,255,.08) 0%, transparent 40%)',
          pointerEvents: 'none',
        }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="ms-stats" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
          }}>
            {content.microsoft_accents.map((stat: { num: string; label: string; sub: string }, i: number) => (
              <div key={i} style={{
                textAlign: 'center', padding: '0 20px',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,.15)' : 'none',
              }}>
                <p style={{
                  fontFamily: SERIF, fontStyle: 'italic',
                  fontSize: 'clamp(36px, 5.5vw, 64px)', fontWeight: 400,
                  color: '#fff', margin: '0 0 8px', lineHeight: 1,
                }}>
                  <E id={`microsoft_accents.${i}.num`} editMode={editMode}>{stat.num}</E>
                </p>
                <p style={{
                  fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,.9)',
                  margin: '0 0 2px',
                }}><E id={`microsoft_accents.${i}.label`} editMode={editMode}>{stat.label}</E></p>
                <p style={{
                  fontFamily: MONO, fontSize: 12, fontWeight: 500,
                  letterSpacing: '.06em', color: 'rgba(255,255,255,.5)', margin: 0,
                }}><E id={`microsoft_accents.${i}.sub`} editMode={editMode}>{stat.sub}</E></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. 주요 제품 — 4열 이미지 카드 ═══ */}
      <section style={{ padding: 'clamp(64px, 9vw, 112px) 0' }}>
        <div className="wrap">
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>PRODUCTS</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', margin: 0,
            }}>
              <E id="microsoft_sections.products_title" editMode={editMode}>{content.microsoft_sections.products_title}</E>
            </h2>
          </div>
          <div className="ms-products" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
          }}>
            {PRODUCTS.map((p, i) => (
              <div key={p.name} className="reveal ms-prod-card" style={{
                border: '1px solid var(--line)', overflow: 'hidden',
                background: 'var(--surface)',
                transition: 'transform .25s cubic-bezier(.16,.84,.3,1), box-shadow .25s',
                transitionDelay: `${i * 0.06}s`,
              }}>
                <div style={{ overflow: 'hidden', position: 'relative', aspectRatio: '4/3' }}>
                  <Image src={`${CRAWL}${p.img}`} alt={p.name} className="ms-prod-img" fill style={{
                    objectFit: 'cover',
                    transition: 'transform .4s',
                  }} />
                </div>
                <div style={{ padding: 20 }}>
                  <h3 style={{ fontWeight: 800, fontSize: 18, margin: '0 0 4px' }}><E id={`microsoft_products.${i}.name`} editMode={editMode}>{content.microsoft_products[i]?.name ?? p.name}</E></h3>
                  <p style={{ fontSize: 16, color: 'var(--ink2)', margin: 0, lineHeight: 1.5 }}><E id={`microsoft_products.${i}.desc`} editMode={editMode}>{content.microsoft_products[i]?.desc ?? p.desc}</E></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. 강점 — 탭 셀렉터 (Roofly 스타일) ═══ */}
      <section style={{
        padding: 'clamp(64px, 9vw, 112px) 0',
        background: 'var(--charcoal)', position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 70%, rgba(148,53,67,.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {/* Gradient blob */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '10%', top: '20%', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(245,51,63,.04) 0%, transparent 60%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,.4)', margin: '0 0 14px' }}>
              WHY MICROSOFT 365
            </p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', color: '#fff', margin: 0,
            }}>
              <E id="microsoft_sections.strengths_title" editMode={editMode}>{content.microsoft_sections.strengths_title}</E>
            </h2>
          </div>

          {/* Tab buttons */}
          <div className="reveal" style={{ display: 'flex', gap: 0, marginBottom: 40 }}>
            {content.microsoft_strengths.map((st: { num: string; title: string; sub: string }, i: number) => (
              <button
                key={st.num}
                onClick={() => switchStrength(i)}
                className="ms-str-tab"
                style={{
                  flex: 1, padding: '20px 24px', border: 'none',
                  background: activeStrength === i ? 'rgba(255,255,255,.08)' : 'transparent',
                  borderBottom: activeStrength === i ? '2px solid var(--accent)' : '2px solid rgba(255,255,255,.06)',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'background .2s, border-color .2s',
                }}
              >
                <span style={{
                  fontFamily: SERIF, fontStyle: 'italic',
                  fontSize: 28, fontWeight: 400,
                  color: activeStrength === i ? 'var(--accent)' : 'rgba(255,255,255,.15)',
                  display: 'block', marginBottom: 8, transition: 'color .2s',
                }}>
                  {st.num}
                </span>
                <span style={{
                  fontWeight: 700, fontSize: 16,
                  color: activeStrength === i ? '#fff' : 'rgba(255,255,255,.35)',
                  display: 'block', transition: 'color .2s',
                }}>
                  <E id={`microsoft_strengths[${i}].title`} editMode={editMode}>{st.title}</E>
                </span>
                <span style={{
                  fontFamily: MONO, fontSize: 12, letterSpacing: '.04em',
                  color: activeStrength === i ? 'rgba(255,255,255,.4)' : 'rgba(255,255,255,.15)',
                  display: 'block', marginTop: 4, transition: 'color .2s',
                }}>
                  <E id={`microsoft_strengths[${i}].sub`} editMode={editMode}>{st.sub}</E>
                </span>
              </button>
            ))}
          </div>

          {/* Active content */}
          <div className="ms-str-content" style={{
            display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 48,
            alignItems: 'center',
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity .3s, transform .3s',
          }}>
            <div style={{
              border: '1px solid rgba(255,255,255,.08)', overflow: 'hidden',
              position: 'relative', minHeight: 280,
            }}>
              <Image src={`${CRAWL}${s.img}`} alt={s.title} fill style={{
                objectFit: 'cover',
              }} />
              {/* Number overlay on image */}
              <div aria-hidden="true" style={{
                position: 'absolute', right: 16, bottom: 16,
                fontFamily: SERIF, fontStyle: 'italic',
                fontSize: 80, fontWeight: 300, color: 'rgba(255,255,255,.08)',
                lineHeight: 1,
              }}>
                {s.num}
              </div>
            </div>
            <div>
              <h3 style={{
                fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
                letterSpacing: '-.03em', color: '#fff', margin: '0 0 16px',
              }}>
                <E id={`microsoft_strengths[${activeStrength}].title`} editMode={editMode}>{s.title}</E>
              </h3>
              <div style={{
                fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,.55)', margin: '0 0 24px',
              }}>
                <E id={`microsoft_strengths[${activeStrength}].desc`} editMode={editMode}>{s.desc}</E>
              </div>
              <Link href="/contact?product=Microsoft%20365" style={{
                fontFamily: MONO, fontSize: 13, fontWeight: 600,
                letterSpacing: '.04em', color: 'var(--accent)',
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                <E id="microsoft_buttons.detail" editMode={editMode}>{content.microsoft_buttons.detail}</E> <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6. 플랜 — Viewport-first 풀 화면 ═══ */}
      <section style={{
        padding: 'clamp(80px, 10vw, 140px) 0',
        background: 'var(--soft)', position: 'relative', overflow: 'hidden',
      }}>
        {/* Viewport-level watermark */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '8%', right: '-4%',
          fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
          fontSize: 'clamp(180px, 22vw, 360px)', lineHeight: .85,
          color: 'var(--line)', opacity: .2,
          whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none',
        }}>365</div>

        {/* Dot pattern */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)',
          backgroundSize: '40px 40px', opacity: .18, pointerEvents: 'none',
        }} />

        {/* Guide line — 좌측 */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, bottom: 0,
          left: 'clamp(16px,2.5vw,40px)', width: 1,
          background: 'var(--line)', opacity: .2, pointerEvents: 'none',
        }} />

        {/* Full-width top line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>PLANS</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: 1.05, letterSpacing: '-.04em', margin: '0 0 12px',
            }}>
              <E id="microsoft_sections.plans_title" editMode={editMode}>{content.microsoft_sections.plans_title}</E>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink2)', margin: 0, maxWidth: 640 }}>
              <E id="microsoft_sections.plans_desc" editMode={editMode}>{content.microsoft_sections.plans_desc}</E>
            </p>
          </div>

          <div className="ms-plans" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20, alignItems: 'stretch',
          }}>
            {PLANS.map((pl, i) => (
              <div
                key={pl.name}
                className="reveal ms-plan-card"
                style={{
                  border: pl.highlight ? '2px solid var(--ink)' : '1px solid var(--line)',
                  overflow: 'hidden', background: 'var(--surface)',
                  transition: 'transform .3s cubic-bezier(.16,.84,.3,1), box-shadow .3s',
                  position: 'relative',
                  transitionDelay: `${i * 0.06}s`,
                  display: 'flex', flexDirection: 'column',
                }}
              >
                {pl.highlight && (
                  <div style={{
                    position: 'absolute', top: 16, right: 16, zIndex: 2,
                    background: 'var(--ink)', padding: '4px 10px',
                    fontFamily: MONO, fontSize: 12, fontWeight: 700,
                    letterSpacing: '.06em', color: '#fff',
                  }}><E id="microsoft_plans.recommended" editMode={editMode}>RECOMMENDED</E></div>
                )}
                <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                  <Image src={`${CRAWL}${pl.img}`} alt={pl.name} className="ms-plan-img" fill style={{
                    objectFit: 'cover',
                    transition: 'transform .5s',
                  }} />
                </div>
                <div style={{ padding: '28px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Plan number */}
                  <div aria-hidden="true" style={{
                    fontFamily: SERIF, fontStyle: 'italic',
                    fontSize: 44, fontWeight: 300, lineHeight: 1,
                    color: 'var(--line)', opacity: .4, marginBottom: 12,
                  }}>{String(i + 1).padStart(2, '0')}</div>

                  <h3 style={{ fontWeight: 900, fontSize: 22, margin: '0 0 8px', letterSpacing: '-.02em' }}><E id={`microsoft_plans.${i}.name`} editMode={editMode}>{content.microsoft_plans[i]?.name ?? pl.name}</E></h3>
                  <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink2)', margin: '0 0 14px' }}><E id={`microsoft_plans.${i}.desc`} editMode={editMode}>{content.microsoft_plans[i]?.desc ?? pl.desc}</E></div>

                  {/* Apps */}
                  <p style={{
                    fontFamily: MONO, fontSize: 12, fontWeight: 500,
                    letterSpacing: '.03em', color: 'var(--ink2)', opacity: .7,
                    margin: '0 0 8px', lineHeight: 1.5,
                  }}><E id={`microsoft_plans.${i}.apps`} editMode={editMode}>{content.microsoft_plans[i]?.apps ?? pl.apps}</E></p>

                  {/* Price type */}
                  <p style={{
                    fontSize: 13, fontWeight: 600, color: 'var(--ink)',
                    margin: '0 0 20px',
                  }}><E id={`microsoft_plans.${i}.price`} editMode={editMode}>{content.microsoft_plans[i]?.price ?? pl.price}</E></p>

                  {/* CTA */}
                  <Link href="/contact?product=Microsoft%20365" style={{
                    marginTop: 'auto',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '14px 24px',
                    background: pl.highlight ? 'var(--accent)' : 'transparent',
                    border: pl.highlight ? 'none' : '1px solid var(--line)',
                    color: pl.highlight ? '#fff' : 'var(--ink)',
                    fontWeight: 700, fontSize: 14,
                    textDecoration: 'none', transition: 'all .2s',
                  }}>
                    <E id="microsoft_buttons.plan_quote" editMode={editMode}>{content.microsoft_buttons.plan_quote}</E> <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Trust strip */}
          <div style={{
            marginTop: 36, display: 'flex', alignItems: 'center', gap: 24,
            padding: '18px 28px', border: '1px solid var(--line)', background: 'var(--surface)',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {content.microsoft_trust.map((t: string, i: number) => (
                <span key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 14, fontWeight: 500, color: 'var(--ink2)',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <E id={`microsoft_trust.${i}`} editMode={editMode}>{t}</E>
                </span>
              ))}
            </div>
            <a href="tel:02-706-8999" style={{
              marginLeft: 'auto', fontWeight: 600, fontSize: 14,
              color: 'var(--ink)', textDecoration: 'none',
            }}>02-706-8999</a>
          </div>
        </div>
      </section>

      {/* ═══ 7. CTA — 인용구 스타일 ═══ */}
      <section style={{
        padding: 'clamp(72px, 10vw, 128px) 0',
        background: 'var(--charcoal)', position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 80%, rgba(148,53,67,.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 700 }}>
          {/* Quote mark */}
          <div className="reveal" style={{
            fontFamily: SERIF, fontStyle: 'italic',
            fontSize: 72, fontWeight: 300, color: 'var(--accent)', lineHeight: 1,
            marginBottom: 16, opacity: .5,
          }}>
            &ldquo;
          </div>
          <h2 className="reveal" style={{
            fontFamily: SERIF, fontStyle: 'italic',
            fontWeight: 400, fontSize: 'clamp(26px, 3.5vw, 40px)',
            lineHeight: 1.3, color: '#fff', margin: '0 0 16px', letterSpacing: '-.01em',
          }}>
            <E id="microsoft_cta.title" editMode={editMode}>
              {stripHtml(content.microsoft_cta.title).split('\n').map((line: string, i: number) => (
                <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
              ))}
            </E>
          </h2>
          <p className="reveal" style={{
            fontSize: 16, color: 'rgba(255,255,255,.45)', margin: '0 0 36px', lineHeight: 1.7,
          }}>
            <E id="microsoft_cta.desc" editMode={editMode}>{content.microsoft_cta.desc}</E>
          </p>
          <div className="reveal" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact?product=Microsoft%20365" className="btn" style={{
              padding: '16px 36px', background: 'var(--accent)', color: '#fff',
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
            }}>
              <E id="microsoft_buttons.cta_primary" editMode={editMode}>{content.microsoft_buttons.cta_primary}</E>
            </Link>
            <Link href="/contact?product=Microsoft%20365" style={{
              padding: '16px 36px', border: '1px solid rgba(255,255,255,.45)',
              color: '#fff', fontWeight: 600, fontSize: 15, textDecoration: 'none',
            }}>
              <E id="microsoft_buttons.cta_secondary" editMode={editMode}>{content.microsoft_buttons.cta_secondary}</E>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes msMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ms-marquee:hover { animation-play-state: paused; }
        .ms-prod-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px rgba(0,0,0,.07) !important; }
        .ms-prod-card:hover .ms-prod-img { transform: scale(1.05); }
        .ms-plan-card:hover { transform: scale(1.06) !important; box-shadow: 0 16px 48px rgba(0,0,0,.1) !important; }
        .ms-plan-card:hover .ms-plan-img { transform: scale(1.05); }
        .ms-str-tab:hover { background: rgba(255,255,255,.04) !important; }
        @media (max-width: 920px) {
          .ms-products { grid-template-columns: repeat(2, 1fr) !important; }
          .ms-plans { grid-template-columns: 1fr !important; }
          .ms-plans div { transform: none !important; }
          .ms-stats { grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; }
          .ms-stats div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,.15); padding-bottom: 20px; }
          .ms-str-content { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .ms-products { grid-template-columns: 1fr !important; }
          .ms-str-tab { padding: 14px 16px !important; }
        }
      `}</style>
    </div>
  );
}
