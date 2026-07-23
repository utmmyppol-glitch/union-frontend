'use client';

import React, { useState, useEffect } from 'react';


const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SERIF = "'Newsreader', Georgia, serif";
const CRAWL = '/images/crawl/unionsystems/';
const UP = '/images/uploads/';

type FilterTab = 'all' | 'active' | 'ended';

interface EventItem {
  id: number;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'ended';
  img: string;
}

const EVENTS: EventItem[] = [
  { id: 11, category: '프로모션', title: 'DATAWARE™ 공식 총판 계약 체결 기념 데이터 검진 프로모션', startDate: '2026.07.15', endDate: '2026.09.30', status: 'active', img: `${UP}2026/07/new특성이미지-1.png` },
  { id: 1, category: '프로모션', title: '5월 한정 어도비 기업용 라이선스 역대급 특가 프로모션', startDate: '2026.05.11', endDate: '2026.05.29', status: 'ended', img: `${UP}%ED%94%84%EB%A1%9C%EB%AA%A8%EC%85%98_%ED%8A%B9%EC%84%B1%EC%9D%B4%EB%AF%B8%EC%A7%_76.png` },
  { id: 2, category: '이벤트', title: '2026 오토캐드 설문 & 상담 이벤트', startDate: '2026.03.03', endDate: '2026.05.29', status: 'ended', img: `${UP}%ED%94%84%EB%A1%9C%EB%AA%A8%EC%85%98_%ED%8A%B9%EC%84%B1%EC%9D%B4%EB%AF%B8%EC%A7%_28.png` },
  { id: 3, category: '프로모션', title: 'Copilot Business 신제품 출시 기념 프로모션', startDate: '2026.01.14', endDate: '2026.06.30', status: 'ended', img: `${CRAWL}2025-%ED%94%84%EB%A1%9C%EB%AA%A8%EC%85%98-001-2_29.png` },
  { id: 4, category: '프로모션', title: '유니온 케어팩 오픈! 백신 구매 프로모션', startDate: '2025.11.17', endDate: '2025.12.31', status: 'ended', img: `${CRAWL}2025%EC%9C%A0%EB%8B%88%EC%98%A8-%EB%B0%B1%EC%8B%A0-%ED%94%84%EB%A1%9C%EB%AA%A8%E_77.png` },
  { id: 5, category: '캠페인', title: '2025 DA# 조달 캠페인', startDate: '2025.10.03', endDate: '2025.12.31', status: 'ended', img: `${CRAWL}2025-%EC%97%AC%EB%A6%84%ED%94%84%EB%A1%9C%EB%AA%A8%EC%85%98-DA_7.png` },
  { id: 6, category: '이벤트', title: 'DA-드리는 DA# 여름 할인 이벤트', startDate: '2025.07.01', endDate: '2025.08.29', status: 'ended', img: `${UP}%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EB%B0%B0%EB%84%88-966X339-002_32.png` },
  { id: 7, category: '이벤트', title: '유니온시스템즈 x AutoCAD 여름 프로모션: 오토캐드 Toolset 맞춤 제안', startDate: '2025.06.26', endDate: '2025.08.29', status: 'ended', img: `${UP}2025/06/2025%EC%98%A4%ED%86%A0%EC%BA%90%EB%93%9C%ED%94%84%EB%A1%9C%EB%AA%A8%EC%85%98-002.png` },
  { id: 8, category: '프로모션', title: 'Microsoft 365 무상 제공 프로모션', startDate: '2025.06.02', endDate: '2025.06.27', status: 'ended', img: `${UP}2025/03/2025-MS%ED%94%84%EB%A1%9C%EB%AA%A8%EC%85%98-001.png` },
  { id: 9, category: '프로모션', title: '2025 을사년 맞이 BBAM! 프로모션', startDate: '2025.02.03', endDate: '2025.03.31', status: 'ended', img: `${UP}2025/02/%ED%94%84%EB%A1%9C%EB%AA%A8%EC%85%98_%ED%8A%B9%EC%84%B1%EC%9D%B4%EB%AF%B8%EC%A7%80-001.png` },
  { id: 10, category: '이벤트', title: '홈페이지 리뉴얼 홍랑이를 잡아라 이벤트', startDate: '2022.07.13', endDate: '2022.07.18', status: 'ended', img: `${UP}2022/07/%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EB%B0%B0%EB%84%882-966X339-004.png` },
];

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'active', label: '진행중' },
  { key: 'ended', label: '종료' },
];

