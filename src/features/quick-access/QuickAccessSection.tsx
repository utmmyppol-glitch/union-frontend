'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const ITEMS = [
  {
    title: '소개서 다운로드',
    desc: '회사소개서를 무료로 받아보세요',
    color: '#111214',
    href: '#',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: '무료 IT 진단',
    desc: '현재 IT 환경을 무료로 진단해드립니다',
    color: '#6B655C',
    href: '/contact',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    title: '기술지원',
    desc: '전담 엔지니어가 원격으로 지원합니다',
    color: '#2B2C30',
    href: '/support/tech',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    title: '도입문의',
    desc: '맞춤 솔루션을 제안해드립니다',
    color: '#059669',
    href: '/contact',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
];

const QuickAccessSection: React.FC = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section ref={ref} style={{ padding: 'clamp(48px, 6vw, 80px) 0' }}>
      <Container>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: '.14em', color: 'var(--ink2)', textTransform: 'uppercase' as const }}>
            GET STARTED
          </span>
          <h2 style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 900, fontSize: 'clamp(24px, 3.5vw, 36px)', lineHeight: 1.2, color: 'var(--ink)', marginTop: 10 }}>
            어디서부터 시작할지 모르겠다면
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 14 }}>
          {ITEMS.map((item, i) => (
            <Link
              key={item.title}
              href={item.href}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 0,
                padding: '28px 22px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 12,
                textDecoration: 'none',
                transition: `all .4s ease ${i * 0.08}s`,
                opacity: isIntersecting ? 1 : 0,
                transform: isIntersecting ? 'translateY(0)' : 'translateY(20px)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = item.color;
                e.currentTarget.style.boxShadow = `0 12px 32px ${item.color}18`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--line)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 0, background: `${item.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                {item.icon}
              </div>
              <div>
                <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 800, fontSize: 18, color: 'var(--ink)' }}>{item.title}</p>
                <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 400, fontSize: 16, color: 'var(--ink2)', marginTop: 4, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
              <span style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: 14, color: item.color }}>바로가기 →</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default QuickAccessSection;
