'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui';

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

/* ── Component ── */
const SolutionDiagnostic: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [showResult, setShowResult] = useState(false);

  const currentStep = STEPS[step];
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
      if (step < STEPS.length - 1) {
        setTimeout(() => setStep(step + 1), 300);
      } else {
        setTimeout(() => setShowResult(true), 300);
      }
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else setShowResult(true);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setShowResult(false);
  };

  // Calculate recommendations
  const allValues = Object.values(answers).flat();
  const recommended = SOLUTIONS
    .map((s) => ({
      ...s,
      score: s.match.filter((m) => allValues.includes(m)).length,
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return (
    <section style={{ padding: 'clamp(56px, 7vw, 96px) 0', background: 'var(--soft)' }}>
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
                {STEPS.map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? 'var(--accent)' : 'var(--line)', transition: 'background .3s' }} />
                ))}
              </div>

              {/* Step label */}
              <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: 18, color: 'var(--accent)', marginBottom: 8 }}>
                STEP {step + 1} / {STEPS.length}
              </p>

              {/* Question */}
              <h3 style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 800, fontSize: 'clamp(18px, 2.5vw, 22px)', color: 'var(--ink)', marginBottom: 24 }}>
                {currentStep.question}
              </h3>

              {/* Options */}
              <div style={{ display: 'grid', gap: 10 }}>
                {currentStep.options.map((opt) => {
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
                      {'icon' in opt && <span style={{ fontSize: 18 }}>{(opt as { icon?: string }).icon}</span>}
                      {opt.label}
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
                    {step < STEPS.length - 1 ? '다음' : '결과 보기'}
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

              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <Link
                  href="/contact"
                  style={{ padding: '14px 28px', borderRadius: 0, background: 'var(--accent)', color: '#fff', fontFamily: "'Pretendard', sans-serif", fontWeight: 700, fontSize: 18, textDecoration: 'none' }}
                >
                  무료 견적 받기 →
                </Link>
                <button
                  onClick={handleReset}
                  style={{ padding: '14px 20px', borderRadius: 0, border: '1px solid var(--line)', background: 'transparent', fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: 18, color: 'var(--ink2)', cursor: 'pointer' }}
                >
                  다시 진단
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default SolutionDiagnostic;
