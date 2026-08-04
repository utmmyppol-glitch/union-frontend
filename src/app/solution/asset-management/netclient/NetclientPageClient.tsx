'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { E, safeParse, useEditMode, useEditableManifest, EDITABLE_STYLES } from '@/lib/editable';

const CRAWL = '/images/crawl/unionsystems';

const MODULES = [
  {
    num: '01',
    name: 'DMS (Desktop Management System)',
    desc: 'PC 자산의 하드웨어/소프트웨어 정보를 자동 수집하고 관리합니다. 설치 소프트웨어 현황 파악, 라이선스 관리, 원격 배포를 지원합니다.',
    img: `${CRAWL}/solution_netclient_function_dms_10.jpg`,
  },
  {
    num: '02',
    name: 'PMS (Patch Management System)',
    desc: 'Windows 보안 패치와 소프트웨어 업데이트를 중앙에서 관리합니다. 자동 패치 적용으로 보안 취약점을 사전에 차단합니다.',
    img: `${CRAWL}/solution_netclient_function_pms_11.jpg`,
  },
  {
    num: '03',
    name: 'PC-OFF (근로시간 관리)',
    desc: '주 52시간 근로시간제에 맞춘 PC 사용시간 기반 근무 관리. 업무 종료 후 미사용 PC를 자동 종료하여 전력 비용을 절감합니다.',
    img: `${CRAWL}/solution_netclient_function_pcoff_12.jpg`,
  },
  {
    num: '04',
    name: 'HSM (PC 보안 관리)',
    desc: '내부 정보 외부 유출 방지, 불법 소프트웨어 통제, PC 보안 점검 및 미디어 보안 관리를 지원합니다.',
    img: `${CRAWL}/solution_netclient_function_dms_10.jpg`,
  },
];

const POINTS = [
  { title: 'IT 자산 가시성 확보', desc: '사내 전체 PC의 하드웨어 사양, 설치 소프트웨어, 네트워크 정보를 실시간으로 파악합니다.' },
  { title: '운영 비용 절감', desc: '소프트웨어 라이선스 과잉 구매 방지, PC 전력 관리, 자동화된 패치 관리로 IT 운영 비용을 줄입니다.' },
];

const ICONS = [
  { label: 'HW 자산 수집' },
  { label: 'SW 관리' },
  { label: '패치 관리' },
  { label: '원격 배포' },
  { label: '전력 관리' },
  { label: '리포트' },
];

const DEFAULT_HERO = { desc: 'PC 자산 관리(DMS), 패치 관리(PMS), 근로시간 관리(PC-OFF),\n하드웨어 보안(HSM) — 4대 모듈로 IT 자산을 통합 관리합니다.' };
const DEFAULT_MODULES_DATA = MODULES.map(m => ({ name: m.name, desc: m.desc }));
const DEFAULT_POINTS_DATA = POINTS.map(p => ({ title: p.title, desc: p.desc }));
const DEFAULT_ICONS_DATA = ICONS.map(ic => ({ label: ic.label }));
const DEFAULT_CTA = { title: 'NetClient 도입 상담', desc: '전문 컨설턴트가 귀사 환경에 맞는 최적의 구성을 안내합니다.' };

