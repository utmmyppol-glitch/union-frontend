'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface CardData {
  title: string;
  tag: string;
  desc: string;
  chips: string[];
  img: string;
  logo: string;
  href: string;
}

const CARDS: CardData[] = [
  {
    title: 'OfficeKeeper',
    tag: '보안',
    desc: '매체·네트워크·출력물까지 모든 유출 경로를 차단하는 정보유출방지(DLP) 솔루션',
    chips: ['DLP', '매체 제어', '출력 보안'],
    img: '/images/uploads/solution_list_officekeeper.jpg',
    logo: '/images/uploads/logo_officekeeper_w_84.png',
    href: '/solution/security/officekeeper',
  },
  {
    title: 'AhnLab V3',
    tag: '보안',
    desc: '국내 1위 엔드포인트 백신 — 악성코드·랜섬웨어를 실시간으로 방어합니다.',
    chips: ['V3 Endpoint', 'EDR', '24/7 관제'],
    img: '/images/uploads/solution_ahnlab_visual_198.png',
    logo: '/images/uploads/logo_ahnlab_w_199.png',
    href: '/solution/security/ahnlab',
  },
  {
    title: 'ESTsecurity',
    tag: '보안',
    desc: '알약 ASM과 AI EDR로 위협을 탐지하고 자동 대응하는 통합 보안 관리',
    chips: ['알약 ASM', 'AI EDR', '자동 대응'],
    img: '/images/uploads/solution_estsecurity_banner_img_227.png',
    logo: '/images/uploads/logo_estsecurity_w_216.png',
    href: '/solution/security/estsecurity',
  },
  {
    title: 'DA# · 엔코아',
    tag: '데이터',
    desc: '전사 데이터 모델링부터 표준화·품질관리까지, 데이터 거버넌스의 표준',
    chips: ['모델링', '표준화', 'DQ'],
    img: '/images/uploads/solution_dataware_visual_180.png',
    logo: '/images/uploads/logo_encore_w_181.png',
    href: 'https://uniondata.co.kr',
  },
  {
    title: 'NetClient',
    tag: '자산관리',
    desc: 'IT 자산·패치·근태·보안을 하나로 묶는 통합 PC 관리 (DMS·PMS·PC-OFF·HSM)',
    chips: ['DMS', 'PMS', 'PC-OFF'],
    img: '/images/uploads/solution_netclient_visual_8.png',
    logo: '/images/uploads/logo_netclient_w_9.png',
    href: '/solution/asset-management/netclient',
  },
];

