'use client';

import { Container } from '@/components/ui';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import StatCard from './StatCard';

const stats = [
  { n: 16, suf: '년+', label: 'IT 파트너십', sub: 'Since 2010', color: 'var(--ink)' },
  { n: 200, suf: '+', label: '누적 고객사', sub: '대기업·공공·금융', color: 'var(--ink)' },
  { n: 10, suf: '+', label: '글로벌 파트너', sub: 'MS·Adobe·AhnLab 외', color: 'var(--ink)' },
  { n: 59, suf: '억', label: '연 매출', sub: '2025년 기준', color: 'var(--ink)' },
] as const;

export default function StatsSection() {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section style={{ padding: 'clamp(72px, 9vw, 120px) 0', background: 'var(--bg)' }}>
      <Container>
        {/* Webflow-style: left-aligned editorial */}
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontWeight: 500, fontSize: 13, letterSpacing: '.16em', textTransform: 'uppercase' as const, color: 'var(--ink2)' }}>
            ABOUT
          </span>
          <h2 style={{
            fontFamily: "'Newsreader', serif",
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(30px, 4vw, 48px)',
            lineHeight: 1.15,
            letterSpacing: '-.02em',
            color: 'var(--ink)',
            marginTop: 14,
          }}>
            숫자가 증명하는 신뢰.
          </h2>
        </div>

        {/* 4-column grid — hairline borders, no cards */}
        <div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-4"
          style={{ gap: 0, borderTop: '1px solid var(--line)' }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                borderRight: i < 3 ? '1px solid var(--line)' : 'none',
                borderBottom: '1px solid var(--line)',
                padding: '32px 28px',
                opacity: isIntersecting ? 1 : 0,
                transform: isIntersecting ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity .5s ease ${i * 0.1}s, transform .5s ease ${i * 0.1}s`,
              }}
            >
              <StatCard
                n={s.n}
                suf={s.suf}
                label={s.label}
                sub={s.sub}
                color={s.color}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
