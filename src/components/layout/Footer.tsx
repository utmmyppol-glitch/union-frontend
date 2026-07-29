'use client';

import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/constants';
import type { NavItem } from '@/types';

/** NAV_ITEMS에서 Footer용 평탄화된 링크 목록을 생성 */
function flattenChildren(item: NavItem): { label: string; href: string }[] {
  if (!item.children?.length) {
    return [{ label: item.label, href: item.href }];
  }
  return item.children.flatMap((child) =>
    child.children?.length
      ? child.children.map((gc) => ({ label: gc.label, href: gc.href }))
      : [{ label: child.label, href: child.href }]
  );
}

/** Footer에 표시할 메뉴 라벨 매핑 (영어 → 한글) */
const FOOTER_LABELS: Record<string, string> = {
  Company: '회사소개',
  Software: '소프트웨어',
  Solution: '솔루션',
  Customer: '고객지원',
  Insights: '인사이트',
};

/** Footer에 표시할 메뉴만 필터링 */
const FOOTER_KEYS = ['Company', 'Software', 'Solution', 'Customer', 'Insights'];

const footerNav = NAV_ITEMS
  .filter((item) => FOOTER_KEYS.includes(item.label))
  .map((item) => ({
    title: FOOTER_LABELS[item.label] || item.label,
    items: flattenChildren(item),
  }));

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
                개인정보처리방침
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

          {/* SNS icons */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <a
              href="https://blog.naver.com/unionsystems_"
              target="_blank"
              rel="noopener noreferrer"
              title="블로그 바로가기"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(255,255,255,.12)',
                transition: 'background .2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.12)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16v16H4V4z" fill="none"/>
                <text x="12" y="17" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">B</text>
              </svg>
            </a>
            <a
              href="https://www.facebook.com/%EC%9C%A0%EB%8B%88%EC%98%A8%EC%8B%9C%EC%8A%A4%ED%85%9C%EC%A6%88-407065599829009/"
              target="_blank"
              rel="noopener noreferrer"
              title="페이스북 바로가기"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(255,255,255,.12)',
                transition: 'background .2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.12)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
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
