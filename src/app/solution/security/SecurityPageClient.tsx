'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { E, safeParse, useEditMode, useEditableManifest, EDITABLE_STYLES } from '@/lib/editable';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SERIF = "'Newsreader', Georgia, serif";
const IMG = '/images/uploads/2022/06';

const PRODUCTS = [
  { num: '01', name: 'AhnLab', cat: '엔드포인트 통합 보안', desc: 'V3 외에도 MDS, EPP, EDR, 방화벽 등 국내 1위 통합 보안 체계를 구축합니다.', img: `${IMG}/solution_list_ahnLab.jpg`, href: '/solution/security/ahnlab' },
  { num: '02', name: 'ESTsecurity', cat: 'AI 기반 EDR', desc: 'AI가 위협 행위를 실시간으로 탐지하고 자동 대응하는 차세대 엔드포인트 보안입니다.', img: `${IMG}/solution_list_estsecurity.jpg`, href: '/solution/security/estsecurity' },
  { num: '03', name: 'OfficeKeeper', cat: '정보유출 방지 DLP', desc: '매체·네트워크·출력물까지 모든 유출 경로를 차단하는 정보보안 솔루션입니다.', img: `${IMG}/solution_list_officekeeper.jpg`, href: '/solution/security/officekeeper' },
];

const DEFAULT_HERO = {
  title: '보안 솔루션',
  desc: '기업의 엔드포인트부터 네트워크까지,\n안전한 IT 환경을 구축합니다.',
};
const DEFAULT_PRODUCTS_DATA = PRODUCTS.map(p => ({ name: p.name, cat: p.cat, desc: p.desc }));
const DEFAULT_CTA = {
  title: '보안은 선택이 아닌\n필수입니다.',
  desc: '유니온시스템즈가 최적의 보안 솔루션을 제안합니다.',
};

