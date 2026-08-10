'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { E, useEditableContent, EDITABLE_STYLES } from '@/lib/editable';

const COMPANY_TABS = [
  { label: '기업소개', href: '/company' },
  { label: '주요연혁', href: '/company/history' },
  { label: '오시는 길', href: '/company/location' },
];

interface Milestone {
  year: string;
  yearBg: string;
  title: string;
  events: string[];
  accent?: boolean;
}

const MILESTONES: Milestone[] = [
  {
    year: '2026', yearBg: '26', title: '데이터 사업 확장',
    events: ['DATAWARE™ 공식 총판 계약 체결', '데이터 검진 프로모션 런칭', 'Copilot Business 공인 파트너 선정', '홈페이지 2차 리뉴얼'],
    accent: true,
  },
  {
    year: '2025', yearBg: '25', title: '통합 서비스 강화',
    events: ['유니온 케어팩(통합 유지보수) 서비스 오픈', 'DA# 조달 캠페인 진행', 'AutoCAD Toolset 맞춤 제안 서비스 시작'],
  },
  {
    year: '2024', yearBg: '24', title: '포트폴리오 고도화',
    events: ['Microsoft 365 Copilot 도입 컨설팅 시작', 'AhnLab XDR 통합관제 파트너', 'DA# Architecture 신규 버전 대응'],
  },
  {
    year: '2023', yearBg: '23', title: '고객사 4,000 돌파',
    events: ['누적 고객사 4,000개 돌파', '공공기관 조달 사업 확대', 'ESTsecurity AI 기반 EDR 파트너'],
  },
  {
    year: '2022', yearBg: '22', title: '새로운 도약',
    events: ['유니온시스템즈 사명 변경', 'DA#/DQ 총판 계약 체결', 'NetClient 총판 계약 체결', '홈페이지 리뉴얼', '제2회 데이터품질관리 세미나 개최'],
  },
  {
    year: '2021', yearBg: '21', title: '고객관리 체계화',
    events: ['CRM/Redmine 기반 고객관리 시스템 구축', '엔코아 DA# 총판 협약 체결'],
  },
  {
    year: '2020', yearBg: '20', title: '데이터 사업 확대',
    events: ['앤코아 DA# 공인총판 계약', '닥터소프트 NetClient 공인총판 계약'],
  },
  {
    year: '2019', yearBg: '19', title: '보안 전문화',
    events: ['AhnLab 공인 파트너 선정', 'SW산업보호 유공 표창 수상'],
  },
  {
    year: '2018', yearBg: '18', title: '보안·클라우드',
    events: ['ESTsecurity 파트너 계약', 'Microsoft CSP 파트너', 'CRM 솔루션 도입'],
  },
  {
    year: '2017', yearBg: '17', title: '해외 진출',
    events: ['베트남 현지법인 설립', 'Netrix 솔루션 런칭'],
  },
  {
    year: '2016', yearBg: '16', title: '보안 포트폴리오',
    events: ['OfficeKeeper 리셀러 계약', 'Adobe 리셀러 계약'],
  },
  {
    year: '2015', yearBg: '15', title: '파트너십 확장',
    events: ['지란지교 파트너 계약', '기업 보안 솔루션 유통 확대'],
  },
  {
    year: '2014', yearBg: '14', title: '설계·보안 진출',
    events: ['Autodesk 리셀러 계약', 'AhnLab 파트너 계약'],
  },
  {
    year: '2013', yearBg: '13', title: '법인 전환',
    events: ['주식회사 유니온소프트 법인 설립', 'ESTsoft Gold 파트너 선정', 'DLP 솔루션 파트너 계약'],
  },
  {
    year: '2012', yearBg: '12', title: '성장',
    events: ['사업 확장 · 고객사 100개 돌파'],
  },
  {
    year: '2011', yearBg: '11', title: '초기 파트너십',
    events: ['SoftBank 파트너 계약', 'Dau Data · Dimoa · Doctor Software 파트너 계약'],
  },
  {
    year: '2010', yearBg: '10', title: '창립',
    events: ['유니온소프트 설립', 'ESTsoft(알툴즈) 리셀러 사업 시작'],
    accent: true,
  },
];

const DEFAULT_HERO = { eyebrow: 'HISTORY', title: '주요연혁', desc: '10여년간 축적한 기술 노하우로 200여개 이상의 기업들이\n유니온시스템즈와 함께하고 있습니다.' };
const DEFAULT_ITEMS = MILESTONES.map(m => ({ year: m.year, title: m.title, events: m.events }));
const DEFAULT_CTA = { eyebrow: 'SINCE 2010', title: '앞으로도 함께하겠습니다', desc: '유니온시스템즈와 함께 IT 환경을 혁신하세요.', btn: '도입문의 하기 →' };

const DEFAULTS = {
  history_hero: DEFAULT_HERO,
  history_items: DEFAULT_ITEMS,
  history_cta: DEFAULT_CTA,
} as const;