export default function EventsPage() {
  const [filter, setFilter] = useState<FilterTab>('all');

  const filtered = EVENTS.filter((e) => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const activeCount = EVENTS.filter(e => e.status === 'active').length;

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filtered]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ═══ Hero ═══ */}
      <section style={{
        position: 'relative', background: 'var(--charcoal)', overflow: 'hidden',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 20% 70%, rgba(148,53,67,.07) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {/* Blobs */}
        <div className="blob blob-accent" aria-hidden="true" style={{ width: 350, height: 350, right: '5%', top: '10%' }} />
        <div className="blob blob-graphite" aria-hidden="true" style={{ width: 250, height: 250, left: '10%', bottom: '10%', animationDelay: '5s' }} />

        <div aria-hidden="true" style={{
          position: 'absolute', right: '-3%', bottom: '-10%',
          fontFamily: SERIF, fontStyle: 'italic',
          fontSize: 'clamp(140px, 22vw, 320px)', fontWeight: 300,
          color: 'rgba(255,255,255,.02)', lineHeight: .8, pointerEvents: 'none',
        }}>Event</div>

        <div className="wrap" style={{ position: 'relative', zIndex: 1, padding: '120px clamp(20px,4vw,52px) 64px' }}>
          <p style={{ fontFamily: MONO, fontWeight: 500, fontSize: 18, letterSpacing: '.14em', color: 'var(--accent)', margin: '0 0 12px' }}>EVENTS</p>
          <h1 style={{ fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)', lineHeight: 1.05, letterSpacing: '-.04em', color: '#fff', margin: '0 0 12px' }}>
            이벤트 소식을 만나보세요.
          </h1>
          {activeCount > 0 && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 16px',
              border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.03)',
              marginTop: 8,
            }}>
              <span style={{ width: 8, height: 8, background: 'var(--accent)', boxShadow: '0 0 8px rgba(245,51,63,.4)', animation: 'evtPulse 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,.5)' }}>{activeCount}개 진행중</span>
            </div>
          )}
        </div>
      </section>

      {/* ═══ Filter ═══ */}
      <section style={{ borderBottom: '1px solid var(--line)', background: 'var(--bg)' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="wrap" style={{ display: 'flex', gap: 0 }}>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '14px 28px', fontFamily: MONO, fontSize: 18, fontWeight: 600,
                color: filter === tab.key ? 'var(--ink)' : 'var(--ink2)',
                background: 'transparent', border: 'none',
                borderBottom: filter === tab.key ? '3px solid var(--accent)' : '3px solid transparent',
                cursor: 'pointer', transition: 'all .2s', marginBottom: -1,
              }}
            >
              {tab.label}
              {tab.key === 'active' && activeCount > 0 && (
                <span style={{ marginLeft: 6, padding: '2px 7px', background: 'var(--accent)', color: '#fff', fontSize: 18, fontWeight: 700 }}>{activeCount}</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ═══ Featured event (진행중 첫 번째) ═══ */}
      {(() => {
        const featured = filtered.find(e => e.status === 'active') || filtered[0];
        const rest = filtered.filter(e => e !== featured);
        if (!featured) return (
          <section style={{ padding: 'clamp(56px, 8vw, 96px) 0' }}>
            <div className="wrap" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--ink2)', fontSize: 16 }}>해당하는 이벤트가 없습니다.</div>
          </section>
        );
        return (
          <>
            {/* Featured */}
            <section style={{ padding: 'clamp(40px, 6vw, 72px) 0 0', position: 'relative', overflow: 'hidden' }}>
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .12, pointerEvents: 'none' }} />
              <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
                <div
                  className="reveal tilt-card evt-card evt-featured"                  style={{
                    display: 'grid', gridTemplateColumns: '1.2fr 1fr',
                    border: '1px solid var(--line)', overflow: 'hidden',
                    background: 'var(--surface)', cursor: 'pointer',
                  }}
                >
                  <div style={{ position: 'relative', overflow: 'hidden', minHeight: 320 }}>
                    <img src={featured.img} alt={featured.title} className="evt-img" style={{
                      width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                      transition: 'transform .5s',
                    }} onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = 'none';
                      el.parentElement!.style.background = 'var(--charcoal)';
                    }} />
                    <span style={{
                      position: 'absolute', top: 16, left: 16, padding: '5px 14px',
                      fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: '.06em',
                      ...(featured.status === 'active'
                        ? { background: 'var(--accent)', color: '#fff' }
                        : { background: 'var(--graphite)', color: 'rgba(255,255,255,.6)' }),
                    }}>
                      {featured.status === 'active' ? 'LIVE' : '종료'}
                    </span>
                  </div>
                  <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{
                      fontFamily: MONO, fontSize: 12, fontWeight: 600, letterSpacing: '.12em',
                      color: 'var(--accent)', marginBottom: 12,
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <span style={{ width: 20, height: 1.5, background: 'var(--accent)' }} />
                      {featured.category.toUpperCase()}
                    </div>
                    <h2 className="evt-title" style={{
                      fontWeight: 800, fontSize: 'clamp(22px, 2.5vw, 30px)',
                      lineHeight: 1.35, letterSpacing: '-0.02em',
                      color: 'var(--ink)', margin: '0 0 16px',
                      transition: 'color .2s',
                    }}>{featured.title}</h2>
                    <p style={{
                      fontFamily: MONO, fontSize: 13, color: 'var(--ink2)', margin: '0 0 24px',
                      letterSpacing: '.02em',
                    }}>{featured.startDate} – {featured.endDate}</p>
                    <div>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '12px 24px', background: 'var(--accent)', color: '#fff',
                        fontWeight: 700, fontSize: 14, transition: 'transform .2s, box-shadow .2s',
                      }}>
                        자세히 보기 <span>&rarr;</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ═══ Remaining cards ═══ */}
            {rest.length > 0 && (
              <section style={{ padding: 'clamp(40px, 6vw, 64px) 0', position: 'relative', overflow: 'hidden' }}>
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .12, pointerEvents: 'none' }} />
                <div className="blob blob-accent" aria-hidden="true" style={{ width: 300, height: 300, right: '5%', top: '20%', animationDelay: '3s' }} />

                <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28,
                  }}>
                    <span style={{
                      fontFamily: MONO, fontSize: 12, fontWeight: 600, letterSpacing: '.1em',
                      color: 'var(--ink2)',
                    }}>ALL EVENTS</span>
                    <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
                    <span style={{
                      fontFamily: SERIF, fontStyle: 'italic', fontSize: 15, color: 'var(--ink2)',
                    }}>{rest.length}건</span>
                  </div>

                  <div className="evt-grid" style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
                  }}>
                    {rest.map((evt, idx) => (
                      <div
                        key={evt.id}
                        className="reveal tilt-card evt-card"                        style={{
                          border: '1px solid var(--line)', overflow: 'hidden',
                          background: 'var(--surface)', cursor: 'pointer',
                          transitionDelay: `${idx * 0.06}s`,
                        }}
                      >
                        <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/9' }}>
                          <img src={evt.img} alt={evt.title} className="evt-img" style={{
                            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                            transition: 'transform .5s',
                          }} onError={(e) => {
                            const el = e.target as HTMLImageElement;
                            el.style.display = 'none';
                            el.parentElement!.style.background = 'var(--charcoal)';
                            el.parentElement!.innerHTML += `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><span style="font-family:Newsreader,serif;font-style:italic;font-size:40px;color:rgba(255,255,255,.06)">Event</span></div>`;
                          }} />
                          <span style={{
                            position: 'absolute', top: 10, left: 10, padding: '4px 10px',
                            fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: '.06em',
                            ...(evt.status === 'active'
                              ? { background: 'var(--accent)', color: '#fff' }
                              : { background: 'var(--graphite)', color: 'rgba(255,255,255,.6)' }),
                          }}>
                            {evt.status === 'active' ? 'LIVE' : '종료'}
                          </span>
                        </div>

                        <div style={{ padding: '16px 18px' }}>
                          <div style={{
                            fontFamily: MONO, fontSize: 12, color: 'var(--ink2)',
                            letterSpacing: '.06em', marginBottom: 6,
                          }}>{evt.category}</div>
                          <h3 className="evt-title" style={{
                            fontWeight: 700, fontSize: 16, color: 'var(--ink)',
                            margin: '0 0 10px', lineHeight: 1.45, transition: 'color .2s',
                          }}>{evt.title}</h3>
                          <p style={{
                            fontFamily: MONO, fontSize: 12, color: 'var(--ink2)', margin: 0,
                            letterSpacing: '.02em',
                          }}>{evt.startDate} – {evt.endDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        );
      })()}

      {/* ═══ CTA ═══ */}
      <section style={{
        padding: 'clamp(48px, 7vw, 80px) 0',
        background: 'var(--charcoal)', position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', right: '8%', top: '50%', transform: 'translateY(-50%)',
          fontFamily: SERIF, fontStyle: 'italic',
          fontSize: 'clamp(100px, 16vw, 200px)', fontWeight: 300,
          color: 'rgba(255,255,255,.02)', lineHeight: .8, pointerEvents: 'none',
        }}>News</div>
        <div className="wrap" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <p style={{
              fontFamily: MONO, fontSize: 12, fontWeight: 600, letterSpacing: '.12em',
              color: 'var(--accent)', margin: '0 0 10px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ width: 20, height: 1.5, background: 'var(--accent)' }} />
              STAY UPDATED
            </p>
            <h3 style={{
              fontWeight: 800, fontSize: 'clamp(20px, 2.5vw, 28px)',
              color: '#fff', margin: 0, letterSpacing: '-0.02em',
            }}>
              새로운 이벤트와 프로모션 소식을 놓치지 마세요
            </h3>
          </div>
          <a href="/contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '16px 32px', background: 'var(--accent)', color: '#fff',
            fontWeight: 700, fontSize: 15, textDecoration: 'none',
            transition: 'transform .2s, box-shadow .2s',
            boxShadow: '0 4px 20px -4px rgba(245,51,63,.35)',
          }}>
            도입 문의하기 <span>&rarr;</span>
          </a>
        </div>
      </section>

      <style>{`
        @keyframes evtPulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
        .evt-card:hover .evt-img { transform: scale(1.04); }
        .evt-card:hover .evt-title { color: var(--accent) !important; }
        @media (max-width: 920px) {
          .evt-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .evt-featured { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) { .evt-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