const AUTO_INTERVAL = 5000;
const TOTAL = CARDS.length;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SolutionCarousel() {
  const [idx, setIdx] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgressKey((k) => k + 1);
    timerRef.current = setInterval(() => {
      setIdx((prev) => (prev + 1) % TOTAL);
      setProgressKey((k) => k + 1);
    }, AUTO_INTERVAL);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const go = (dir: -1 | 1) => {
    setIdx((prev) => (prev + dir + TOTAL) % TOTAL);
    resetTimer();
  };

  const currentLabel = String(idx + 1).padStart(2, '0');
  const card = CARDS[idx];

  return (
    <section style={{
      background: 'var(--soft)',
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(80px,10vw,140px) 0',
    }}>

      {/* ═══ BLUEPRINT STYLE — 설계도/기술 그리드 배경 ═══ */}

      {/* Blueprint grid — 기술 설계도 패턴 */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(var(--line) 1px, transparent 1px),
          linear-gradient(90deg, var(--line) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        opacity: .08,
        pointerEvents: 'none',
      }} />
      {/* Fine sub-grid */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(var(--line) 1px, transparent 1px),
          linear-gradient(90deg, var(--line) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        opacity: .03,
        pointerEvents: 'none',
      }} />

      {/* Large serif watermark — 우측, viewport 밖까지 */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '5%',
        right: '-5%',
        fontFamily: "'Newsreader', Georgia, serif",
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: 'clamp(200px, 24vw, 400px)',
        lineHeight: .8,
        color: 'var(--line)',
        opacity: .18,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        pointerEvents: 'none',
        letterSpacing: '-.04em',
      }}>
        Blueprint
      </div>

      {/* Section number — 좌측 끝 */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: 'clamp(40px,5vw,80px)',
        left: 'clamp(20px,3vw,48px)',
        fontFamily: "'Newsreader', Georgia, serif",
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: 64,
        color: 'var(--line)',
        opacity: .5,
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        02
      </div>

      {/* Vertical guide line — 우측 */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: 0, bottom: 0,
        right: 'clamp(16px,2.5vw,40px)',
        width: 1,
        background: 'var(--line)',
        opacity: .25,
        pointerEvents: 'none',
      }} />

      {/* Crosshair markers — blueprint reference points */}
      {[
        { top: '15%', left: '8%' },
        { top: '75%', right: '12%' },
        { bottom: '20%', left: '15%' },
      ].map((pos, i) => (
        <div key={i} aria-hidden="true" style={{
          position: 'absolute', ...pos,
          width: 20, height: 20,
          pointerEvents: 'none',
          opacity: .2,
        }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--ink2)' }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'var(--ink2)' }} />
        </div>
      ))}

      {/* Corner squares */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 40, right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />

      {/* ═══ Content ═══ */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Full-width top line ── */}
        <div style={{ width: '100%', height: 1, background: 'var(--line)', opacity: .35, marginBottom: 48 }} />

        {/* ── Header: eyebrow + title + nav ── */}
        <div style={{
          maxWidth: 1300, margin: '0 auto', padding: '0 clamp(20px,4vw,52px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 40, flexWrap: 'wrap', gap: 24,
        }}>
          <div style={{ maxWidth: 480 }}>
            <p style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
              fontWeight: 500, fontSize: 12, letterSpacing: '.14em',
              color: 'var(--ink2)', textTransform: 'uppercase',
              margin: '0 0 14px',
            }}>Solution</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px,3.5vw,40px)',
              lineHeight: 1.05, letterSpacing: '-.045em',
              color: 'var(--ink)', margin: 0,
            }}>
              기업에 꼭 맞는 솔루션을,<br />
              직접 구축하고 지원합니다
            </h2>
          </div>

          {/* Nav arrows + counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => go(-1)} aria-label="이전" className="sc-nav-btn" style={{
              width: 44, height: 44, border: '1px solid var(--line)',
              background: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
              transition: 'all .2s',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.2"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button onClick={() => go(1)} aria-label="다음" className="sc-nav-btn" style={{
              width: 44, height: 44, border: '1px solid var(--line)',
              background: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
              transition: 'all .2s',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.2"><polyline points="9 6 15 12 9 18" /></svg>
            </button>
            <span style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontStyle: 'italic', fontSize: 28, fontWeight: 400,
              color: 'var(--ink)', marginLeft: 8,
              fontVariantNumeric: 'tabular-nums', userSelect: 'none',
            }}>
              {currentLabel}
              <span style={{ color: 'var(--ink2)', fontSize: 13 }}> / {String(TOTAL).padStart(2, '0')}</span>
            </span>
          </div>
        </div>

        {/* ── Main card — FULL WIDTH (viewport edge) ── */}
        <div style={{
          width: '100%',
          padding: '0 clamp(20px,4vw,52px)',
          boxSizing: 'border-box',
        }}>
          <div style={{
            position: 'relative',
            height: 'clamp(380px, 50vw, 520px)',
            background: 'var(--charcoal)',
            overflow: 'hidden',
            transition: 'none',
          }}>
            {/* Background image */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${card.img})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              opacity: 0.25,
              transition: 'opacity .5s',
            }} />
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(17,18,20,.95) 0%, rgba(17,18,20,.7) 40%, rgba(17,18,20,.4) 100%)',
              pointerEvents: 'none',
            }} />

            {/* Card content */}
            <div style={{
              position: 'relative', zIndex: 1,
              padding: 'clamp(32px,5vw,56px)',
              display: 'flex', flexDirection: 'column',
              height: '100%', boxSizing: 'border-box',
            }}>
              {/* Top row: tag + logo */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  padding: '5px 14px',
                  border: '1px solid rgba(255,255,255,.2)',
                  background: 'rgba(255,255,255,.06)',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                  fontWeight: 500, fontSize: 12, letterSpacing: '.1em',
                  color: 'rgba(255,255,255,.7)', textTransform: 'uppercase',
                }}>{card.tag}</span>
                <img
                  src={card.logo} alt={card.title}
                  style={{ height: 32, objectFit: 'contain', opacity: .6, filter: 'brightness(2)' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>

              {/* Middle: large title */}
              <h3 style={{
                fontWeight: 900, fontSize: 'clamp(32px, 5vw, 56px)',
                letterSpacing: '-.03em', color: '#fff',
                margin: 'auto 0 0',
              }}>{card.title}</h3>

              {/* Description */}
              <p style={{
                fontWeight: 400, fontSize: 16, lineHeight: 1.65,
                color: 'rgba(255,255,255,.6)', maxWidth: 500,
                margin: '14px 0 0',
              }}>{card.desc}</p>

              {/* Bottom row: chips + CTA */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 16, marginTop: 20,
              }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {card.chips.map((chip) => (
                    <span key={chip} style={{
                      padding: '4px 12px',
                      border: '1px solid rgba(255,255,255,.15)',
                      background: 'rgba(255,255,255,.05)',
                      color: 'rgba(255,255,255,.55)',
                      fontWeight: 600, fontSize: 13,
                    }}>{chip}</span>
                  ))}
                </div>
                <Link href={card.href} style={{
                  fontWeight: 700, fontSize: 14,
                  color: 'rgba(255,255,255,.7)',
                  textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'color .2s',
                }}>
                  자세히 보기 <span>&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Decorative: large index number — 우하단 */}
            <div aria-hidden="true" style={{
              position: 'absolute', right: 'clamp(24px,4vw,56px)', bottom: -20,
              fontFamily: "'Newsreader', Georgia, serif",
              fontStyle: 'italic', fontWeight: 300,
              fontSize: 'clamp(140px, 18vw, 240px)',
              lineHeight: 1, color: 'rgba(255,255,255,.04)',
              pointerEvents: 'none',
            }}>{currentLabel}</div>
          </div>
        </div>

        {/* ── Progress bar — full width ── */}
        <div style={{
          maxWidth: 1300, margin: '0 auto', padding: '0 clamp(20px,4vw,52px)',
          marginTop: 24,
        }}>
          <div style={{ height: 2, background: 'var(--line)', position: 'relative', overflow: 'hidden' }}>
            <div key={progressKey} style={{
              position: 'absolute', top: 0, left: 0, height: '100%',
              background: 'var(--ink)',
              animation: `progressLine ${AUTO_INTERVAL}ms linear forwards`,
            }} />
          </div>
        </div>

        {/* ── Thumbnail navigation — 5 mini cards ── */}
        <div style={{
          maxWidth: 1300, margin: '0 auto', padding: '0 clamp(20px,4vw,52px)',
          marginTop: 20,
        }}>
          <div className="sc-thumbs" style={{ display: 'flex', gap: 8 }}>
            {CARDS.map((c, i) => (
              <button
                key={i}
                onClick={() => { setIdx(i); resetTimer(); }}
                className="sc-thumb-btn"
                style={{
                  flex: 1,
                  padding: '14px 12px',
                  border: i === idx ? '1px solid var(--ink)' : '1px solid var(--line)',
                  background: i === idx ? 'var(--surface)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all .25s',
                  opacity: i === idx ? 1 : .6,
                }}
              >
                <p style={{
                  fontWeight: 700, fontSize: 13,
                  color: i === idx ? 'var(--ink)' : 'var(--ink2)',
                  margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{c.title}</p>
                <p style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                  fontSize: 12, fontWeight: 500, color: 'var(--ink2)',
                  margin: '4px 0 0', opacity: .7,
                }}>{c.tag}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Bottom full-width line ── */}
        <div style={{ width: '100%', height: 1, background: 'var(--line)', opacity: .35, marginTop: 48 }} />

        {/* Floating annotation — 좌하단 (Blueprint label) */}
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: 20, left: 'clamp(20px,3vw,52px)',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
          fontSize: 12, fontWeight: 500, letterSpacing: '.06em',
          color: 'var(--ink2)', opacity: .5,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ display: 'inline-block', width: 6, height: 6, border: '1px solid var(--ink2)', transform: 'rotate(45deg)' }} />
          BLUEPRINT · 5 SOLUTIONS · DATA · SECURITY · ASSET
        </div>
      </div>
    </section>
  );
}
