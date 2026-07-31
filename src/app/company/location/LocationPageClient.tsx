'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE } from '@/lib/constants';
import { E, safeParse, useEditMode, useEditableManifest, EDITABLE_STYLES } from '@/lib/editable';

const COMPANY_TABS = [
  { label: '기업소개', href: '/company' },
  { label: '주요연혁', href: '/company/history' },
  { label: '오시는 길', href: '/company/location' },
];

/* ── 기본값 (편집 전 fallback) ── */
const DEFAULT_HERO = { title: '오시는 길', subtitle: '서울 성수동에서 여러분을 기다리고 있습니다.' };
const DEFAULT_ADDRESS = {
  line1: '서울시 성동구 아차산로17길 49',
  line2: '1209~1210호 (성수동2가, 생각공장데시앙플렉스)',
  mapNote: '성수역 3번 출구 도보 5분',
};
const DEFAULT_CONTACT = {
  tel: SITE.tel, fax: SITE.fax,
  emailSales: SITE.emailSales, emailGeneral: SITE.emailGeneral,
  hours: '09:00 – 18:00', hoursNote: '평일 운영 · 점심 12:00–13:00 · 주말/공휴일 휴무',
};
const DEFAULT_SUBWAY = [
  { line: '2호선 성수역', desc: '3번 출구 도보 5분' },
  { line: '수인분당선 서울숲역', desc: '4번 출구 도보 10분' },
];
const DEFAULT_BUS = [
  { type: '간선버스', routes: '141, 148, 302, 421' },
  { type: '지선버스', routes: '2016, 2224, 2413' },
];
const DEFAULT_PARKING = { title: '건물 내 지하주차장', desc: '방문 시 안내데스크 문의' };
const DEFAULT_CTA = { text: '방문 전 사전 연락을 부탁드립니다.' };

