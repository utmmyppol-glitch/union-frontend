'use client';

import Link from 'next/link';

const SOFTWARE_ITEMS = [
  {
    name: 'Microsoft',
    logo: '/images/logo_microsoft.png',
    desc: 'IT 인프라 · 협업/생산성',
    href: '/software?tab=microsoft365',
    left: '7%',
    top: '26%',
    size: 92,
    dur: 6.8,
    delay: 0,
  },
  {
    name: '닥터소프트',
    logo: '/images/uploads/logo_netclient_83.png',
    desc: 'ITAM · PC OFF',
    href: '/solution/asset-management/netclient',
    left: '21%',
    top: '10%',
    size: 84,
    dur: 7.2,
    delay: 0.5,
  },
  {
    name: 'ESTsoft',
    subtitle: '알툴즈',
    logo: '/images/logo_estsoft.png',
    desc: '통합 유틸리티 · 백신',
    href: '/software?tab=estsoft',
    left: '35%',
    top: '30%',
    size: 84,
    dur: 6.4,
    delay: 1.0,
  },
  {
    name: 'AhnLab',
    logo: '/images/logo_ahnlab.png',
    desc: '통합 보안 인프라',
    href: '/solutions?tab=security',
    left: '50%',
    top: '8%',
    size: 88,
    dur: 7.6,
    delay: 0.3,
  },
  {
    name: 'Autodesk',
    logo: '/images/logo_autodesk.png',
    desc: '설계',
    href: '/software?tab=autodesk',
    left: '64%',
    top: '28%',
    size: 88,
    dur: 6.2,
    delay: 0.8,
  },
  {
    name: 'Adobe',
    logo: '/images/logo_adobe.png',
    desc: 'Contents Creative',
    href: '/software?tab=adobe',
    left: '78%',
    top: '10%',
    size: 88,
    dur: 7.0,
    delay: 0.6,
  },
  {
    name: '엔코아',
    logo: '/images/uploads/logo_encore_82.png',
    desc: '데이터 거버넌스',
    href: 'https://uniondata.co.kr',
    left: '92%',
    top: '28%',
    size: 84,
    dur: 6.6,
    delay: 1.2,
  },
];

export default function SoftwareSection() {
  return (
    <section
      style={{
        background: 'var(--surface)',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(80px,10vw,130px) 0',
      }}
    >
      {/* Background decorative — large serif italic "Software" */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: "'Newsreader', Georgia, serif",
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 'clamp(100px, 14vw, 220px)',
          color: 'var(--line)',
          opacity: .35,
          whiteSpace: 'nowrap',
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: '-.04em',
        }}
      >
        Software
      </div>

      <div
        style={{
          maxWidth: 1300,
          margin: '0 auto',
          padding: '0 clamp(20px, 4vw, 52px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: '.14em',
              color: 'var(--ink2)',
              textTransform: 'uppercase',
              margin: '0 0 16px',
            }}
          >
            Software
          </p>
          <h2
            style={{
              fontWeight: 900,
              fontSize: 'clamp(30px, 3.8vw, 52px)',
              lineHeight: .92,
              letterSpacing: '-.05em',
              color: 'var(--ink)',
              margin: '0 0 16px',
            }}
          >
            예산에 맞춘 비교견적,
            <br />
            라이선스 통합 관리
            <span style={{ color: 'var(--accent)' }}>.</span>
          </h2>
          <p
            style={{
              fontWeight: 400,
              fontSize: 16,
              lineHeight: 1.65,
              color: 'var(--ink2)',
              maxWidth: 380,
              margin: '0 auto',
            }}
          >
            도입부터 갱신까지, 유니온시스템즈가 책임집니다.
          </p>
        </div>

        {/* Floating cards stage */}
        <div
          className="sw-floating-stage"
          style={{
            position: 'relative',
            height: 440,
          }}
        >
          {/* Sparkle decorations */}
          {[
            { x: '22%', y: '8%', size: 10, d: 3 },
            { x: '48%', y: '55%', size: 8, d: 4.2 },
            { x: '76%', y: '10%', size: 12, d: 3.6 },
            { x: '62%', y: '72%', size: 7, d: 5 },
          ].map((s, i) => (
            <div
              key={i}
              className="sw-sparkle"
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: s.x,
                top: s.y,
                width: s.size,
                height: s.size,
                animation: `sparkle ${s.d}s ease-in-out infinite`,
                pointerEvents: 'none',
                zIndex: 0,
              }}
            >
              <svg viewBox="0 0 16 16" fill="var(--ink2)" style={{ width: '100%', height: '100%', opacity: .4 }}>
                <path d="M8 0L9.2 6.8L16 8L9.2 9.2L8 16L6.8 9.2L0 8L6.8 6.8Z" />
              </svg>
            </div>
          ))}

          {/* SVG dashed path */}
          <svg
            className="sw-sparkle"
            viewBox="0 0 1300 420"
            fill="none"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
            preserveAspectRatio="none"
          >
            <path
              d="M 90 200 Q 200 80 350 150 Q 500 220 580 170 Q 660 120 780 130 Q 900 140 1020 200 Q 1120 80 1200 160"
              stroke="var(--line)"
              strokeWidth="1"
              strokeDasharray="1 14"
              strokeLinecap="round"
              opacity="0.4"
            />
          </svg>

          {/* Logo cards */}
          {SOFTWARE_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="sw-card"
              style={{
                position: 'absolute',
                left: item.left,
                top: item.top,
                transform: 'translateX(-50%)',
                textAlign: 'center',
                textDecoration: 'none',
                cursor: 'pointer',
                animation: `swFloat ${item.dur}s ease-in-out ${item.delay}s infinite`,
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                padding: '28px 24px 22px',
                width: 155,
                boxShadow: '0 8px 32px rgba(0,0,0,.06)',
                zIndex: 1,
              }}
            >
              <img
                className="sw-logo-img"
                src={item.logo}
                alt={`${item.name} logo`}
                style={{
                  width: item.size,
                  height: item.size,
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto 10px',
                  filter: 'grayscale(40%)',
                  transition: 'filter .4s',
                }}
              />
              <p
                className="sw-card-name"
                style={{
                  fontWeight: 800,
                  fontSize: 17,
                  color: 'var(--ink)',
                  margin: '0 0 4px',
                  transition: 'color 0.3s',
                }}
              >
                {item.name}
              </p>
              <p
                style={{
                  fontWeight: 500,
                  fontSize: 13,
                  color: 'var(--ink2)',
                  margin: 0,
                }}
              >
                {item.desc}
              </p>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link
            href="/software"
            style={{
              fontWeight: 600,
              fontSize: 15,
              color: 'var(--ink2)',
              textDecoration: 'none',
              transition: 'color .2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink2)'; }}
          >
            전체 소프트웨어 보기
            <span style={{ fontSize: 14 }}>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
