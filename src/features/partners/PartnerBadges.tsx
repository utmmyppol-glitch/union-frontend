'use client';

import React from 'react';
import { Container } from '@/components/ui';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const PARTNERS = [
  {
    name: 'Microsoft',
    role: 'CSP 공인 파트너',
    logo: 'https://img.icons8.com/color/96/microsoft.png',
    color: '#111214',
  },
  {
    name: 'Adobe',
    role: '공식 리셀러',
    logo: 'https://img.icons8.com/color/96/adobe.png',
    color: '#FF0000',
  },
  {
    name: 'Autodesk',
    role: '공인 리셀러',
    logo: 'https://img.icons8.com/color/96/autodesk.png',
    color: '#0696D7',
  },
  {
    name: '엔코아',
    role: 'DA# 공인총판',
    logo: null,
    color: '#2B2C30',
    text: 'DA#',
  },
  {
    name: 'AhnLab',
    role: '공식 파트너',
    logo: null,
    color: '#F5333F',
    text: 'V3',
  },
  {
    name: 'ESTsoft',
    role: '알툴즈 파트너',
    logo: null,
    color: '#6B655C',
    text: 'EST',
  },
];

const PartnerBadges: React.FC = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      style={{
        padding: 'clamp(48px, 6vw, 80px) 0',
        background: 'var(--soft)',
      }}
    >
      <Container>
        <div style={{ marginBottom: 40 }}>
          <span
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
              fontWeight: 500,
              fontSize: 18,
              letterSpacing: '.16em',
              color: 'var(--ink2)',
              textTransform: 'uppercase',
            }}
          >
            TRUSTED PARTNERSHIPS
          </span>
          <h2
            style={{
              fontFamily: "'Newsreader', serif",
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 'clamp(30px, 4vw, 48px)',
              lineHeight: 1.15,
              letterSpacing: '-.02em',
              color: 'var(--ink)',
              marginTop: 10,
            }}
          >
            글로벌 기업이 인정한 공식 파트너
          </h2>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
          style={{ gap: 14 }}
        >
          {PARTNERS.map((p, i) => (
            <div
              key={p.name}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 0,
                padding: '28px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                transition: `all .4s ease ${i * 0.06}s`,
                opacity: isIntersecting ? 1 : 0,
                transform: isIntersecting ? 'translateY(0)' : 'translateY(20px)',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = p.color;
                e.currentTarget.style.boxShadow = `0 8px 24px ${p.color}18`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--line)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Logo or text fallback */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {p.logo ? (
                  <img
                    src={p.logo}
                    alt={p.name}
                    style={{ width: 40, height: 40, objectFit: 'contain' }}
                  />
                ) : (
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: `${p.color}14`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Pretendard', sans-serif",
                      fontWeight: 800,
                      fontSize: 18,
                      color: p.color,
                    }}
                  >
                    {p.text}
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'center' }}>
                <p
                  style={{
                    fontFamily: "'Pretendard', sans-serif",
                    fontWeight: 800,
                    fontSize: 18,
                    color: 'var(--ink)',
                    lineHeight: 1.2,
                  }}
                >
                  {p.name}
                </p>
                <p
                  style={{
                    fontFamily: "'Pretendard', sans-serif",
                    fontWeight: 500,
                    fontSize: 18,
                    color: p.color,
                    marginTop: 3,
                  }}
                >
                  {p.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default PartnerBadges;
