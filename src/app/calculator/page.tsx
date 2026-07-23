'use client';
import { useState } from 'react';
import Link from 'next/link';

const INDUSTRIES = ['제조', 'IT·소프트웨어', '금융', '유통·물류', '공공·교육', '기타'];

interface Solution {
  id: string;
  name: string;
  options?: { label: string; monthly: number }[];
  monthly?: number;
  annual?: number;
  perUser: boolean;
  color: string;
}

const SOLUTIONS: Solution[] = [
  { id: 'm365', name: 'Microsoft 365', perUser: true, color: 'var(--accent)', options: [
    { label: 'Business Basic', monthly: 6000 },
    { label: 'Business Standard', monthly: 12000 },
    { label: 'Business Premium', monthly: 22000 },
  ]},
  { id: 'ahnlab', name: 'AhnLab V3', monthly: 3000, perUser: true, color: '#F5333F' },
  { id: 'estsec', name: 'ESTsecurity 알약', monthly: 2500, perUser: true, color: '#111214' },
  { id: 'officekeeper', name: 'OfficeKeeper', monthly: 4000, perUser: true, color: '#2B2C30' },
  { id: 'netclient', name: 'NetClient 자산관리', monthly: 3500, perUser: true, color: '#059669' },
  { id: 'da', name: 'DA# 데이터 분석', annual: 5000000, perUser: false, color: '#D97706' },
  { id: 'adobe', name: 'Adobe Creative Cloud', monthly: 33000, perUser: true, color: '#FF0000' },
  { id: 'autodesk', name: 'Autodesk AutoCAD', annual: 2400000, perUser: true, color: '#0696D7' },
  { id: 'altools', name: '알툴즈', monthly: 1500, perUser: true, color: '#FF6B00' },
];

