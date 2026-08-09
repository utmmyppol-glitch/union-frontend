'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

type Logo = { id: number; name: string; image: string };

/* ── 정적 폴백 (API 실패 시) ── */
const FALLBACK_LOGOS: Logo[] = [
  { id: 1, name: '경신', image: '/images/clients/kyungshin.png' },
  { id: 2, name: 'LG CNS', image: '/images/clients/lgcns.png' },
  { id: 3, name: '건국대학교병원', image: '/images/clients/konkuk-hospital.png' },
  { id: 4, name: 'KTA', image: '/images/clients/kta.png' },
  { id: 5, name: 'LG이노텍', image: '/images/clients/lginnotek.png' },
  { id: 6, name: 'SKT', image: '/images/clients/skt.png' },
  { id: 7, name: '영풍문고', image: '/images/clients/ypbooks.png' },
  { id: 8, name: '잡코리아', image: '/images/clients/jobkorea.png' },
  { id: 9, name: '노랑풍선', image: '/images/clients/norangpungseon.png' },
  { id: 10, name: '대웅', image: '/images/clients/daewoong.png' },
  { id: 11, name: '종근당', image: '/images/clients/jongkeundang.png' },
  { id: 12, name: 'KICA', image: '/images/clients/kica.png' },
  { id: 13, name: 'GC녹십자', image: '/images/clients/gc-greencross.png' },
  { id: 14, name: '아워홈', image: '/images/clients/ourhome.png' },
  { id: 15, name: '야놀자', image: '/images/clients/yanolja.png' },
];

export default function ClientMarquee() {
  const [logos, setLogos] = useState<Logo[]>(FALLBACK_LOGOS);

  useEffect(() => {
    let alive = true;
    apiClient.getClientLogos()
      .then(list => {
        if (alive && Array.isArray(list) && list.length > 0) {
          setLogos(list.map(l => ({ id: l.id, name: l.name, image: l.logoUrl || '' })));
        }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  return (
    <section style={{ position: 'relative', backgroundColor: 'var(--bg, #fff)', borderTop: '1px solid var(--line, #E5E5E5)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(80px, 10vw, 120px) clamp(24px, 4vw, 56px)', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p data-anim style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent, #2563EB)', letterSpacing: '0.12em', marginBottom: 16, textTransform: 'uppercase' }}>
            Clients
          </p>
          <h2 data-anim style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: 'var(--ink, #111)', lineHeight: 1.15, marginBottom: 16 }}>
            유니온시스템즈와 함께한 고객사
          </h2>
          <p data-anim style={{ fontSize: 18, color: 'var(--ink2, #6B6B6B)' }}>
            IT 인프라 · 보안 · 자산관리 · 데이터 분석
          </p>
        </div>

        {/* ── Logo Grid (4열, float 애니메이션) ── */}
        <div data-anim style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '44px 24px', alignItems: 'center', justifyItems: 'center', maxWidth: 1200, margin: '0 auto', padding: '20px 0 8px' }}
          className="clients-logo-grid"
        >
          {logos.map((logo, i) => (
            <div
              key={logo.id}
              className="client-logo-float"
              style={{
                height: 92,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: `clientFloat ${3 + (i % 3) * 0.8}s ease-in-out ${(i * 0.3) % 2}s infinite alternate`,
              }}
            >
              <img
                src={logo.image}
                alt={logo.name}
                style={{
                  height: 'clamp(60px, 10vw, 100px)',
                  maxWidth: 220,
                  objectFit: 'contain',
                  opacity: 0.85,
                  transition: 'transform 0.25s, opacity 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = ''; }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
