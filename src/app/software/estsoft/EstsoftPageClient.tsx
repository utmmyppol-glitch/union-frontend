'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { E, safeParse, useEditMode, useEditableManifest, EDITABLE_STYLES } from '@/lib/editable';

const CRAWL = '/images/crawl/unionsystems/';
const PRODUCTS = [
  { name: '알집', img: 'software_estsoft_alzip_102.jpg', desc: '파일 압축 및 해제' },
  { name: '알씨', img: 'software_estsoft_alsee_103.jpg', desc: '이미지 뷰어 및 편집' },
  { name: '알PDF', img: 'software_estsoft_alpdf_104.jpg', desc: 'PDF 생성, 편집, 변환' },
  { name: '알캡처', img: 'software_estsoft_alcapture_105.jpg', desc: '화면 캡처 도구' },
];
const DEFAULT_HERO = {
  subtitle: '삶을 더 편리하게',
  title: 'PC 사용을 편리하게\n이스트소프트',
};

const DEFAULT_STRENGTHS = [
  { num: '01', img: 'software_estsoft_point_mobile_108.jpg', title: '모바일 호환', desc: '스마트폰과 PC 어디서나 동일한 환경에서 문서를 확인하고 편집할 수 있습니다.' },
  { num: '02', img: 'software_estsoft_point_mobile_108.jpg', title: '20년 이상의 노하우', desc: '1999년 출시 이후 20년 이상 국내 사용자에게 사랑받아 온 검증된 유틸리티입니다.' },
  { num: '03', img: 'software_estsoft_point_mobile_108.jpg', title: '3,000만 사용자', desc: '국내 3,000만 이상의 사용자가 선택한 대한민국 대표 유틸리티 소프트웨어입니다.' },
];

const DEFAULT_CTA = {
  title: '이스트소프트 기업용 라이선스가\n필요하신가요?',
  desc: '유니온시스템즈가 볼륨 라이선스와\n중앙 관리 환경을 안내해 드립니다.',
};
const ICONS = [
  { name: '알집', img: 'software_estsoft_icon_alzip_109.jpg' }, { name: '알씨', img: 'software_estsoft_icon_alsee_110.jpg' },
  { name: '알PDF', img: 'software_estsoft_icon_alpdf_111.jpg' }, { name: '알캡처', img: 'software_estsoft_icon_alcapture_112.jpg' },
  { name: '알드라이브', img: 'software_estsoft_icon_aldrive_115.jpg' }, { name: '알키퍼', img: 'software_estsoft_icon_alkeeper_116.jpg' },
  { name: '알마인드', img: 'software_estsoft_icon_almind_117.jpg' }, { name: '알송', img: 'software_estsoft_icon_alsong_114.jpg' },
  { name: '알툴바', img: 'software_estsoft_icon_altoolbar_113.jpg' }, { name: 'PaintShop', img: 'software_estsoft_icon_paintshop_118.jpg' },
];
const PLANS = [
  { name: '알툴즈', img: 'software_estsoft_package_altools_121.jpg', desc: '개인·소규모 사업자를 위한 핵심 유틸리티 패키지', badge: null, apps: '알집 · 알PDF · 알캡처 · 알씨 · 알드라이브' },
  { name: '알스위트', img: 'software_estsoft_package_alsuite_122.jpg', desc: '기업 전체를 위한 올인원 패키지 — 중앙 관리 콘솔 + 전 제품 포함', badge: 'RECOMMENDED', apps: '전 제품 + 중앙관리 콘솔 + 라이선스 모니터링' },
  { name: '교육기관', img: 'software_estsoft_package_altools_121.jpg', desc: '학교·교육기관 전용 볼륨 라이선스 — 학생·교직원 대상 특별가', badge: null, apps: '알집 · 알PDF · 알캡처 · 알씨 · 기관 인증 필요' },
];

const STATS = [
  { num: '3,000만+', label: '사용자' },
  { num: '20+', label: '년' },
  { num: '10+', label: '제품' },
];

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SERIF = "'Newsreader', Georgia, serif";

