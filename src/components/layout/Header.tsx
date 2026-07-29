'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/constants';
import type { NavItem } from '@/types';

interface MenuApiItem {
  name: string;
  url: string;
  menuType: string;
  isExposed: boolean;
  children?: MenuApiItem[];
}

function apiToNavItems(items: MenuApiItem[]): NavItem[] {
  return items.map((m) => ({
    label: m.name,
    href: m.url,
    children: m.children?.length ? apiToNavItems(m.children) : undefined,
  }));
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union').replace('/api/union', '');

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [navItems, setNavItems] = useState<NavItem[]>(NAV_ITEMS);

  // 메뉴 API에서 가져오기 (실패 시 하드코딩 폴백 유지)
  useEffect(() => {
    fetch(`${API_BASE}/api/union/menu`)
      .then((r) => r.ok ? r.json() : null)
      .then((data: MenuApiItem[] | null) => {
        if (data && data.length > 0) setNavItems(apiToNavItems(data));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const mainNavItems = navItems.filter(
    (item) => item.label !== '도입문의'
  );

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(label);
    setHoveredGroup(null);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 84,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(20px, 4vw, 52px)',
          ...(scrolled
            ? {
                background: 'linear-gradient(90deg, rgba(251,250,247,.94), rgba(251,250,247,.88) 50%, rgba(251,250,247,.94))',
                backdropFilter: 'blur(16px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
                borderBottom: '1px solid var(--line)',
              }
            : {
                background: 'transparent',
                borderBottom: '1px solid transparent',
              }),
          transition: 'all .4s',
        }}
      >
        {/* Logo */}
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}
          style={{ flexShrink: 0, display: 'flex', alignItems: 'center', marginRight: 12 }}
        >
          <img
            src="/images/logo.png"
            alt="UNION SYSTEMS"
            style={{ height: 52, display: 'block' }}
          />
        </a>

        {/* Desktop Nav */}
        <nav className="header-nav" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          {mainNavItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openDropdown === item.label;

            return (
              <div
                key={item.label}
                style={{ position: 'relative' }}
                onMouseEnter={() => hasChildren && handleDropdownEnter(item.label)}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  href={item.href}
                  className={`header-nav-link${isOpen ? ' nav-active' : ''}`}
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    color: isOpen ? 'var(--ink)' : 'var(--ink2)',
                    textDecoration: 'none',
                    padding: '8px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {item.label}
                  {item.badge && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E4002B', display: 'inline-block', marginLeft: 4, flexShrink: 0 }} />
                  )}
                </Link>

                {/* Dropdown */}
                {hasChildren && isOpen && (() => {
                  const hasGroups = item.children!.some(c => c.children && c.children.length > 0);
                  return (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        paddingTop: 8,
                      }}
                    >
                      <div
                        className="header-dropdown"
                        style={{
                          background: 'var(--surface)',
                          border: '1px solid var(--line)',
                          boxShadow: '0 8px 32px rgba(17,18,20,.08)',
                          padding: hasGroups ? 0 : '8px 6px',
                          minWidth: hasGroups ? undefined : 180,
                          overflow: 'visible',
                        }}
                      >
                        {hasGroups
                          ? (() => {
                              const activeGroup = hoveredGroup || null;
                              const activeChildren = activeGroup
                                ? item.children!.find(g => g.label === activeGroup)?.children || []
                                : [];
                              const activeIdx = activeGroup
                                ? item.children!.findIndex(g => g.label === activeGroup)
                                : -1;
                              return (
                                <div style={{ position: 'relative' }}>
                                  {/* Left: group list */}
                                  <div style={{ minWidth: 160, padding: '6px 0' }}>
                                    {item.children!.map((group, gi) => {
                                      const isActive = group.label === activeGroup;
                                      return (
                                        <div
                                          key={group.label}
                                          className="header-dropdown-item"
                                          onMouseEnter={() => setHoveredGroup(group.label)}
                                          onMouseLeave={() => {}}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '12px 20px',
                                            fontWeight: isActive ? 700 : 500,
                                            fontSize: 15,
                                            color: isActive ? '#fff' : 'var(--ink2)',
                                            background: isActive ? 'var(--accent)' : 'transparent',
                                            cursor: 'pointer',
                                            transition: 'all .15s',
                                            whiteSpace: 'nowrap',
                                            animationDelay: `${gi * 0.04}s`,
                                          }}
                                        >
                                          {group.label}
                                          <span style={{
                                            fontSize: 13,
                                            color: isActive ? '#fff' : 'var(--ink2)',
                                            opacity: isActive ? 1 : 0.35,
                                            marginLeft: 12,
                                          }}>&rsaquo;</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  {/* Right: sub items — absolutely positioned, sized to content */}
                                  {activeGroup && activeChildren.length > 0 && (
                                    <div
                                      className="header-sub-panel"
                                      onMouseEnter={() => setHoveredGroup(activeGroup)}
                                      style={{
                                        position: 'absolute',
                                        left: '100%',
                                        top: activeIdx * 46 + 6,
                                        background: 'var(--surface)',
                                        border: '1px solid var(--line)',
                                        boxShadow: '0 8px 32px rgba(17,18,20,.08)',
                                        padding: '6px 0',
                                        minWidth: 160,
                                      }}
                                    >
                                      {activeChildren.map((child) => {
                                        const isExternal = child.href.startsWith('http');
                                        const Comp = isExternal ? 'a' : Link;
                                        const extraProps = isExternal
                                          ? { target: '_blank', rel: 'noopener noreferrer' }
                                          : {};
                                        return (
                                          <Comp
                                            key={child.label}
                                            href={child.href}
                                            {...extraProps}
                                            style={{
                                              display: 'block',
                                              padding: '10px 20px',
                                              fontWeight: 500,
                                              fontSize: 15,
                                              color: 'var(--ink2)',
                                              textDecoration: 'none',
                                              transition: 'color .15s, background .15s',
                                              whiteSpace: 'nowrap',
                                            }}
                                            onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                                              e.currentTarget.style.color = 'var(--ink)';
                                              e.currentTarget.style.background = 'var(--soft)';
                                            }}
                                            onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                                              e.currentTarget.style.color = 'var(--ink2)';
                                              e.currentTarget.style.background = 'transparent';
                                            }}
                                          >
                                            {child.label}
                                          </Comp>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })()
                          : item.children!.map((child, ci) => {
                              const isExternal = child.href.startsWith('http');
                              const Comp = isExternal ? 'a' : Link;
                              const extraProps = isExternal
                                ? { target: '_blank', rel: 'noopener noreferrer' }
                                : {};
                              return (
                                <Comp
                                  key={child.label}
                                  href={child.href}
                                  className="header-dropdown-item"
                                  {...extraProps}
                                  style={{
                                    display: 'block',
                                    padding: '10px 16px',
                                    fontWeight: 500,
                                    fontSize: 16,
                                    color: 'var(--ink2)',
                                    textDecoration: 'none',
                                    transition: 'color .15s, background .15s, transform .2s cubic-bezier(.34,1.4,.5,1)',
                                    whiteSpace: 'nowrap',
                                    animationDelay: `${ci * 0.04}s`,
                                  }}
                                  onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                                    e.currentTarget.style.color = 'var(--ink)';
                                    e.currentTarget.style.background = 'var(--soft)';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                  }}
                                  onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                                    e.currentTarget.style.color = 'var(--ink2)';
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                  }}
                                >
                                  {child.label}
                                  {isExternal && (
                                    <span style={{ marginLeft: 4, fontSize: 16, opacity: 0.4 }}>&#x2197;</span>
                                  )}
                                </Comp>
                              );
                            })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </nav>

        {/* Right side — CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a
            href="/unionsystems-brochure.pdf"
            download="유니온시스템즈 - 회사소개서.pdf"
            className="header-download"
            style={{
              padding: '11px 24px',
              background: 'var(--charcoal)',
              border: 'none',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'border-color .15s, background .15s',
            }}
          >
            소개서다운
          </a>
          <Link
            href="/contact"
            style={{
              padding: '11px 24px',
              background: 'var(--accent)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'opacity .15s',
            }}
          >
            도입문의
          </Link>

          {/* Hamburger */}
          <button
            className="header-hamburger"
            onClick={() => setMobileOpen(true)}
            aria-label="메뉴 열기"
            style={{
              display: 'none',
              width: 36,
              height: 36,
              border: '1px solid var(--line)',
              background: 'transparent',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1001,
            background: 'rgba(0,0,0,.6)',
          }}
        />
      )}

      {/* Mobile slide-in panel — dark theme */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 1002,
          height: '100%',
          width: 300,
          maxWidth: '85vw',
          background: 'var(--charcoal)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .3s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Mobile header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,.08)',
        }}>
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <img src="/images/logo_w.png" alt="UNION SYSTEMS" style={{ height: 18 }} />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="메뉴 닫기"
            style={{
              width: 36,
              height: 36,
              border: '1px solid rgba(255,255,255,.12)',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Mobile nav links */}
        <nav style={{ padding: 20, flex: 1, overflowY: 'auto' }}>
          {mainNavItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = mobileExpanded === item.label;

            return (
              <div key={item.label}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255,255,255,.06)',
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'block',
                      padding: '14px 8px',
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                      fontWeight: 500,
                      fontSize: 15,
                      letterSpacing: '.04em',
                      color: 'rgba(255,255,255,.7)',
                      textDecoration: 'none',
                      flex: 1,
                    }}
                  >
                    [ {item.label} ]
                  </Link>
                  {hasChildren && (
                    <button
                      onClick={() =>
                        setMobileExpanded(isExpanded ? null : item.label)
                      }
                      style={{
                        padding: '14px 8px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'rgba(255,255,255,.4)',
                      }}
                      aria-label={`${item.label} 하위메뉴 ${isExpanded ? '접기' : '펼치기'}`}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        style={{
                          transition: 'transform .2s',
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                        }}
                      >
                        <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>

                {hasChildren && isExpanded && (
                  <div style={{ paddingLeft: 20, paddingBottom: 4 }}>
                    {item.children!.map((child) => {
                      const hasSubChildren = child.children && child.children.length > 0;

                      if (hasSubChildren) {
                        return (
                          <div key={child.label}>
                            <div
                              style={{
                                padding: '8px 8px 4px',
                                fontWeight: 700,
                                fontSize: 12,
                                color: 'rgba(255,255,255,.4)',
                                letterSpacing: '.06em',
                                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                                textTransform: 'uppercase',
                              }}
                            >
                              {child.label}
                            </div>
                            {child.children!.map((sub) => {
                              const isExternal = sub.href.startsWith('http');
                              if (isExternal) {
                                return (
                                  <a
                                    key={sub.label}
                                    href={sub.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setMobileOpen(false)}
                                    style={{
                                      display: 'block',
                                      padding: '8px 8px 8px 16px',
                                      fontWeight: 500,
                                      fontSize: 14,
                                      color: 'rgba(255,255,255,.45)',
                                      textDecoration: 'none',
                                    }}
                                  >
                                    {sub.label} &#x2197;
                                  </a>
                                );
                              }
                              return (
                                <Link
                                  key={sub.label}
                                  href={sub.href}
                                  onClick={() => setMobileOpen(false)}
                                  style={{
                                    display: 'block',
                                    padding: '8px 8px 8px 16px',
                                    fontWeight: 500,
                                    fontSize: 14,
                                    color: 'rgba(255,255,255,.45)',
                                    textDecoration: 'none',
                                  }}
                                >
                                  {sub.label}
                                </Link>
                              );
                            })}
                          </div>
                        );
                      }

                      const isExternal = child.href.startsWith('http');
                      if (isExternal) {
                        return (
                          <a
                            key={child.label}
                            href={child.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMobileOpen(false)}
                            style={{
                              display: 'block',
                              padding: '10px 8px',
                              fontWeight: 500,
                              fontSize: 15,
                              color: 'rgba(255,255,255,.45)',
                              textDecoration: 'none',
                            }}
                          >
                            {child.label} &#x2197;
                          </a>
                        );
                      }
                      return (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          style={{
                            display: 'block',
                            padding: '10px 8px',
                            fontWeight: 500,
                            fontSize: 15,
                            color: 'rgba(255,255,255,.45)',
                            textDecoration: 'none',
                          }}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            style={{
              display: 'block',
              marginTop: 24,
              padding: '14px 0',
              background: 'var(--accent)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 16,
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            도입 문의
          </Link>
        </nav>
      </div>

      {/* Responsive styles + animations */}
      <style jsx global>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: translateY(6px) scale(.92); }
          60% { transform: translateY(-2px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes subSlideIn {
          from { opacity: 0; transform: translateX(-6px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .header-dropdown {
          animation: dropIn .25s cubic-bezier(.34,1.4,.5,1) both;
          border: none !important;
          border-radius: 12px;
          box-shadow: 0 12px 40px rgba(17,18,20,.10), 0 0 0 1px rgba(0,0,0,.04) !important;
          backdrop-filter: blur(16px) saturate(1.3);
          -webkit-backdrop-filter: blur(16px) saturate(1.3);
          background: rgba(255,255,255,.92) !important;
        }
        .header-dropdown-item {
          opacity: 0;
          animation: popIn .3s cubic-bezier(.34,1.4,.5,1) both;
          border-radius: 6px;
          margin: 2px 6px;
        }
        .header-sub-panel {
          animation: subSlideIn .2s cubic-bezier(.34,1.4,.5,1) both;
          border: none !important;
          border-radius: 12px;
          box-shadow: 0 12px 40px rgba(17,18,20,.10), 0 0 0 1px rgba(0,0,0,.04) !important;
          backdrop-filter: blur(16px) saturate(1.3);
          -webkit-backdrop-filter: blur(16px) saturate(1.3);
          background: rgba(255,255,255,.92) !important;
        }
        .header-nav-link {
          position: relative;
          transition: color .2s, transform .2s cubic-bezier(.34,1.4,.5,1);
        }
        .header-nav-link:hover {
          transform: translateY(-2px);
        }
        .header-nav-link::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 18px;
          right: 18px;
          height: 2px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform .25s cubic-bezier(.34,1.4,.5,1);
        }
        .header-nav-link:hover::after,
        .header-nav-link.nav-active::after {
          transform: scaleX(1);
        }
        @media (max-width: 960px) {
          .header-nav { display: none !important; }
          .header-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
