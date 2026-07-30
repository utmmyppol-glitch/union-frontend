'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const IMG = '/images/uploads/2022/06/';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';

const COMPANY_TABS = [
  { label: '기업소개', href: '/company' },
  { label: '주요연혁', href: '/company/history' },
  { label: '오시는 길', href: '/company/location' },
];

/* ── 기본값 ── */
const DEFAULT_HERO = { title: '복잡한 기업 IT를', accent: '하나로 연결', desc: '열정과 전문성을 바탕으로 소프트웨어 유통은 물론, 보안 및 데이터 사업까지 확대하며 제2의 도약을 실현해 가고 있습니다.' };
const DEFAULT_OVERVIEW = { title: 'IT Solution & Consulting 전문기업', text: '주식회사 유니온시스템즈는 2010년 4월 유니온소프트를 시작으로 기업·공공기관을 대상으로 고객의 IT 환경에 필요한 SW, 솔루션을 공급하여 최적의 IT 인프라를 만들어 온 IT Solution & Consulting 전문기업입니다.' };
const DEFAULT_STATS = [
  { num: '16', label: '년 업력' }, { num: '200+', label: '고객사' },
  { num: '4', label: '전문 사업부' }, { num: '50+', label: '파트너사' },
];
const DEFAULT_STRENGTHS = [
  { img: '/images/crawl/unionsystems/sub_unionsystems_point_01_24.jpg', title: '보안', desc: '안랩, 이스트소프트, 오피스키퍼 등 기업용 PC 통합보안 전문 솔루션을 구축, 운영합니다.' },
  { img: '/images/crawl/unionsystems/sub_unionsystems_point_02_25.jpg', title: '자산관리', desc: '넷클라이언트 등 기업 IT환경에 적합한 SW, HW 자산관리를 지원합니다.' },
  { img: '/images/crawl/unionsystems/sub_unionsystems_point_03_26.jpg', title: '데이터', desc: '엔코아의 DA# 공인총판으로 데이터모델링 툴의 유통, 기술지원, 교육을 지원합니다.' },
  { img: '/images/crawl/unionsystems/sub_unionsystems_point_04_27.jpg', title: '글로벌 파트너십', desc: 'Microsoft, Adobe, Autodesk 등 글로벌 소프트웨어 공식 파트너로서 정품 라이선스를 공급합니다.' },
];
const DEFAULT_VALUES = [
  { num: '01', title: '신뢰', desc: '2010년부터 축적된 경험과 200여 개 고객사의 검증된 파트너십으로 변함없는 신뢰를 드립니다.' },
  { num: '02', title: '전문성', desc: '소프트웨어, 보안, 데이터, 자산관리 각 분야 전문가로 구성된 소수정예 팀이 최적의 솔루션을 제공합니다.' },
  { num: '03', title: '파트너십', desc: '단순 공급이 아닌 도입부터 운영, 유지보수까지 전 과정을 함께하는 진정한 IT 파트너가 되겠습니다.' },
];
const DEFAULT_DEPTS = [
  { name: '솔루션사업부', desc: 'DATA / SW / SI 사업팀' }, { name: '영업부', desc: '공공영업 / 기업영업 / 교육영업' },
  { name: '서비스사업부', desc: '기술지원 팀' }, { name: '사업지원부', desc: '리뉴얼 / 마케팅 / 영업지원' },
];
const DEFAULT_ORG = { img: '/images/crawl/unionsystems/about_organization_chart_30.jpg', title: '소수정예 전문가 조직', text: '각 분야의 전문가들이 고객의 IT 환경을 책임집니다.' };
const DEFAULT_CI = { img: '/images/crawl/unionsystems/about_ci_31.jpg', title: '기업 아이덴티티', subtitle: 'UNION RED는 고객을 향한 열정을 담고 있습니다', quote: '고객과 신뢰로 만들어진 유니온시스템즈,\n함께 구축하겠다는 열정을 담고 있습니다.', ceo: 'CEO 홍민석' };
const DEFAULT_CTA = { title: '유니온시스템즈와 함께 시작하세요', desc: '귀사의 IT 환경에 최적화된 솔루션을 제안해 드립니다.' };

