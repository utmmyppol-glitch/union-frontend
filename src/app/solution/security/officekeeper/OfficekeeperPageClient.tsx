'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { E, safeParse, stripHtml, useEditMode, useEditableManifest, EDITABLE_STYLES } from '@/lib/editable';

const CRAWL = '/images/crawl/unionsystems';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SERIF = "'Newsreader', Georgia, serif";

/* ════════════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════════════ */

const PROBLEMS = [
  { num: '01', title: '내부자 유출', stat: '82%', statLabel: '정보유출 원인', desc: '퇴사자, 불만 직원에 의한 USB/메일 경유 유출이 전체의 82%를 차지합니다.' },
  { num: '02', title: '클라우드 사각지대', stat: '3.7배', statLabel: '클라우드 유출 증가', desc: '재택근무 확산으로 웹메일·클라우드 통한 데이터 유출이 급증하고 있습니다.' },
  { num: '03', title: '사후 대응 한계', stat: '197일', statLabel: '평균 탐지 소요', desc: '유출 후 발견까지 평균 197일. 사전 차단 없이는 대응이 불가능합니다.' },
];

const FEATURES_MAIN = [
  { title: '매체 제어', desc: 'USB, 외장하드, 블루투스 등 모든 이동식 저장매체 통제', tag: 'DEVICE' },
  { title: '네트워크 DLP', desc: '웹메일, 클라우드, SNS 등 네트워크 유출 경로 실시간 차단', tag: 'NETWORK' },
  { title: '출력 보안', desc: '프린터 출력 로그 + 워터마크 자동 삽입', tag: 'PRINT' },
];

const FEATURES_SUB = [
  { title: '화면 캡처 방지', desc: '스크린샷·녹화 차단' },
  { title: 'PC 사용 관리', desc: '근무시간·앱 사용 통제' },
  { title: '소프트웨어 관리', desc: '미허가 SW 설치 제어' },
  { title: '로그 관리', desc: '모든 행위 기록·감사' },
  { title: '정책 관리', desc: '부서별 정책 일괄 적용' },
  { title: '리포트', desc: '대시보드·정기 보고서' },
];

const PROCESS = [
  { num: '01', title: '현황 분석', desc: '기업 보안 환경 진단' },
  { num: '02', title: '정책 설계', desc: '부서별 DLP 정책 수립' },
  { num: '03', title: '에이전트 배포', desc: '중앙 자동 설치' },
  { num: '04', title: '운영 안정화', desc: '2주간 모니터링' },
  { num: '05', title: '유지보수', desc: '전담팀 상시 지원' },
];

const METRICS = [
  { num: '99.9%', label: '유출 차단율' },
  { num: '5분', label: '에이전트 배포' },
  { num: '200+', label: '도입 기업' },
  { num: '24/7', label: '관제 지원' },
];

const FAQS = [
  { q: 'OfficeKeeper 도입 시 직원 PC 성능에 영향이 있나요?', a: '에이전트가 경량화되어 CPU 0.3% 미만, 메모리 30MB 이하로 운영됩니다. 체감할 수 있는 성능 저하는 없습니다.' },
  { q: '렌탈 서비스와 구매의 차이는?', a: '렌탈은 초기 비용 없이 월 단위로 이용하며, 구매는 영구 라이선스입니다. 50인 이하 기업은 렌탈을 추천합니다.' },
  { q: '재택근무 환경에서도 동작하나요?', a: 'VPN 없이도 인터넷만 연결되면 정책이 적용됩니다. 재택/출장 시에도 동일한 보안 수준을 유지합니다.' },
  { q: '기존 보안 솔루션과 충돌은?', a: 'AhnLab V3, Windows Defender 등 주요 백신과 호환 검증 완료. 타 DLP와의 병행 사용도 가능합니다.' },
];

/* ════════════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════════════ */

