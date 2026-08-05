'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { apiClient } from '@/lib/api';
import { E, safeParse, useEditMode, useEditableManifest, EDITABLE_STYLES } from '@/lib/editable';

/* ── Data ── */
const STEPS = [
  {
    question: '회사 규모가 어떻게 되시나요?',
    options: [
      { label: '10명 이하', value: 'small' },
      { label: '11~50명', value: 'mid' },
      { label: '51~200명', value: 'large' },
      { label: '200명 이상', value: 'enterprise' },
    ],
  },
  {
    question: '관심 있는 분야를 선택해주세요 (복수 선택)',
    multi: true,
    options: [
      { label: '오피스 SW (MS365·Adobe)', value: 'office', icon: '💻' },
      { label: '보안 (백신·DLP)', value: 'security', icon: '🛡️' },
      { label: 'IT 자산관리', value: 'asset', icon: '📋' },
      { label: '데이터 관리', value: 'data', icon: '📊' },
    ],
  },
  {
    question: '현재 가장 큰 고민은 무엇인가요?',
    multi: true,
    options: [
      { label: '라이선스 비용이 너무 많다', value: 'cost' },
      { label: '보안 위협·정보유출이 걱정', value: 'threat' },
      { label: 'IT 자산 현황 파악이 안 된다', value: 'visibility' },
      { label: '데이터 표준화가 필요하다', value: 'standard' },
      { label: '주52시간 근태관리가 어렵다', value: 'worktime' },
      { label: 'IT 인력이 부족하다', value: 'manpower' },
    ],
  },
];

interface Solution {
  code: string;
  name: string;
  desc: string;
  color: string;
  match: string[];
}

const SOLUTIONS: Solution[] = [
  { code: 'Microsoft 365', name: 'MS365 라이선스 최적화', desc: '사용자별 플랜 차등 적용으로 연 20%+ 절감', color: '#111214', match: ['office', 'cost', 'manpower'] },
  { code: 'AhnLab + EST', name: '이중 보안 체계', desc: 'V3 + AI EDR 이중 방어로 위협 탐지율 35%↑', color: '#F5333F', match: ['security', 'threat'] },
  { code: 'OfficeKeeper', name: '정보유출 방지 DLP', desc: 'USB·네트워크·출력물 전방위 유출 차단', color: '#6B655C', match: ['security', 'threat'] },
  { code: 'NetClient', name: '통합 PC 자산관리', desc: 'DMS·PMS·PC-OFF·HSM 4모듈 통합', color: '#2B2C30', match: ['asset', 'visibility', 'worktime', 'cost'] },
  { code: 'DA#', name: '데이터 모델링·표준화', desc: '전사 데이터 표준화율 100% 달성', color: '#111214', match: ['data', 'standard'] },
  { code: 'Adobe CC', name: 'Adobe 기업 라이선스', desc: 'VIP 프로그램으로 중앙 관리 + 비용 절감', color: '#FF0000', match: ['office', 'cost'] },
];

/* ── Helper: 진단 답변을 문자열로 요약 ── */
function summarizeAnswers(answers: Record<number, string[]>) {
  const sizeMap: Record<string, string> = { small: '10명 이하', mid: '11~50명', large: '51~200명', enterprise: '200명 이상' };
  const interestMap: Record<string, string> = { office: '오피스 SW', security: '보안', asset: 'IT 자산관리', data: '데이터 관리' };
  const concernMap: Record<string, string> = { cost: '라이선스 비용', threat: '보안 위협·정보유출', visibility: 'IT 자산 현황 파악', standard: '데이터 표준화', worktime: '주52시간 근태관리', manpower: 'IT 인력 부족' };
  const size = (answers[0] || []).map((v) => sizeMap[v] || v).join(', ');
  const interests = (answers[1] || []).map((v) => interestMap[v] || v).join(', ');
  const concerns = (answers[2] || []).map((v) => concernMap[v] || v).join(', ');
  return `[3분 진단] 규모: ${size} / 관심분야: ${interests} / 고민: ${concerns}`;
}

