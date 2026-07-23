'use client';

import React from 'react';
import { Container } from '@/components/ui';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const teams = [
  { k: '영업/컨설팅팀', d: '고객 상담, 비교견적, IT 환경 진단' },
  { k: '기술지원팀', d: '솔루션 구축, 원격지원, 정기점검' },
  { k: '개발팀', d: '웹/앱 개발, 시스템 구축, 기술 혁신' },
  { k: '솔루션사업팀', d: 'DA#·보안 솔루션 전문 구축/운영' },
] as const;

const WhyUnionSection: React.FC = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.15 });

  return (
    <section ref={ref} style={{ padding: 'clamp(80px, 10vw, 140px) 0', background: 'var(--bg)' }}>
      <Container>
        {/* Webflow-style asymmetric 2-column */}
        <div className="why-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px, 6vw, 80px)', alignItems: 'start' }}>

          {/* Left — editorial heading */}
          <div style={{
            opacity: isIntersecting ? 1 : 0,
            transform: isIntersecting ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity .6s ease, transform .6s ease',
          }}>
            <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontWeight: 500, fontSize: 13, letterSpacing: '.16em', textTransform: 'uppercase' as const, color: 'var(--ink2)', display: 'block', marginBottom: 20 }}>
              TEAM
            </span>
            <h2 style={{
              fontFamily: "'Newsreader', serif",
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 'clamp(32px, 4.5vw, 52px)',
              lineHeight: 1.15,
              letterSpacing: '-.02em',
              color: 'var(--ink)',
              margin: 0,
            }}>
              소수정예 4개 팀,<br />
              하나의 창구.
            </h2>
            <p style={{ fontWeight: 400, fontSize: 16, lineHeight: 1.8, color: 'var(--ink2)', marginTop: 24, maxWidth: 400 }}>
              비교견적부터 구축, 유지보수까지 — 담당자 한 명이 끝까지 책임집니다.
            </p>
            <a href="/contact" style={{
              display: 'inline-block', marginTop: 32,
              padding: '12px 28px', background: 'var(--ink)', color: '#fff',
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
              letterSpacing: '.04em', textTransform: 'uppercase' as const,
            }}>
              LEARN MORE
            </a>
          </div>

          {/* Right — clean list, no cards */}
          <div style={{ borderTop: '1px solid var(--line)' }}>
            {teams.map((t, i) => (
              <div key={t.k} style={{
                padding: '28px 0',
                borderBottom: '1px solid var(--line)',
                opacity: isIntersecting ? 1 : 0,
                transform: isIntersecting ? 'translateX(0)' : 'translateX(12px)',
                transition: `opacity .5s ease ${0.1 + i * 0.08}s, transform .5s ease ${0.1 + i * 0.08}s`,
              }}>
                <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', margin: 0 }}>{t.k}</p>
                <p style={{ fontWeight: 400, fontSize: 16, color: 'var(--ink2)', marginTop: 6, lineHeight: 1.5 }}>{t.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <style>{`
        @media (max-width: 920px) {
          .why-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default WhyUnionSection;