const DEFAULT_HERO = { title1: '정보유출방지', title2: 'DLP 솔루션', desc: '매체 · 네트워크 · 출력물까지 모든 유출 경로를 차단하는 통합 DLP. 도입부터 운영까지 유니온시스템즈가 책임집니다.', btn: '도입 문의하기 →' };
const DEFAULT_PROBLEMS_DATA = PROBLEMS.map(p => ({ title: p.title, stat: p.stat, statLabel: p.statLabel, desc: p.desc }));
const DEFAULT_FEATURES_MAIN_DATA = FEATURES_MAIN.map(f => ({ title: f.title, desc: f.desc, tag: f.tag }));
const DEFAULT_FEATURES_SUB_DATA = FEATURES_SUB.map(f => ({ title: f.title, desc: f.desc }));
const DEFAULT_PROCESS_DATA = PROCESS.map(p => ({ title: p.title, desc: p.desc }));
const DEFAULT_METRICS_DATA = METRICS.map(m => ({ num: m.num, label: m.label }));
const DEFAULT_FAQS_DATA = FAQS.map(f => ({ q: f.q, a: f.a }));
const DEFAULT_CTA = { title: '정보는 기업의\n가장 중요한 자산입니다.', desc: '유니온시스템즈가 OfficeKeeper로 기업 데이터를 보호합니다.', btn: '도입 문의하기 →' };
const DEFAULT_HERO_TRUST = ['GS 인증', '국내 DLP 1위', '200+ 기업'];
const DEFAULT_CTA_TRUST = ['GS 인증 1등급', '국내 DLP 점유율 1위', '200+ 기업 도입'];

const DEFAULT_SECTIONS = {
  whyTitle: '정보유출, 왜\n사전 차단이 필요한가?',
  whyDesc: '기업 데이터 유출의 대부분은 내부에서 발생합니다. 사후 대응이 아닌, 실시간 차단만이 유일한 해답입니다.',
  solutionTitle: '3대 유출 경로 완전 차단',
  solutionDesc: '매체·네트워크·출력물 — 모든 데이터 반출 경로를 실시간으로 통제합니다.',
  featuresTitle: '9가지 통합 모듈',
  featuresDesc: '하나의 에이전트로 모든 정보보안 기능을 통합 관리합니다.',
  processTitle: '도입 프로세스',
  faqTitle: '자주 묻는 질문',
};