export default function HistoryPageClient({ ssrContent }: { ssrContent: Record<string, string> }) {
  const pageRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [content, editMode] = useEditableContent(DEFAULTS, ssrContent);

  useEffect(() => {
    const els = pageRef.current?.querySelectorAll('.tl-card');
    if (!els) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('tl-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Also reveal generic .reveal */
  useEffect(() => {
    const els = pageRef.current?.querySelectorAll('.reveal');
    if (!els) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={pageRef} style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ═══ Hero ═══ */}
      <section style={{
        position: 'relative', background: 'var(--charcoal)',
        display: 'flex', alignItems: 'flex-end', overflow: 'hidden',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(/images/crawl/unionsystems/customer_header_img-01_5.png)`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.1,
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 80%, rgba(148,53,67,.07) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {/* Blob decorations */}
        <div className="blob blob-accent" aria-hidden="true" style={{ width: 340, height: 340, right: '8%', top: '10%' }} />
        <div className="blob blob-wine" aria-hidden="true" style={{ width: 240, height: 240, left: '5%', bottom: '8%', animationDelay: '8s' }} />
        <div aria-hidden="true" style={{
          position: 'absolute', width: 16, height: 16, left: '22%', top: '30%',
          border: '1.5px solid rgba(255,255,255,.08)', transform: 'rotate(45deg)',
          animation: 'geoFloat2 16s ease-in-out infinite', pointerEvents: 'none',
        }} />

        {/* Huge background year */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '-2%', bottom: '-15%',
          fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic',
          fontSize: 'clamp(200px, 30vw, 480px)', fontWeight: 300,
          color: 'rgba(255,255,255,.02)', lineHeight: .8, pointerEvents: 'none',
        }}>
          2010
        </div>

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 640, padding: '120px 0 40px' }}>
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,.4)', margin: '0 0 16px' }}>
              <E id="history_hero.eyebrow" editMode={editMode}>{content.history_hero.eyebrow}</E>
            </p>
            <h1 style={{
              fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
              lineHeight: .92, letterSpacing: '-.045em', color: '#fff', margin: '0 0 16px',
            }}>
              <E id="history_hero.title" editMode={editMode}>{content.history_hero.title}</E>
            </h1>
            <p style={{
              fontWeight: 400, fontSize: 18, lineHeight: 1.7,
              color: 'rgba(255,255,255,.5)', maxWidth: 640, margin: 0,
            }}>
              <E id="history_hero.desc" editMode={editMode}>{content.history_hero.desc}</E>
            </p>

            <div style={{ display: 'flex', gap: 4, marginTop: 32 }}>
              {COMPANY_TABS.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link key={tab.href} href={tab.href} style={{
                    padding: '10px 20px',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                    fontSize: 18, fontWeight: 500, letterSpacing: '.06em',
                    color: isActive ? '#fff' : 'rgba(255,255,255,.35)',
                    textDecoration: 'none',
                    background: isActive ? 'rgba(255,255,255,.1)' : 'transparent',
                    border: isActive ? '1px solid rgba(255,255,255,.15)' : '1px solid transparent',
                    transition: 'all .2s',
                  }}>
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Timeline — center-line, alternating left/right ═══ */}
      <section style={{ padding: 'clamp(72px, 10vw, 128px) 0', position: 'relative', overflow: 'hidden' }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="blob blob-accent" aria-hidden="true" style={{ width: 320, height: 320, left: '2%', top: '20%', animationDelay: '5s' }} />
        {/* Permanent center line */}
        <div className="tl-center-line" aria-hidden="true" style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: 2,
          background: 'linear-gradient(to bottom, var(--line), var(--accent), var(--line))',
          opacity: .25,
          transform: 'translateX(-50%)',
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 4vw, 52px)', position: 'relative' }}>
          {MILESTONES.map((m, idx) => {
            const isLeft = idx % 2 === 0;
            // yearBg(장식용 큰 숫자)는 실제 표시 연도에서 자동 파생 → year 편집 시 항상 동기화
            const displayYear = String(content.history_items[idx]?.year ?? m.year);
            const yearBg = displayYear.slice(-2);

            return (
              <div
                key={m.year}
                className={`tl-card ${isLeft ? 'tl-side-left' : 'tl-side-right'}`}
                style={{
                  display: 'flex',
                  justifyContent: isLeft ? 'flex-start' : 'flex-end',
                  position: 'relative',
                  marginBottom: idx < MILESTONES.length - 1 ? 20 : 0,
                  /* animation start state set in CSS */
                }}
              >
                {/* ── Dot on center line ── */}
                <div className="tl-dot" style={{
                  position: 'absolute',
                  left: '50%',
                  top: 32,
                  transform: 'translateX(-50%)',
                  zIndex: 3,
                }}>
                  <div style={{
                    width: m.accent ? 16 : 10,
                    height: m.accent ? 16 : 10,
                    background: m.accent ? 'var(--accent)' : 'var(--charcoal)',
                    border: m.accent ? '3px solid rgba(245,51,63,.15)' : '2px solid var(--line)',
                    boxShadow: m.accent ? '0 0 20px rgba(245,51,63,.3)' : 'none',
                    transition: 'transform .3s',
                  }} />
                </div>

                {/* ── Connector line to card ── */}
                <div className="tl-connector" style={{
                  position: 'absolute',
                  top: 38,
                  height: 1,
                  width: 40,
                  background: m.accent ? 'var(--accent)' : 'var(--line)',
                  opacity: m.accent ? .4 : .3,
                  ...(isLeft
                    ? { left: 'calc(50% + 8px)' }
                    : { right: 'calc(50% + 8px)' }
                  ),
                }} />

                {/* ── Card ── */}
                <div
                  className="tl-card-inner"
                  style={{
                    width: 'calc(50% - 60px)',
                    position: 'relative',
                    padding: '28px 32px',
                    background: m.accent ? 'var(--charcoal)' : 'var(--surface)',
                    border: `1px solid ${m.accent ? 'rgba(255,255,255,.08)' : 'var(--line)'}`,
                    overflow: 'hidden',
                    transition: 'transform .3s cubic-bezier(.16,.84,.3,1), box-shadow .3s',
                  }}
                >
                  {/* Background year watermark */}
                  <div aria-hidden="true" style={{
                    position: 'absolute',
                    right: isLeft ? -8 : 'auto',
                    left: isLeft ? 'auto' : -8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontFamily: "'Newsreader', Georgia, serif",
                    fontStyle: 'italic',
                    fontSize: 120,
                    fontWeight: 300,
                    lineHeight: 1,
                    color: m.accent ? 'rgba(245,51,63,.06)' : 'rgba(20,18,16,.04)',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}>
                    {yearBg}
                  </div>

                  {/* Content */}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Year + title row */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14 }}>
                      <span style={{
                        fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic',
                        fontSize: 32, fontWeight: 400, lineHeight: 1,
                        color: m.accent ? 'var(--accent)' : 'var(--ink)',
                      }}>
                        <E id={`history_items.${idx}.year`} editMode={editMode}>{content.history_items[idx]?.year ?? m.year}</E>
                      </span>
                      <span style={{
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                        fontSize: 18, fontWeight: 500, letterSpacing: '.1em',
                        color: m.accent ? 'rgba(255,255,255,.35)' : 'var(--ink2)',
                        textTransform: 'uppercase',
                      }}>
                        <E id={`history_items.${idx}.title`} editMode={editMode}>{content.history_items[idx]?.title ?? m.title}</E>
                      </span>
                    </div>

                    {/* Events */}
                    {(content.history_items[idx]?.events ?? m.events).map((evt: string, ei: number) => (
                      <div key={ei} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '6px 0',
                      }}>
                        <span style={{
                          width: 16, height: 1, flexShrink: 0,
                          background: m.accent ? 'var(--accent)' : 'var(--line)',
                          opacity: m.accent ? .5 : 1,
                        }} />
                        <span style={{
                          fontSize: 18, lineHeight: 1.5,
                          color: m.accent ? 'rgba(255,255,255,.7)' : 'var(--ink2)',
                          fontWeight: ei === 0 ? 600 : 400,
                        }}>
                          <E id={`history_items.${idx}.events.${ei}`} editMode={editMode}>{evt}</E>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ Bottom CTA strip ═══ */}
      <section style={{
        padding: 'clamp(80px, 6vw, 72px) 0',
        background: 'var(--charcoal)', position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(148,53,67,.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <p className="eyebrow reveal" style={{ color: 'rgba(255,255,255,.4)', margin: '0 0 14px' }}>
            <E id="history_cta.eyebrow" editMode={editMode}>{content.history_cta.eyebrow}</E>
          </p>
          <h2 className="reveal" style={{
            fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
            lineHeight: 1.1, color: '#fff', margin: '0 0 12px', letterSpacing: '-.04em',
          }}>
            <E id="history_cta.title" editMode={editMode}>{content.history_cta.title}</E>
          </h2>
          <p className="reveal" style={{ fontSize: 18, color: 'rgba(255,255,255,.5)', margin: '0 0 32px' }}>
            <E id="history_cta.desc" editMode={editMode}>{content.history_cta.desc}</E>
          </p>
          <Link href="/contact" className="reveal btn" style={{
            display: 'inline-block', padding: '16px 40px',
            background: 'var(--accent)', color: '#fff',
            fontWeight: 700, fontSize: 18, textDecoration: 'none',
          }}>
            <E id="history_cta.btn" editMode={editMode}>{content.history_cta.btn}</E>
          </Link>
        </div>
      </section>

      {editMode && <style>{EDITABLE_STYLES}</style>}
    </div>
  );
}
