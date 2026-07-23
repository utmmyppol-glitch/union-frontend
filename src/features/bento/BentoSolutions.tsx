'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const ITEMS = [
  { code: 'DA#', name: '데이터 모델링', desc: '전사 데이터 표준화 · 엔코아 공인총판', color: '#6B6B70', size: 'lg', href: 'https://uniondata.co.kr', external: true },
  { code: 'NetClient', name: '통합 PC 관리', desc: 'DMS·PMS·PC-OFF·HSM 4모듈', color: '#2B2C30', size: 'lg', href: '/solutions?tab=netclient', external: false },
  { code: 'AhnLab', name: '엔드포인트 보안', desc: 'V3·EPP·EDR 국내 1위', color: '#111214', size: 'md', href: '/solutions?tab=security', external: false },
  { code: 'ESTsecurity', name: 'AI 기반 EDR', desc: '실시간 위협 탐지·자동 대응', color: '#111214', size: 'md', href: '/solutions?tab=security', external: false },
  { code: 'OfficeKeeper', name: '정보유출 방지', desc: 'DLP — 매체·출력·네트워크 차단', color: '#6B6B70', size: 'md', href: '/solutions?tab=security', external: false },
  { code: 'M365', name: 'Microsoft 365', desc: '클라우드 오피스 · CSP 파트너', color: '#111214', size: 'sm', href: '/software?tab=microsoft365', external: false },
  { code: 'Adobe', name: 'Adobe CC', desc: '크리에이티브 클라우드 · 리셀러', color: '#FF0000', size: 'sm', href: '/software?tab=adobe', external: false },
  { code: 'CAD', name: 'Autodesk', desc: 'AutoCAD·Revit · 공인 리셀러', color: '#0696D7', size: 'sm', href: '/software?tab=autodesk', external: false },
  { code: 'EST', name: 'ESTsoft 알툴즈', desc: '알집·알약·알PDF 기업용', color: '#4CAF50', size: 'sm', href: '/software?tab=estsoft', external: false },
] as const;

const BentoSolutions: React.FC = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.08 });

  return (
    <section ref={ref} style={{ padding: 'clamp(56px, 7vw, 96px) 0' }}>
      <Container>
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontWeight: 500, fontSize: 18, letterSpacing: '.16em', color: 'var(--ink2)', textTransform: 'uppercase' as const }}>
            SOFTWARE · SOLUTIONS
          </span>
          <h2 style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(30px, 4vw, 48px)', lineHeight: 1.15, letterSpacing: '-.02em', color: 'var(--ink)', marginTop: 14 }}>
            9개 제품, 한눈에.
          </h2>
        </div>

        <div className="bento-grid">
          {ITEMS.map((item, i) => {
            const Comp = item.external ? 'a' : Link;
            const extraProps = item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

            return (
              <Comp
                key={item.code}
                href={item.href}
                {...extraProps}
                className={`bento-card bento-${item.size}`}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: 0,
                  padding: item.size === 'lg' ? '32px 28px' : item.size === 'md' ? '24px 22px' : '20px 18px',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 14,
                  transition: `all .4s ease ${i * 0.04}s`,
                  opacity: isIntersecting ? 1 : 0,
                  transform: isIntersecting ? 'translateY(0)' : 'translateY(16px)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = item.color;
                  e.currentTarget.style.boxShadow = `0 8px 28px ${item.color}16`;
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--line)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Code badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: item.size === 'sm' ? 36 : 44,
                    height: item.size === 'sm' ? 36 : 44,
                    borderRadius: 0,
                    background: `${item.color}12`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Pretendard', sans-serif",
                    fontWeight: 800,
                    fontSize: item.size === 'sm' ? 11 : 13,
                    color: item.color,
                    flexShrink: 0,
                  }}>
                    {item.code}
                  </div>
                  {item.external && (
                    <span style={{ fontSize: 18, color: 'var(--ink2)', opacity: .5 }}>외부</span>
                  )}
                </div>

                <div>
                  <p style={{
                    fontFamily: "'Pretendard', sans-serif",
                    fontWeight: 800,
                    fontSize: item.size === 'lg' ? 20 : item.size === 'md' ? 16 : 14,
                    color: 'var(--ink)',
                    marginBottom: 4,
                  }}>
                    {item.name}
                  </p>
                  <p style={{
                    fontFamily: "'Pretendard', sans-serif",
                    fontWeight: 400,
                    fontSize: item.size === 'sm' ? 11 : 13,
                    color: 'var(--ink2)',
                    lineHeight: 1.5,
                  }}>
                    {item.desc}
                  </p>
                </div>
              </Comp>
            );
          })}
        </div>
      </Container>

      <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .bento-lg { grid-column: span 2; }
        .bento-md { grid-column: span 1; }
        .bento-sm { grid-column: span 1; }
        @media (max-width: 920px) {
          .bento-grid { grid-template-columns: repeat(2, 1fr); }
          .bento-lg { grid-column: span 2; }
        }
        @media (max-width: 480px) {
          .bento-grid { grid-template-columns: 1fr; }
          .bento-lg { grid-column: span 1; }
        }
      `}</style>
    </section>
  );
};

export default BentoSolutions;
