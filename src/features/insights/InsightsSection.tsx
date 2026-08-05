'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui';

interface Insight {
  id?: number;
  title?: string;
  summary?: string;
  sourceName?: string;
  sourceUrl?: string;
  publishedAt?: string;
  thumbnailUrl?: string;
}

const FALLBACK_POSTS = [
  { cat: '보안', title: '2026년 기업이 대비해야 할 5가지 보안 위협', date: '2026.06.20' },
  { cat: '데이터', title: '데이터 표준화, 왜 지금 시작해야 할까', date: '2026.05.28' },
  { cat: '라이선스', title: 'Microsoft 365 라이선스, 이렇게 하면 아낀다', date: '2026.04.15' },
];

function mapInsight(item: Insight) {
  return {
    cat: item.sourceName ?? '',
    title: item.title ?? '',
    date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, '') : '',
    url: item.sourceUrl ?? '/insights',
  };
}

const InsightsSection: React.FC<{ insights?: Record<string, unknown>[] }> = ({ insights }) => {
  const posts = insights && insights.length >= 3
    ? insights.slice(0, 3).map((i) => mapInsight(i as unknown as Insight))
    : FALLBACK_POSTS.map((p) => ({ ...p, url: '/insights' }));
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <section className="insights-section" style={{ padding: 'clamp(60px, 8vw, 112px) 0' }}>
      <Container>
        {/* Header row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 40,
          }}
        >
          <div>
            <span
              style={{
                display: 'inline-block',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: '.14em',
                color: 'var(--ink2)',
                textTransform: 'uppercase' as const,
                marginBottom: 12,
              }}
            >
              INSIGHTS
            </span>
            <h2
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 'clamp(30px, 4vw, 48px)',
                lineHeight: 1.15,
                letterSpacing: '-.02em',
                color: 'var(--ink)',
                margin: 0,
              }}
            >
              IT 담당자를 위한 인사이트
            </h2>
          </div>
          <a
            href="/insights"
            style={{
              fontWeight: 600,
              fontSize: 18,
              color: 'var(--ink2)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'color .2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink2)'; }}
          >
            전체 보기 &rarr;
          </a>
        </div>

        {/* 2-column grid */}
        <div className="insights-grid">
          {/* Featured post */}
          <Link
            href={featured.url}
            target={featured.url.startsWith('http') ? '_blank' : undefined}
            rel={featured.url.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="insights-featured"
            style={{
              padding: 36,
              minHeight: 320,
              background: 'var(--charcoal)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              color: '#fff',
              transition: 'transform .2s',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Subtle radial overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at 85% 15%, rgba(255,255,255,.08), transparent 45%)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span
                style={{
                  display: 'inline-block',
                  border: '1px solid rgba(255,255,255,.15)',
                  padding: '5px 12px',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                  fontWeight: 500,
                  fontSize: 18,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase' as const,
                  marginBottom: 14,
                  color: 'rgba(255,255,255,.6)',
                }}
              >
                {featured.cat}
              </span>
              <h3
                style={{
                  fontWeight: 900,
                  fontSize: 'clamp(22px, 2.4vw, 30px)',
                  lineHeight: 1.3,
                  margin: '0 0 14px',
                }}
              >
                {featured.title}
              </h3>
              <span
                style={{
                  fontWeight: 500,
                  fontSize: 18,
                  opacity: 0.5,
                }}
              >
                {featured.date}
              </span>
            </div>
          </Link>

          {/* Smaller posts — leisure row style */}
          {rest.map((post, i) => (
            <Link
              key={i}
              href={post.url}
              target={post.url.startsWith('http') ? '_blank' : undefined}
              rel={post.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                textDecoration: 'none',
                padding: '26px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'padding-left .2s, border-color .2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.paddingLeft = '40px';
                el.style.borderColor = 'var(--ink)';
                const title = el.querySelector('h3') as HTMLElement;
                if (title) title.style.color = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.paddingLeft = '28px';
                el.style.borderColor = 'var(--line)';
                const title = el.querySelector('h3') as HTMLElement;
                if (title) title.style.color = 'var(--ink)';
              }}
            >
              <span
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                  fontWeight: 500,
                  fontSize: 18,
                  letterSpacing: '.1em',
                  color: 'var(--ink2)',
                  textTransform: 'uppercase' as const,
                  marginBottom: 10,
                }}
              >
                {post.cat}
              </span>
              <h3
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  lineHeight: 1.4,
                  color: 'var(--ink)',
                  margin: '0 0 12px',
                  transition: 'color .2s',
                }}
              >
                {post.title}
                <span style={{ marginLeft: 8, fontSize: 18, color: 'var(--ink2)' }}>&rarr;</span>
              </h3>
              <span
                style={{
                  fontWeight: 500,
                  fontSize: 18,
                  color: 'var(--ink2)',
                }}
              >
                {post.date}
              </span>
            </Link>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div
          style={{
            marginTop: 40,
            padding: '28px 32px',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p style={{ fontWeight: 800, fontSize: 18, color: 'var(--ink)' }}>
              IT 트렌드 뉴스레터를 구독하세요
            </p>
            <p style={{ fontWeight: 400, fontSize: 18, color: 'var(--ink2)', marginTop: 4 }}>
              매월 IT 담당자를 위한 보안·라이선스·데이터 인사이트를 보내드립니다.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="email"
              placeholder="이메일 주소"
              style={{
                padding: '10px 14px',
                border: '1px solid var(--line)',
                background: 'var(--bg)',
                fontSize: 18,
                color: 'var(--ink)',
                outline: 'none',
                width: 220,
              }}
            />
            <button
              style={{
                padding: '10px 20px',
                border: 'none',
                background: 'var(--accent)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 18,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              구독하기
            </button>
          </div>
        </div>
      </Container>

      <style>{`
        .insights-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 16px;
        }
        .insights-featured {
          grid-row: span 2;
        }
        @media (max-width: 920px) {
          .insights-grid {
            grid-template-columns: 1fr !important;
          }
          .insights-featured {
            grid-row: span 1;
          }
        }
      `}</style>
    </section>
  );
};

export default InsightsSection;
