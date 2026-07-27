'use client';

import React from 'react';
import { Container } from '@/components/ui';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const POINTS = [
  {
    title: '모델링 Full Spec',
    desc: '논리·물리 모델 설계, Forward/Reverse Engineering, 표준 사전, 영향도 분석까지 데이터 모델링의 모든 것.',
    color: '#6B6B70',
  },
  {
    title: 'AI 자동화',
    desc: 'DA# AI Powered Pack으로 모델링 공수 80% 절감. 자동 표준 매핑, 모델 추천, 품질 자동 진단.',
    color: '#111214',
  },
  {
    title: '데이터 품질진단',
    desc: 'DA# DQ Edition으로 품질 측정·오류 분석·지속 개선. 공공데이터 품질관리 수준평가 지원.',
    color: '#2B2C30',
  },
];

const DaHighlightSection: React.FC = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      style={{
        padding: 'clamp(56px, 7vw, 96px) 0',
        background: 'linear-gradient(135deg, rgba(18,184,134,.04), rgba(26,86,219,.04))',
      }}
    >
      <Container>
        <div className="da-highlight-grid">
          {/* Left — copy */}
          <div
            style={{
              opacity: isIntersecting ? 1 : 0,
              transform: isIntersecting ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all .6s ease',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                fontWeight: 500,
                fontSize: 18,
                letterSpacing: '.16em',
                textTransform: 'uppercase' as const,
                color: 'var(--ink2)',
                marginBottom: 16,
              }}
            >
              FLAGSHIP SOLUTION
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
                marginBottom: 16,
              }}
            >
              데이터 설계의 정석,
              <br />
              <span style={{ color: '#6B6B70' }}>DA#</span>
            </h2>
            <p
              style={{
                fontFamily: "'Pretendard', sans-serif",
                fontWeight: 400,
                fontSize: 'clamp(14px, 1.5vw, 16px)',
                lineHeight: 1.7,
                color: 'var(--ink2)',
                maxWidth: 620,
                marginBottom: 24,
              }}
            >
              국내 데이터 비즈니스 전문 엔코아의 DA#.
              <br />
              유니온시스템즈가 공인총판으로 도입부터 기술지원까지 책임집니다.
            </p>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
              {['GS인증 1등급', '엔코아 공인총판', '1,500+ 프로젝트'].map((badge) => (
                <span
                  key={badge}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 0,
                    border: '1px solid var(--line)',
                    background: 'var(--surface)',
                    fontFamily: "'Pretendard', sans-serif",
                    fontWeight: 600,
                    fontSize: 18,
                    color: 'var(--ink)',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a
                href="https://uniondata.co.kr"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '14px 26px',
                  borderRadius: 0,
                  background: '#6B6B70',
                  color: '#fff',
                  fontFamily: "'Pretendard', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  textDecoration: 'none',
                  transition: 'transform .2s, box-shadow .2s',
                }}
              >
                DA# 자세히 보기
              </a>
              <a
                href="/contact"
                style={{
                  padding: '14px 26px',
                  borderRadius: 0,
                  border: '1px solid var(--line)',
                  background: 'var(--surface)',
                  color: 'var(--ink)',
                  fontFamily: "'Pretendard', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  textDecoration: 'none',
                }}
              >
                도입 문의
              </a>
            </div>
          </div>

          {/* Right — 3 point cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {POINTS.map((p, i) => (
              <div
                key={p.title}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderLeft: `4px solid ${p.color}`,
                  borderRadius: 0,
                  padding: '22px 24px',
                  opacity: isIntersecting ? 1 : 0,
                  transform: isIntersecting ? 'translateX(0)' : 'translateX(20px)',
                  transition: `all .5s ease ${0.15 + i * 0.12}s`,
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.boxShadow = `0 6px 20px ${p.color}14`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <p
                  style={{
                    fontFamily: "'Pretendard', sans-serif",
                    fontWeight: 800,
                    fontSize: 18,
                    color: 'var(--ink)',
                    marginBottom: 6,
                  }}
                >
                  {p.title}
                </p>
                <p
                  style={{
                    fontFamily: "'Pretendard', sans-serif",
                    fontWeight: 400,
                    fontSize: 18,
                    lineHeight: 1.6,
                    color: 'var(--ink2)',
                  }}
                >
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <style>{`
        .da-highlight-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }
        @media (max-width: 920px) {
          .da-highlight-grid {
            grid-template-columns: 1fr !important;
            gap: 28px;
          }
        }
      `}</style>
    </section>
  );
};

export default DaHighlightSection;
