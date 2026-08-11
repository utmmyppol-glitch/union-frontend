'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { E, OptImg, safeParse, stripHtml, useEditableContent, EDITABLE_STYLES, BACKOFFICE_ORIGIN } from '@/lib/editable';

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
  { name: '조성준', position: '차장/팀장', email: 'kevin@unionsystems.co.kr' },
  { name: '박상현', position: '차장', email: 'mite5@unionsystems.co.kr' },
];

const DEFAULT_DA_TEAM: { name: string; position: string; email: string }[] = [];

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

const DEFAULT_CTA = { title: '기술지원이 필요하신가요?', btn_call: '전화하기', btn_inquiry: '1:1 문의하기' };

const DEFAULT_SECTIONS = {
  services_title: '무엇을 도와드릴까요?',
  services_desc: 'IT 전체 역할 없이 기존 IT 자산 상담, 분석하세요',
  process_title: '기술지원 프로세스',
  contact_title: '기술지원 안내',
  faq_title: '자주 묻는 질문',
};
const DEFAULT_LABELS = { tel: '전화 문의', hours: '운영시간', tech_team: '기술지원팀', da_team: 'DA팀' };

const DEFAULT_CONTACT = {
  tel: '02-706-8999',
  hours: '평일 10 – 18시 (점심시간 12:00 – 13:00 제외, 주말 및 공휴일 휴무)',
};

const DEFAULT_TEAM_INTRO = {
  title: '유니온시스템즈 서비스',
  subtitle: '소프트웨어 라이선스 관리, 솔루션 유지보수',
  support_name: '기술지원 팀',
  support_desc: '전담 엔지니어 배정, 도입 및 업무 적용 지원, 절차화 된 프로세스, 유지보수, 이슈대응, 원격지원, 장애처리',
  renewal_name: '리뉴얼 팀',
  renewal_desc: '벤더(개발사)와 긴밀한 연결, 소프트웨어 라이선스 정책 안내, 갱신관리, 성능 향상을 위한 교육, 세미나',
};

/* ── useEditableContent DEFAULTS ── */
const DEFAULTS = {
  tech_hero: DEFAULT_HERO,
  tech_services: DEFAULT_SERVICES,
  tech_process: DEFAULT_PROCESS,
  tech_faq: DEFAULT_FAQ,
  tech_mid: DEFAULT_MID,
  tech_cta: DEFAULT_CTA,
  tech_contact: DEFAULT_CONTACT,
  tech_team_intro: DEFAULT_TEAM_INTRO,
  tech_sections: DEFAULT_SECTIONS,
  tech_labels: DEFAULT_LABELS,
} as const;

/* 담당자 문자열 "이름 | 직책 | 이메일" 줄 파싱/합치기 */
function parseMembers(str: string): { name: string; position: string; email: string }[] {
  return (str || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const parts = l.split('|').map((x) => x.trim());
    return { name: parts[0] || '', position: parts[1] || '', email: parts[2] || '' };
  });
}
function joinMembers(rows: { name: string; position: string; email: string }[]): string {
  return rows.map((r) => `${r.name} | ${r.position} | ${r.email}`).join('\n');
}