const CONTENT_KEYS = ['company_hero','company_overview','company_stats','company_strengths','company_values','company_depts','company_org','company_ci','company_cta'];

function safeParse<T>(json: string | undefined, fallback: T): T {
  if (!json) return fallback;
  try { return JSON.parse(json); } catch { return fallback; }
}

/* ── 편집모드 컴포넌트 ── */
function E({ id, editMode, children, tag: Tag = 'span' }: { id: string; editMode: boolean; children: React.ReactNode; tag?: 'span' | 'div' | 'p' }) {
  if (!editMode) return <>{children}</>;
  return (
    <Tag
      data-editable={id}
      onClick={(e: React.MouseEvent) => { e.stopPropagation(); window.parent.postMessage({ type: 'field-click', id }, '*'); }}
      style={{ cursor: 'pointer', position: 'relative' }}
      className="editable-field"
    >
      {children}
    </Tag>
  );
}

function EImg({ id, editMode, src, alt, style, onError }: { id: string; editMode: boolean; src: string; alt: string; style: React.CSSProperties; onError?: React.ReactEventHandler<HTMLImageElement> }) {
  return (
    <img
      src={src} alt={alt} style={style} onError={onError}
      data-editable={editMode ? id : undefined}
      className={editMode ? 'editable-field editable-image' : undefined}
      onClick={editMode ? (e) => { e.stopPropagation(); window.parent.postMessage({ type: 'field-click', id }, '*'); } : undefined}
    />
  );
}