export default function SecurityPageClient({ ssrContent }: { ssrContent: Record<string, string> }) {
  const editMode = useEditMode();
  useEditableManifest(editMode);
  const [hero, setHero] = useState(() => safeParse(ssrContent.security_hero, DEFAULT_HERO));
  const [productsData, setProductsData] = useState(() => safeParse(ssrContent.security_products, DEFAULT_PRODUCTS_DATA));
  const [cta, setCta] = useState(() => safeParse(ssrContent.security_cta, DEFAULT_CTA));
  useEffect(() => {
    if (!editMode) return;
    const setters: Record<string, (v: unknown) => void> = { security_hero: setHero as (v: unknown) => void, security_products: setProductsData as (v: unknown) => void, security_cta: setCta as (v: unknown) => void };
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
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {editMode && <style>{EDITABLE_STYLES}</style>}

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
          background: 'radial-gradient(ellipse at 30% 80%, rgba(148,53,67,.08) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {/* Gradient blur blob */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '8%', top: '25%', width: 350, height: 350,
          background: 'radial-gradient(circle, rgba(245,51,63,.05) 0%, transparent 60%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', right: '-3%', bottom: '-10%',
          fontFamily: SERIF, fontStyle: 'italic',
          fontSize: 'clamp(160px, 25vw, 400px)', fontWeight: 300,
          color: 'rgba(255,255,255,.02)', lineHeight: .8, pointerEvents: 'none',
        }}>
          Sec.
        </div>

        <div className="wrap" style={{ position: 'relative', zIndex: 1, padding: '120px clamp(20px,4vw,52px) 64px' }}>
          <p style={{
            fontFamily: MONO, fontWeight: 500, fontSize: 12, letterSpacing: '.14em',
            textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 16px',
          }}>Security Solutions</p>
          <h1 style={{
            fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
            lineHeight: .88, letterSpacing: '-.05em', color: '#fff', margin: '0 0 20px',
          }}>
            <E id="security_hero.title" editMode={editMode}>{hero.title}</E>
          </h1>
          <p style={{
            fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,.45)',
            maxWidth: 620, margin: '0 0 24px',
          }}>
            <E id="security_hero.desc" editMode={editMode}>
              {hero.desc.split('\n').map((line: string, i: number) => (
                <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
              ))}
            </E>
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['AhnLab', 'ESTsecurity', 'OfficeKeeper'].map((t) => (
              <span key={t} style={{
                fontFamily: MONO, fontSize: 12, fontWeight: 500, letterSpacing: '.06em',
                color: 'rgba(255,255,255,.35)', border: '1px solid rgba(255,255,255,.08)',
                padding: '5px 12px',
              }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3개 보안 솔루션 — 풀폭 카드 leisure row ═══ */}
      <section style={{ padding: 'clamp(100px, 9vw, 112px) 0' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="wrap">
          {PRODUCTS.map((s, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <Link
                key={s.name}
                href={s.href}
                className="reveal sec-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: isEven ? '0.45fr 0.55fr' : '0.55fr 0.45fr',
                  gap: 0,
                  marginBottom: idx < PRODUCTS.length - 1 ? 24 : 0,
                  textDecoration: 'none',
                  overflow: 'hidden',
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  transition: 'transform .3s cubic-bezier(.16,.84,.3,1), box-shadow .3s',
                  transitionDelay: `${idx * 0.08}s`,
                }}
              >
                {/* Image */}
                <div style={{
                  order: isEven ? 1 : 2,
                  overflow: 'hidden', minHeight: 280,
                  position: 'relative',
                }}>
                  <Image src={s.img} alt={s.name} className="sec-row-img" fill style={{
                    objectFit: 'cover',
                    transition: 'transform .5s',
                  }} />
                </div>

                {/* Text */}
                <div style={{
                  order: isEven ? 2 : 1,
                  padding: 'clamp(28px, 4vw, 48px)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  position: 'relative',
                }}>
                  {/* Bg number */}
                  <div aria-hidden="true" style={{
                    position: 'absolute', right: 16, bottom: -8,
                    fontFamily: SERIF, fontStyle: 'italic',
                    fontSize: 100, fontWeight: 300, color: 'rgba(20,18,16,.03)',
                    lineHeight: 1, pointerEvents: 'none',
                  }}>{s.num}</div>

                  <p style={{
                    fontFamily: MONO, fontSize: 12, fontWeight: 600, letterSpacing: '.12em',
                    color: 'var(--accent)', margin: '0 0 10px',
                  }}><E id={`security_products.${idx}.cat`} editMode={editMode}>{(productsData[idx]?.cat ?? s.cat).toUpperCase()}</E></p>

                  <h2 style={{
                    fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
                    letterSpacing: '-.04em', color: 'var(--ink)', margin: '0 0 12px',
                  }}><E id={`security_products.${idx}.name`} editMode={editMode}>{productsData[idx]?.name ?? s.name}</E></h2>

                  <p style={{
                    fontSize: 16, lineHeight: 1.7, color: 'var(--ink2)', margin: '0 0 24px',
                  }}><E id={`security_products.${idx}.desc`} editMode={editMode}>{productsData[idx]?.desc ?? s.desc}</E></p>

                  <span className="sec-row-arrow" style={{
                    fontFamily: MONO, fontSize: 12, fontWeight: 600,
                    letterSpacing: '.04em', color: 'var(--accent)',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                  }}>
                    자세히 보기 <span style={{ fontSize: 16, transition: 'transform .2s' }}>→</span>
                  </span>
                </div>
              </Link>
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
            <E id="security_cta.title" editMode={editMode}>
              {cta.title.split('\n').map((line: string, i: number) => (
                <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
              ))}
            </E>
          </h2>
          <p className="reveal" style={{
            fontSize: 16, color: 'rgba(255,255,255,.45)', margin: '0 0 32px', lineHeight: 1.7,
          }}>
            유니온시스템즈가 기업 환경에 맞는 보안 체계를 설계합니다.
          </p>
          <div className="reveal" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn" style={{
              padding: '16px 36px', background: 'var(--accent)', color: '#fff',
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
            }}>도입 문의하기</Link>
            <Link href="/contact" style={{
              padding: '16px 36px', border: '1px solid rgba(255,255,255,.45)',
              color: '#fff', fontWeight: 600, fontSize: 15, textDecoration: 'none',
            }}>견적 요청하기</Link>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .sec-row:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,.08); }
        .sec-row:hover .sec-row-img { transform: scale(1.05); }
        .sec-row:hover .sec-row-arrow span { transform: translateX(4px); }
        @media (max-width: 920px) {
          .sec-row { grid-template-columns: 1fr !important; }
          .sec-row > div { order: unset !important; }
          .sec-row > div:first-child { min-height: 200px !important; }
        }
      ` }} />
    </div>
  );
}