export default function NetclientPageClient({ ssrContent }: { ssrContent: Record<string, string> }) {
  const editMode = useEditMode();
  useEditableManifest(editMode);
  const [hero, setHero] = useState(() => safeParse(ssrContent.netclient_hero, DEFAULT_HERO));
  const [modulesData, setModulesData] = useState(() => safeParse(ssrContent.netclient_modules, DEFAULT_MODULES_DATA));
  const [pointsData, setPointsData] = useState(() => safeParse(ssrContent.netclient_points, DEFAULT_POINTS_DATA));
  const [iconsData, setIconsData] = useState(() => safeParse(ssrContent.netclient_icons, DEFAULT_ICONS_DATA));
  const [cta, setCta] = useState(() => safeParse(ssrContent.netclient_cta, DEFAULT_CTA));
  useEffect(() => {
    if (!editMode) return;
    const setters: Record<string, (v: unknown) => void> = {
      netclient_hero: setHero as (v: unknown) => void,
      netclient_modules: setModulesData as (v: unknown) => void,
      netclient_points: setPointsData as (v: unknown) => void,
      netclient_icons: setIconsData as (v: unknown) => void,
      netclient_cta: setCta as (v: unknown) => void,
    };
    const handler = (e: MessageEvent) => { if (e.data?.type === 'content-update') { const fn = setters[e.data.section]; if (fn) fn(e.data.data); } };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [editMode]);
  const pageRef = useRef<HTMLDivElement>(null);

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
    <div ref={pageRef} style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      {editMode && <style>{EDITABLE_STYLES}</style>}
      {/* ═══ Hero — charcoal full-bleed ═══ */}
      <section style={{
        position: 'relative', background: 'var(--charcoal)',
        minHeight: 480, display: 'flex', alignItems: 'center', overflow: 'hidden',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${CRAWL}/solution_netclient_visual_8.png)`,
          backgroundSize: 'contain', backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat', opacity: 0.08,
        }} />
        {/* Wine ambient */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 70% 80%, rgba(148,53,67,.07) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {/* Blur blob */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '15%', top: '20%', width: 320, height: 320,
          background: 'radial-gradient(circle, rgba(245,51,63,.05) 0%, transparent 60%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        {/* Bg serif text */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '-3%', bottom: '10%',
          fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic',
          fontSize: 'clamp(100px, 16vw, 240px)', fontWeight: 300,
          color: 'rgba(255,255,255,.025)', lineHeight: 1, pointerEvents: 'none',
        }}>
          Asset
        </div>

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 600, padding: '120px 0 72px' }}>
<p className="eyebrow" style={{ color: 'var(--accent)', margin: '0 0 16px' }}>
              NETCLIENT
            </p>
            <h1 style={{
              fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
              lineHeight: .92, letterSpacing: '-.045em', color: '#fff', margin: '0 0 20px',
            }}>
              IT 자산<br />통합 관리
            </h1>
            <p style={{
              fontWeight: 400, fontSize: 16, lineHeight: 1.7,
              color: 'rgba(255,255,255,.5)', maxWidth: 620, margin: '0 0 12px',
            }}>
              <E id="netclient_hero.desc" editMode={editMode}>
                {hero.desc.split('\n').map((line: string, i: number) => (
                  <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
                ))}
              </E><br />
              보안 관리(HSM)를 하나의 에이전트로 통합 운영합니다.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
              {['DMS', 'PMS', 'PC-OFF', 'HSM'].map((t) => (
                <span key={t} style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                  fontSize: 12, fontWeight: 500, letterSpacing: '.06em',
                  color: 'rgba(255,255,255,.4)', border: '1px solid rgba(255,255,255,.1)',
                  padding: '4px 10px',
                }}>
                  {t}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/contact" style={{
                padding: '16px 32px', background: 'var(--accent)', color: '#fff',
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
              }}>
                도입 문의 →
              </Link>
              <a href="tel:02-706-8999" style={{
                padding: '16px 32px', background: 'transparent',
                border: '1px solid rgba(255,255,255,.45)', color: '#fff',
                fontWeight: 600, fontSize: 15, textDecoration: 'none',
              }}>
                02-706-8999
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Modules — asymmetric 2-col ═══ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0', position: 'relative', overflow: 'hidden' }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        {/* Gradient blobs */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '5%', top: '10%', width: 350, height: 350,
          background: 'radial-gradient(circle, rgba(245,51,63,.025) 0%, transparent 60%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', left: '8%', bottom: '15%', width: 280, height: 280,
          background: 'radial-gradient(circle, rgba(43,44,48,.025) 0%, transparent 60%)',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>MODULES</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', margin: 0,
            }}>
              주요 모듈
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {MODULES.map((m, i) => (
              <div
                key={m.name}
                className="reveal nc-mod"
                style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
                  border: '1px solid var(--line)', background: 'var(--surface)',
                  overflow: 'hidden',
                  transition: 'transform .3s cubic-bezier(.16,.84,.3,1), box-shadow .3s, border-color .3s',
                  transitionDelay: `${i * 0.08}s`,
                }}
              >
                <div style={{
                  background: 'var(--soft)', minHeight: 260,
                  position: 'relative',
                  order: i % 2 === 0 ? 0 : 1,
                }}>
                  <Image
                    src={m.img} alt={m.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div style={{
                  padding: 'clamp(28px, 4vw, 48px)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  order: i % 2 === 0 ? 1 : 0,
                }}>
                  <span style={{
                    fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic',
                    fontSize: 36, fontWeight: 300, color: 'var(--accent)', opacity: .5,
                    display: 'block', marginBottom: 16, lineHeight: 1,
                  }}>
                    {m.num}
                  </span>
                  <h3 style={{ fontWeight: 800, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>
                    <E id={`netclient_modules.${i}.name`} editMode={editMode}>{modulesData[i]?.name ?? m.name}</E>
                  </h3>
                  <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink2)', margin: 0 }}>
                    <E id={`netclient_modules.${i}.desc`} editMode={editMode}>{modulesData[i]?.desc ?? m.desc}</E>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Why — dark section ═══ */}
      <section style={{
        padding: 'clamp(56px, 8vw, 96px) 0',
        background: 'var(--charcoal)', position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 80%, rgba(148,53,67,.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {/* Blur blob */}
        <div aria-hidden="true" style={{
          position: 'absolute', left: '10%', top: '20%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(245,51,63,.04) 0%, transparent 60%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,.4)', margin: '0 0 14px' }}>WHY NETCLIENT</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', color: '#fff', margin: 0,
            }}>
              도입 효과
            </h2>
          </div>

          <div className="nc-why-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {POINTS.map((pt, i) => (
              <div
                key={i}
                className="reveal"
                style={{
                  border: '1px solid rgba(255,255,255,.08)', padding: 36,
                  transition: 'border-color .3s',
                  transitionDelay: `${i * 0.1}s`,
                }}
              >
                <span style={{
                  fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic',
                  fontSize: 42, fontWeight: 300, color: 'rgba(255,255,255,.1)',
                  display: 'block', marginBottom: 20, lineHeight: 1,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 style={{ fontWeight: 700, fontSize: 22, color: '#fff', margin: '0 0 12px' }}>
                  <E id={`netclient_points.${i}.title`} editMode={editMode}>{pointsData[i]?.title ?? pt.title}</E>
                </h3>
                <p style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,.5)', margin: 0 }}>
                  <E id={`netclient_points.${i}.desc`} editMode={editMode}>{pointsData[i]?.desc ?? pt.desc}</E>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Features — icon grid ═══ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0', background: 'var(--soft)', position: 'relative', overflow: 'hidden' }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div aria-hidden="true" style={{
          position: 'absolute', right: '10%', bottom: '10%', width: 250, height: 250,
          background: 'radial-gradient(circle, rgba(245,51,63,.02) 0%, transparent 60%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>FEATURES</p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
              lineHeight: .95, letterSpacing: '-.04em', margin: 0,
            }}>
              주요 기능
            </h2>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16,
            maxWidth: 800, margin: '0 auto',
          }} className="nc-feat-grid">
            {ICONS.map((ic, i) => (
              <div
                key={i}
                className="reveal nc-feat-card"
                style={{
                  textAlign: 'center', padding: '28px 12px',
                  border: '1px solid var(--line)', background: 'var(--surface)',
                  transition: 'transform .2s, border-color .2s',
                  transitionDelay: `${i * 0.05}s`,
                }}
              >
                <span style={{
                  fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic',
                  fontSize: 24, fontWeight: 300, color: 'var(--line)',
                  display: 'block', marginBottom: 10,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                  fontSize: 13, fontWeight: 500, letterSpacing: '.04em',
                  color: 'var(--ink)', margin: 0,
                }}>
                  <E id={`netclient_icons.${i}.label`} editMode={editMode}>{iconsData[i]?.label ?? ic.label}</E>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
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
          <p className="eyebrow reveal" style={{ color: 'rgba(255,255,255,.4)', margin: '0 0 14px' }}>CONTACT</p>
          <h2 className="reveal" style={{
            fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
            lineHeight: 1.1, color: '#fff', margin: '0 0 16px', letterSpacing: '-.04em',
          }}>
            <E id="netclient_cta.title" editMode={editMode}>{cta.title}</E>
          </h2>
          <p className="reveal" style={{
            fontSize: 16, color: 'rgba(255,255,255,.5)', margin: '0 0 32px',
          }}>
            IT 자산을 체계적으로 관리하고 운영 비용을 절감하세요.
          </p>
          <Link
            href="/contact"
            className="reveal btn"
            style={{
              display: 'inline-block', padding: '16px 40px',
              background: 'var(--accent)', color: '#fff',
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
            }}
          >
            도입 문의하기 →
          </Link>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .nc-mod:hover { transform: translateY(-4px) !important; box-shadow: 0 16px 48px rgba(0,0,0,.08) !important; border-color: var(--accent) !important; }
        .nc-mod:hover img { transform: scale(1.04); transition: transform .5s; }
        .nc-feat-card:hover { transform: translateY(-4px) !important; border-color: var(--accent) !important; box-shadow: 0 8px 28px rgba(0,0,0,.06) !important; }
        @media (max-width: 920px) {
          .nc-mod { grid-template-columns: 1fr !important; }
          .nc-mod > div { order: unset !important; }
          .nc-why-grid { grid-template-columns: 1fr !important; }
          .nc-feat-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .nc-feat-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      ` }} />
    </div>
  );
}
