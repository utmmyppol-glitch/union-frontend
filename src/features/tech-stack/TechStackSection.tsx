'use client';

import React from 'react';
import { Container } from '@/components/ui';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const STACKS = [
  {
    category: 'OS',
    color: '#111214',
    items: ['Windows', 'macOS', 'Linux', 'Windows Server'],
  },
  {
    category: 'Cloud',
    color: '#6B655C',
    items: ['AWS', 'Azure', 'Google Cloud', 'NHN Cloud'],
  },
  {
    category: 'DBMS',
    color: '#2B2C30',
    items: ['Oracle', 'MS SQL', 'PostgreSQL', 'MySQL', 'MariaDB', 'Tibero'],
  },
  {
    category: 'Browser',
    color: '#059669',
    items: ['Chrome', 'Edge', 'Firefox', 'Safari'],
  },
];

const TechStackSection: React.FC = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      style={{ padding: 'clamp(48px, 5vw, 72px) 0', background: 'var(--soft)' }}
    >
      <Container>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: 18, letterSpacing: '.14em', color: 'var(--ink2)', textTransform: 'uppercase' as const }}>
            SUPPORTED PLATFORMS
          </span>
          <h2 style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 900, fontSize: 'clamp(22px, 3vw, 32px)', lineHeight: 1.2, color: 'var(--ink)', marginTop: 10 }}>
            지원 기술 범위
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 20 }}>
          {STACKS.map((stack, si) => (
            <div
              key={stack.category}
              style={{
                opacity: isIntersecting ? 1 : 0,
                transform: isIntersecting ? 'translateY(0)' : 'translateY(16px)',
                transition: `all .5s ease ${si * 0.1}s`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: stack.color }} />
                <span style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: '.06em', color: stack.color }}>
                  {stack.category}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {stack.items.map((item) => (
                  <span
                    key={item}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 0,
                      background: 'var(--surface)',
                      border: '1px solid var(--line)',
                      fontFamily: "'Pretendard', sans-serif",
                      fontWeight: 500,
                      fontSize: 18,
                      color: 'var(--ink)',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TechStackSection;