export default function EstsoftPageClient({ ssrContent }: { ssrContent: Record<string, string> }) {
  const editMode = useEditMode();
  useEditableManifest(editMode);

  const [hero, setHero] = useState(() => safeParse(ssrContent.estsoft_hero, DEFAULT_HERO));
  const [strengths, setStrengths] = useState(() => safeParse(ssrContent.estsoft_strengths, DEFAULT_STRENGTHS));
  const [cta, setCta] = useState(() => safeParse(ssrContent.estsoft_cta, DEFAULT_CTA));

  useEffect(() => {
    if (!editMode) return;
    const setters: Record<string, (v: unknown) => void> = {
      estsoft_hero: setHero as (v: unknown) => void,
      estsoft_strengths: setStrengths as (v: unknown) => void,
      estsoft_cta: setCta as (v: unknown) => void,
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
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      {editMode && <style>{EDITABLE_STYLES}</style>}

      {/* ═══ 1. Hero — charcoal + wine ambient + watermark ═══ */}
      <section
        className="es-hero"
        style={{
          position: 'relative',
          background: 'var(--charcoal)',
          minHeight: 540,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Wine ambient blob */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 70% 80%, rgba(148,53,67,.07) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {/* Secondary ambient blob */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 10% 20%, rgba(43,44,48,.4) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {/* Serif watermark */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '-3%', bottom: '-8%',
          fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
          fontSize: 'clamp(140px, 18vw, 280px)', color: 'rgba(255,255,255,.03)',
          lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
        }}>
          ESTsoft
        </div>

        <Container>
          <div style={{ position: 'relative', zIndex: 1, color: '#fff', maxWidth: 660, padding: '140px 0 80px' }}>
            <p className="eyebrow" style={{
              fontFamily: MONO,
              fontWeight: 500, fontSize: 12, letterSpacing: '.14em',
              textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 18px',
            }}>
              ESTsoft
            </p>
            <p style={{
              fontWeight: 400, fontSize: 16, lineHeight: 1.75,
              color: 'rgba(255,255,255,.5)', margin: '0 0 8px',
            }}>
              <E id="estsoft_hero.subtitle" editMode={editMode}>{hero.subtitle}</E>
            </p>
            <h1 style={{
              fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
              lineHeight: 0.92, letterSpacing: '-.045em', margin: '0 0 22px',
            }}>
              <E id="estsoft_hero.title" editMode={editMode}>
                {hero.title.split('\n').map((line: string, i: number) => (
                  <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
                ))}
              </E>
            </h1>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
              {['랜섬웨어차단', '압축해제', '스마트폰호환'].map((t) => (
                <span key={t} style={{
                  fontFamily: MONO,
                  fontSize: 12, fontWeight: 500, letterSpacing: '.06em',
                  color: 'rgba(255,255,255,.35)', border: '1px solid rgba(255,255,255,.08)',
                  padding: '5px 12px', textTransform: 'uppercase',
                }}>
                  {t}
                </span>
              ))}
            </div>
            {/* Since badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              marginBottom: 28, padding: '8px 16px',
              border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.03)',
            }}>
              <span style={{
                fontFamily: SERIF, fontStyle: 'italic',
                fontSize: 22, fontWeight: 400, color: 'var(--accent)', lineHeight: 1,
              }}>1999</span>
              <span style={{
                fontFamily: MONO, fontSize: 12, fontWeight: 500, letterSpacing: '.06em',
                color: 'rgba(255,255,255,.35)',
              }}>SINCE</span>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/contact" className="btn" style={{
                padding: '16px 34px', background: 'var(--accent)', color: '#fff',
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
                transition: 'transform .2s, box-shadow .2s',
              }}>
                도입 문의하기
              </Link>
              <Link href="/contact" className="btn" style={{
                padding: '16px 34px', border: '1px solid rgba(255,255,255,.45)',
                color: '#fff', fontWeight: 600, fontSize: 15, textDecoration: 'none',
                transition: 'transform .2s',
              }}>
                견적 요청
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══ 2. Stats strip — ivory, big Newsreader numbers ═══ */}
      <section style={{ padding: 'clamp(48px, 6vw, 72px) 0', background: 'var(--bg)', borderBottom: '1px solid var(--line)' }}>
        <Container>
          <div className="es-stats reveal" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
          }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                textAlign: 'center', padding: '20px 16px',
                borderRight: i < STATS.length - 1 ? '1px solid var(--line)' : 'none',
              }}>
                <span style={{
                  fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
                  fontSize: 'clamp(36px, 5.5vw, 64px)', color: 'var(--ink)',
                  letterSpacing: '-.03em', display: 'block', lineHeight: 1.1,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {s.num}
                </span>
                <span style={{
                  fontWeight: 700, fontSize: 16, color: 'var(--ink2)',
                  display: 'block', margin: '8px 0 0',
                }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══ 3. Products — 4-col image cards with hover ═══ */}
      <section style={{ padding: 'clamp(64px, 8vw, 108px) 0', background: 'var(--bg)' }}>
        <Container>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 52 }}>
            <p className="eyebrow" style={{
              fontFamily: MONO,
              fontWeight: 500, fontSize: 12, letterSpacing: '.14em',
              textTransform: 'uppercase', color: 'var(--ink2)', margin: '0 0 12px',
            }}>Products</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              letterSpacing: '-.04em', margin: 0,
            }}>
              주요 제품
            </h2>
          </div>
          <div className="es-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
            {PRODUCTS.map((p, i) => (
              <div
                key={p.name}
                className="reveal"
                style={{
                  border: '1px solid var(--line)', overflow: 'hidden',
                  background: 'var(--surface)',
                  transition: 'transform .25s ease, border-color .25s ease, box-shadow .25s ease',
                  cursor: 'default',
                  transitionDelay: `${i * 0.07}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--line)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ overflow: 'hidden' }}>
                  <img
                    src={`${CRAWL}${p.img}`} alt={p.name}
                    style={{
                      width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block',
                      transition: 'transform .4s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />
                </div>
                <div style={{ padding: '20px 22px' }}>
                  <h3 style={{ fontWeight: 800, fontSize: 18, margin: '0 0 4px', letterSpacing: '-.02em' }}>{p.name}</h3>
                  <p style={{ fontSize: 16, color: 'var(--ink2)', margin: 0, lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══ 4. Strengths — alternating asymmetric 2-col, huge bg numbers ═══ */}
      <section style={{
        padding: 'clamp(72px, 9vw, 120px) 0',
        background: 'var(--soft)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Gradient blob top-right */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: '50%', height: '50%',
          background: 'radial-gradient(ellipse, rgba(148,53,67,.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* Gradient blob bottom-left */}
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: '-10%', left: '-5%',
          width: '40%', height: '40%',
          background: 'radial-gradient(ellipse, rgba(43,44,48,.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <Container>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <p className="eyebrow" style={{
              fontFamily: MONO,
              fontWeight: 500, fontSize: 12, letterSpacing: '.14em',
              textTransform: 'uppercase', color: 'var(--ink2)', margin: '0 0 12px',
            }}>Why ESTsoft</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              letterSpacing: '-.04em', margin: 0,
            }}>
              이스트소프트의 강점
            </h2>
          </div>
          {strengths.map((s: { num: string; img: string; title: string; desc: string }, i: number) => {
            const imgFirst = i % 2 === 0;
            return (
              <div
                key={s.num}
                className="es-strength reveal"
                style={{
                  display: 'grid',
                  gridTemplateColumns: imgFirst ? '1.15fr 0.85fr' : '0.85fr 1.15fr',
                  gap: 'clamp(36px, 5vw, 72px)',
                  alignItems: 'center',
                  marginBottom: i < strengths.length - 1 ? 80 : 0,
                  position: 'relative',
                }}
              >
                {/* Huge watermark number */}
                <div aria-hidden="true" style={{
                  position: 'absolute',
                  top: '-20px',
                  ...(imgFirst ? { right: '0' } : { left: '0' }),
                  fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
                  fontSize: 'clamp(80px, 12vw, 120px)',
                  color: 'var(--ink)',
                  opacity: 0.04,
                  lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
                  zIndex: 0,
                }}>
                  {s.num}
                </div>

                {/* Image */}
                <div style={{
                  order: imgFirst ? 1 : 2,
                  position: 'relative', zIndex: 1,
                }}>
                  <div style={{
                    border: '1px solid var(--line)', overflow: 'hidden',
                    position: 'relative',
                  }}>
                    <img
                      src={`${CRAWL}${s.img}`} alt={s.title}
                      style={{ width: '100%', display: 'block', transition: 'transform .5s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    />
                  </div>
                </div>

                {/* Text */}
                <div style={{
                  order: imgFirst ? 2 : 1,
                  position: 'relative', zIndex: 1,
                }}>
                  <span style={{
                    fontFamily: SERIF, fontStyle: 'italic',
                    fontSize: 44, fontWeight: 400, color: 'var(--accent)',
                    fontVariantNumeric: 'tabular-nums', display: 'block',
                    lineHeight: 1,
                  }}>
                    {s.num}
                  </span>
                  <h3 style={{
                    fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
                    letterSpacing: '-.03em', margin: '12px 0 16px',
                  }}>
                    <E id={`estsoft_strengths[${i}].title`} editMode={editMode}>{s.title}</E>
                  </h3>
                  <p style={{
                    fontSize: 16, lineHeight: 1.8, color: 'var(--ink2)', margin: '0 0 24px',
                    maxWidth: 420,
                  }}>
                    <E id={`estsoft_strengths[${i}].desc`} editMode={editMode}>{s.desc}</E>
                  </p>
                  <Link href="/contact" style={{
                    fontFamily: MONO, fontSize: 13, fontWeight: 600,
                    letterSpacing: '.08em', textTransform: 'uppercase',
                    color: 'var(--ink)', textDecoration: 'none',
                    borderBottom: '1px solid var(--line)',
                    paddingBottom: 4,
                    transition: 'border-color .2s',
                  }}>
                    자세히 보기
                  </Link>
                </div>
              </div>
            );
          })}
        </Container>
      </section>

      {/* ═══ 5. Lineup — 5-col icon grid centered ═══ */}
      <section style={{
        padding: 'clamp(64px, 8vw, 108px) 0',
        background: 'var(--bg)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* subtle gradient blob */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '20%', left: '-8%',
          width: '40%', height: '60%',
          background: 'radial-gradient(ellipse, rgba(245,51,63,.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <Container>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 52 }}>
            <p className="eyebrow" style={{
              fontFamily: MONO,
              fontWeight: 500, fontSize: 12, letterSpacing: '.14em',
              textTransform: 'uppercase', color: 'var(--ink2)', margin: '0 0 12px',
            }}>Lineup</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              letterSpacing: '-.04em', margin: 0,
            }}>
              전체 제품 라인업
            </h2>
          </div>
          <div className="es-grid-icon" style={{
            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 18, maxWidth: 720, margin: '0 auto',
          }}>
            {ICONS.map((ic, i) => (
              <div
                key={ic.name}
                className="reveal"
                style={{
                  textAlign: 'center', padding: '24px 16px',
                  border: i < 4 ? '1px solid rgba(245,51,63,.12)' : '1px solid var(--line)',
                  background: i < 4 ? 'rgba(245,51,63,.02)' : 'var(--surface)',
                  transition: 'transform .25s ease, border-color .25s ease, box-shadow .25s ease',
                  cursor: 'default',
                  transitionDelay: `${i * 0.04}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--line)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <img
                  src={`${CRAWL}${ic.img}`} alt={ic.name}
                  style={{
                    width: 56, height: 56, objectFit: 'contain',
                    margin: '0 auto 12px', display: 'block',
                  }}
                />
                <span style={{
                  fontFamily: MONO,
                  fontSize: 12, fontWeight: 600,
                  letterSpacing: '.06em',
                  color: 'var(--ink2)',
                  textTransform: 'uppercase',
                }}>
                  {ic.name}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══ 6. Plans — Viewport-first 풀 화면 ═══ */}
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

        <Container style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{
              fontFamily: MONO, fontWeight: 500, fontSize: 12, letterSpacing: '.14em',
              textTransform: 'uppercase', color: 'var(--ink2)', margin: '0 0 14px',
            }}>PLANS</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: 1.05, letterSpacing: '-.04em', margin: '0 0 14px',
            }}>환경에 맞는 패키지를 선택하세요</h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink2)', margin: 0, maxWidth: 640 }}>
              개인부터 기업·교육기관까지. 유니온시스템즈가 최적 볼륨 라이선스를 안내합니다.
            </p>
          </div>

          <div className="es-plans-layout" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
          }}>
            {PLANS.map((pl, i) => (
              <div key={pl.name} className="reveal es-plan-row" style={{
                position: 'relative', overflow: 'hidden',
                border: pl.badge ? '2px solid var(--ink)' : '1px solid var(--line)',
                background: 'var(--surface)',
                transition: 'transform .3s cubic-bezier(.16,.84,.3,1), box-shadow .3s',
                transitionDelay: `${i * 0.08}s`,
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
                  <img src={`${CRAWL}${pl.img}`} alt={pl.name} className="es-plan-img" style={{
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
                    textAlign: 'center', justifyContent: 'center',
                  }}>견적 요청 <span>&rarr;</span></Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 40, display: 'flex', alignItems: 'center', gap: 24,
            padding: '20px 28px', border: '1px solid var(--line)', background: 'var(--surface)',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {['ESTsoft 공인 리셀러', '즉시 발급', '세금계산서 발행', '볼륨 라이선스 전문'].map((t) => (
                <span key={t} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 14, fontWeight: 500, color: 'var(--ink2)',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {t}
                </span>
              ))}
            </div>
            <a href="tel:02-706-8999" style={{ marginLeft: 'auto', fontWeight: 600, fontSize: 14, color: 'var(--ink)', textDecoration: 'none' }}>
              전화 상담 02-706-8999
            </a>
          </div>
        </Container>
      </section>

      {/* ═══ 7. CTA — charcoal + wine ambient ═══ */}
      <section style={{
        padding: 'clamp(72px, 9vw, 120px) 0',
        background: 'var(--charcoal)', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Wine ambient */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 100%, rgba(148,53,67,.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {/* Secondary ambient */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 20% 0%, rgba(43,44,48,.3) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        <Container>
          <div className="reveal" style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <p className="eyebrow" style={{
              fontFamily: MONO,
              fontWeight: 500, fontSize: 12, letterSpacing: '.14em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', margin: '0 0 18px',
            }}>Get Started</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              letterSpacing: '-.04em', color: '#fff', margin: '0 0 16px',
              lineHeight: 1.2,
            }}>
              <E id="estsoft_cta.title" editMode={editMode}>
                {cta.title.split('\n').map((line: string, i: number) => (
                  <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
                ))}
              </E>
            </h2>
            <p style={{
              fontSize: 16, color: 'rgba(255,255,255,.45)', marginBottom: 32,
              lineHeight: 1.7, maxWidth: 620, marginLeft: 'auto', marginRight: 'auto',
            }}>
              <E id="estsoft_cta.desc" editMode={editMode}>
                {cta.desc.split('\n').map((line: string, i: number) => (
                  <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
                ))}
              </E>
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn" style={{
                padding: '17px 38px', background: 'var(--accent)', color: '#fff',
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
                transition: 'transform .2s, box-shadow .2s',
              }}>
                도입 문의하기
              </Link>
              <Link href="/contact" className="btn" style={{
                padding: '17px 38px', border: '1px solid rgba(255,255,255,.45)',
                color: '#fff', fontWeight: 600, fontSize: 15, textDecoration: 'none',
                transition: 'transform .2s',
              }}>
                견적 요청하기
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <style>{`
        /* ── Reveal animation ── */
        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity .7s ease, transform .7s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Responsive ── */
        @media (max-width: 920px) {
          .es-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .es-grid-2 { grid-template-columns: 1fr !important; }
          .es-grid-icon { grid-template-columns: repeat(3, 1fr) !important; }
          .es-strength { grid-template-columns: 1fr !important; }
          .es-strength > div { order: unset !important; }
          .es-hero { min-height: 420px !important; }
          .es-stats { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .es-grid-4 { grid-template-columns: 1fr !important; }
          .es-grid-icon { grid-template-columns: repeat(2, 1fr) !important; }
          .es-stats { grid-template-columns: 1fr !important; }
          .es-stats > div { border-right: none !important; border-bottom: 1px solid var(--line); }
          .es-stats > div:last-child { border-bottom: none !important; }
        }
      `}</style>
    </div>
  );
}
