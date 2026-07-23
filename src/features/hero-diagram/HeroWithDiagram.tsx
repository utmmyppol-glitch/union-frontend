'use client';

/**
 * HeroWithDiagram — 풀스크린 확정본과 동일 레이아웃
 *
 * ★ 핵심: maxWidth 중앙 그리드 대신 "풀블리드 flex" 로 변경.
 *   - 좌: 카피 36% 고정폭 (좌측 패딩)
 *   - 우: 다이어그램이 나머지 전체(폭·높이 100vh) 차지 → 크게 확대됨
 *   dc(.hero: flex / .copy: 36% / .eco: flex:1) 구조를 그대로 옮긴 것.
 */

import HeroDiagram from './HeroDiagram';
import { HERO_COPY, ACCENT } from '@/data/solutions';

export default function HeroWithDiagram() {
  return (
    <section
      className="relative"
      style={{
        minHeight: '100vh',
        overflow: 'hidden',
        background:
          'linear-gradient(180deg, #FFFFFF 0%, #FCFBF8 100%)',
      }}
    >
      <div className="hero-flex" style={{ display: 'flex', alignItems: 'center', minHeight: '100vh', width: '100%', paddingTop: 90 }}>
        {/* ── 좌: 카피 (36% 고정) ────────────────── */}
        <div
          className="hero-copy"
          style={{ width: '36%', flexShrink: 0, padding: '0 0 0 clamp(48px, 7vw, 96px)', zIndex: 20 }}
        >
          <p
            style={{
              fontFamily: "'Pretendard Variable','Pretendard', sans-serif", fontSize: 18, fontWeight: 600, letterSpacing: '.06em',
              color: '#9A9A9A', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            <span style={{ width: 26, height: 1, background: '#C6C6C6', display: 'inline-block' }} />
            {HERO_COPY.badge}
          </p>

          <h1
            style={{
              fontFamily: "'Pretendard Variable','Pretendard', sans-serif", fontWeight: 800,
              fontSize: 'clamp(42px, 4.8vw, 66px)', lineHeight: 1.06, letterSpacing: '-0.045em',
              color: '#333333', marginBottom: 26,
            }}
          >
            <span style={{ display: 'block', fontSize: '.6em', fontWeight: 700, color: '#6E6E6E', letterSpacing: '-0.03em', marginBottom: 14 }}>
              {HERO_COPY.headline[0]}
            </span>
            <span className="hero-pulse" style={{ display: 'block', fontSize: '1.12em' }}>{HERO_COPY.headline[1]}</span>
            <span style={{ display: 'block', fontSize: '.85em', marginTop: 12 }}>{HERO_COPY.headline[2]}</span>
          </h1>

          <p
            style={{
              fontFamily: "'Pretendard Variable','Pretendard', sans-serif", fontWeight: 400, fontSize: 18,
              lineHeight: 1.85, color: '#6E6E6E', maxWidth: 520, marginBottom: 34,
              whiteSpace: 'pre-line', wordBreak: 'keep-all',
            }}
          >
            {HERO_COPY.sub}
          </p>

          <div style={{ display: 'flex', gap: 11, flexWrap: 'wrap', marginBottom: 22 }}>
            <a
              href={HERO_COPY.cta.href}
              style={{
                display: 'inline-flex', alignItems: 'center', padding: '15px 26px', borderRadius: 6,
                backgroundColor: ACCENT, color: '#fff',
                fontFamily: "'Pretendard Variable','Pretendard', sans-serif", fontWeight: 700, fontSize: 18,
                textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: `0 8px 20px ${ACCENT}3d`,
                transition: 'transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 26px ${ACCENT}52`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 8px 20px ${ACCENT}3d`; }}
            >
              {HERO_COPY.cta.label}
            </a>
            <a
              href={HERO_COPY.ctaSub.href}
              style={{
                display: 'inline-flex', alignItems: 'center', padding: '15px 26px', borderRadius: 6,
                background: '#fff', border: '1px solid #E2E2E2', color: '#3A3A3A',
                fontFamily: "'Pretendard Variable','Pretendard', sans-serif", fontWeight: 600, fontSize: 18,
                textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(40,40,40,.05)',
                transition: 'transform .22s cubic-bezier(.22,1,.36,1), border-color .22s, box-shadow .22s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#CBCBCB'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(40,40,40,.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = '#E2E2E2'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(40,40,40,.05)'; }}
            >
              {HERO_COPY.ctaSub.label}
            </a>
          </div>

          <div style={{ fontSize: 18.5, color: '#A0A0A0', letterSpacing: '-0.01em', fontWeight: 500 }}>
            {HERO_COPY.partnerLogos.join(' · ')} 공식 파트너
          </div>
        </div>

        {/* ── 우: 다이어그램 (나머지 전체 폭·높이) ── */}
        <div className="hero-diagram-col" style={{ flex: 1, alignSelf: 'stretch', position: 'relative', overflow: 'visible' }}>
          <HeroDiagram />
        </div>
      </div>

      <style>{`
        .hero-pulse {
          display: inline-block;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-pulse { animation: none !important; }
        }
        @media (max-width: 920px) {
          .hero-flex { flex-direction: column; padding-top: 96px; }
          .hero-copy { width: 100% !important; padding: 16px clamp(24px,6vw,40px) 4px !important; }
          .hero-diagram-col { display: none !important; }
        }
      `}</style>
    </section>
  );
}