export default function OfficekeeperPageClient({ ssrContent }: { ssrContent: Record<string, string> }) {
  const editMode = useEditMode();
  useEditableManifest(editMode);
  const [hero, setHero] = useState(() => safeParse(ssrContent.officekeeper_hero, DEFAULT_HERO));
  const [problemsData, setProblemsData] = useState(() => safeParse(ssrContent.officekeeper_problems, DEFAULT_PROBLEMS_DATA));
  const [featMainData, setFeatMainData] = useState(() => safeParse(ssrContent.officekeeper_features_main, DEFAULT_FEATURES_MAIN_DATA));
  const [featSubData, setFeatSubData] = useState(() => safeParse(ssrContent.officekeeper_features_sub, DEFAULT_FEATURES_SUB_DATA));
  const [processData, setProcessData] = useState(() => safeParse(ssrContent.officekeeper_process, DEFAULT_PROCESS_DATA));
  const [metricsData, setMetricsData] = useState(() => safeParse(ssrContent.officekeeper_metrics, DEFAULT_METRICS_DATA));
  const [faqsData, setFaqsData] = useState(() => safeParse(ssrContent.officekeeper_faqs, DEFAULT_FAQS_DATA));
  const [cta, setCta] = useState(() => safeParse(ssrContent.officekeeper_cta, DEFAULT_CTA));
  const [sectionsData, setSectionsData] = useState(() => safeParse(ssrContent.officekeeper_sections, DEFAULT_SECTIONS));
  const [heroTrust, setHeroTrust] = useState(() => safeParse(ssrContent.officekeeper_hero_trust, DEFAULT_HERO_TRUST));
  const [ctaTrust, setCtaTrust] = useState(() => safeParse(ssrContent.officekeeper_cta_trust, DEFAULT_CTA_TRUST));
  useEffect(() => {
    if (!editMode) return;
    const setters: Record<string, (v: unknown) => void> = {
      officekeeper_hero: setHero as (v: unknown) => void,
      officekeeper_problems: setProblemsData as (v: unknown) => void,
      officekeeper_features_main: setFeatMainData as (v: unknown) => void,
      officekeeper_features_sub: setFeatSubData as (v: unknown) => void,
      officekeeper_process: setProcessData as (v: unknown) => void,
      officekeeper_metrics: setMetricsData as (v: unknown) => void,
      officekeeper_faqs: setFaqsData as (v: unknown) => void,
      officekeeper_cta: setCta as (v: unknown) => void,
      officekeeper_sections: setSectionsData as (v: unknown) => void,
      officekeeper_hero_trust: setHeroTrust as (v: unknown) => void,
      officekeeper_cta_trust: setCtaTrust as (v: unknown) => void,
    };
    const handler = (e: MessageEvent) => { if (e.data?.type === 'content-update') { const fn = setters[e.data.section]; if (fn) fn(e.data.data); } };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [editMode]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = pageRef.current?.querySelectorAll('.reveal');
    if (!els) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={pageRef} style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      {editMode && <style>{EDITABLE_STYLES}</style>}

      {/* ═══════════════════════════════════════════════════════════════
          § 01 — HERO (Cinematic)
          100vh, 제품 비주얼, 큰 타이포, floating 요소
          ═══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative', background: 'var(--charcoal)',
        minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden',
      }}>
        {/* BG image */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${CRAWL}/solution_list_officekeeper_179.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08 }} />
        {/* Ambient glows */}
        <div aria-hidden="true" style={{ position: 'absolute', top: '10%', right: '5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(245,51,63,.06) 0%, transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '15%', left: '8%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(26,86,219,.04) 0%, transparent 60%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        {/* Guide lines */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.04)', pointerEvents: 'none' }} />
        {/* Corner squares */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 32, left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.12)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: 32, right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.12)' }} />
        {/* DLP watermark */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '-3%', bottom: '-8%',
          fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(280px, 35vw, 560px)',
          fontWeight: 300, color: 'rgba(255,255,255,.02)', lineHeight: .75, pointerEvents: 'none',
        }}>DLP</div>
        {/* Section number */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 40, right: 'clamp(24px,4vw,60px)',
          fontFamily: SERIF, fontStyle: 'italic', fontSize: 64, fontWeight: 300,
          color: 'rgba(255,255,255,.06)', pointerEvents: 'none',
        }}>01</div>

        {/* Content */}
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 clamp(20px,4vw,52px)', position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="ok-hero-grid">
            {/* Left — text */}
            <div style={{ padding: '120px 0 80px' }}>
              <p style={{ fontFamily: MONO, fontWeight: 500, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 20px' }}>OfficeKeeper · DLP</p>
              <h1 style={{ fontWeight: 900, fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: .88, letterSpacing: '-.05em', color: '#fff', margin: '0 0 24px' }}>
                <E id="officekeeper_hero.title1" editMode={editMode}>{hero.title1}</E><br />
                <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400 }}><E id="officekeeper_hero.title2" editMode={editMode}>{hero.title2}</E></span>
              </h1>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,.5)', maxWidth: 400, margin: '0 0 36px' }}>
                <E id="officekeeper_hero.desc" editMode={editMode}>{hero.desc}</E>
              </p>
              <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                <Link href="/contact" style={{ padding: '16px 36px', background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}><E id="officekeeper_hero.btn" editMode={editMode}>{hero.btn}</E></Link>
                <a href="tel:02-706-8999" style={{ padding: '16px 28px', border: '1px solid rgba(255,255,255,.2)', color: 'rgba(255,255,255,.7)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>02-706-8999</a>
              </div>
              {/* Trust strip */}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {heroTrust.map((t: string, i: number) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,.4)' }}>
                    <span style={{ color: '#34d399' }}>✓</span><E id={`officekeeper_hero_trust.${i}`} editMode={editMode}>{t}</E>
                  </span>
                ))}
              </div>
            </div>
            {/* Right — floating dashboard mock */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: '100%', maxWidth: 420, aspectRatio: '4/3',
                background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)',
                position: 'relative', overflow: 'hidden',
              }}>
                <Image src={`${CRAWL}/solution_list_officekeeper_179.jpg`} alt="OfficeKeeper Dashboard" fill style={{ objectFit: 'cover', opacity: .6 }} />
                {/* Floating panel */}
                <div style={{
                  position: 'absolute', bottom: 20, right: -20,
                  padding: '14px 18px', background: 'rgba(20,18,16,.9)',
                  border: '1px solid rgba(255,255,255,.1)', backdropFilter: 'blur(8px)',
                }}>
                  <p style={{ fontFamily: MONO, fontSize: 12, color: 'rgba(255,255,255,.5)', margin: '0 0 4px' }}>BLOCK RATE</p>
                  <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 28, fontWeight: 400, color: '#fff', margin: 0 }}>99.9%</p>
                </div>
                {/* Floating badge top-left */}
                <div style={{
                  position: 'absolute', top: 16, left: 16,
                  padding: '6px 12px', background: 'var(--accent)',
                  fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: '.06em', color: '#fff',
                }}>LIVE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          § 02 — WHY (Editorial)
          문제 제기. 카드 없이 큰 문장 + 숫자로 읽게 만드는 섹션
          ═══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(100px,12vw,160px) 0',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Viewport decor */}
        <div aria-hidden="true" style={{ position: 'absolute', top: '8%', left: '-5%', fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(200px,25vw,400px)', fontWeight: 300, color: 'var(--line)', opacity: .2, lineHeight: .8, pointerEvents: 'none', userSelect: 'none' }}>Why?</div>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 32, right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 40, right: 'clamp(60px,8vw,120px)', fontFamily: SERIF, fontStyle: 'italic', fontSize: 64, fontWeight: 300, color: 'var(--line)', opacity: .3, pointerEvents: 'none' }}>02</div>

        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 clamp(20px,4vw,52px)', position: 'relative', zIndex: 1 }}>
          {/* Big editorial question */}
          <div className="reveal" style={{ maxWidth: 700, marginBottom: 64 }}>
            <p style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.14em', color: 'var(--ink2)', textTransform: 'uppercase', margin: '0 0 16px' }}>WHY DLP</p>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(30px,4.5vw,52px)', lineHeight: 1.1, letterSpacing: '-.04em', margin: '0 0 20px' }}>
              <E id="officekeeper_sections.whyTitle" editMode={editMode}>
                {stripHtml(sectionsData.whyTitle).split('\n').map((line: string, i: number) => (
                  <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
                ))}
              </E>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--ink2)', maxWidth: 500 }}>
              <E id="officekeeper_sections.whyDesc" editMode={editMode}>{sectionsData.whyDesc}</E>
            </p>
          </div>

          {/* 3 problems — not cards, editorial style with big numbers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {PROBLEMS.map((p, pi) => (
              <div key={p.num} className="reveal" style={{
                display: 'grid', gridTemplateColumns: '140px 1fr', gap: 32,
                padding: '40px 0', borderTop: '1px solid var(--line)',
                alignItems: 'baseline',
              }}>
                {/* Big stat */}
                <div>
                  <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(36px,5vw,56px)', fontWeight: 400, color: 'var(--accent)', margin: 0, lineHeight: 1 }}><E id={`officekeeper_problems.${pi}.stat`} editMode={editMode}>{problemsData[pi]?.stat ?? p.stat}</E></p>
                  <p style={{ fontFamily: MONO, fontSize: 12, fontWeight: 500, letterSpacing: '.06em', color: 'var(--ink2)', margin: '8px 0 0' }}><E id={`officekeeper_problems.${pi}.statLabel`} editMode={editMode}>{problemsData[pi]?.statLabel ?? p.statLabel}</E></p>
                </div>
                {/* Text */}
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: 20, margin: '0 0 8px', letterSpacing: '-.02em' }}><E id={`officekeeper_problems.${pi}.title`} editMode={editMode}>{problemsData[pi]?.title ?? p.title}</E></h3>
                  <div style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink2)', margin: 0, maxWidth: 500 }}><E id={`officekeeper_problems.${pi}.desc`} editMode={editMode}>{problemsData[pi]?.desc ?? p.desc}</E></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          § 03 — SOLUTION (Blueprint)
          핵심 3대 차단 경로. 가장 많은 화면 사용. 비대칭 레이아웃.
          ═══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(100px,12vw,160px) 0',
        background: 'var(--charcoal)', position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '5%', right: '-3%', fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(200px,24vw,380px)', fontWeight: 300, color: 'rgba(255,255,255,.02)', lineHeight: .8, pointerEvents: 'none' }}>Block</div>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.015) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 40, left: 'clamp(24px,4vw,60px)', fontFamily: SERIF, fontStyle: 'italic', fontSize: 64, fontWeight: 300, color: 'rgba(255,255,255,.05)', pointerEvents: 'none' }}>03</div>

        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 clamp(20px,4vw,52px)', position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ marginBottom: 56 }}>
            <p style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.14em', color: 'rgba(255,255,255,.4)', margin: '0 0 14px' }}>SOLUTION</p>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px,3.5vw,40px)', lineHeight: 1.05, letterSpacing: '-.04em', color: '#fff', margin: '0 0 14px' }}><E id="officekeeper_sections.solutionTitle" editMode={editMode}>{sectionsData.solutionTitle}</E></h2>
            <div style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,.45)', maxWidth: 440 }}><E id="officekeeper_sections.solutionDesc" editMode={editMode}>{sectionsData.solutionDesc}</E></div>
          </div>

          {/* 비대칭 bento: 큰 카드 1개 + 작은 2개 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }} className="ok-sol-grid">
            {/* Hero card */}
            <div className="reveal" style={{
              gridRow: 'span 2', padding: '40px 36px',
              border: '1px solid rgba(255,255,255,.1)', background: 'rgba(245,51,63,.03)',
              position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              <div aria-hidden="true" style={{ position: 'absolute', right: -10, bottom: -20, fontFamily: SERIF, fontStyle: 'italic', fontSize: 160, fontWeight: 300, color: 'rgba(255,255,255,.03)', pointerEvents: 'none' }}>01</div>
              <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, letterSpacing: '.1em', color: 'var(--accent)', marginBottom: 16, display: 'block' }}><E id="officekeeper_features_main.0.tag" editMode={editMode}>{featMainData[0]?.tag ?? FEATURES_MAIN[0].tag}</E></span>
              <h3 style={{ fontWeight: 900, fontSize: 28, color: '#fff', margin: '0 0 14px', letterSpacing: '-.02em' }}><E id="officekeeper_features_main.0.title" editMode={editMode}>{featMainData[0]?.title ?? FEATURES_MAIN[0].title}</E></h3>
              <div style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,.55)', margin: '0 0 24px', maxWidth: 400 }}><E id="officekeeper_features_main.0.desc" editMode={editMode}>{featMainData[0]?.desc ?? FEATURES_MAIN[0].desc}</E></div>
              <div style={{ marginTop: 'auto', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {['USB', '외장HDD', '블루투스', 'CD/DVD', 'SD카드'].map((t) => (
                  <span key={t} style={{ padding: '5px 12px', border: '1px solid rgba(255,255,255,.12)', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.5)' }}>{t}</span>
                ))}
              </div>
            </div>
            {/* Small cards */}
            {FEATURES_MAIN.slice(1).map((f, i) => (
              <div key={f.title} className="reveal" style={{
                padding: '32px 28px', border: '1px solid rgba(255,255,255,.08)',
                background: 'rgba(255,255,255,.02)', position: 'relative', overflow: 'hidden',
              }}>
                <div aria-hidden="true" style={{ position: 'absolute', right: 8, bottom: -8, fontFamily: SERIF, fontStyle: 'italic', fontSize: 80, fontWeight: 300, color: 'rgba(255,255,255,.03)', pointerEvents: 'none' }}>{String(i + 2).padStart(2, '0')}</div>
                <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, letterSpacing: '.1em', color: 'rgba(255,255,255,.35)', marginBottom: 12, display: 'block' }}><E id={`officekeeper_features_main.${i + 1}.tag`} editMode={editMode}>{featMainData[i + 1]?.tag ?? f.tag}</E></span>
                <h3 style={{ fontWeight: 800, fontSize: 20, color: '#fff', margin: '0 0 8px' }}><E id={`officekeeper_features_main.${i + 1}.title`} editMode={editMode}>{featMainData[i + 1]?.title ?? f.title}</E></h3>
                <div style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,.45)', margin: 0 }}><E id={`officekeeper_features_main.${i + 1}.desc`} editMode={editMode}>{featMainData[i + 1]?.desc ?? f.desc}</E></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          § 04 — FEATURES (Magazine)
          6개 보조 기능 — 비대칭 매거진 레이아웃
          ═══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(100px,12vw,160px) 0', background: 'var(--soft)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-5%', right: '-3%', fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(160px,20vw,300px)', fontWeight: 300, color: 'var(--line)', opacity: .2, pointerEvents: 'none' }}>Feat.</div>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '44px 44px', opacity: .15, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 40, right: 'clamp(24px,4vw,60px)', fontFamily: SERIF, fontStyle: 'italic', fontSize: 64, fontWeight: 300, color: 'var(--line)', opacity: .25, pointerEvents: 'none' }}>04</div>

        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 clamp(20px,4vw,52px)', position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.14em', color: 'var(--ink2)', textTransform: 'uppercase', margin: '0 0 14px' }}>FEATURES</p>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px,3.5vw,40px)', lineHeight: 1.05, letterSpacing: '-.04em', margin: '0 0 12px' }}><E id="officekeeper_sections.featuresTitle" editMode={editMode}>{sectionsData.featuresTitle}</E></h2>
            <div style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink2)', maxWidth: 400 }}><E id="officekeeper_sections.featuresDesc" editMode={editMode}>{sectionsData.featuresDesc}</E></div>
          </div>

          {/* Magazine layout: 2 big + 4 small */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 16 }} className="ok-feat-mag">
            {FEATURES_SUB.map((f, i) => {
              const isBig = i < 2;
              return (
                <div key={f.title} className="reveal ok-feat-card" style={{
                  padding: isBig ? '36px 28px' : '24px 20px',
                  border: '1px solid var(--line)', background: 'var(--surface)',
                  gridColumn: i === 0 ? 'span 1' : undefined,
                  gridRow: i === 0 ? 'span 2' : undefined,
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                  transition: 'transform .2s, border-color .2s, box-shadow .2s',
                }}>
                  <div aria-hidden="true" style={{ position: 'absolute', right: 6, bottom: -6, fontFamily: SERIF, fontStyle: 'italic', fontSize: isBig ? 72 : 48, fontWeight: 300, color: 'var(--line)', opacity: .3, pointerEvents: 'none' }}>{String(i + 4).padStart(2, '0')}</div>
                  <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: isBig ? 22 : 16, fontWeight: 300, color: isBig ? 'var(--accent)' : 'var(--line)', display: 'block', marginBottom: isBig ? 12 : 8 }}>{String(i + 4).padStart(2, '0')}</span>
                  <h3 style={{ fontWeight: 700, fontSize: isBig ? 18 : 16, color: 'var(--ink)', margin: '0 0 6px' }}><E id={`officekeeper_features_sub.${i}.title`} editMode={editMode}>{featSubData[i]?.title ?? f.title}</E></h3>
                  <div style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--ink2)', margin: 0 }}><E id={`officekeeper_features_sub.${i}.desc`} editMode={editMode}>{featSubData[i]?.desc ?? f.desc}</E></div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 500, letterSpacing: '.06em', color: 'var(--ink2)', opacity: .5 }}>9 MODULES · 1 AGENT · UNIFIED DLP</span>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          § 05 — PROCESS (Timeline)
          도입 프로세스 5단계. 스크롤 활성화 스타일.
          ═══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(100px,12vw,160px) 0',
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .15, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 40, left: 'clamp(24px,4vw,60px)', fontFamily: SERIF, fontStyle: 'italic', fontSize: 64, fontWeight: 300, color: 'var(--line)', opacity: .25, pointerEvents: 'none' }}>05</div>

        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 clamp(20px,4vw,52px)', position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ marginBottom: 56 }}>
            <p style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.14em', color: 'var(--ink2)', textTransform: 'uppercase', margin: '0 0 14px' }}>PROCESS</p>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px,3.5vw,40px)', lineHeight: 1.05, letterSpacing: '-.04em', margin: 0 }}><E id="officekeeper_sections.processTitle" editMode={editMode}>{sectionsData.processTitle}</E></h2>
          </div>

          {/* Timeline — vertical left line + steps */}
          <div style={{ position: 'relative', paddingLeft: 48 }}>
            {/* Vertical line */}
            <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 20, width: 2, background: 'var(--line)', opacity: .4 }} />

            {PROCESS.map((s, i) => (
              <div key={s.num} className="reveal" style={{
                position: 'relative', paddingBottom: i < PROCESS.length - 1 ? 48 : 0,
              }}>
                {/* Dot on line */}
                <div style={{
                  position: 'absolute', left: -36, top: 4,
                  width: 14, height: 14, border: '2px solid var(--accent)',
                  background: i === 0 ? 'var(--accent)' : 'var(--surface)',
                }} />
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                  <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 28, fontWeight: 400, color: 'var(--accent)', opacity: .6 }}>{s.num}</span>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: 18, margin: '0 0 4px' }}><E id={`officekeeper_process.${i}.title`} editMode={editMode}>{processData[i]?.title ?? s.title}</E></h3>
                    <div style={{ fontSize: 15, color: 'var(--ink2)', margin: 0 }}><E id={`officekeeper_process.${i}.desc`} editMode={editMode}>{processData[i]?.desc ?? s.desc}</E></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          § 06 — METRICS (Infographic)
          큰 숫자 — 카드에 넣지 않고 editorial 스타일
          ═══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(80px,10vw,120px) 0',
        background: 'var(--charcoal)', position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(245,51,63,.04) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 clamp(20px,4vw,52px)', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }} className="ok-metrics-grid">
            {METRICS.map((m, i) => (
              <div key={m.label} className="reveal" style={{
                textAlign: 'center', padding: '32px 16px',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,.08)' : 'none',
              }}>
                <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(36px,5vw,56px)', fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1 }}><E id={`officekeeper_metrics.${i}.num`} editMode={editMode}>{metricsData[i]?.num ?? m.num}</E></p>
                <p style={{ fontFamily: MONO, fontSize: 12, fontWeight: 500, letterSpacing: '.06em', color: 'rgba(255,255,255,.4)', margin: '10px 0 0' }}><E id={`officekeeper_metrics.${i}.label`} editMode={editMode}>{metricsData[i]?.label ?? m.label}</E></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          § 07 — FAQ (Minimal)
          Accordion
          ═══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(100px,12vw,160px) 0',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 40, right: 'clamp(24px,4vw,60px)', fontFamily: SERIF, fontStyle: 'italic', fontSize: 64, fontWeight: 300, color: 'var(--line)', opacity: .2, pointerEvents: 'none' }}>07</div>

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 clamp(20px,4vw,52px)', position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.14em', color: 'var(--ink2)', textTransform: 'uppercase', margin: '0 0 14px' }}>FAQ</p>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px,3.5vw,40px)', lineHeight: 1.05, letterSpacing: '-.04em', margin: 0 }}><E id="officekeeper_sections.faqTitle" editMode={editMode}>{sectionsData.faqTitle}</E></h2>
          </div>

          {FAQS.map((faq, i) => (
            <div key={i} className="reveal" style={{ borderBottom: '1px solid var(--line)' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', textAlign: 'left', padding: '24px 0',
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', lineHeight: 1.4 }}><E id={`officekeeper_faqs.${i}.q`} editMode={editMode}>{faqsData[i]?.q ?? faq.q}</E></span>
                <span style={{ fontFamily: SERIF, fontSize: 20, color: 'var(--ink2)', flexShrink: 0, transition: 'transform .2s', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 0 24px', fontSize: 15, lineHeight: 1.7, color: 'var(--ink2)', maxWidth: 600 }}>
                  <E id={`officekeeper_faqs.${i}.a`} editMode={editMode}>{faqsData[i]?.a ?? faq.a}</E>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          § 08 — CTA (Luxury)
          Huge Typography + Background motion hint
          ═══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(100px,14vw,180px) 0',
        background: 'var(--charcoal)', position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', left: '-3%', bottom: '-10%', fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(200px,28vw,480px)', fontWeight: 300, color: 'rgba(255,255,255,.02)', lineHeight: .8, pointerEvents: 'none' }}>Secure</div>
        <div aria-hidden="true" style={{ position: 'absolute', top: '20%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(245,51,63,.05) 0%, transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 clamp(20px,4vw,52px)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 56, fontWeight: 300, color: 'var(--accent)', lineHeight: 1, marginBottom: 20, opacity: .4 }}>&ldquo;</div>
          <h2 className="reveal" style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(28px,4vw,48px)', lineHeight: 1.3, color: '#fff', margin: '0 0 16px' }}>
            <E id="officekeeper_cta.title" editMode={editMode}>
              {stripHtml(cta.title).split('\n').map((line: string, i: number) => (
                <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
              ))}
            </E>
          </h2>
          <p className="reveal" style={{ fontSize: 16, color: 'rgba(255,255,255,.45)', margin: '0 0 40px', lineHeight: 1.7 }}>
            <E id="officekeeper_cta.desc" editMode={editMode}>{cta.desc}</E>
          </p>
          <div className="reveal" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <Link href="/contact" style={{ padding: '18px 40px', background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}><E id="officekeeper_cta.btn" editMode={editMode}>{cta.btn}</E></Link>
            <a href="tel:02-706-8999" style={{ padding: '18px 36px', border: '1px solid rgba(255,255,255,.2)', color: 'rgba(255,255,255,.7)', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>02-706-8999</a>
          </div>
          <div className="reveal" style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {ctaTrust.map((t: string, i: number) => (
              <span key={i} style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,.35)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#34d399' }}>✓</span><E id={`officekeeper_cta_trust.${i}`} editMode={editMode}>{t}</E>
              </span>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
        .reveal.visible { opacity: 1; transform: none; }
        .ok-feat-card:hover { transform: translateY(-3px) !important; border-color: var(--accent) !important; box-shadow: 0 8px 28px rgba(0,0,0,.06) !important; }
        @media (max-width: 960px) {
          .ok-hero-grid { grid-template-columns: 1fr !important; }
          .ok-sol-grid { grid-template-columns: 1fr !important; }
          .ok-feat-mag { grid-template-columns: 1fr 1fr !important; }
          .ok-metrics-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .ok-feat-mag { grid-template-columns: 1fr !important; }
          .ok-metrics-grid { grid-template-columns: 1fr !important; }
        }
      ` }} />
    </div>
  );
}
