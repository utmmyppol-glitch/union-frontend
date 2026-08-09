'use client';

import React, { useState, useEffect } from 'react';
import { SITE } from '@/lib/constants';
import { InquiryForm } from '@/features/cta';
import { E, safeParse, useEditMode, useEditableManifest, EDITABLE_STYLES } from '@/lib/editable';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SERIF = "'Newsreader', Georgia, serif";

const DEFAULT_HERO = {
  eyebrow: '1:1 INQUIRY',
  title: '어떤 것이 궁금하세요?',
  desc: '담당자 확인 후 빠르게 회신 드릴게요.',
  hours: '평일 10–18시',
};

const DEFAULT_CONTACT = {
  title: '다른 방법으로 문의하기',
  desc: '편하신 방법으로 연락해주세요.',
  btn: '전화 상담하기',
  privacy: '수집항목: 이름, 회사명, 연락처, 이메일 · 수집목적: 상담 및 이벤트 안내 · 보유기간: 상담 완료 후 1년',
};

export default function InquiryPageClient({ ssrContent }: { ssrContent: Record<string, string> }) {
  const editMode = useEditMode();
  useEditableManifest(editMode);

  const [hero, setHero] = useState(() => safeParse(ssrContent.inquiry_hero, DEFAULT_HERO));
  const [contact, setContact] = useState(() => safeParse(ssrContent.inquiry_contact, DEFAULT_CONTACT));

  useEffect(() => {
    if (!editMode) return;
    const setters: Record<string, (v: unknown) => void> = {
      inquiry_hero: setHero as (v: unknown) => void,
      inquiry_contact: setContact as (v: unknown) => void,
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
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {editMode && <style>{EDITABLE_STYLES}</style>}

      {/* ═══ Hero — ivory 배경 (다크 탈피) ═══ */}
      <section style={{
        position: 'relative', background: 'var(--soft)', overflow: 'hidden',
        borderBottom: '1px solid var(--line)',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="blob blob-accent" aria-hidden="true" style={{ width: 350, height: 350, right: '5%', top: '5%' }} />
        <div className="blob blob-graphite" aria-hidden="true" style={{ width: 250, height: 250, left: '8%', bottom: '5%', animationDelay: '8s' }} />
        <div aria-hidden="true" style={{
          position: 'absolute', right: '-3%', bottom: '-10%',
          fontFamily: SERIF, fontStyle: 'italic',
          fontSize: 'clamp(140px, 22vw, 320px)', fontWeight: 300,
          color: 'rgba(20,18,16,.02)', lineHeight: .8, pointerEvents: 'none',
        }}>Q&A</div>

        <div className="wrap" style={{
          position: 'relative', zIndex: 1,
          padding: '120px clamp(20px,4vw,52px) 64px',
        }}>
          <p style={{
            fontFamily: MONO, fontWeight: 500, fontSize: 18, letterSpacing: '.14em',
            textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 12px',
          }}>
            <E id="inquiry_hero.eyebrow" editMode={editMode}>{hero.eyebrow}</E>
          </p>
          <h1 style={{
            fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
            lineHeight: 1.05, letterSpacing: '-.04em', color: 'var(--ink)', margin: '0 0 10px',
          }}>
            <E id="inquiry_hero.title" editMode={editMode}>{hero.title}</E>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--ink2)', margin: '0 0 24px' }}>
            <E id="inquiry_hero.desc" editMode={editMode}>{hero.desc}</E>
          </p>
          <a href={`tel:${SITE.tel.replace(/-/g, '')}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 14,
            padding: '14px 28px', border: '1px solid var(--line)', background: 'var(--surface)',
            textDecoration: 'none',
          }}>
            <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 24, color: 'var(--ink)' }}>{SITE.tel}</span>
            <span style={{ fontSize: 18, color: 'var(--ink2)' }}>
              <E id="inquiry_hero.hours" editMode={editMode}>{hero.hours}</E>
            </span>
          </a>
        </div>
      </section>

      {/* ═══ Form — 풀폭 ═══ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0', position: 'relative' , overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        {/* Side blobs */}
        <div className="blob blob-accent" aria-hidden="true" style={{ width: 250, height: 250, left: '-3%', top: '10%', animationDelay: '2s' }} />
        <div className="blob blob-graphite" aria-hidden="true" style={{ width: 200, height: 200, right: '-2%', bottom: '20%', animationDelay: '10s' }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{
            border: '1px solid var(--line)', background: 'var(--surface)',
            padding: 'clamp(36px, 5.5vw, 64px)',
          }}>
            <InquiryForm />
          </div>
        </div>
      </section>

      {/* ═══ 하단 정보 — 기존 사이트처럼 가로 풀폭 ═══ */}
      <section style={{
        padding: 'clamp(56px, 8vw, 96px) 0',
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
        <div className="blob blob-accent" aria-hidden="true" style={{ width: 300, height: 300, right: '10%', top: '10%', animationDelay: '4s' }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              letterSpacing: '-.03em', color: '#fff', margin: '0 0 8px',
            }}>
              <E id="inquiry_contact.title" editMode={editMode}>{contact.title}</E>
            </h2>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,.4)', margin: 0 }}>
              <E id="inquiry_contact.desc" editMode={editMode}>{contact.desc}</E>
            </p>
          </div>

          <div className="inq-contact-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
          }}>
            {[
              { label: 'TEL', value: SITE.tel, big: true },
              { label: 'FAX', value: SITE.fax, big: false },
              { label: 'EMAIL', value: SITE.emailSales, big: false },
              { label: 'HOURS', value: <E id="inquiry_contact.hours_value" editMode={editMode}>평일 10:00 – 18:00</E>, big: false },
            ].map((item) => (
              <div key={item.label} className="reveal" style={{
                padding: '24px 20px', border: '1px solid rgba(255,255,255,.08)',
                background: 'rgba(255,255,255,.03)',
                transition: 'border-color .2s, transform .2s',
              }}>
                <p style={{
                  fontFamily: MONO, fontSize: 18, fontWeight: 600, letterSpacing: '.12em',
                  color: 'rgba(255,255,255,.3)', margin: '0 0 10px',
                }}>{item.label}</p>
                <p style={{
                  fontSize: item.big ? 24 : 16, fontWeight: item.big ? 700 : 500,
                  color: item.big ? '#fff' : 'rgba(255,255,255,.6)', margin: 0,
                  wordBreak: 'break-all',
                  fontFamily: item.big ? SERIF : 'inherit',
                  fontStyle: item.big ? 'italic' : 'normal',
                }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Address + CTA */}
          <div className="reveal" style={{
            marginTop: 16, padding: '20px 24px',
            border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.02)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <p style={{ fontFamily: MONO, fontSize: 18, letterSpacing: '.1em', color: 'rgba(255,255,255,.3)', margin: '0 0 6px' }}>ADDRESS</p>
              <p style={{ fontSize: 18, color: 'rgba(255,255,255,.5)', margin: 0 }}>{SITE.address}</p>
            </div>
            <a href={`tel:${SITE.tel.replace(/-/g, '')}`} className="btn" style={{
              padding: '14px 32px', background: 'var(--accent)', color: '#fff',
              fontWeight: 700, fontSize: 18, textDecoration: 'none', flexShrink: 0,
            }}>
              <E id="inquiry_contact.btn" editMode={editMode}>{contact.btn}</E>
            </a>
          </div>

          {/* Privacy — 작게 */}
          <p style={{
            fontSize: 18, color: 'rgba(255,255,255,.45)',
            margin: '20px 0 0', textAlign: 'center', lineHeight: 1.7,
          }}>
            <E id="inquiry_contact.privacy" editMode={editMode}>{contact.privacy}</E>
          </p>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .inq-contact-grid > div:hover { border-color: rgba(245,51,63,.2) !important; transform: translateY(-2px); }
        @media (max-width: 920px) {
          .inq-contact-grid { grid-template-columns: 1fr 1fr !important; }
          .wrap > div:first-child { grid-template-columns: 1fr !important; }
          .inq-hero-img { display: none !important; }
        }
        @media (max-width: 560px) {
          .inq-contact-grid { grid-template-columns: 1fr !important; }
        }
      ` }} />
    </div>
  );
}