export default function LocationPageClient({ ssrContent }: { ssrContent: Record<string, string> }) {
  const pageRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const editMode = useEditMode();

  // SSR에서 받은 데이터로 초기화
  const [hero, setHero] = useState(() => safeParse(ssrContent.location_hero, DEFAULT_HERO));
  const [address, setAddress] = useState(() => safeParse(ssrContent.location_address, DEFAULT_ADDRESS));
  const [contact, setContact] = useState(() => safeParse(ssrContent.location_contact, DEFAULT_CONTACT));
  const [subway, setSubway] = useState(() => safeParse(ssrContent.location_subway, DEFAULT_SUBWAY));
  const [bus, setBus] = useState(() => safeParse(ssrContent.location_bus, DEFAULT_BUS));
  const [parking, setParking] = useState(() => safeParse(ssrContent.location_parking, DEFAULT_PARKING));
  const [cta, setCta] = useState(() => safeParse(ssrContent.location_cta, DEFAULT_CTA));

  // 편집모드 매니페스트 전송 (pathname 변화마다 재전송)
  useEditableManifest(editMode);

  // postMessage 수신 (편집모드에서만)
  useEffect(() => {
    if (!editMode) return;
    const setters: Record<string, (v: unknown) => void> = {
      location_hero: setHero as (v: unknown) => void,
      location_address: setAddress as (v: unknown) => void,
      location_contact: setContact as (v: unknown) => void,
      location_subway: setSubway as (v: unknown) => void,
      location_bus: setBus as (v: unknown) => void,
      location_parking: setParking as (v: unknown) => void,
      location_cta: setCta as (v: unknown) => void,
    };
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'content-update') {
        const fn = setters[e.data.section];
        if (fn) fn(e.data.data);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [editMode]);

  // IntersectionObserver (reveal 애니메이션)
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
        position: 'relative', background: 'var(--charcoal)', overflow: 'hidden',
        display: 'flex', alignItems: 'flex-end',
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 60% 80%, rgba(148,53,67,.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div className="blob blob-accent" aria-hidden="true" style={{ width: 350, height: 350, right: '6%', top: '5%' }} />
        <div className="blob blob-wine" aria-hidden="true" style={{ width: 250, height: 250, left: '10%', bottom: '12%', animationDelay: '9s' }} />
        <div aria-hidden="true" style={{
          position: 'absolute', width: 14, height: 14, right: '25%', top: '35%',
          border: '1.5px solid rgba(255,255,255,.08)', transform: 'rotate(45deg)',
          animation: 'geoFloat1 12s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', right: '-3%', top: '8%',
          fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic',
          fontSize: 'clamp(100px, 18vw, 260px)', fontWeight: 300,
          color: 'rgba(255,255,255,.02)', lineHeight: 1, pointerEvents: 'none',
        }}>
          Location
        </div>

        <div className="wrap" style={{ position: 'relative', zIndex: 1, padding: '120px clamp(20px,4vw,52px) 40px' }}>
          <p className="eyebrow" style={{ color: 'rgba(255,255,255,.4)', margin: '0 0 16px' }}>LOCATION</p>
          <h1 style={{
            fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
            lineHeight: .92, letterSpacing: '-.045em', color: '#fff', margin: '0 0 16px',
          }}>
            <E id="location_hero.title" editMode={editMode}>{hero.title}</E>
          </h1>
          <p style={{
            fontWeight: 400, fontSize: 18, lineHeight: 1.7,
            color: 'rgba(255,255,255,.5)', maxWidth: 620, margin: 0,
          }}>
            <E id="location_hero.subtitle" editMode={editMode}>{hero.subtitle}</E>
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
      </section>

      {/* ═══ Big address strip — full width, dark ═══ */}
      <section className="reveal" style={{
        padding: 'clamp(40px, 6vw, 64px) 0',
        background: 'var(--charcoal)', borderTop: '1px solid rgba(255,255,255,.06)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 100%, rgba(148,53,67,.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="loc-address-row" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 40, flexWrap: 'wrap',
          }}>
            <div style={{ flex: '1 1 400px' }}>
              <p style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                fontSize: 18, fontWeight: 500, letterSpacing: '.14em',
                color: 'rgba(255,255,255,.3)', margin: '0 0 12px',
              }}>ADDRESS</p>
              <p style={{
                fontWeight: 700, fontSize: 'clamp(18px, 2.5vw, 26px)',
                lineHeight: 1.4, color: '#fff', margin: '0 0 8px', letterSpacing: '-.02em',
              }}>
                <E id="location_address.line1" editMode={editMode}>{address.line1}</E>
              </p>
              <p style={{
                fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,.4)', margin: 0,
              }}>
                <E id="location_address.line2" editMode={editMode}>{address.line2}</E>
              </p>
            </div>

            <div style={{ display: 'flex', gap: 32, flexShrink: 0 }}>
              <div>
                <p style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                  fontSize: 18, fontWeight: 500, letterSpacing: '.1em',
                  color: 'rgba(255,255,255,.3)', margin: '0 0 6px',
                }}>TEL</p>
                <p style={{
                  fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic',
                  fontSize: 22, fontWeight: 400, color: '#fff', margin: 0,
                }}><E id="location_contact.tel" editMode={editMode}>{contact.tel}</E></p>
              </div>
              <div>
                <p style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                  fontSize: 18, fontWeight: 500, letterSpacing: '.1em',
                  color: 'rgba(255,255,255,.3)', margin: '0 0 6px',
                }}>FAX</p>
                <p style={{
                  fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic',
                  fontSize: 22, fontWeight: 400, color: 'rgba(255,255,255,.5)', margin: 0,
                }}><E id="location_contact.fax" editMode={editMode}>{contact.fax}</E></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Map ═══ */}
      <section style={{ padding: 'clamp(80px, 7vw, 80px) 0', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />
        <div className="blob blob-graphite" aria-hidden="true" style={{ width: 280, height: 280, left: '5%', bottom: '10%', animationDelay: '3s' }} />
        <div className="wrap">
          <div className="reveal" style={{
            border: '1px solid var(--line)', overflow: 'hidden',
            position: 'relative',
          }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1582.5!2d127.056!3d37.5447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca4f3b6c1b5a7%3A0x1234567890abcdef!2z7ISc7Jq47Iuc7ISx64-Z6rWsIOyVhOywqOyCsOuhnDE36ri4IDQ5!5e0!3m2!1sko!2skr!4v1700000000000!5m2!1sko!2skr"
              width="100%" height="450"
              style={{ border: 'none', display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="유니온시스템즈 오시는 길"
            />
            <div style={{
              padding: '14px 20px', background: 'var(--surface)',
              borderTop: '1px solid var(--line)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 10,
            }}>
              <span style={{ fontSize: 14, color: 'var(--ink2)' }}>
                <E id="location_address.mapNote" editMode={editMode}>{address.mapNote}</E>
              </span>
              <div style={{ display: 'flex', gap: 16 }}>
                <a href="https://map.kakao.com/link/to/유니온시스템즈,37.5447,127.0566" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink2)', textDecoration: 'none' }}>카카오맵 →</a>
                <a href="https://map.naver.com/p/search/서울시 성동구 아차산로17길 49" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink2)', textDecoration: 'none' }}>네이버지도 →</a>
                <a href="https://www.google.com/maps/search/서울시+성동구+아차산로17길+49" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none' }}>구글맵 →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Transportation — 3 cards ═══ */}
      <section style={{ padding: '0 0 clamp(48px, 7vw, 80px)', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="wrap">
          <div className="reveal" style={{ marginBottom: 36 }}>
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>TRANSPORTATION</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', margin: 0,
            }}>
              교통 안내
            </h2>
          </div>

          <div className="loc-transport" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
          }}>
            {/* Subway */}
            <div className="reveal loc-t-card" style={{
              border: '1px solid var(--line)', background: 'var(--surface)',
              padding: 28, position: 'relative', overflow: 'hidden',
              transition: 'transform .25s cubic-bezier(.16,.84,.3,1), box-shadow .25s',
            }}>
              <div aria-hidden="true" style={{
                position: 'absolute', right: -10, bottom: -20,
                fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic',
                fontSize: 120, fontWeight: 300, color: 'rgba(51,162,61,.06)',
                lineHeight: 1, pointerEvents: 'none',
              }}>2</div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{
                    width: 28, height: 28, background: '#33A23D',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                    fontSize: 18, fontWeight: 700, color: '#fff',
                  }}>2</span>
                  <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink)' }}>지하철</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {subway.map((item: { line: string; desc: string }, idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ width: 16, height: 1, background: idx === 0 ? '#33A23D' : '#F5A623', flexShrink: 0, marginTop: 10 }} />
                      <div>
                        <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', margin: '0 0 2px' }}>
                          <E id={`location_subway.${idx}.line`} editMode={editMode}>{item.line}</E>
                        </p>
                        <p style={{
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                          fontSize: 18, color: 'var(--ink2)', margin: 0, letterSpacing: '.02em',
                        }}>
                          <E id={`location_subway.${idx}.desc`} editMode={editMode}>{item.desc}</E>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bus */}
            <div className="reveal loc-t-card" style={{
              border: '1px solid var(--line)', background: 'var(--surface)',
              padding: 28, position: 'relative', overflow: 'hidden',
              transition: 'transform .25s cubic-bezier(.16,.84,.3,1), box-shadow .25s',
              transitionDelay: '.06s',
            }}>
              <div aria-hidden="true" style={{
                position: 'absolute', right: -10, bottom: -20,
                fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic',
                fontSize: 120, fontWeight: 300, color: 'rgba(59,130,246,.05)',
                lineHeight: 1, pointerEvents: 'none',
              }}>B</div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{
                    width: 28, height: 28, background: '#3B82F6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                    fontSize: 18, fontWeight: 700, color: '#fff',
                  }}>B</span>
                  <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink)' }}>버스</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {bus.map((item: { type: string; routes: string }, idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ width: 16, height: 1, background: idx === 0 ? '#3B82F6' : '#33A23D', flexShrink: 0, marginTop: 10 }} />
                      <div>
                        <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', margin: '0 0 2px' }}>
                          <E id={`location_bus.${idx}.type`} editMode={editMode}>{item.type}</E>
                        </p>
                        <p style={{
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                          fontSize: 18, color: 'var(--ink2)', margin: 0,
                        }}>
                          <E id={`location_bus.${idx}.routes`} editMode={editMode}>{item.routes}</E>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Parking */}
            <div className="reveal loc-t-card" style={{
              border: '1px solid var(--line)', background: 'var(--surface)',
              padding: 28, position: 'relative', overflow: 'hidden',
              transition: 'transform .25s cubic-bezier(.16,.84,.3,1), box-shadow .25s',
              transitionDelay: '.12s',
            }}>
              <div aria-hidden="true" style={{
                position: 'absolute', right: -10, bottom: -20,
                fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic',
                fontSize: 120, fontWeight: 300, color: 'rgba(43,44,48,.04)',
                lineHeight: 1, pointerEvents: 'none',
              }}>P</div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{
                    width: 28, height: 28, background: 'var(--graphite)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                    fontSize: 18, fontWeight: 700, color: '#fff',
                  }}>P</span>
                  <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink)' }}>주차</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ width: 16, height: 1, background: 'var(--graphite)', flexShrink: 0, marginTop: 10 }} />
                  <div>
                    <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', margin: '0 0 2px' }}>
                      <E id="location_parking.title" editMode={editMode}>{parking.title}</E>
                    </p>
                    <p style={{
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                      fontSize: 18, color: 'var(--ink2)', margin: 0,
                    }}>
                      <E id="location_parking.desc" editMode={editMode}>{parking.desc}</E>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Contact detail — dark section ═══ */}
      <section style={{
        padding: 'clamp(56px, 8vw, 96px) 0',
        background: 'var(--charcoal)', position: 'relative',
        overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 40% 50%, rgba(148,53,67,.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ marginBottom: 40 }}>
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,.4)', margin: '0 0 14px' }}>CONTACT INFO</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', color: '#fff', margin: 0,
            }}>
              연락처
            </h2>
          </div>

          <div className="loc-contact-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
          }}>
            {[
              { label: 'TEL', id: 'location_contact.tel', value: contact.tel, big: true },
              { label: 'FAX', id: 'location_contact.fax', value: contact.fax, big: false },
              { label: 'SALES', id: 'location_contact.emailSales', value: contact.emailSales, big: false },
              { label: 'GENERAL', id: 'location_contact.emailGeneral', value: contact.emailGeneral, big: false },
            ].map((item, idx) => (
              <div key={item.label} className="reveal" style={{
                border: '1px solid rgba(255,255,255,.08)',
                padding: 24, transitionDelay: `${idx * .06}s`,
              }}>
                <p style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                  fontSize: 18, fontWeight: 500, letterSpacing: '.12em',
                  color: 'rgba(255,255,255,.3)', margin: '0 0 10px',
                }}>{item.label}</p>
                <p style={{
                  fontSize: item.big ? 18 : 14, fontWeight: item.big ? 700 : 500,
                  color: item.big ? '#fff' : 'rgba(255,255,255,.6)', margin: 0,
                  wordBreak: 'break-all',
                }}>
                  <E id={item.id} editMode={editMode}>{item.value}</E>
                </p>
              </div>
            ))}
          </div>

          {/* Hours */}
          <div className="reveal" style={{
            marginTop: 24, border: '1px solid rgba(255,255,255,.08)',
            padding: 24, display: 'flex', gap: 40, flexWrap: 'wrap',
          }}>
            <div>
              <p style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                fontSize: 18, fontWeight: 500, letterSpacing: '.12em',
                color: 'rgba(255,255,255,.3)', margin: '0 0 8px',
              }}>HOURS</p>
              <p style={{
                fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic',
                fontSize: 24, fontWeight: 400, color: '#fff', margin: 0,
              }}><E id="location_contact.hours" editMode={editMode}>{contact.hours}</E></p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
              <span style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                fontSize: 18, color: 'rgba(255,255,255,.35)', letterSpacing: '.04em',
              }}><E id="location_contact.hoursNote" editMode={editMode}>{contact.hoursNote}</E></span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{
        padding: 'clamp(40px, 5vw, 56px) 0',
        background: 'var(--soft)', borderTop: '1px solid var(--line)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="wrap" style={{ textAlign: 'center' }}>
          <p className="reveal" style={{ fontSize: 18, color: 'var(--ink2)', margin: '0 0 20px' }}>
            <E id="location_cta.text" editMode={editMode}>{cta.text}</E>
          </p>
          <div className="reveal" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`tel:${contact.tel.replace(/-/g, '')}`} className="btn" style={{
              display: 'inline-block', padding: '14px 32px',
              background: 'var(--accent)', color: '#fff',
              fontWeight: 700, fontSize: 18, textDecoration: 'none',
            }}>
              전화하기 {contact.tel}
            </a>
            <Link href="/support/inquiry" className="btn" style={{
              display: 'inline-block', padding: '14px 32px',
              background: 'transparent', border: '1px solid var(--ink)',
              color: 'var(--ink)', fontWeight: 700, fontSize: 18, textDecoration: 'none',
            }}>
              1:1 문의하기
            </Link>
          </div>
        </div>
      </section>

      {editMode && <style>{EDITABLE_STYLES}</style>}

      <style>{`
        .loc-t-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 40px rgba(0,0,0,.07) !important;
        }
        @keyframes pinBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @media (max-width: 920px) {
          .loc-transport { grid-template-columns: 1fr !important; }
          .loc-contact-grid { grid-template-columns: 1fr 1fr !important; }
          .loc-address-row { flex-direction: column !important; gap: 24px !important; }
        }
        @media (max-width: 560px) {
          .loc-contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
