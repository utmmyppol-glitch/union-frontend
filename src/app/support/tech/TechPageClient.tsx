'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { E, safeParse, useEditMode, useEditableManifest, EDITABLE_STYLES } from '@/lib/editable';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SERIF = "'Newsreader', Georgia, serif";

/* ── 기본값 ── */
const DEFAULT_HERO = {
  title: '유니온시스템즈의\n리뉴얼, 기술지원팀을 소개합니다.',
  subtitle: 'IT 솔루션, 도입이 끝이 아닙니다. 체계적인 관리!',
};

const DEFAULT_SERVICES = [
  { title: '기술지원', desc: '장애 및 이슈\n기술지원 서비스' },
  { title: '라이선스 관리', desc: '리뉴얼 팀\n라이선스 관리' },
  { title: '교육지원', desc: '교육/세미나\n최신기술 업데이트' },
];

const DEFAULT_PROCESS = [
  { num: '01', title: '정기방문', desc: '사용자 요청사항 파악 및 솔루션 사용 지원을 위한 정기 방문.' },
  { num: '02', title: '사용자교육', desc: '단계별 맞춤 능력 향상 교육을 제공합니다.' },
  { num: '03', title: '관리자교육', desc: '라이선스 정책 및 관리 방법 교육을 진행합니다.' },
  { num: '04', title: '원격지원', desc: '긴급 애로사항에 대한 1:1 원격 지원을 제공합니다.' },
  { num: '05', title: '솔루션 업데이트', desc: '버전업 및 보안 패치 적용을 지원합니다.' },
  { num: '06', title: '방문세미나', desc: '기술습득 및 IT 트렌드 제공 세미나를 직접 방문하여 진행합니다.' },
];

const DEFAULT_TECH_TEAM = [
  { name: '조성준', title: '차장/팀장', email: 'kevin@unionsystems.co.kr' },
  { name: '박상현', title: '차장', email: 'mite5@unionsystems.co.kr' },
];

const DEFAULT_DA_TEAM: { name: string; title: string; email: string }[] = [];

const DEFAULT_FAQ = [
  { category: 'Microsoft 365', question: 'Microsoft 365 라이선스 갱신은 어떻게 하나요?', answer: '라이선스 만료일 30일 전 안내 메일을 발송해 드립니다. 자동 갱신 설정이 되어 있는 경우 별도 조치 없이 갱신되며, 수동 갱신의 경우 담당자에게 연락해주시면 처리해 드립니다.' },
  { category: '보안', question: '안랩 V3 업데이트가 되지 않습니다.', answer: '방화벽에서 안랩 업데이트 서버(update.ahnlab.com) 접근이 차단되어 있는지 확인해주세요.' },
  { category: '자산관리', question: 'NetClient 에이전트 설치 방법을 알려주세요.', answer: '관리 콘솔에서 설치 파일을 다운로드하여 각 PC에 배포하시면 됩니다.' },
  { category: '일반', question: '기술지원 요청은 어떻게 하나요?', answer: '전화(02-706-8999), 이메일(ud@unionsystems.co.kr), 또는 1:1 문의를 통해 기술지원을 요청하실 수 있습니다.' },
];

const DEFAULT_MID = {
  title: '솔루션 구축에서 유지보수까지',
  subtitle: 'IT 솔루션, 도입이 끝이 아닙니다. 체계적인 관리',
};

const DEFAULT_CTA = { title: '기술지원이 필요하신가요?' };

const DEFAULT_CONTACT = {
  tel: '02-706-8999',
  hours: '평일 10 – 18시 (점심시간 12:00 – 13:00 제외, 주말 및 공휴일 휴무)',
};