/* ── Component ── */
const SolutionDiagnostic: React.FC<{ ssrContent?: Record<string, string> }> = ({ ssrContent = {} }) => {
  const editMode = useEditMode();
  useEditableManifest(editMode);

  const [steps, setSteps] = useState(() => safeParse(ssrContent.diagnostic_steps, STEPS));
  const [solutions, setSolutions] = useState(() => safeParse(ssrContent.diagnostic_solutions, SOLUTIONS));

  useEffect(() => {
    if (!editMode) return;
    const setters: Record<string, (v: unknown) => void> = {
      diagnostic_steps: setSteps as (v: unknown) => void,
      diagnostic_solutions: setSolutions as (v: unknown) => void,
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

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '' });
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const currentStep = steps[step];
  const selected = answers[step] || [];

  const toggleOption = (value: string) => {
    if (currentStep.multi) {
      setAnswers({
        ...answers,
        [step]: selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value],
      });
    } else {
      setAnswers({ ...answers, [step]: [value] });
      // Auto-advance for single select
      if (step < steps.length - 1) {
        setTimeout(() => setStep(step + 1), 300);
      } else {
        setTimeout(() => setShowResult(true), 300);
      }
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else setShowResult(true);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setShowResult(false);
    setForm({ name: '', company: '', phone: '', email: '' });
    setConsent(false);
    setSubmitted(false);
    setSubmitError('');
  };

  // Calculate recommendations
  const allValues = Object.values(answers).flat();
  const recommended = solutions
    .map((s) => ({
      ...s,
      score: s.match.filter((m) => allValues.includes(m)).length,
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return (
    <section style={{ padding: 'clamp(56px, 7vw, 96px) 0', background: 'var(--soft)' }}>
      {editMode && <style>{EDITABLE_STYLES}</style>}
      <Container>
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontWeight: 500, fontSize: 18, letterSpacing: '.16em', color: 'var(--ink2)', textTransform: 'uppercase' as const }}>
            SOLUTION FINDER
          </span>
          <h2 style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(30px, 4vw, 48px)', lineHeight: 1.15, letterSpacing: '-.02em', color: 'var(--ink)', marginTop: 10 }}>
            우리 회사에 맞는 솔루션은?
          </h2>
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 18, color: 'var(--ink2)', marginTop: 8 }}>
            3가지 질문에 답하면, 맞춤 솔루션을 추천해드립니다.
          </p>
        </div>

        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          {!showResult ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 0, padding: 'clamp(28px, 4vw, 44px)', }}>
              {/* Progress bar */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
                {steps.map((_: unknown, i: number) => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? 'var(--accent)' : 'var(--line)', transition: 'background .3s' }} />
                ))}
              </div>

              {/* Step label */}
              <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: 18, color: 'var(--accent)', marginBottom: 8 }}>
                STEP {step + 1} / {steps.length}
              </p>

              {/* Question */}
              <h3 style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 800, fontSize: 'clamp(18px, 2.5vw, 22px)', color: 'var(--ink)', marginBottom: 24 }}>
                <E id={`diagnostic_steps.${step}.question`} editMode={editMode}>{currentStep.question}</E>
              </h3>

              {/* Options */}
              <div style={{ display: 'grid', gap: 10 }}>
                {currentStep.options.map((opt: { label: string; value: string; icon?: string }, oi: number) => {
                  const isSelected = selected.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggleOption(opt.value)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '14px 18px',
                        borderRadius: 14,
                        border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--line)'}`,
                        background: isSelected ? 'rgba(26,86,219,.06)' : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all .2s',
                        color: 'var(--ink)',
                        fontFamily: "'Pretendard', sans-serif",
                        fontWeight: 600,
                        fontSize: 18,
                      }}
                    >
                      <span style={{
                        width: 22, height: 22, borderRadius: currentStep.multi ? 6 : '50%',
                        border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--line)'}`,
                        background: isSelected ? 'var(--accent)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, transition: 'all .2s',
                      }}>
                        {isSelected && <svg width="12" height="12" viewBox="0 0 20 20" fill="#fff"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>}
                      </span>
                      {opt.icon && <span style={{ fontSize: 18 }}>{opt.icon}</span>}
                      <E id={`diagnostic_steps.${step}.options.${oi}.label`} editMode={editMode}>{opt.label}</E>
                    </button>
                  );
                })}
              </div>

              {/* Nav buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
                <button
                  onClick={handleBack}
                  style={{ padding: '10px 20px', borderRadius: 0, border: '1px solid var(--line)', background: 'transparent', cursor: step > 0 ? 'pointer' : 'default', opacity: step > 0 ? 1 : .3, fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: 18, color: 'var(--ink2)' }}
                  disabled={step === 0}
                >
                  이전
                </button>
                {currentStep.multi && (
                  <button
                    onClick={handleNext}
                    disabled={selected.length === 0}
                    style={{ padding: '10px 24px', borderRadius: 0, border: 'none', background: selected.length > 0 ? 'var(--accent)' : 'var(--line)', color: '#fff', cursor: selected.length > 0 ? 'pointer' : 'default', fontFamily: "'Pretendard', sans-serif", fontWeight: 700, fontSize: 18 }}
                  >
                    {step < steps.length - 1 ? '다음' : '결과 보기'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ── Results ── */
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 0, padding: 'clamp(28px, 4vw, 44px)' }}>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <span style={{ fontSize: 36 }}>🎯</span>
                <h3 style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 900, fontSize: 22, color: 'var(--ink)', marginTop: 8 }}>
                  맞춤 추천 솔루션
                </h3>
                <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 18, color: 'var(--ink2)', marginTop: 6 }}>
                  귀사 환경에 적합한 솔루션을 추천드립니다.
                </p>
              </div>

              <div style={{ display: 'grid', gap: 12, marginBottom: 28 }}>
                {recommended.map((sol) => (
                  <div key={sol.code} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 14, border: '1px solid var(--line)', background: `${sol.color}06` }}>
                    <div style={{ width: 44, height: 44, borderRadius: 0, background: `${sol.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Pretendard', sans-serif", fontWeight: 800, fontSize: 18, color: sol.color, flexShrink: 0 }}>
                      {sol.code.slice(0, 3)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 800, fontSize: 18, color: 'var(--ink)' }}>{sol.name}</p>
                      <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 400, fontSize: 18, color: 'var(--ink2)', marginTop: 2 }}>{sol.desc}</p>
                    </div>
                    <span style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 700, fontSize: 18, color: sol.color, background: `${sol.color}14`, padding: '4px 10px', borderRadius: 0 }}>
                      매칭 {sol.score}
                    </span>
                  </div>
                ))}
                {recommended.length === 0 && (
                  <p style={{ textAlign: 'center', color: 'var(--ink2)', fontSize: 18, padding: 20 }}>
                    더 많은 정보가 필요합니다. 전문 컨설턴트와 상담해보세요.
                  </p>
                )}
              </div>

              {/* ── 연락처 입력 + 제출 ── */}
              {!submitted ? (
                <>
                  <div style={{ borderTop: '1px solid var(--line)', paddingTop: 24, marginBottom: 20 }}>
                    <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', marginBottom: 14 }}>
                      진단 결과와 함께 맞춤 견적을 받아보세요
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {([['name', '이름', 'text'], ['company', '회사명', 'text'], ['phone', '연락처', 'tel'], ['email', '이메일', 'email']] as const).map(([key, placeholder, type]) => (
                        <input
                          key={key}
                          type={type}
                          placeholder={placeholder}
                          value={form[key]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          style={{ padding: '12px 14px', border: '1px solid var(--line)', background: 'var(--bg)', fontSize: 15, color: 'var(--ink)', outline: 'none' }}
                        />
                      ))}
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, cursor: 'pointer', fontSize: 13, color: 'var(--ink2)' }}>
                      <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                      개인정보 수집·이용에 동의합니다
                    </label>
                    {submitError && <p style={{ color: 'var(--accent)', fontSize: 13, marginTop: 8 }}>{submitError}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <button
                      disabled={submitting}
                      onClick={async () => {
                        if (!form.name || !form.company || !form.phone || !form.email) { setSubmitError('모든 항목을 입력해주세요.'); return; }
                        if (!consent) { setSubmitError('개인정보 수집에 동의해주세요.'); return; }
                        setSubmitError('');
                        setSubmitting(true);
                        try {
                          await apiClient.submitInquiry({
                            name: form.name,
                            company: form.company,
                            phone: form.phone,
                            email: form.email,
                            product: recommended.map((s) => s.code).join(', '),
                            message: summarizeAnswers(answers),
                            consentPrivacy: true,
                          });
                          setSubmitted(true);
                        } catch {
                          setSubmitError('제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                        } finally {
                          setSubmitting(false);
                        }
                      }}
                      style={{ padding: '14px 28px', background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? .6 : 1 }}
                    >
                      {submitting ? '제출 중...' : '무료 견적 받기 →'}
                    </button>
                    <button
                      onClick={handleReset}
                      style={{ padding: '14px 20px', border: '1px solid var(--line)', background: 'transparent', fontWeight: 600, fontSize: 16, color: 'var(--ink2)', cursor: 'pointer' }}
                    >
                      다시 진단
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <span style={{ fontSize: 36 }}>✅</span>
                  <p style={{ fontWeight: 800, fontSize: 18, color: 'var(--ink)', marginTop: 10 }}>
                    제출이 완료되었습니다!
                  </p>
                  <p style={{ fontSize: 15, color: 'var(--ink2)', marginTop: 6 }}>
                    담당자가 확인 후 빠르게 연락드리겠습니다.
                  </p>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
                    <Link href="/" style={{ padding: '12px 24px', background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                      홈으로
                    </Link>
                    <button onClick={handleReset} style={{ padding: '12px 20px', border: '1px solid var(--line)', background: 'transparent', fontWeight: 600, fontSize: 15, color: 'var(--ink2)', cursor: 'pointer' }}>
                      다시 진단
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default SolutionDiagnostic;