export default function CompanyPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('_edit') === '1') {
      setEditMode(true);
    }
  }, []);

  const [hero, setHero] = useState(DEFAULT_HERO);
  const [overview, setOverview] = useState(DEFAULT_OVERVIEW);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [strengths, setStrengths] = useState(DEFAULT_STRENGTHS);
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [depts, setDepts] = useState(DEFAULT_DEPTS);
  const [org, setOrg] = useState(DEFAULT_ORG);
  const [ci, setCi] = useState(DEFAULT_CI);
  const [cta, setCta] = useState(DEFAULT_CTA);

  const stateMap: Record<string, { get: unknown; set: (v: unknown) => void }> = {
    company_hero: { get: hero, set: setHero as (v: unknown) => void },
    company_overview: { get: overview, set: setOverview as (v: unknown) => void },
    company_stats: { get: stats, set: setStats as (v: unknown) => void },
    company_strengths: { get: strengths, set: setStrengths as (v: unknown) => void },
    company_values: { get: values, set: setValues as (v: unknown) => void },
    company_depts: { get: depts, set: setDepts as (v: unknown) => void },
    company_org: { get: org, set: setOrg as (v: unknown) => void },
    company_ci: { get: ci, set: setCi as (v: unknown) => void },
    company_cta: { get: cta, set: setCta as (v: unknown) => void },
  };

  // API에서 콘텐츠 로드
  useEffect(() => {
    const base = API_URL.replace(/\/api\/union\/?$/, '');
    fetch(`${base}/api/union/content?keys=${CONTENT_KEYS.join(',')}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data: Record<string, string> | null) => {
        if (!data) return;
        if (data.company_hero) setHero(safeParse(data.company_hero, DEFAULT_HERO));
        if (data.company_overview) setOverview(safeParse(data.company_overview, DEFAULT_OVERVIEW));
        if (data.company_stats) setStats(safeParse(data.company_stats, DEFAULT_STATS));
        if (data.company_strengths) setStrengths(safeParse(data.company_strengths, DEFAULT_STRENGTHS));
        if (data.company_values) setValues(safeParse(data.company_values, DEFAULT_VALUES));
        if (data.company_depts) setDepts(safeParse(data.company_depts, DEFAULT_DEPTS));
        if (data.company_org) setOrg(safeParse(data.company_org, DEFAULT_ORG));
        if (data.company_ci) setCi(safeParse(data.company_ci, DEFAULT_CI));
        if (data.company_cta) setCta(safeParse(data.company_cta, DEFAULT_CTA));
      })
      .catch(() => {});
  }, []);

  // postMessage 수신: 백오피스에서 실시간 값 업데이트
  useEffect(() => {
    if (!editMode) return;
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'content-update') {
        const { section, data: newData } = e.data;
        const entry = stateMap[section];
        if (entry) entry.set(newData);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode]);

  // IntersectionObserver
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
    <div ref={pageRef}>
      {/* ═══ Hero ═══ */}
      <section style={{ position: 'relative', background: 'var(--charcoal)', minHeight: 480, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/images/crawl/unionsystems/customer_header_img-01_5.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 80%, rgba(148,53,67,.08) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div className="blob blob-accent" aria-hidden="true" style={{ width: 380, height: 380, right: '5%', top: '8%' }} />
        <div className="blob blob-wine" aria-hidden="true" style={{ width: 260, height: 260, left: '8%', bottom: '10%', animationDelay: '7s' }} />
        <div aria-hidden="true" style={{ position: 'absolute', width: 18, height: 18, right: '18%', top: '25%', border: '1.5px solid rgba(255,255,255,.08)', transform: 'rotate(45deg)', animation: 'geoFloat1 14s ease-in-out infinite', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', right: '-3%', top: '15%', fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(120px, 20vw, 300px)', fontWeight: 300, color: 'rgba(255,255,255,.025)', lineHeight: 1, pointerEvents: 'none' }}>About</div>

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 640, padding: '120px 0 40px' }}>
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,.4)', margin: '0 0 16px' }}>ABOUT US</p>
            <h1 style={{ fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)', lineHeight: .92, letterSpacing: '-.045em', color: '#fff', margin: '0 0 20px' }}>
              <E id="company_hero.title" editMode={editMode}>{hero.title}</E><br />
              <span style={{ color: 'var(--accent)' }}><E id="company_hero.accent" editMode={editMode}>{hero.accent}</E></span>합니다
            </h1>
            <p style={{ fontWeight: 400, fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,.5)', maxWidth: 640, margin: 0 }}>
              <E id="company_hero.desc" editMode={editMode}>{hero.desc}</E>
            </p>
            <div style={{ display: 'flex', gap: 4, marginTop: 32 }}>
              {COMPANY_TABS.map((tab) => {
                const isActive = pathname === tab.href;
                return <Link key={tab.href} href={tab.href} style={{ padding: '10px 20px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize: 14, fontWeight: 500, letterSpacing: '.06em', color: isActive ? '#fff' : 'rgba(255,255,255,.35)', textDecoration: 'none', background: isActive ? 'rgba(255,255,255,.1)' : 'transparent', border: isActive ? '1px solid rgba(255,255,255,.15)' : '1px solid transparent', transition: 'all .2s' }}>{tab.label}</Link>;
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Stats ═══ */}
      <section style={{ padding: 'clamp(80px, 7vw, 80px) 0', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />
        <div className="wrap">
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>COMPANY OVERVIEW</p>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', lineHeight: .95, letterSpacing: '-.04em', margin: '0 0 16px' }}>
              <E id="company_overview.title" editMode={editMode}>{overview.title}</E>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink2)', maxWidth: 680, margin: 0 }}>
              <E id="company_overview.text" editMode={editMode}>{overview.text}</E>
            </p>
          </div>
          <div className="reveal about-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, borderTop: '1px solid var(--line)', paddingTop: 40 }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(36px, 5.5vw, 64px)', fontWeight: 300, color: 'var(--ink)', margin: '0 0 4px', lineHeight: 1 }}>
                  <E id={`company_stats.${i}.num`} editMode={editMode}>{s.num}</E>
                </p>
                <p style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize: 13, fontWeight: 500, letterSpacing: '.08em', color: 'var(--ink2)', margin: 0 }}>
                  <E id={`company_stats.${i}.label`} editMode={editMode}>{s.label}</E>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Strengths ═══ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0', background: 'var(--soft)', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />
        <div className="blob blob-graphite" aria-hidden="true" style={{ width: 300, height: 300, right: '3%', top: '15%', animationDelay: '4s' }} />
        <div className="wrap">
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>OUR STRENGTHS</p>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', lineHeight: .95, letterSpacing: '-.04em', margin: 0 }}>유니온시스템즈가<br />선택받는 이유</h2>
          </div>
          <div className="about-strengths" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {strengths.map((item, idx) => (
              <div key={item.title} className="reveal about-str-card" style={{ border: '1px solid var(--line)', background: 'var(--surface)', overflow: 'hidden', transition: 'transform .25s cubic-bezier(.16,.84,.3,1), box-shadow .25s', transitionDelay: `${idx * 0.06}s` }}>
                <div style={{ height: 220, overflow: 'hidden', position: 'relative' }}>
                  <EImg id={`company_strengths.${idx}.img`} editMode={editMode} src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <span style={{ position: 'absolute', top: 16, left: 16, fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic', fontSize: 22, fontWeight: 300, color: '#fff', background: 'var(--charcoal)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{String(idx + 1).padStart(2, '0')}</span>
                </div>
                <div style={{ padding: 28 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 17, color: 'var(--ink)', margin: '0 0 8px' }}><E id={`company_strengths.${idx}.title`} editMode={editMode}>{item.title}</E></h3>
                  <p style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--ink2)', margin: 0 }}><E id={`company_strengths.${idx}.desc`} editMode={editMode}>{item.desc}</E></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Core Values ═══ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0', background: 'var(--charcoal)', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 80%, rgba(148,53,67,.05) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,.4)', margin: '0 0 14px' }}>CORE VALUES</p>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', lineHeight: .95, letterSpacing: '-.04em', color: '#fff', margin: 0 }}>핵심 가치</h2>
          </div>
          <div className="about-values" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {values.map((v, idx) => (
              <div key={v.title} className="reveal about-val-card" style={{ border: '1px solid rgba(255,255,255,.08)', padding: 32, transition: 'border-color .3s, transform .25s', transitionDelay: `${idx * 0.06}s` }}>
                <span style={{ fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic', fontSize: 32, fontWeight: 300, color: 'rgba(255,255,255,.1)', display: 'block', marginBottom: 20, lineHeight: 1 }}>{v.num}</span>
                <h3 style={{ fontWeight: 700, fontSize: 17, color: '#fff', margin: '0 0 10px' }}><E id={`company_values.${idx}.title`} editMode={editMode}>{v.title}</E></h3>
                <p style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,.45)', margin: 0 }}><E id={`company_values.${idx}.desc`} editMode={editMode}>{v.desc}</E></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Organization ═══ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0', background: 'var(--surface)', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />
        <div className="wrap">
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>ORGANIZATION</p>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', lineHeight: .95, letterSpacing: '-.04em', margin: '0 0 12px' }}><E id="company_org.title" editMode={editMode}>{org.title}</E></h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink2)', maxWidth: 600, margin: 0 }}><E id="company_org.text" editMode={editMode}>{org.text}</E></p>
          </div>
          <div className="reveal" style={{ border: '1px solid var(--line)', overflow: 'hidden', marginBottom: 32 }}>
            <EImg id="company_org.img" editMode={editMode} src={org.img} alt="유니온시스템즈 조직도" style={{ width: '100%', height: 'auto' }} onError={(e) => { (e.target as HTMLImageElement).src = `${IMG}about_organization_chart.jpg`; }} />
          </div>
          <div className="about-depts" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {depts.map((d, idx) => (
              <div key={d.name} className="reveal" style={{ borderTop: idx === 0 ? '2px solid var(--accent)' : '2px solid var(--line)', padding: '20px 0 0', transitionDelay: `${idx * 0.06}s` }}>
                <h3 style={{ fontWeight: 700, fontSize: 17, color: 'var(--ink)', margin: '0 0 6px' }}><E id={`company_depts.${idx}.name`} editMode={editMode}>{d.name}</E></h3>
                <p style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize: 13, color: 'var(--ink2)', margin: 0, letterSpacing: '.02em' }}><E id={`company_depts.${idx}.desc`} editMode={editMode}>{d.desc}</E></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CI ═══ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />
        <div className="wrap" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <p className="eyebrow" style={{ margin: '0 0 14px' }}>CORPORATE IDENTITY</p>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', lineHeight: .95, letterSpacing: '-.04em', margin: '0 0 12px' }}><E id="company_ci.title" editMode={editMode}>{ci.title}</E></h2>
            <p style={{ fontSize: 16, color: 'var(--ink2)', margin: '0 0 40px' }}><E id="company_ci.subtitle" editMode={editMode}>{ci.subtitle}</E></p>
          </div>
          <div className="reveal" style={{ display: 'inline-block', border: '1px solid var(--line)', background: '#fff', padding: 'clamp(24px, 4vw, 48px)' }}>
            <EImg id="company_ci.img" editMode={editMode} src={ci.img} alt="유니온시스템즈 CI" style={{ maxWidth: 480, width: '100%', height: 'auto' }} onError={(e) => { (e.target as HTMLImageElement).src = `${IMG}about_ci.jpg`; }} />
          </div>
          <div className="reveal" style={{ marginTop: 48, maxWidth: 600, margin: '48px auto 0' }}>
            <blockquote style={{ fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 400, lineHeight: 1.5, color: 'var(--ink)', margin: '0 0 16px' }}>
              <E id="company_ci.quote" editMode={editMode}>
                &ldquo;{ci.quote.split('\n').map((line, i) => (<React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>))}&rdquo;
              </E>
            </blockquote>
            <p style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize: 12, fontWeight: 500, letterSpacing: '.1em', color: 'var(--ink2)', margin: 0 }}>
              <E id="company_ci.ceo" editMode={editMode}>{ci.ceo}</E>
            </p>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: 'clamp(80px, 6vw, 72px) 0', background: 'var(--charcoal)', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(148,53,67,.06) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h2 className="reveal" style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', lineHeight: 1.1, color: '#fff', margin: '0 0 12px', letterSpacing: '-.04em' }}>
            <E id="company_cta.title" editMode={editMode}>{cta.title}</E>
          </h2>
          <p className="reveal" style={{ fontSize: 16, color: 'rgba(255,255,255,.5)', margin: '0 0 32px' }}>
            <E id="company_cta.desc" editMode={editMode}>{cta.desc}</E>
          </p>
          <Link href="/contact" className="reveal btn" style={{ display: 'inline-block', padding: '16px 40px', background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>도입문의 하기 →</Link>
        </div>
      </section>

      <style>{`
        .about-str-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px rgba(0,0,0,.07) !important; }
        .about-str-card:hover img { transform: scale(1.05) !important; }
        .about-val-card:hover { border-color: rgba(255,255,255,.2) !important; transform: translateY(-3px) !important; }
        @media (max-width: 920px) {
          .about-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .about-strengths { grid-template-columns: 1fr !important; }
          .about-values { grid-template-columns: 1fr 1fr !important; }
          .about-depts { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .about-values { grid-template-columns: 1fr !important; }
          .about-depts { grid-template-columns: 1fr !important; }
        }
        .editable-field { transition: outline .15s, outline-offset .15s; outline: 2px solid transparent; outline-offset: 2px; border-radius: 2px; }
        .editable-field:hover { outline: 2px dashed #36c88a !important; outline-offset: 4px; }
        .editable-image { display: block; }
        .editable-image:hover { outline-offset: -2px; }
      `}</style>
    </div>
  );
}
