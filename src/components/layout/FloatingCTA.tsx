'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';

interface FloatingCTAProps {
  onDownloadClick?: () => void;
}

interface CTAOption {
  label: string;
  icon: React.ReactNode;
  action: 'link' | 'callback';
  href?: string;
  callback?: () => void;
}

export default function FloatingCTA({ onDownloadClick }: FloatingCTAProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const options: CTAOption[] = [
    {
      label: '전화상담',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M17.56 13.96l-3.53-1.18a1.25 1.25 0 00-1.31.34l-1.56 1.91a13.81 13.81 0 01-6.2-6.2l1.91-1.56a1.25 1.25 0 00.34-1.31L6.04 2.44A1.25 1.25 0 004.78 1.62l-3 .63A1.25 1.25 0 00.75 3.58 17.67 17.67 0 0016.42 19.25a1.25 1.25 0 001.33-1.03l.63-3a1.25 1.25 0 00-.82-1.26z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      action: 'link',
      href: 'tel:02-706-8999',
    },
    {
      label: '1:1문의',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M17.5 12.5a1.67 1.67 0 01-1.67 1.67h-10L2.5 17.5V4.17A1.67 1.67 0 014.17 2.5h11.66A1.67 1.67 0 0117.5 4.17v8.33z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      action: 'link',
      href: '/contact',
    },
    {
      label: '소개서 다운로드',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M17.5 12.5v3.33a1.67 1.67 0 01-1.67 1.67H4.17a1.67 1.67 0 01-1.67-1.67V12.5M5.83 8.33L10 12.5l4.17-4.17M10 12.5V2.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      action: 'callback',
      callback: onDownloadClick,
    },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 12,
      }}
    >
      {/* Expanded options */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          transition: 'opacity .2s, transform .2s',
          transformOrigin: 'bottom',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0)' : 'translateY(8px)',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {options.map((option) => {
          const content = (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                cursor: 'pointer',
                transition: 'border-color .15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; }}
            >
              <span style={{ color: 'var(--ink2)' }}>
                {option.icon}
              </span>
              <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>
                {option.label}
              </span>
            </div>
          );

          if (option.action === 'link' && option.href) {
            if (option.href.startsWith('tel:')) {
              return (
                <a
                  key={option.label}
                  href={option.href}
                  onClick={() => setIsOpen(false)}
                  style={{ textDecoration: 'none' }}
                >
                  {content}
                </a>
              );
            }
            return (
              <Link
                key={option.label}
                href={option.href}
                onClick={() => setIsOpen(false)}
                style={{ textDecoration: 'none' }}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={option.label}
              onClick={() => {
                setIsOpen(false);
                option.callback?.();
              }}
              style={{ textAlign: 'left', border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
            >
              {content}
            </button>
          );
        })}
      </div>

      {/* Main toggle button */}
      <button
        onClick={toggle}
        style={{
          width: 56,
          height: 56,
          background: 'var(--accent)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity .2s, transform .15s',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
        }}
        aria-label={isOpen ? '문의 메뉴 닫기' : '문의하기'}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