/* 담당자 테이블: 로컬 상태 + 통째 저장(field-set 전체 배열). array-action 미사용 → 중복추가 원천 차단 */
function TechTeamsTable({ initial, editMode }: { initial: { label: string; members: string }[]; editMode: boolean }) {
  const [groups, setGroups] = useState(initial);
  const commit = (g: { label: string; members: string }[]) => {
    setGroups(g);
    window.parent.postMessage({ type: 'field-set', id: 'tech_teams', value: g }, BACKOFFICE_ORIGIN);
  };
  const addTeam = () => commit([...groups, { label: '', members: '' }]);
  const delTeam = (gi: number) => commit(groups.filter((_, i) => i !== gi));
  const setLabel = (gi: number, v: string) => commit(groups.map((g, i) => (i === gi ? { ...g, label: v } : g)));
  const setMembers = (gi: number, rows: { name: string; position: string; email: string }[]) =>
    commit(groups.map((g, i) => (i === gi ? { ...g, members: joinMembers(rows) } : g)));

  const inputStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box', border: '1px dashed var(--line)', background: '#fff', font: 'inherit', color: 'inherit', padding: '5px 7px', borderRadius: 3 };

  return (
    <div className="reveal" style={{ border: '1px solid var(--line)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 18 }}>
        <tbody>
          {groups.map((g, gi) => {
            const rows = parseMembers(g.members);
            const shown = editMode ? rows : rows.filter((m) => m.name || m.position || m.email);
            const span = (editMode ? rows.length + 1 : shown.length) || 1;
            const border = gi > 0 ? '1px solid var(--line)' : undefined;
            const setField = (mi: number, k: 'name' | 'position' | 'email', v: string) => setMembers(gi, rows.map((r, j) => (j === mi ? { ...r, [k]: v } : r)));
            const delMember = (mi: number) => setMembers(gi, rows.filter((_, j) => j !== mi));
            const addMember = () => setMembers(gi, [...rows, { name: '', position: '', email: '' }]);
            const labelCell = (
              <td rowSpan={span} style={{ padding: '18px 24px', fontWeight: 800, fontSize: 18, color: 'var(--ink)', borderRight: '1px solid var(--line)', borderTop: border, verticalAlign: 'top', width: 190, background: 'var(--soft)' }}>
                {editMode ? (
                  <>
                    <input value={g.label} placeholder="팀 이름" onChange={(e) => setLabel(gi, e.target.value)} style={{ ...inputStyle, fontWeight: 800 }} />
                    <button type="button" onClick={() => delTeam(gi)} style={{ marginTop: 8, fontSize: 12, color: '#e5484d', background: 'none', border: '1px solid #f3c0c2', borderRadius: 4, padding: '3px 8px', cursor: 'pointer' }}>✕ 팀 삭제</button>
                  </>
                ) : g.label}
              </td>
            );

            if (!editMode) {
              return shown.map((m, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                  {i === 0 && labelCell}
                  <td style={{ padding: '0 24px', height: 64, fontWeight: 600, fontSize: 18, color: 'var(--ink)', width: 260, borderTop: i === 0 ? border : undefined }}>{m.name} {m.position}</td>
                  <td style={{ padding: '0 24px', height: 64, borderTop: i === 0 ? border : undefined }}><a href={`mailto:${m.email}`} style={{ color: 'var(--ink2)', textDecoration: 'none', fontSize: 18 }}>{m.email}</a></td>
                </tr>
              ));
            }
            return (
              <React.Fragment key={gi}>
                {rows.map((m, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                    {i === 0 && labelCell}
                    <td style={{ padding: '8px 16px', height: 60, width: 320, borderTop: i === 0 ? border : undefined }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <input value={m.name} placeholder="이름" onChange={(e) => setField(i, 'name', e.target.value)} style={inputStyle} />
                        <input value={m.position} placeholder="직책" onChange={(e) => setField(i, 'position', e.target.value)} style={inputStyle} />
                        <button type="button" title="담당자 삭제" onClick={() => delMember(i)} style={{ flexShrink: 0, width: 24, height: 24, border: '1px solid #f3c0c2', background: '#fff', color: '#e5484d', borderRadius: 4, cursor: 'pointer' }}>✕</button>
                      </div>
                    </td>
                    <td style={{ padding: '8px 16px', height: 60, borderTop: i === 0 ? border : undefined }}>
                      <input value={m.email} placeholder="이메일" onChange={(e) => setField(i, 'email', e.target.value)} style={inputStyle} />
                    </td>
                  </tr>
                ))}
                <tr>
                  {rows.length === 0 && labelCell}
                  <td colSpan={2} style={{ padding: 0, borderTop: rows.length === 0 ? border : undefined }}>
                    <button type="button" onClick={addMember} style={{ width: '100%', border: 'none', borderTop: '1px dashed rgba(226,58,58,.4)', background: 'rgba(226,58,58,.05)', color: 'var(--accent)', fontWeight: 700, fontSize: 13, padding: '10px', cursor: 'pointer' }}>+ 담당자 추가</button>
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
          {editMode && (
            <tr>
              <td style={{ padding: 8, width: 190, borderRight: '1px solid var(--line)', borderTop: '1px solid var(--line)', background: 'var(--soft)', verticalAlign: 'top' }}>
                <button type="button" onClick={addTeam} style={{ width: '100%', border: '1px dashed var(--accent)', background: 'rgba(226,58,58,.06)', color: 'var(--accent)', fontWeight: 700, fontSize: 13, padding: '9px', cursor: 'pointer', borderRadius: 4 }}>+ 팀 추가</button>
              </td>
              <td colSpan={2} style={{ borderTop: '1px solid var(--line)' }}></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function TechPageClient({ ssrContent }: { ssrContent: Record<string, string> }) {
  const [content, editMode] = useEditableContent(DEFAULTS, ssrContent);

  const [techTeams] = useState<{ label: string; members: string }[]>(() => {
    const existing = safeParse<{ label: string; members: string }[] | null>(ssrContent.tech_teams, null);
    if (Array.isArray(existing)) return existing;
    const lbl = safeParse(ssrContent.tech_labels, DEFAULT_LABELS);
    const toStr = (arr: { name: string; position?: string; title?: string; email: string }[]) =>
      arr.map((m) => `${m.name} | ${m.position ?? m.title ?? ''} | ${m.email}`).join('\n');
    const t1 = safeParse(ssrContent.tech_team, DEFAULT_TECH_TEAM);
    const t2 = safeParse(ssrContent.tech_da_team, DEFAULT_DA_TEAM);
    const groups = [{ label: lbl.tech_team, members: toStr(t1) }];
    if (Array.isArray(t2) && t2.length) groups.push({ label: lbl.da_team, members: toStr(t2) });
    return groups;
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
      {editMode && (
        <button type="button" onClick={() => window.parent.postMessage({ type: 'save-all' }, BACKOFFICE_ORIGIN)}
          style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 99999, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 26px', fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,.28)' }}>
          💾 저장하기
        </button>
      )}

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
              <E id="tech_hero.subtitle" editMode={editMode}>{content.tech_hero.subtitle}</E>
            </p>
            <h1 style={{
              fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
              lineHeight: 1.05, letterSpacing: '-.04em', color: '#fff', margin: 0,
            }}>
              <E id="tech_hero.title" editMode={editMode}>
                {stripHtml(content.tech_hero.title).split('\n').map((line: string, i: number) => (
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
              <E id="tech_team_intro.title" editMode={editMode}>{content.tech_team_intro.title}</E>
            </h2>
            <p style={{ fontSize: 18, color: 'var(--ink2)', marginTop: 8 }}><E id="tech_team_intro.subtitle" editMode={editMode}>{content.tech_team_intro.subtitle}</E></p>
          </div>

          {/* 기술지원팀 */}
          <div className="reveal tech-team-row" style={{
            display: 'grid', gridTemplateColumns: '0.45fr 0.55fr', gap: 0,
            border: '1px solid var(--line)', overflow: 'hidden', background: 'var(--surface)',
            marginBottom: 20,
          }}>
            <div style={{ background: 'var(--soft)', minHeight: 280, overflow: 'hidden' }}>
              <OptImg id="tech_team_intro.img1" editMode={editMode} src="/images/crawl/unionsystems/customer_header_img-01_5.png" alt="기술지원팀" width={640} height={360} style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              }} />
            </div>
            <div style={{ padding: 'clamp(26px, 3.5vw, 40px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontFamily: MONO, fontSize: 18, fontWeight: 600, letterSpacing: '.1em', color: 'var(--accent)', margin: '0 0 8px' }}>SUPPORT TEAM</p>
              <h3 style={{ fontWeight: 900, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}><E id="tech_team_intro.support_name" editMode={editMode}>{content.tech_team_intro.support_name}</E></h3>
              <p style={{ fontSize: 18, lineHeight: 1.7, color: 'var(--ink2)', margin: 0 }}>
                <E id="tech_team_intro.support_desc" editMode={editMode}>{content.tech_team_intro.support_desc}</E>
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
              <h3 style={{ fontWeight: 900, fontSize: 22, color: 'var(--ink)', margin: '0 0 12px' }}><E id="tech_team_intro.renewal_name" editMode={editMode}>{content.tech_team_intro.renewal_name}</E></h3>
              <p style={{ fontSize: 18, lineHeight: 1.7, color: 'var(--ink2)', margin: 0 }}>
                <E id="tech_team_intro.renewal_desc" editMode={editMode}>{content.tech_team_intro.renewal_desc}</E>
              </p>
            </div>
            <div style={{ background: 'var(--soft)', minHeight: 280, overflow: 'hidden' }}>
              <OptImg id="tech_team_intro.img2" editMode={editMode} src="/images/crawl/unionsystems/customer_header_img-02_99.png" alt="리뉴얼팀" width={640} height={360} style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
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
            <E id="tech_mid.title" editMode={editMode}>{content.tech_mid.title}</E>
          </h2>
          <p className="reveal" style={{ fontSize: 18, color: 'rgba(255,255,255,.45)', margin: 0 }}>
            <E id="tech_mid.subtitle" editMode={editMode}>{content.tech_mid.subtitle}</E>
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
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', letterSpacing: '-.03em', margin: '0 0 8px' }}><E id="tech_sections.services_title" editMode={editMode}>{content.tech_sections.services_title}</E></h2>
            <p style={{ fontSize: 18, color: 'var(--ink2)', margin: 0 }}><E id="tech_sections.services_desc" editMode={editMode}>{content.tech_sections.services_desc}</E></p>
          </div>
          <div className="tech-svc" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {content.tech_services.map((s: { title: string; desc: string }, i: number) => (
              <div key={s.title} className="reveal" style={{
                textAlign: 'center', padding: '32px 20px',
                border: '1px solid var(--line)', background: 'var(--surface)',
                transition: 'transform .2s, box-shadow .2s',
                transitionDelay: `${i * .06}s`,
              }}>
                <h3 style={{ fontWeight: 800, fontSize: 18, color: 'var(--ink)', margin: '0 0 8px' }}>
                  <E id={`tech_services.${i}.title`} editMode={editMode}>{s.title}</E>
                </h3>
                <p style={{ fontSize: 18, color: 'var(--ink2)', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  <E id={`tech_services.${i}.desc`} editMode={editMode}>{s.desc}</E>
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
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', letterSpacing: '-.03em', margin: 0 }}><E id="tech_sections.process_title" editMode={editMode}>{content.tech_sections.process_title}</E></h2>
          </div>
          <div className="tech-process" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {content.tech_process.map((s: { num: string; title: string; desc: string }, i: number) => (
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
                  <E id={`tech_process.${i}.title`} editMode={editMode}>{s.title}</E>
                </h3>
                <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--ink2)', margin: 0 }}>
                  <E id={`tech_process.${i}.desc`} editMode={editMode}>{s.desc}</E>
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
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', letterSpacing: '-.03em', margin: '0 0 12px' }}><E id="tech_sections.contact_title" editMode={editMode}>{content.tech_sections.contact_title}</E></h2>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 18, color: 'var(--ink2)' }}>
              <span>
                <strong style={{ color: 'var(--ink)' }}><E id="tech_labels.tel" editMode={editMode}>{content.tech_labels.tel}</E></strong>{' '}
                <E id="tech_contact.tel" editMode={editMode}>{content.tech_contact.tel}</E>
              </span>
              <span>
                <strong style={{ color: 'var(--ink)' }}><E id="tech_labels.hours" editMode={editMode}>{content.tech_labels.hours}</E></strong>{' '}
                <E id="tech_contact.hours" editMode={editMode}>{content.tech_contact.hours}</E>
              </span>
            </div>
          </div>

          {/* 담당자 테이블 — 팀 그룹(추가/삭제) + 담당자(추가/삭제) */}
          <TechTeamsTable initial={techTeams} editMode={editMode} />
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
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', letterSpacing: '-.03em', color: '#fff', margin: 0 }}><E id="tech_sections.faq_title" editMode={editMode}>{content.tech_sections.faq_title}</E></h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {content.tech_faq.map((item: { category: string; question: string; answer: string }, idx: number) => (
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
                      <E id={`tech_faq.${idx}.category`} editMode={editMode}>{item.category}</E>
                    </span>
                    <span style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>
                      <E id={`tech_faq.${idx}.question`} editMode={editMode}>{item.question}</E>
                    </span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2"
                    style={{ flexShrink: 0, marginLeft: 12, transition: 'transform .2s', transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === idx && (
                  <div style={{ padding: '0 20px 16px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
                    <div style={{ fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,.5)', margin: '12px 0 0' }}>
                      <E id={`tech_faq.${idx}.answer`} editMode={editMode}>{item.answer}</E>
                    </div>
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
            <E id="tech_cta.title" editMode={editMode}>{content.tech_cta.title}</E>
          </h2>
          <div className="reveal" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:027068999" className="btn" style={{
              padding: '14px 32px', background: 'var(--accent)', color: '#fff',
              fontWeight: 700, fontSize: 18, textDecoration: 'none',
            }}><E id="tech_cta.btn_call" editMode={editMode}>{content.tech_cta.btn_call}</E> <E id="tech_contact.tel" editMode={editMode}>{content.tech_contact.tel}</E></a>
            <Link href="/support/inquiry" style={{
              padding: '14px 32px', border: '1px solid var(--ink)', color: 'var(--ink)',
              fontWeight: 700, fontSize: 18, textDecoration: 'none',
            }}><E id="tech_cta.btn_inquiry" editMode={editMode}>{content.tech_cta.btn_inquiry}</E></Link>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
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
      ` }} />
    </div>
  );
}