export default function CalculatorPage() {
  const [step, setStep] = useState(1);
  const [employees, setEmployees] = useState(50);
  const [industry, setIndustry] = useState('');
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [m365Plan, setM365Plan] = useState(1); // index of options

  const toggleSolution = (id: string) => setSelected(p => ({ ...p, [id]: !p[id] }));

  const calcResults = () => {
    const items: { name: string; monthly: number; annual: number; color: string }[] = [];
    SOLUTIONS.forEach(s => {
      if (!selected[s.id]) return;
      let monthly = 0;
      if (s.id === 'm365' && s.options) {
        monthly = s.options[m365Plan].monthly * employees;
      } else if (s.monthly) {
        monthly = s.perUser ? s.monthly * employees : s.monthly;
      } else if (s.annual) {
        const annual = s.perUser ? s.annual * employees : s.annual;
        items.push({ name: s.name, monthly: Math.round(annual / 12), annual, color: s.color });
        return;
      }
      items.push({ name: s.name, monthly, annual: monthly * 12, color: s.color });
    });
    return items;
  };

  const results = calcResults();
  const totalAnnual = results.reduce((s, r) => s + r.annual, 0);
  const totalMonthly = results.reduce((s, r) => s + r.monthly, 0);
  const discountedAnnual = Math.round(totalAnnual * 0.85);

  const fmt = (n: number) => n.toLocaleString('ko-KR');

  return (<>
    {/* Hero */}
    <section style={{ padding: '120px clamp(20px,4vw,52px) 48px', background: 'linear-gradient(135deg, #111214 0%, #111214 100%)', color: '#fff', textAlign: 'center' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

      <p style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, letterSpacing: '.14em', opacity: .7, marginBottom: 12 }}>IT COST CALCULATOR</p>
      <h1 style={{ fontFamily: "'Pretendard'", fontWeight: 900, fontSize: 'clamp(28px,4.5vw,48px)', lineHeight: 1.2, letterSpacing: '-.03em', marginBottom: 16 }}>우리 회사 IT 비용,<br/>1분 만에 계산하세요</h1>
      <p style={{ fontFamily: "'Pretendard'", fontWeight: 400, fontSize: 18, opacity: .85, maxWidth: 500, margin: '0 auto' }}>직원 수와 필요한 솔루션만 선택하면 예상 비용을 바로 확인할 수 있습니다.</p>
    </section>

    {/* Steps indicator */}
    <section style={{ padding: '32px clamp(20px,4vw,52px) 0', background: 'var(--bg)' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', gap: 8 }}>
        {['기본 정보', '솔루션 선택', '결과 확인'].map((label, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ height: 4, borderRadius: 2, background: step > i ? 'var(--accent)' : 'var(--line)', transition: 'background .3s', marginBottom: 8 }} />
            <span style={{ fontFamily: "'Pretendard'", fontWeight: step === i + 1 ? 700 : 500, fontSize: 18, color: step === i + 1 ? 'var(--accent)' : 'var(--ink2)' }}>STEP {i + 1}. {label}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Content */}
    <section style={{ padding: 'clamp(32px,4vw,48px) clamp(20px,4vw,52px) clamp(60px,8vw,100px)', background: 'var(--bg)' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* STEP 1 */}
        {step === 1 && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 0, padding: 'clamp(24px,4vw,40px)' }}>
            <h2 style={{ fontFamily: "'Pretendard'", fontWeight: 800, fontSize: 22, color: 'var(--ink)', marginBottom: 32 }}>기본 정보를 입력하세요</h2>

            <label style={{ fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, color: 'var(--ink)', display: 'block', marginBottom: 12 }}>
              직원 수: <span style={{ color: 'var(--accent)', fontSize: 24, fontWeight: 900 }}>{employees}</span>명
            </label>
            <input type="range" min={5} max={500} step={5} value={employees}
              onChange={e => setEmployees(Number(e.target.value))}
              style={{ width: '100%', marginBottom: 8, accentColor: 'var(--accent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Pretendard'", fontSize: 18, color: 'var(--ink2)', marginBottom: 32 }}>
              <span>5명</span><span>500명</span>
            </div>
            <input type="number" min={1} max={9999} value={employees}
              onChange={e => setEmployees(Math.max(1, Number(e.target.value)))}
              style={{ width: 120, padding: '10px 14px', borderRadius: 0, border: '1px solid var(--line)', background: 'var(--bg)', fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, color: 'var(--ink)', marginBottom: 32, textAlign: 'center' }} />

            <label style={{ fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, color: 'var(--ink)', display: 'block', marginBottom: 12 }}>업종</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
              {INDUSTRIES.map(ind => (
                <button key={ind} onClick={() => setIndustry(ind)}
                  style={{ padding: '10px 20px', borderRadius: 0, border: `1px solid ${industry === ind ? 'var(--accent)' : 'var(--line)'}`, background: industry === ind ? '#11121410' : 'transparent', color: industry === ind ? 'var(--accent)' : 'var(--ink2)', fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, cursor: 'pointer', transition: 'all .2s' }}>
                  {ind}
                </button>
              ))}
            </div>

            <button onClick={() => { if (industry) setStep(2); }}
              disabled={!industry}
              style={{ width: '100%', padding: '14px 0', borderRadius: 0, background: industry ? 'var(--accent)' : 'var(--line)', color: '#fff', fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, border: 'none', cursor: industry ? 'pointer' : 'not-allowed', transition: 'background .2s' }}>
              다음 단계로
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 0, padding: 'clamp(24px,4vw,40px)' }}>
            <h2 style={{ fontFamily: "'Pretendard'", fontWeight: 800, fontSize: 22, color: 'var(--ink)', marginBottom: 8 }}>필요한 솔루션을 선택하세요</h2>
            <p style={{ fontFamily: "'Pretendard'", fontWeight: 400, fontSize: 18, color: 'var(--ink2)', marginBottom: 32 }}>복수 선택 가능합니다.</p>

            <div style={{ display: 'grid', gap: 12 }}>
              {SOLUTIONS.map(s => (
                <div key={s.id}>
                  <button onClick={() => toggleSolution(s.id)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderRadius: 14, border: `2px solid ${selected[s.id] ? s.color : 'var(--line)'}`, background: selected[s.id] ? `${s.color}08` : 'transparent', cursor: 'pointer', transition: 'all .2s', textAlign: 'left' }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${selected[s.id] ? s.color : 'var(--line)'}`, background: selected[s.id] ? s.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .2s' }}>
                      {selected[s.id] && <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, color: 'var(--ink)' }}>{s.name}</div>
                      <div style={{ fontFamily: "'Pretendard'", fontWeight: 400, fontSize: 18, color: 'var(--ink2)', marginTop: 2 }}>
                        {s.options ? `월 ${fmt(s.options[0].monthly)}원~/인` : s.monthly ? `월 ${fmt(s.monthly)}원${s.perUser ? '/인' : ''}` : `연 ${fmt(s.annual!)}원${s.perUser ? '/인' : ''}`}
                      </div>
                    </div>
                  </button>
                  {/* M365 plan selector */}
                  {s.id === 'm365' && selected['m365'] && s.options && (
                    <div style={{ display: 'flex', gap: 8, padding: '12px 0 0 40px', flexWrap: 'wrap' }}>
                      {s.options.map((opt, i) => (
                        <button key={i} onClick={() => setM365Plan(i)}
                          style={{ padding: '8px 16px', borderRadius: 0, border: `1px solid ${m365Plan === i ? 'var(--accent)' : 'var(--line)'}`, background: m365Plan === i ? 'var(--accent)' : 'transparent', color: m365Plan === i ? '#fff' : 'var(--ink2)', fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, cursor: 'pointer' }}>
                          {opt.label} (월 {fmt(opt.monthly)}원)
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <button onClick={() => setStep(1)}
                style={{ flex: 1, padding: '14px 0', borderRadius: 0, border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink2)', fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>이전</button>
              <button onClick={() => { if (Object.values(selected).some(v => v)) setStep(3); }}
                disabled={!Object.values(selected).some(v => v)}
                style={{ flex: 2, padding: '14px 0', borderRadius: 0, background: Object.values(selected).some(v => v) ? 'var(--accent)' : 'var(--line)', color: '#fff', fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, border: 'none', cursor: Object.values(selected).some(v => v) ? 'pointer' : 'not-allowed' }}>비용 계산하기</button>
            </div>
          </div>
        )}

        {/* STEP 3 — Results */}
        {step === 3 && (
          <div>
            {/* Summary card */}
            <div style={{ background: 'linear-gradient(135deg, #111214, #111214)', borderRadius: 0, padding: 'clamp(24px,4vw,40px)', color: '#fff', textAlign: 'center', marginBottom: 24 }}>
              <p style={{ fontFamily: "'Pretendard'", fontWeight: 500, fontSize: 18, opacity: .8, marginBottom: 8 }}>{industry} · 직원 {employees}명 기준 연간 예상 비용</p>
              <p style={{ fontFamily: "'Pretendard'", fontWeight: 900, fontSize: 'clamp(36px,5vw,56px)', letterSpacing: '-.03em', lineHeight: 1.1 }}>{fmt(totalAnnual)}원</p>
              <p style={{ fontFamily: "'Pretendard'", fontWeight: 500, fontSize: 18, opacity: .7, marginTop: 4 }}>월 {fmt(totalMonthly)}원</p>
              <div style={{ marginTop: 24, padding: '16px 20px', borderRadius: 14, background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(8px)' }}>
                <p style={{ fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18 }}>유니온시스템즈를 통하면 평균 15% 절감</p>
                <p style={{ fontFamily: "'Pretendard'", fontWeight: 900, fontSize: 28, marginTop: 4 }}>{fmt(discountedAnnual)}원 <span style={{ fontSize: 18, fontWeight: 500, opacity: .8 }}>/ 연</span></p>
                <p style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, color: '#4ADE80', marginTop: 4 }}>연 {fmt(totalAnnual - discountedAnnual)}원 절감 효과</p>
              </div>
            </div>

            {/* Detail table */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 0, overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)' }}>
                <h3 style={{ fontFamily: "'Pretendard'", fontWeight: 800, fontSize: 18, color: 'var(--ink)' }}>솔루션별 상세 비용</h3>
              </div>
              {results.map((r, i) => {
                const pct = totalAnnual > 0 ? (r.annual / totalAnnual) * 100 : 0;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px', borderBottom: i < results.length - 1 ? '1px solid var(--line)' : 'none' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, color: 'var(--ink)' }}>{r.name}</div>
                      <div style={{ fontFamily: "'Pretendard'", fontWeight: 400, fontSize: 18, color: 'var(--ink2)', marginTop: 2 }}>월 {fmt(r.monthly)}원</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, color: 'var(--ink)' }}>연 {fmt(r.annual)}원</div>
                      <div style={{ fontFamily: "'Pretendard'", fontWeight: 500, fontSize: 18, color: 'var(--ink2)' }}>{pct.toFixed(1)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Donut chart */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 0, padding: 'clamp(24px,4vw,40px)', marginBottom: 24, textAlign: 'center' }}>
              <h3 style={{ fontFamily: "'Pretendard'", fontWeight: 800, fontSize: 18, color: 'var(--ink)', marginBottom: 24 }}>비용 비중</h3>
              <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto' }}>
                <svg viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
                  {(() => {
                    let offset = 0;
                    const circumference = 2 * Math.PI * 80;
                    return results.map((r, i) => {
                      const pct = totalAnnual > 0 ? r.annual / totalAnnual : 0;
                      const dash = pct * circumference;
                      const el = <circle key={i} cx="100" cy="100" r="80" fill="none" stroke={r.color} strokeWidth="32" strokeDasharray={`${dash} ${circumference - dash}`} strokeDashoffset={-offset} />;
                      offset += dash;
                      return el;
                    });
                  })()}
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'Pretendard'", fontWeight: 900, fontSize: 22, color: 'var(--ink)' }}>{results.length}개</span>
                  <span style={{ fontFamily: "'Pretendard'", fontWeight: 500, fontSize: 18, color: 'var(--ink2)' }}>솔루션</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 16px', marginTop: 20 }}>
                {results.map((r, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Pretendard'", fontSize: 18, color: 'var(--ink2)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }} />{r.name}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', gap: 12 }} className="calc-cta">
              <button onClick={() => { setStep(1); setSelected({}); }}
                style={{ flex: 1, padding: '14px 0', borderRadius: 0, border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink2)', fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>다시 계산하기</button>
              <Link href="/contact"
                style={{ flex: 2, padding: '14px 0', borderRadius: 0, background: 'var(--accent)', color: '#fff', fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, textDecoration: 'none', textAlign: 'center', display: 'block' }}>정확한 견적 받기</Link>
            </div>
          </div>
        )}
      </div>
    </section>

    <style>{`@media(max-width:920px){.calc-cta{flex-direction:column!important}}`}</style>
  </>);
}
