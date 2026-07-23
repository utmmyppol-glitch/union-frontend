'use client';

import React from 'react';
import { Container } from '@/components/ui';

const ACCENT_COLORS = ['#111214', '#2B2C30', '#111214', '#2B2C30'] as const;

const testimonials = [
  {
    quote: '이중 방어 체계로 보안 위협 탐지율이 눈에 띄게 올라갔습니다.',
    metric: '35%',
    metricLabel: '위협 탐지율 향상',
    who: 'KB생명보험 IT보안팀',
    sol: 'AhnLab + ESTsecurity',
  },
  {
    quote: '전사 라이선스를 다시 설계하며 불필요한 비용을 크게 줄였어요.',
    metric: '22%',
    metricLabel: '라이선스 비용 절감',
    who: 'SSG닷컴 인프라팀',
    sol: 'NetClient + Microsoft 365',
  },
  {
    quote: '흩어져 있던 데이터 모델을 하나의 표준으로 현행화했습니다.',
    metric: '100%',
    metricLabel: '데이터 표준화 달성',
    who: '한국수자원공사',
    sol: 'DA# 전사 모델링',
  },
];

const StoriesSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div style={{ marginBottom: 0 }}>
          <span
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
              fontWeight: 500,
              fontSize: 18,
              letterSpacing: '.16em',
              textTransform: 'uppercase' as const,
              color: 'var(--ink2)',
            }}
          >
            CUSTOMER STORIES
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
            성과로 증명합니다.
          </h2>
        </div>

        <div
          className="stories-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginTop: 56,
          }}
        >
          {testimonials.map((t, i) => {
            const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
            return (
              <div
                key={i}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: 0,
                  padding: 32,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform .3s, border-color .3s, box-shadow .3s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = 'translateY(-6px)';
                  el.style.borderColor = color;
                  el.style.boxShadow = `0 12px 32px ${color}22`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = 'translateY(0)';
                  el.style.borderColor = 'var(--line)';
                  el.style.boxShadow = 'none';
                }}
              >
                {/* Opening quote mark */}
                <span
                  style={{
                    fontFamily: "'Pretendard', sans-serif",
                    fontWeight: 700,
                    fontSize: 42,
                    lineHeight: '.5',
                    height: 22,
                    color,
                    display: 'block',
                    marginBottom: 20,
                  }}
                >
                  &ldquo;
                </span>

                {/* Quote text */}
                <p
                  style={{
                    fontFamily: "'Pretendard', sans-serif",
                    fontWeight: 600,
                    fontSize: 18,
                    lineHeight: 1.65,
                    flex: 1,
                    color: 'var(--ink)',
                    margin: 0,
                  }}
                >
                  {t.quote}
                </p>

                {/* Metric */}
                <div style={{ marginTop: 24 }}>
                  <span
                    style={{
                      fontFamily: "'Pretendard', sans-serif",
                      fontWeight: 700,
                      fontSize: 36,
                      color,
                      display: 'block',
                    }}
                  >
                    {t.metric}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Pretendard', sans-serif",
                      fontWeight: 700,
                      fontSize: 18,
                      color: 'var(--ink2)',
                      display: 'block',
                      marginTop: 2,
                    }}
                  >
                    {t.metricLabel}
                  </span>
                </div>

                {/* Divider + attribution */}
                <div
                  style={{
                    borderTop: '1px solid var(--line)',
                    marginTop: 20,
                    paddingTop: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Pretendard', sans-serif",
                      fontWeight: 800,
                      fontSize: 18,
                      color: 'var(--ink)',
                      display: 'block',
                    }}
                  >
                    {t.who}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Pretendard', sans-serif",
                      fontWeight: 500,
                      fontSize: 18,
                      color: 'var(--ink2)',
                      display: 'block',
                      marginTop: 4,
                    }}
                  >
                    {t.sol}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>

      {/* Responsive moved to globals.css */}
    </section>
  );
};

export default StoriesSection;
