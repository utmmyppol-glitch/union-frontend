'use client';

import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export interface StatCardProps {
  n: number;
  suf: string;
  label: string;
  sub: string;
  color: string;
}

export default function StatCard({ n, suf, label, sub, color }: StatCardProps) {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.3 });
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isIntersecting || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 2000;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * n));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [isIntersecting, n]);

  return (
    <div ref={ref}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
        <span
          style={{
            fontFamily: "'Pretendard', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(40px, 5vw, 60px)',
            color,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {displayValue}
        </span>
        <span
          style={{
            fontFamily: "'Pretendard', sans-serif",
            fontWeight: 700,
            fontSize: 22,
            color,
          }}
        >
          {suf}
        </span>
      </div>
      <p
        style={{
          fontFamily: "'Pretendard', sans-serif",
          fontWeight: 800,
          fontSize: 18,
          marginTop: 10,
          color: 'var(--ink)',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "'Pretendard', sans-serif",
          fontWeight: 500,
          fontSize: 18,
          color: 'var(--ink2)',
          marginTop: 4,
        }}
      >
        {sub}
      </p>
    </div>
  );
}
