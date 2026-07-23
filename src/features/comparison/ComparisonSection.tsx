'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const ROWS = [
  { label: '라이선스 비교 견적', direct: '직접 조사 필요', union: '무료 제공', win: true },
  { label: '도입 컨설팅', direct: '별도 비용', union: '무료 포함', win: true },
  { label: '기술 지원', direct: '제조사 콜센터(영어)', union: '전담 엔지니어 한국어 지원', win: true },
  { label: '통합 관리', direct: '제품별 개별 관리', union: '원스톱 통합 관리', win: true },
  { label: '긴급 대응', direct: '이메일 티켓(1~3일)', union: '당일 원격 지원', win: true },
  { label: '라이선스 최적화', direct: '직접 분석', union: '연 1회 무료 진단', win: true },
];

const ComparisonSection: React.FC = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section ref={ref} style={{ padding: 'clamp(56px, 7vw, 96px) 0' }}>
      <Container>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: 18, letterSpacing: '.14em', color: 'var(--accent)', textTransform: 'uppercase' as const }}>
            WHY THROUGH US
          </span>
          <h2 style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 900, fontSize: 'clamp(24px, 3.5vw, 38px)', lineHeight: 1.2, color: 'var(--ink)', marginTop: 10 }}>
            직접 구매 vs 유니온시스템즈
          </h2>
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 18, color: 'var(--ink2)', marginTop: 8 }}>
            같은 제품, 다른 경험. 유니온을 통하면 이런 차이가 있습니다.
          </p>
        </div>

        <div
          style={{
            maxWidth: 720,
            margin: '0 auto',
            borderRadius: 0,
            overflow: 'hidden',
            border: '1px solid var(--line)',
            background: 'var(--surface)',
            opacity: isIntersecting ? 1 : 0,
            transform: isIntersecting ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all .6s ease',
          }}
        >
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', background: 'var(--soft)', borderBottom: '1px solid var(--line)' }}>
            <div style={{ padding: '14px 20px', fontFamily: "'Pretendard', sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--ink2)' }}>항목</div>
            <div style={{ padding: '14px 16px', fontFamily: "'Pretendard', sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--ink2)', textAlign: 'center' }}>직접 구매</div>
            <div style={{ padding: '14px 16px', fontFamily: "'Pretendard', sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--accent)', textAlign: 'center' }}>유니온시스템즈</div>
          </div>

          {/* Rows */}
          {ROWS.map((row, i) => (
            <div
              key={row.label}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1fr',
                borderBottom: i < ROWS.length - 1 ? '1px solid var(--line)' : 'none',
              }}
            >
              <div style={{ padding: '14px 20px', fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: 18, color: 'var(--ink)' }}>
                {row.label}
              </div>
              <div style={{ padding: '14px 16px', fontFamily: "'Pretendard', sans-serif", fontWeight: 400, fontSize: 18, color: 'var(--ink2)', textAlign: 'center' }}>
                {row.direct}
              </div>
              <div style={{ padding: '14px 16px', fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: 18, color: 'var(--accent)', textAlign: 'center', background: 'rgba(26,86,219,.03)' }}>
                {row.union} {row.win && '✓'}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <Link
            href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '14px 28px',
              borderRadius: 0,
              background: 'var(--accent)',
              color: '#fff',
              fontFamily: "'Pretendard', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              textDecoration: 'none',
            }}
          >
            무료 견적 받기 →
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default ComparisonSection;