export default function TechPageClient({ ssrContent }: { ssrContent: Record<string, string> }) {
  const editMode = useEditMode();

  const [hero, setHero] = useState(() => safeParse(ssrContent.tech_hero, DEFAULT_HERO));
  const [services, setServices] = useState(() => safeParse(ssrContent.tech_services, DEFAULT_SERVICES));
  const [process, setProcess] = useState(() => safeParse(ssrContent.tech_process, DEFAULT_PROCESS));
  const [techTeam, setTechTeam] = useState(() => safeParse(ssrContent.tech_team, DEFAULT_TECH_TEAM));
  const [daTeam, setDaTeam] = useState(() => safeParse(ssrContent.tech_da_team, DEFAULT_DA_TEAM));
  const [faq, setFaq] = useState(() => safeParse(ssrContent.tech_faq, DEFAULT_FAQ));
  const [mid, setMid] = useState(() => safeParse(ssrContent.tech_mid, DEFAULT_MID));
  const [cta, setCta] = useState(() => safeParse(ssrContent.tech_cta, DEFAULT_CTA));
  const [contact, setContact] = useState(() => safeParse(ssrContent.tech_contact, DEFAULT_CONTACT));

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEditableManifest(editMode);

  useEffect(() => {
    if (!editMode) return;
    const setters: Record<string, (v: unknown) => void> = {
      tech_hero: setHero as (v: unknown) => void,
      tech_services: setServices as (v: unknown) => void,
      tech_process: setProcess as (v: unknown) => void,
      tech_team: setTechTeam as (v: unknown) => void,
      tech_da_team: setDaTeam as (v: unknown) => void,
      tech_faq: setFaq as (v: unknown) => void,
      tech_mid: setMid as (v: unknown) => void,
      tech_cta: setCta as (v: unknown) => void,
      tech_contact: setContact as (v: unknown) => void,
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

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {editMode && <style>{EDITABLE_STYLES}</style>}

      {/* ═══ Hero — 기존 사이트 구조 (일러스트 포함) ═══ */}
      <section style={{
        position: 'relative', background: 'var(--charcoal)', overflow: 'hidden',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 60% 80%, rgba(148,53,67,.08) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div className="blob blob-accent" aria-hidden="true" style={{ width: 400, height: 400, right: '5%', top: '5%' }} />
        <div className="blob blob-wine" aria-hidden="true" style={{ width: 300, height: 300, left: '10%', bottom: '5%', animationDelay: '7s' }} />
        {/* Geometric decoration */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '20%', top: '30%', width: 50, height: 50,
          border: '1px solid rgba(255,255,255,.05)', transform: 'rotate(45deg)',
          animation: 'geoFloat1 12s ease-in-out infinite', pointerEvents: 'none',
        }} />

        <div className="wrap" style={{
          position: 'relative', zIndex: 1,
          padding: '120px clamp(20px,4vw,52px) 64px',
        }}>
            <p style={{
              fontFamily: MONO, fontSize: 18, letterSpacing: '.1em',
              color: 'rgba(255,255,255,.4)', margin: '0 0 10px',
            }}>
              <E id="tech_hero.subtitle" editMode={editMode}>{hero.subtitle}</E>
            </p>
            <h1 style={{
              fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
              lineHeight: 1.05, letterSpacing: '-.04em', color: '#fff', margin: 0,
            }}>
              <E id="tech_hero.title" editMode={editMode}>
                {hero.title.split('\n').map((line: string, i: number) => (
                  <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
                ))}
              </E>
            </h1>
        </div>
      </section>

      {/* ═══ 팀 소개 — 기술지원팀 + 리뉴얼팀 (사진 + 텍스트 비대칭) ═══ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0', position: 'relative', overflow: 'hidden' }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="blob blob-accent" aria-hidden="true" style={{ width: 300, height: 300, right: '3%', top: '15%', animationDelay: '3s' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 40 }}>
            <p className="eyebrow" style={{ margin: '0 0 10px' }}>OUR TEAMS</p>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', letterSpacing: '-.03em', margin: 0 }}>
              유니온시스템즈 서비스
            </h2>
            <p style={{ fontSize: 18, color: 'var(--ink2)', marginTop: 8 }}>소프트웨어 라이선스 관리, 솔루션 유지보수</p>
          </div>

          {/* 기술지원팀 */}
          <div className="reveal tech-team-row" style={{
            display: 'grid', gridTemplateColumns: '0.45fr 0.55fr', gap: 0,
            border: '1px solid var(--line)', overflow: 'hidden', background: 'var(--surface)',
            marginBottom: 20,
          }}>
            <div style={{ background: 'var(--soft)', minHeight: 280, overflow: 'hidden' }}>
              <img src="/images/crawl/unionsystems/customer_header_img-01_5.png" alt="기술지원팀" loading="lazy" style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              }} onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = 'none';
                el.parentElement!.style.background = 'var(--charcoal)';
                el.parentElement!.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;"><span style="font-family:Newsreader,serif;font-style:italic;font-size:48px;color:rgba(255,255,255,.06)">ST</span></div>';
              }} />
            </div>
            <div style={{ padding: 'clamp(26px, 3.5vw, 40px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontFamily: MONO, fontSize: 18, fontWeight: 600, letterSpacing: '.1em', color: 'var(--accent)', margin: '0 0 8px' }}>SUPPORT TEAM</p>
              <h3 style={{ fontWeight: 900, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>기술지원 팀</h3>
              <p style={{ fontSize: 18, lineHeight: 1.7, color: 'var(--ink2)', margin: 0 }}>
                전담 엔지니어 배정, 도입 및 업무 적용 지원, 절차화 된 프로세스, 유지보수, 이슈대응, 원격지원, 장애처리
              </p>
            </div>
          </div>

          {/* 리뉴얼팀 */}
          <div className="reveal tech-team-row" style={{
            display: 'grid', gridTemplateColumns: '0.55fr 0.45fr', gap: 0,
            border: '1px solid var(--line)', overflow: 'hidden', background: 'var(--surface)',
          }}>
            <div style={{ padding: 'clamp(26px, 3.5vw, 40px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontFamily: MONO, fontSize: 18, fontWeight: 600, letterSpacing: '.1em', color: 'var(--accent)', margin: '0 0 8px' }}>RENEWAL TEAM</p>
              <h3 style={{ fontWeight: 900, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}>리뉴얼 팀</h3>
              <p style={{ fontSize: 18, lineHeight: 1.7, color: 'var(--ink2)', margin: 0 }}>
                벤더(개발사)와 긴밀한 연결, 소프트웨어 라이선스 정책 안내, 갱신관리, 성능 향상을 위한 교육, 세미나
              </p>
            </div>
            <div style={{ background: 'var(--soft)', minHeight: 280, overflow: 'hidden' }}>
              <img src="/images/crawl/unionsystems/customer_header_img-02_99.png" alt="리뉴얼팀" loading="lazy" style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              }} onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = 'none';
                el.parentElement!.style.background = 'var(--charcoal)';
                el.parentElement!.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;"><span style="font-family:Newsreader,serif;font-style:italic;font-size:48px;color:rgba(255,255,255,.06)">RT</span></div>';
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 풀블리드 다크 비주얼 — "솔루션 구축에서 유지보수까지" ═══ */}
      <section style={{
        padding: 'clamp(80px, 12vw, 160px) 0', position: 'relative', overflow: 'hidden',
        background: 'var(--charcoal)',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(/images/crawl/unionsystems/customer_header_img-01_5.png)`,
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: .15,
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(20,18,16,.6) 0%, rgba(20,18,16,.9) 100%)',
          pointerEvents: 'none',
        }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h2 className="reveal" style={{
            fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
            lineHeight: 1.15, letterSpacing: '-.04em', color: '#fff', margin: '0 0 12px',
          }}>
            <E id="tech_mid.title" editMode={editMode}>{mid.title}</E>
          </h2>
          <p className="reveal" style={{ fontSize: 18, color: 'rgba(255,255,255,.45)', margin: 0 }}>
            <E id="tech_mid.subtitle" editMode={editMode}>{mid.subtitle}</E>
          </p>
        </div>
      </section>

      {/* ═══ "무엇을 도와드릴까요?" — 3열 서비스 ═══ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', letterSpacing: '-.03em', margin: '0 0 8px' }}>무엇을 도와드릴까요?</h2>
            <p style={{ fontSize: 18, color: 'var(--ink2)', margin: 0 }}>IT 전체 역할 없이 기존 IT 자산 상담, 분석하세요</p>
          </div>
          <div className="tech-svc" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {services.map((s: { title: string; desc: string }, i: number) => (
              <div key={s.title} className="reveal" style={{
                textAlign: 'center', padding: '32px 20px',
                border: '1px solid var(--line)', background: 'var(--surface)',
                transition: 'transform .2s, box-shadow .2s',
                transitionDelay: `${i * .06}s`,
              }}>
                <h3 style={{ fontWeight: 800, fontSize: 18, color: 'var(--ink)', margin: '0 0 8px' }}>
                  <E id={`tech_services[${i}].title`} editMode={editMode}>{s.title}</E>
                </h3>
                <p style={{ fontSize: 18, color: 'var(--ink2)', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  <E id={`tech_services[${i}].desc`} editMode={editMode}>{s.desc}</E>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 지원 프로세스 — 6개 카드 ═══ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0', background: 'var(--soft)' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="wrap">
          <div className="reveal" style={{ marginBottom: 32 }}>
            <p className="eyebrow" style={{ margin: '0 0 10px' }}>PROCESS</p>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', letterSpacing: '-.03em', margin: 0 }}>기술지원 프로세스</h2>
          </div>
          <div className="tech-process" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {process.map((s: { num: string; title: string; desc: string }, i: number) => (
              <div key={s.num} className="reveal tech-proc-card" style={{
                border: '1px solid var(--line)', background: 'var(--surface)',
                padding: '24px 20px', transition: 'transform .2s, box-shadow .2s',
                transitionDelay: `${i * .04}s`, position: 'relative', overflow: 'hidden',
              }}>
                <div aria-hidden="true" style={{
                  position: 'absolute', right: 4, bottom: -6,
                  fontFamily: SERIF, fontStyle: 'italic', fontSize: 56, fontWeight: 300,
                  color: 'rgba(20,18,16,.03)', lineHeight: 1, pointerEvents: 'none',
                }}>{s.num}</div>
                <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 22, color: 'var(--accent)', opacity: .6 }}>{s.num}</span>
                <h3 style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink)', margin: '8px 0 6px' }}>
                  <E id={`tech_process[${i}].title`} editMode={editMode}>{s.title}</E>
                </h3>
                <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--ink2)', margin: 0 }}>
                  <E id={`tech_process[${i}].desc`} editMode={editMode}>{s.desc}</E>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 기술지원 안내 — 담당자 테이블 ═══ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0', position: 'relative', overflow: 'hidden' }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="blob blob-graphite" aria-hidden="true" style={{ width: 250, height: 250, left: '5%', bottom: '10%', animationDelay: '6s' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ marginBottom: 24 }}>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', letterSpacing: '-.03em', margin: '0 0 12px' }}>기술지원 안내</h2>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 18, color: 'var(--ink2)' }}>
              <span>
                <strong style={{ color: 'var(--ink)' }}>전화 문의</strong>{' '}
                <E id="tech_contact.tel" editMode={editMode}>{contact.tel}</E>
              </span>
              <span>
                <strong style={{ color: 'var(--ink)' }}>운영시간</strong>{' '}
                <E id="tech_contact.hours" editMode={editMode}>{contact.hours}</E>
              </span>
            </div>
          </div>

          {/* 담당자 테이블 — 넓고 깔끔한 table */}
          <div className="reveal" style={{ border: '1px solid var(--line)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 18 }}>
              <tbody>
                {techTeam.map((m: { name: string; title: string; email: string }, i: number) => (
                  <tr key={m.email} style={{ borderBottom: '1px solid var(--line)' }}>
                    {i === 0 && (
                      <td rowSpan={techTeam.length} style={{
                        padding: '28px 36px', fontWeight: 800, fontSize: 18, color: 'var(--ink)',
                        borderRight: '1px solid var(--line)', verticalAlign: 'middle',
                        width: 180, background: 'var(--soft)',
                      }}>기술지원팀</td>
                    )}
                    <td style={{ padding: '22px 28px', fontWeight: 600, fontSize: 18, color: 'var(--ink)', width: 220 }}>
                      <E id={`tech_team[${i}].name`} editMode={editMode}>{m.name}</E>{' '}
                      <E id={`tech_team[${i}].title`} editMode={editMode}>{m.title}</E>
                    </td>
                    <td style={{ padding: '22px 28px' }}>
                      <a href={`mailto:${m.email}`} style={{ color: 'var(--ink2)', textDecoration: 'none', fontSize: 18 }}>
                        <E id={`tech_team[${i}].email`} editMode={editMode}>{m.email}</E>
                      </a>
                    </td>
                  </tr>
                ))}
                {daTeam.length > 0 && daTeam.map((m: { name: string; title: string; email: string }, i: number) => (
                  <tr key={m.email} style={{ borderBottom: i < daTeam.length - 1 ? '1px solid var(--line)' : 'none' }}>
                    {i === 0 && (
                      <td rowSpan={daTeam.length} style={{
                        padding: '28px 36px', fontWeight: 800, fontSize: 18, color: 'var(--ink)',
                        borderRight: '1px solid var(--line)', verticalAlign: 'middle',
                        width: 180, background: 'var(--soft)', borderTop: '1px solid var(--line)',
                      }}>DA팀</td>
                    )}
                    <td style={{ padding: '22px 28px', fontWeight: 600, fontSize: 18, color: 'var(--ink)', width: 220, borderTop: i === 0 ? '1px solid var(--line)' : 'none' }}>
                      <E id={`tech_da_team[${i}].name`} editMode={editMode}>{m.name}</E>{' '}
                      <E id={`tech_da_team[${i}].title`} editMode={editMode}>{m.title}</E>
                    </td>
                    <td style={{ padding: '18px 24px', borderTop: i === 0 ? '1px solid var(--line)' : 'none' }}>
                      <a href={`mailto:${m.email}`} style={{ color: 'var(--ink2)', textDecoration: 'none', fontSize: 18 }}>
                        <E id={`tech_da_team[${i}].email`} editMode={editMode}>{m.email}</E>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0', background: 'var(--charcoal)', position: 'relative' , overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 50%, rgba(148,53,67,.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1, maxWidth: 800 }}>
          <div className="reveal" style={{ marginBottom: 28 }}>
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,.4)', margin: '0 0 10px' }}>FAQ</p>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', letterSpacing: '-.03em', color: '#fff', margin: 0 }}>자주 묻는 질문</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {faq.map((item: { category: string; question: string; answer: string }, idx: number) => (
              <div key={idx} style={{ border: '1px solid rgba(255,255,255,.08)', overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      padding: '2px 8px', fontFamily: MONO, fontSize: 18, fontWeight: 500,
                      border: '1px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.4)',
                    }}>
                      <E id={`tech_faq[${idx}].category`} editMode={editMode}>{item.category}</E>
                    </span>
                    <span style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>
                      <E id={`tech_faq[${idx}].question`} editMode={editMode}>{item.question}</E>
                    </span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2"
                    style={{ flexShrink: 0, marginLeft: 12, transition: 'transform .2s', transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === idx && (
                  <div style={{ padding: '0 20px 16px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
                    <p style={{ fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,.5)', margin: '12px 0 0' }}>
                      <E id={`tech_faq[${idx}].answer`} editMode={editMode}>{item.answer}</E>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0', background: 'var(--soft)', borderTop: '1px solid var(--line)' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 className="reveal" style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', color: 'var(--ink)', margin: '0 0 16px' }}>
            <E id="tech_cta.title" editMode={editMode}>{cta.title}</E>
          </h2>
          <div className="reveal" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:027068999" className="btn" style={{
              padding: '14px 32px', background: 'var(--accent)', color: '#fff',
              fontWeight: 700, fontSize: 18, textDecoration: 'none',
            }}>전화하기 <E id="tech_contact.tel" editMode={editMode}>{contact.tel}</E></a>
            <Link href="/support/inquiry" style={{
              padding: '14px 32px', border: '1px solid var(--ink)', color: 'var(--ink)',
              fontWeight: 700, fontSize: 18, textDecoration: 'none',
            }}>1:1 문의하기</Link>
          </div>
        </div>
      </section>

      <style>{`
        .tech-team-row { transition: transform .3s cubic-bezier(.16,.84,.3,1), box-shadow .3s; }
        .tech-team-row:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,.08); }
        .tech-proc-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 36px rgba(0,0,0,.07) !important; border-color: var(--accent) !important; }
        .tech-svc > div:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,.07); border-color: var(--accent); }
        @media (max-width: 920px) {
          .tech-team-row { grid-template-columns: 1fr !important; }
          .tech-team-row > div { order: unset !important; }
          .tech-svc { grid-template-columns: 1fr !important; }
          .tech-process { grid-template-columns: 1fr 1fr !important; }
          .tech-hero-img { display: none !important; }
        }
        @media (max-width: 560px) {
          .tech-process { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
