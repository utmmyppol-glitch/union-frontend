'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CtaSection } from '@/features/cta';
import { E, safeParse, stripHtml, useEditMode, useEditableManifest, EDITABLE_STYLES } from '@/lib/editable';

const DEFAULT_HERO = {
  eyebrow: 'CONTACT US',
  title: '도입문의',
  desc: '귀사의 IT 환경에 최적화된 솔루션을\n전문 컨설턴트가 제안해 드립니다.',
};

const DEFAULT_BENEFITS = [
  { num: '01', title: '빠른 응답', desc: '당일 내 담당자가 연락드립니다.' },
  { num: '02', title: '맞춤 제안서', desc: '귀사 환경에 맞는 맞춤형 솔루션 제안서를 제공합니다.' },
  { num: '03', title: '전문 컨설팅', desc: '20년 경험의 전문 컨설턴트가 최적의 솔루션을 안내합니다.' },
];

export default function ContactPageClient({ ssrContent }: { ssrContent: Record<string, string> }) {
  const editMode = useEditMode();
  useEditableManifest(editMode);

  const [hero, setHero] = useState(() => safeParse(ssrContent.contact_hero, DEFAULT_HERO));
  const [benefits, setBenefits] = useState(() => safeParse(ssrContent.contact_benefits, DEFAULT_BENEFITS));

  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editMode) return;
    const setters: Record<string, (v: unknown) => void> = {
      contact_hero: setHero as (v: unknown) => void,
      contact_benefits: setBenefits as (v: unknown) => void,
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
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={pageRef} style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {editMode && <style>{EDITABLE_STYLES}</style>}

      {/* ═══ Hero ═══ */}
      <section style={{
        position: 'relative', background: 'var(--charcoal)',
        overflow: 'hidden',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 80%, rgba(148,53,67,.08) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {/* Blob decorations */}
        <div className="blob blob-accent" aria-hidden="true" style={{ width: 360, height: 360, right: '4%', top: '8%' }} />
        <div className="blob blob-wine" aria-hidden="true" style={{ width: 270, height: 270, left: '6%', bottom: '5%', animationDelay: '6s' }} />
        <div aria-hidden="true" style={{
          position: 'absolute', width: 16, height: 16, left: '30%', top: '20%',
          border: '1.5px solid rgba(255,255,255,.08)', transform: 'rotate(45deg)',
          animation: 'geoFloat2 15s ease-in-out infinite', pointerEvents: 'none',
        }} />

        <div aria-hidden="true" style={{
          position: 'absolute', right: '-3%', top: '10%',
          fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic',
          fontSize: 'clamp(100px, 18vw, 280px)', fontWeight: 300,
          color: 'rgba(255,255,255,.025)', lineHeight: 1, pointerEvents: 'none',
        }}>
          Contact
        </div>

        <div className="wrap" style={{ position: 'relative', zIndex: 1, padding: '120px clamp(20px,4vw,52px) 72px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'rgba(255,255,255,.4)', margin: '0 0 16px' }}>
            <E id="contact_hero.eyebrow" editMode={editMode}>{hero.eyebrow}</E>
          </p>
          <h1 style={{
            fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
            lineHeight: .92, letterSpacing: '-.045em', color: '#fff', margin: '0 0 20px',
          }}>
            <E id="contact_hero.title" editMode={editMode}>{hero.title}</E>
          </h1>
          <p style={{
            fontWeight: 400, fontSize: 18, lineHeight: 1.7,
            color: 'rgba(255,255,255,.5)', maxWidth: 640, margin: '0 auto',
          }}>
            <E id="contact_hero.desc" editMode={editMode}>
              {stripHtml(hero.desc).split('\n').map((line: string, i: number) => (
                <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
              ))}
            </E>
          </p>
        </div>
      </section>

      {/* ═══ CTA Form Section ═══ */}
      <CtaSection />

      {/* ═══ Benefits — soft bg ═══ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0', background: 'var(--soft)', position: 'relative', overflow: 'hidden' }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="blob blob-graphite" aria-hidden="true" style={{ width: 300, height: 300, right: '5%', bottom: '10%', animationDelay: '4s' }} />
        <div className="wrap">
          <div className="contact-benefits" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
          }}>
            {benefits.map((b: { num: string; title: string; desc: string }, idx: number) => (
              <div
                key={idx}
                className="reveal"
                style={{
                  border: '1px solid var(--line)', background: 'var(--surface)',
                  padding: 32, textAlign: 'center',
                  transition: 'transform .25s, box-shadow .25s',
                  transitionDelay: `${idx * 0.08}s`,
                }}
              >
                <span style={{
                  fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic',
                  fontSize: 32, fontWeight: 300, color: 'var(--line)',
                  display: 'block', marginBottom: 16, lineHeight: 1,
                }}>
                  {b.num}
                </span>
                <h3 style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink)', margin: '0 0 8px' }}>
                  <E id={`contact_benefits[${idx}].title`} editMode={editMode}>{b.title}</E>
                </h3>
                <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--ink2)', margin: 0 }}>
                  <E id={`contact_benefits[${idx}].desc`} editMode={editMode}>{b.desc}</E>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 920px) {
          .contact-benefits { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
