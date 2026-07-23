'use client';

import Link from 'next/link';

const footerNav = [
  {
    title: '회사소개',
    items: [
      { label: '기업소개', href: '/company/about' },
      { label: '주요연혁', href: '/company/history' },
    ],
  },
  {
    title: '소프트웨어',
    items: [
      { label: 'Microsoft 365', href: '/software/microsoft' },
      { label: 'ESTsoft', href: '/software/estsoft' },
      { label: 'Autodesk', href: '/software/autodesk' },
      { label: 'Adobe', href: '/software/adobe' },
    ],
  },
  {
    title: '솔루션',
    items: [
      { label: 'DA#', href: '/solution/data/da' },
      { label: 'NetClient', href: '/solution/asset-management/netclient' },
      { label: 'AhnLab', href: '/solution/security/ahnlab' },
      { label: 'ESTsecurity', href: '/solution/security/estsecurity' },
      { label: 'OfficeKeeper', href: '/solution/security/officekeeper' },
    ],
  },
  {
    title: '고객지원',
    items: [
      { label: '공지사항', href: '/support/notices' },
      { label: '1:1 문의', href: '/support/inquiry' },
      { label: '기술지원', href: '/support/tech' },
      { label: '이벤트', href: '/support/events' },
    ],
  },
  {
    title: '인사이트',
    items: [
      { label: '블로그/칼럼', href: '/insights' },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--charcoal)', color: '#fff' }}>
      <div
        style={{
          maxWidth: 1300,
          margin: '0 auto',
          padding: '64px clamp(20px, 4vw, 52px) 30px',
        }}
      >
        {/* Top section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr 1fr',
            gap: 32,
          }}
          className="footer-grid"
        >
          {/* Company info column */}
          <div>
            <img
              src="/images/logo_w.png"
              alt="UNION SYSTEMS"
              style={{ height: 22, display: 'block', marginBottom: 20 }}
            />
            <div
              style={{
                fontWeight: 400,
                fontSize: 13,
                lineHeight: 1.9,
                color: 'rgba(255,255,255,.4)',
                maxWidth: 300,
              }}
            >
              <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,.55)' }}>
                주식회사 유니온시스템즈
              </p>
              <p style={{ margin: 0 }}>대표자 : 홍민석</p>
              <p style={{ margin: 0 }}>
                주소 : 서울시 성동구 아차산로17길 49, 1209~1210호
                <br />
                <span style={{ paddingLeft: 38 }}>(성수동2가, 생각공장데시앙플렉스)</span>
              </p>
              <p style={{ margin: 0 }}>사업자등록번호 : 120-87-96801</p>
              <p style={{ margin: 0 }}>TEL : 02-706-8999 ｜ FAX : 02-706-8990</p>

              <Link
                href="/privacy"
                style={{
                  display: 'inline-block',
                  marginTop: 12,
                  fontWeight: 600,
                  fontSize: 13,
                  color: 'rgba(255,255,255,.55)',
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,.55)'; }}
              >
                개인정보취급방침
              </Link>
            </div>
          </div>

          {/* Nav columns */}
          {footerNav.map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: '.02em',
                  color: 'rgba(255,255,255,.6)',
                  marginBottom: 14,
                  marginTop: 0,
                }}
              >
                {col.title}
              </h4>
              {col.items.map((item) => {
                const isExternal = item.href.startsWith('http');
                if (isExternal) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        fontWeight: 400,
                        fontSize: 13,
                        color: 'rgba(255,255,255,.4)',
                        textDecoration: 'none',
                        marginBottom: 8,
                        transition: 'color .2s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,.4)'; }}
                    >
                      {item.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    style={{
                      display: 'block',
                      fontWeight: 400,
                      fontSize: 13,
                      color: 'rgba(255,255,255,.4)',
                      textDecoration: 'none',
                      marginBottom: 8,
                      transition: 'color .2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,.4)'; }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,.08)',
            paddingTop: 20,
            marginTop: 40,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span
            style={{
              fontWeight: 400,
              fontSize: 12,
              color: 'rgba(255,255,255,.4)',
            }}
          >
            &copy; Copyright 2015 UNION SYSTEMS. All rights reserved.
          </span>

          {/* SNS links */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <a
              href="https://blog.naver.com/union_systems"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: 'rgba(255,255,255,.35)',
                textDecoration: 'none',
                transition: 'color .2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,.35)'; }}
            >
              블로그 바로가기
            </a>
            <span style={{ color: 'rgba(255,255,255,.12)' }}>|</span>
            <a
              href="https://www.facebook.com/unionsystems"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: 'rgba(255,255,255,.35)',
                textDecoration: 'none',
                transition: 'color .2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,.35)'; }}
            >
              페이스북 바로가기
            </a>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style jsx global>{`
        @media (max-width: 960px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 28px !important;
          }
        }
        @media (max-width: 520px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
