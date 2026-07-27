'use client';

import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { Solution } from '@/data/molecular-data';
import { apiClient } from '@/lib/api';
import PrivacyConsent from '@/components/ui/PrivacyConsent';

const MolecularU = dynamic(() => import('@/components/MolecularU'), {
  ssr: false,
  loading: () => (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/union-u-v2.png"
        alt="UNION 플랫폼"
        draggable={false}
        style={{
          width: '70%', maxWidth: 500, objectFit: 'contain',
          opacity: 0.3, filter: 'grayscale(1)',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />
    </div>
  ),
});

/* Error Boundary for MolecularU */
class MolecularErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>렌더링 오류</div>
            <div style={{ fontSize: 12, color: 'var(--ink2)', wordBreak: 'break-all' }}>{this.state.error.message}</div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const PERSONAS = [
  {
    id: 'ceo',
    tab: '경영진',
    headline: ['검증된 솔루션으로', '기업 IT를 한 번에'],
    headlineSuffix: '.',
    sub: '보안 · 데이터 · 자산관리 · SW 라이선스.\n5대 솔루션으로 복잡한 기업 IT를 통합 관리합니다.',
    cta: '도입 문의하기',
    ctaHref: '/contact',
    sub2: '소개서 다운로드',
  },
  {
    id: 'it',
    tab: 'IT 담당자',
    headline: ['전담 엔지니어가', '대신 관리합니다'],
    headlineSuffix: '.',
    sub: '원격 지원, 정기 점검, 긴급 대응까지.\n내부 IT 인력 없이도 안정적인 인프라를 유지합니다.',
    cta: '기술지원 알아보기',
    ctaHref: '/support/tech',
    sub2: '도입 사례 보기',
  },
  {
    id: 'buyer',
    tab: '구매/총무',
    headline: ['라이선스 비교견적', '원스톱 관리'],
    headlineSuffix: '.',
    sub: 'Microsoft · Adobe · Autodesk · 보안까지,\n복수 벤더 라이선스를 한 창구에서 비교·구매·갱신합니다.',
    cta: '무료 견적 받기',
    ctaHref: '/contact',
    sub2: '비용 절감 사례',
  },
] as const;

/* ═══ 문의 목적 옵션 (솔루션별) ═══ */
const PURPOSE_MAP: Record<string, string[]> = {
  ms: ['Microsoft 365 신규 도입', 'Azure 클라우드 전환', 'Teams 협업 환경 구축', 'Copilot AI 도입', '기존 라이선스 최적화'],
  encora: ['데이터 모델링(DA#) 도입', '데이터 품질관리(DQ#) 도입', '데이터 표준화 컨설팅', '기존 DA# 업그레이드', '데이터 거버넌스 구축'],
  ahn: ['V3 백신 도입/갱신', 'EDR·XDR 위협 탐지 구축', '네트워크 보안 강화', '통합 보안 관제', '보안 컴플라이언스 점검'],
  adobe: ['Creative Cloud 기업 도입', 'Acrobat 문서·전자서명', '팀 라이선스 통합 관리', '기존 라이선스 최적화', '디자인 워크플로우 개선'],
  est: ['알약 기업용 백신 도입', '알툴즈 전사 배포', '통합 유틸리티 관리', 'ESTsecurity 보안 솔루션', '기존 라이선스 점검'],
  auto: ['AutoCAD 라이선스 도입', 'Revit BIM 설계 환경', 'Flex 토큰 전환 상담', 'Inventor 3D 설계', '기존 라이선스 최적화'],
  doctor: ['NetClient IT 자산관리', 'PC OFF 절전 관리', '라이선스 컴플라이언스', 'SW 자산 현황 파악', '통합 단말 관리'],
};
const DEFAULT_PURPOSE_OPTIONS = ['솔루션 도입 상담', '기존 환경 점검', '견적 요청', '기술 지원 문의', '아직 잘 모르겠어요'];

/* ═══ Detail Panel (when zoomed) — 단계형 전환 구조 ═══ */
function DetailPanel({ solution, onClose, onExplorer }: {
  solution: Solution;
  onClose: () => void;
  onExplorer: () => void;
}) {
  // 'idle' = 초기(가치 제안 + CTA만), 'inquiry' = 상담 단계폼, 'brochure' = 소개서 경량폼
  const [flow, setFlow] = useState<'idle' | 'inquiry' | 'brochure'>('idle');
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // 폼 데이터
  const [purpose, setPurpose] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employees, setEmployees] = useState('');
  const [timeline, setTimeline] = useState('');
  const [environment, setEnvironment] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);

  // 소개서 전용
  const [brochureEmail, setBrochureEmail] = useState('');
  const [brochureName, setBrochureName] = useState('');
  const [brochureCompany, setBrochureCompany] = useState('');
  const [brochureStep, setBrochureStep] = useState<1 | 2 | 3>(1);
  const [brochureConsent, setBrochureConsent] = useState(false);

  // 필드 에러
  const [errors, setErrors] = useState<Record<string, string>>({});

  const purposeOptions = PURPOSE_MAP[solution.id] || DEFAULT_PURPOSE_OPTIONS;

  // 솔루션이 바뀌면 첫 번째 옵션 자동 선택
  useEffect(() => {
    const opts = PURPOSE_MAP[solution.id] || DEFAULT_PURPOSE_OPTIONS;
    setPurpose(opts[0]);
  }, [solution.id]);

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = '이름을 입력해 주세요.';
    if (!company.trim()) e.company = '회사명을 입력해 주세요.';
    if (!email.trim()) e.email = '이메일을 입력해 주세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = '업무용 이메일 주소를 입력해 주세요.';
    if (!phone.trim()) e.phone = '연락처를 입력해 주세요.';
    if (!consent) e.consent = '개인정보 수집·이용에 동의해 주세요.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateBrochureEmail = () => {
    const e: Record<string, string> = {};
    if (!brochureEmail.trim()) e.brochureEmail = '이메일을 입력해 주세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brochureEmail)) e.brochureEmail = '올바른 이메일 주소를 입력해 주세요.';
    if (!brochureConsent) e.brochureConsent = '개인정보 수집·이용에 동의해 주세요.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleInquirySubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      await apiClient.submitInquiry({
        name,
        company,
        email,
        phone,
        message: [
          purpose ? `문의 목적: ${purpose}` : '',
          employees ? `직원 수: ${employees}` : '',
          timeline ? `예상 도입 시기: ${timeline}` : '',
          environment ? `현재 사용 환경: ${environment}` : '',
          message,
        ].filter(Boolean).join('\n'),
        product: solution.area,
        consentPrivacy: consent,
      });
      setStep(4);
    } catch {
      setSubmitError('전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBrochureSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      await apiClient.submitDownload({
        name: brochureName || '(소개서 요청)',
        company: brochureCompany || '(미입력)',
        email: brochureEmail,
        phone: '',
        fileType: solution.area,
        consentPrivacy: brochureConsent,
      });
      setBrochureStep(3);
    } catch {
      setSubmitError('전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Shared field style ── */
  const fieldLabelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 700,
    color: 'var(--ink)', marginBottom: 6,
  };

  const fieldInputStyle: React.CSSProperties = {
    width: '100%', minHeight: 52, padding: '0 16px',
    fontSize: 16, border: '1px solid var(--line)',
    background: '#fff', color: 'var(--ink)',
    fontFamily: 'inherit', outline: 'none',
    transition: 'border-color .2s ease',
    boxSizing: 'border-box' as const,
  };

  const errorStyle: React.CSSProperties = {
    fontSize: 13, color: '#c0392f', marginTop: 4,
  };

  /* ── Step indicator ── */
  const StepIndicator = ({ current, total }: { current: number; total: number }) => (
    <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          flex: 1, height: 3,
          background: i < current ? 'var(--accent)' : 'var(--line)',
          transition: 'background .3s ease',
        }} />
      ))}
    </div>
  );

  return (
    <div style={{ textAlign: 'left', maxWidth: 480 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 700, color: 'var(--ink2)',
            display: 'inline-flex', gap: 6,
            padding: 0,
          }}
        >
          ← 메인으로 돌아가기
        </button>
        <span style={{ color: 'var(--line)' }}>|</span>
        <button
          onClick={onExplorer}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 700, color: 'var(--accent)',
            display: 'inline-flex', gap: 6,
            padding: 0,
          }}
        >
          다른 솔루션 보기 →
        </button>
      </div>

      {/* ═══ IDLE ═══ */}
      {flow === 'idle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 24, height: 2, background: 'var(--accent)' }} />
            <span style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
              fontSize: 12, fontWeight: 700, letterSpacing: '.14em', color: 'var(--accent)',
            }}>
              {solution.vendor.toUpperCase()}
            </span>
          </div>

          {/* 제목 */}
          <h2 style={{
            fontSize: 'clamp(34px, 4.5vw, 44px)', fontWeight: 800,
            lineHeight: 1.12, letterSpacing: '-0.04em',
            color: 'var(--ink)', margin: '14px 0 0',
          }}>
            {solution.area}<span style={{ color: 'var(--accent)' }}>.</span>
          </h2>

          {/* 설명 */}
          <p style={{
            fontSize: 17, lineHeight: 1.75, color: '#3a3e46',
            margin: '14px 0 0',
          }}>
            {solution.desc}
          </p>

          {/* ── 구분선 ── */}
          <div style={{ width: 40, height: 1, background: 'var(--line)', margin: '22px 0' }} />

          {/* 제품 태그 — 왼쪽 정렬, 균일 간격 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'flex-start' }}>
            {solution.feats.map((f, i) => (
              <span key={i} style={{
                padding: '8px 16px', fontSize: 15, fontWeight: 700,
                color: '#1a1e24', background: 'var(--surface)',
                border: '1px solid var(--line)', lineHeight: 1,
              }}>
                {f.n}
              </span>
            ))}
          </div>

          {/* 도입 효과 — 체크+텍스트 수직 중앙 맞춤 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 22 }}>
            {solution.gain.map((g, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 16, fontWeight: 500, color: '#1a1e24', lineHeight: 1.4,
              }}>
                <span style={{
                  color: 'var(--accent)', fontWeight: 800, fontSize: 14,
                  flex: 'none', width: 18, textAlign: 'center',
                }}>&#10003;</span>
                {g}
              </div>
            ))}
          </div>

          {/* ── 구분선 ── */}
          <div style={{ height: 1, background: 'var(--line)', margin: '22px 0' }} />

          {/* 수치 — 왼쪽 정렬, 고정 폭 */}
          <div style={{ display: 'flex', gap: 40 }}>
            {[
              { num: '4,000', suffix: '+', label: '도입 기업' },
              { num: '10', suffix: '년+', label: '구축 경험' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{
                  fontSize: 28, fontWeight: 800, color: 'var(--ink)',
                  fontFamily: '"Newsreader", Georgia, serif', fontStyle: 'italic',
                }}>
                  {s.num}{s.suffix && <span style={{ color: 'var(--accent)' }}>{s.suffix}</span>}
                </div>
                <div style={{ fontSize: 13, color: '#6b6f77', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA — 같은 높이, 왼쪽 정렬 */}
          <div style={{ display: 'flex', gap: 12, marginTop: 26 }}>
            <button
              onClick={() => { setFlow('inquiry'); setStep(1); setErrors({}); }}
              style={{
                background: 'var(--accent)', color: '#fff',
                fontSize: 16, fontWeight: 700, padding: '16px 30px',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 10px 26px rgba(245,51,63,.24)',
                transition: 'transform .2s, box-shadow .2s',
                lineHeight: 1,
              }}
            >
              도입 상담 시작하기 →
            </button>
            <button
              onClick={() => { setFlow('brochure'); setBrochureStep(1); setErrors({}); }}
              style={{
                background: 'transparent', border: '1.5px solid var(--line)',
                color: 'var(--ink)', fontSize: 16, fontWeight: 700,
                padding: '16px 26px', cursor: 'pointer',
                transition: 'transform .2s, background .2s, color .2s',
                lineHeight: 1,
              }}
            >
              소개서 요청
            </button>
          </div>
        </div>
      )}

      {/* ═══ INQUIRY FLOW: 단계형 폼 ═══ */}
      {flow === 'inquiry' && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderLeft: '3px solid var(--accent)',
          padding: '28px 30px',
          animation: 'detailFadeIn .42s ease-out',
        }}>
          <StepIndicator current={step} total={4} />

          {/* Step 1: 문의 목적 */}
          {step === 1 && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', marginBottom: 4 }}>
                어떤 도움이 필요하신가요?
              </div>
              <div style={{ fontSize: 14, color: 'var(--ink2)', marginBottom: 20 }}>
                {solution.area} 관련 상담 목적을 선택해 주세요.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {purposeOptions.map((opt) => (
                  <label
                    key={opt}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 16px', cursor: 'pointer',
                      border: `1.5px solid ${purpose === opt ? 'var(--accent)' : 'var(--line)'}`,
                      background: purpose === opt ? 'rgba(245,51,63,.04)' : '#fff',
                      transition: 'all .2s ease',
                    }}
                  >
                    <span style={{
                      width: 20, height: 20, borderRadius: '50%', flex: 'none',
                      border: `2px solid ${purpose === opt ? 'var(--accent)' : '#c0c4cc'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'border-color .2s',
                    }}>
                      {purpose === opt && (
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)' }} />
                      )}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{opt}</span>
                    <input
                      type="radio" name="purpose" value={opt}
                      checked={purpose === opt}
                      onChange={() => setPurpose(opt)}
                      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                    />
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button
                  onClick={() => { setFlow('idle'); }}
                  style={{
                    flex: 'none', padding: '14px 20px',
                    background: 'transparent', border: '1px solid var(--line)',
                    color: 'var(--ink2)', fontSize: 14, fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  이전
                </button>
                <button
                  onClick={() => { if (purpose) setStep(2); }}
                  disabled={!purpose}
                  style={{
                    flex: 1, padding: '14px 20px',
                    background: purpose ? 'var(--accent)' : '#d0d3d9',
                    color: '#fff', fontSize: 15, fontWeight: 700,
                    border: 'none', cursor: purpose ? 'pointer' : 'default',
                    transition: 'background .2s',
                  }}
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {/* Step 2: 필수 정보 (4개) */}
          {step === 2 && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', marginBottom: 4 }}>
                기업 환경을 알려주세요
              </div>
              <div style={{ fontSize: 14, color: 'var(--ink2)', marginBottom: 20 }}>
                적합한 구성을 제안하기 위한 기본 정보입니다.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={fieldLabelStyle}>이름 <span style={{ color: 'var(--accent)' }}>*</span></label>
                  <input
                    value={name} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
                    placeholder="홍길동"
                    style={{ ...fieldInputStyle, borderColor: errors.name ? '#c0392f' : 'var(--line)' }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={(e) => (e.target.style.borderColor = errors.name ? '#c0392f' : 'var(--line)')}
                  />
                  {errors.name && <div style={errorStyle}>{errors.name}</div>}
                </div>
                <div>
                  <label style={fieldLabelStyle}>회사명 <span style={{ color: 'var(--accent)' }}>*</span></label>
                  <input
                    value={company} onChange={(e) => { setCompany(e.target.value); setErrors((p) => ({ ...p, company: '' })); }}
                    placeholder="주식회사 OO"
                    style={{ ...fieldInputStyle, borderColor: errors.company ? '#c0392f' : 'var(--line)' }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={(e) => (e.target.style.borderColor = errors.company ? '#c0392f' : 'var(--line)')}
                  />
                  {errors.company && <div style={errorStyle}>{errors.company}</div>}
                </div>
                <div>
                  <label style={fieldLabelStyle}>업무 이메일 <span style={{ color: 'var(--accent)' }}>*</span></label>
                  <input
                    type="email"
                    value={email} onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                    placeholder="name@company.com"
                    style={{ ...fieldInputStyle, borderColor: errors.email ? '#c0392f' : 'var(--line)' }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={(e) => (e.target.style.borderColor = errors.email ? '#c0392f' : 'var(--line)')}
                  />
                  {errors.email && <div style={errorStyle}>{errors.email}</div>}
                </div>
                <div>
                  <label style={fieldLabelStyle}>연락처 <span style={{ color: 'var(--accent)' }}>*</span></label>
                  <input
                    type="tel"
                    value={phone} onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: '' })); }}
                    placeholder="010-0000-0000"
                    style={{ ...fieldInputStyle, borderColor: errors.phone ? '#c0392f' : 'var(--line)' }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={(e) => (e.target.style.borderColor = errors.phone ? '#c0392f' : 'var(--line)')}
                  />
                  {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
                </div>
              </div>
              {/* 개인정보 수집 안내 스크롤 박스 */}
              <div style={{
                border: '1px solid var(--line)', padding: '12px 14px', marginTop: 16,
                background: 'var(--soft, #f9fafb)', maxHeight: 110, overflowY: 'auto',
                fontSize: 12, lineHeight: 1.7, color: '#8a8f98',
              }}>
                <p style={{ fontWeight: 700, fontSize: 12, color: 'var(--ink)', margin: '0 0 6px' }}>개인정보 수집 및 이용에 대한 안내</p>
                <p style={{ margin: '0 0 4px' }}><strong style={{ color: 'var(--ink)' }}>수집항목</strong> : 이름, 회사명, 연락처, 이메일</p>
                <p style={{ margin: '0 0 4px' }}><strong style={{ color: 'var(--ink)' }}>수집·이용 목적</strong> : 문의 사항에 대한 답변 전달, 상담, 이벤트 안내 등</p>
                <p style={{ margin: 0 }}><strong style={{ color: 'var(--ink)' }}>보유 및 이용기간</strong> : 목적 달성 시 파기. 법률 규정에 따라 계약/청약철회 기록 5년, 대금결제/재화공급 기록 5년, 소비자 불만/분쟁처리 기록 3년 보존</p>
              </div>
                <PrivacyConsent
                  checked={consent}
                  onChange={setConsent}
                  error={errors.consent}
                />
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    flex: 'none', padding: '14px 20px',
                    background: 'transparent', border: '1px solid var(--line)',
                    color: 'var(--ink2)', fontSize: 14, fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  이전
                </button>
                <button
                  onClick={() => { if (validateStep2()) setStep(3); }}
                  style={{
                    flex: 1, padding: '14px 20px',
                    background: 'var(--accent)', color: '#fff',
                    fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
                  }}
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {/* Step 3: 선택 정보 */}
          {step === 3 && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', marginBottom: 4 }}>
                추가 정보 (선택)
              </div>
              <div style={{ fontSize: 14, color: 'var(--ink2)', marginBottom: 20 }}>
                입력하시면 더 정확한 제안이 가능합니다. 건너뛰어도 됩니다.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={fieldLabelStyle}>직원 수</label>
                  <select
                    value={employees} onChange={(e) => setEmployees(e.target.value)}
                    style={{ ...fieldInputStyle, padding: '0 12px', cursor: 'pointer' }}
                  >
                    <option value="">선택</option>
                    <option value="1~10명">1~10명</option>
                    <option value="11~50명">11~50명</option>
                    <option value="51~200명">51~200명</option>
                    <option value="201~500명">201~500명</option>
                    <option value="500명 이상">500명 이상</option>
                  </select>
                </div>
                <div>
                  <label style={fieldLabelStyle}>예상 도입 시기</label>
                  <select
                    value={timeline} onChange={(e) => setTimeline(e.target.value)}
                    style={{ ...fieldInputStyle, padding: '0 12px', cursor: 'pointer' }}
                  >
                    <option value="">선택</option>
                    <option value="즉시">즉시</option>
                    <option value="1개월 이내">1개월 이내</option>
                    <option value="3개월 이내">3개월 이내</option>
                    <option value="6개월 이내">6개월 이내</option>
                    <option value="미정">미정</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <label style={fieldLabelStyle}>현재 사용 환경</label>
                <input
                  value={environment} onChange={(e) => setEnvironment(e.target.value)}
                  placeholder="예: Windows 서버, Office 2019 사용 중"
                  style={fieldInputStyle}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--line)')}
                />
              </div>
              <div style={{ marginTop: 14 }}>
                <label style={fieldLabelStyle}>문의 내용</label>
                <textarea
                  value={message} onChange={(e) => setMessage(e.target.value)}
                  rows={3} placeholder="궁금한 점이나 요청사항을 자유롭게 적어 주세요."
                  style={{ ...fieldInputStyle, minHeight: 80, padding: '12px 16px', resize: 'none' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--line)')}
                />
              </div>
              {submitError && <div style={{ ...errorStyle, marginTop: 12 }}>{submitError}</div>}
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    flex: 'none', padding: '14px 20px',
                    background: 'transparent', border: '1px solid var(--line)',
                    color: 'var(--ink2)', fontSize: 14, fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  이전
                </button>
                <button
                  onClick={() => handleInquirySubmit()}
                  disabled={submitting}
                  style={{
                    flex: 1, padding: '14px 20px',
                    background: 'var(--accent)', color: '#fff',
                    fontSize: 15, fontWeight: 700, border: 'none',
                    cursor: submitting ? 'wait' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? '전송 중...' : '상담 요청 보내기'}
                </button>
              </div>
              <div style={{ fontSize: 12, color: '#a0a4ac', marginTop: 12, lineHeight: 1.5 }}>
                입력한 정보는 상담과 자료 제공 목적으로만 사용됩니다.
              </div>
            </div>
          )}

          {/* Step 4: 완료 */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                width: 48, height: 48, margin: '0 auto 16px',
                background: 'rgba(245,51,63,.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 22, color: 'var(--accent)', fontWeight: 800,
              }}>&#10003;</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>
                상담 요청이 접수되었습니다
              </div>
              <div style={{ fontSize: 15, color: 'var(--ink2)', marginTop: 8, lineHeight: 1.6 }}>
                담당자가 당일 내 연락드립니다.
              </div>
              {purpose && (
                <div style={{
                  display: 'inline-block', marginTop: 16,
                  padding: '8px 16px', background: 'rgba(245,51,63,.06)',
                  border: '1px solid rgba(245,51,63,.15)',
                  fontSize: 13, color: 'var(--ink)',
                }}>
                  선택하신 영역: <strong>{solution.area}</strong> · {purpose}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24 }}>
                <button
                  onClick={onExplorer}
                  style={{
                    padding: '12px 22px', background: 'var(--surface)',
                    border: '1px solid var(--line)', color: 'var(--ink)',
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  다른 솔루션 보기
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ BROCHURE FLOW: 소개서 경량 폼 ═══ */}
      {flow === 'brochure' && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderLeft: '3px solid var(--accent)',
          padding: '28px 30px',
          animation: 'detailFadeIn .42s ease-out',
        }}>
          {/* Step 1: 이메일만 */}
          {brochureStep === 1 && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', marginBottom: 4 }}>
                {solution.area} 소개서 받기
              </div>
              <div style={{ fontSize: 14, color: 'var(--ink2)', marginBottom: 20 }}>
                이메일 주소를 남겨 주시면 소개서를 보내드립니다.
              </div>
              <div>
                <label style={fieldLabelStyle}>이메일 <span style={{ color: 'var(--accent)' }}>*</span></label>
                <input
                  type="email"
                  value={brochureEmail}
                  onChange={(e) => { setBrochureEmail(e.target.value); setErrors((p) => ({ ...p, brochureEmail: '' })); }}
                  placeholder="name@company.com"
                  style={{ ...fieldInputStyle, borderColor: errors.brochureEmail ? '#c0392f' : 'var(--line)' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.target.style.borderColor = errors.brochureEmail ? '#c0392f' : 'var(--line)')}
                />
                {errors.brochureEmail && <div style={errorStyle}>{errors.brochureEmail}</div>}
              </div>
              {/* 개인정보 수집 안내 스크롤 박스 */}
              <div style={{
                border: '1px solid var(--line)', padding: '12px 14px', marginTop: 14,
                background: 'var(--soft, #f9fafb)', maxHeight: 110, overflowY: 'auto',
                fontSize: 12, lineHeight: 1.7, color: '#8a8f98',
              }}>
                <p style={{ fontWeight: 700, fontSize: 12, color: 'var(--ink)', margin: '0 0 6px' }}>개인정보 수집 및 이용에 대한 안내</p>
                <p style={{ margin: '0 0 4px' }}><strong style={{ color: 'var(--ink)' }}>수집항목</strong> : 이메일</p>
                <p style={{ margin: '0 0 4px' }}><strong style={{ color: 'var(--ink)' }}>수집·이용 목적</strong> : 소개서 자료 발송</p>
                <p style={{ margin: 0 }}><strong style={{ color: 'var(--ink)' }}>보유 및 이용기간</strong> : 목적 달성 시 파기. 법률 규정에 따라 계약/청약철회 기록 5년, 대금결제/재화공급 기록 5년, 소비자 불만/분쟁처리 기록 3년 보존</p>
              </div>
                <PrivacyConsent
                  checked={brochureConsent}
                  onChange={setBrochureConsent}
                  error={errors.brochureConsent}
                />
              {submitError && <div style={{ ...errorStyle, marginTop: 12 }}>{submitError}</div>}
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button
                  onClick={() => setFlow('idle')}
                  style={{
                    flex: 'none', padding: '14px 20px',
                    background: 'transparent', border: '1px solid var(--line)',
                    color: 'var(--ink2)', fontSize: 14, fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  이전
                </button>
                <button
                  onClick={() => { if (validateBrochureEmail()) setBrochureStep(2); }}
                  style={{
                    flex: 1, padding: '14px 20px',
                    background: 'var(--accent)', color: '#fff',
                    fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
                  }}
                >
                  소개서 받기
                </button>
              </div>
              <div style={{ fontSize: 12, color: '#a0a4ac', marginTop: 12, lineHeight: 1.5 }}>
                입력한 정보는 자료 발송 목적으로만 사용됩니다.
              </div>
            </div>
          )}

          {/* Step 2: 선택적 추가 정보 */}
          {brochureStep === 2 && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', marginBottom: 4 }}>
                추가 정보 (선택)
              </div>
              <div style={{ fontSize: 14, color: 'var(--ink2)', marginBottom: 20 }}>
                이름과 회사명을 남기시면 맞춤 자료를 보내드립니다.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={fieldLabelStyle}>이름</label>
                  <input
                    value={brochureName} onChange={(e) => setBrochureName(e.target.value)}
                    placeholder="홍길동"
                    style={fieldInputStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--line)')}
                  />
                </div>
                <div>
                  <label style={fieldLabelStyle}>회사명</label>
                  <input
                    value={brochureCompany} onChange={(e) => setBrochureCompany(e.target.value)}
                    placeholder="주식회사 OO"
                    style={fieldInputStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--line)')}
                  />
                </div>
              </div>
              {submitError && <div style={{ ...errorStyle, marginTop: 12 }}>{submitError}</div>}
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button
                  onClick={() => handleBrochureSubmit()}
                  disabled={submitting}
                  style={{
                    flex: 1, padding: '14px 20px',
                    background: 'var(--accent)', color: '#fff',
                    fontSize: 15, fontWeight: 700, border: 'none',
                    cursor: submitting ? 'wait' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? '전송 중...' : '소개서 신청 완료'}
                </button>
              </div>
              <button
                onClick={() => handleBrochureSubmit()}
                disabled={submitting}
                style={{
                  background: 'none', border: 'none', padding: 0,
                  fontSize: 13, color: 'var(--ink2)', cursor: 'pointer',
                  marginTop: 10, textDecoration: 'underline',
                }}
              >
                건너뛰고 바로 받기
              </button>
            </div>
          )}

          {/* Step 3: 완료 */}
          {brochureStep === 3 && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                width: 48, height: 48, margin: '0 auto 16px',
                background: 'rgba(245,51,63,.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 22, color: 'var(--accent)', fontWeight: 800,
              }}>&#10003;</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>
                소개서를 보내드리겠습니다
              </div>
              <div style={{ fontSize: 15, color: 'var(--ink2)', marginTop: 8, lineHeight: 1.6 }}>
                {brochureEmail}으로 발송됩니다.
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
                <button
                  onClick={() => { setFlow('inquiry'); setStep(1); setErrors({}); }}
                  style={{
                    padding: '12px 22px', background: 'var(--accent)',
                    color: '#fff', border: 'none',
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  도입 상담도 시작하기
                </button>
                <button
                  onClick={onExplorer}
                  style={{
                    padding: '12px 22px', background: 'var(--surface)',
                    border: '1px solid var(--line)', color: 'var(--ink)',
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  다른 솔루션 보기
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


export default function HeroSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const [introPhase, setIntroPhase] = useState<0 | 1 | 2>(0);
  const [zoomedSol, setZoomedSol] = useState<Solution | null>(null);
  const [explorerMode, setExplorerMode] = useState(false);

  useEffect(() => {
    // requestAnimationFrame으로 paint 후 실행 보장
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    const raf = requestAnimationFrame(() => {
      t1 = setTimeout(() => setIntroPhase(1), 100);
      t2 = setTimeout(() => setIntroPhase(2), 900);
    });
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const switchPersona = useCallback((idx: number) => {
    if (idx === activeIdx) return;
    setFading(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setFading(false);
    }, 250);
  }, [activeIdx]);

  const p = PERSONAS[activeIdx];
  const isZoomed = !!zoomedSol;

  // "U 구조로 돌아가기" — zoomed에서 explorer로
  const goToExplorer = useCallback(() => {
    setZoomedSol(null);
    setExplorerMode(true);
  }, []);

  // "메인으로 돌아가기" — explorer/zoomed에서 idle로
  const goToMain = useCallback(() => {
    setZoomedSol(null);
    setExplorerMode(false);
  }, []);

  return (
    <section style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>

      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        perspective: 1200,
        zIndex: 2,
      }}>

        {/* Brand intro — flips away */}
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            backfaceVisibility: 'hidden',
            transition: 'transform 1s cubic-bezier(.4,0,.2,1), opacity .7s',
            transform: introPhase >= 2 ? 'rotateX(90deg)' : 'rotateX(0deg)',
            opacity: introPhase >= 2 ? 0 : 1,
            pointerEvents: introPhase >= 2 ? 'none' : 'auto',
          }}
        >
          <p style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            fontWeight: 500, fontSize: 13, letterSpacing: '.2em',
            color: 'var(--ink2)', textTransform: 'uppercase',
            margin: '0 0 20px',
            opacity: introPhase >= 1 ? 1 : 0,
            transition: 'opacity .8s ease .2s',
          }}>
            Connecting Complex IT
          </p>
          <h1 style={{
            fontWeight: 900, fontSize: 'clamp(48px, 10vw, 140px)',
            lineHeight: .88, letterSpacing: '-.06em',
            color: 'var(--ink)', textAlign: 'center',
            opacity: introPhase >= 1 ? 1 : 0,
            transform: introPhase >= 1 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity .8s ease .1s, transform .8s ease .1s',
            textShadow: '0 4px 24px rgba(17,18,20,.06)',
          }}>
            UNION<br />
            <span style={{ color: 'var(--accent)' }}>SYSTEMS</span>
          </h1>
        </div>

        {/* Main content — flips in → left/right split */}
        <div
          className="hero-main-content"
          style={{
            width: '100%',
            padding: '120px clamp(32px, 5vw, 72px) 64px clamp(20px, 3vw, 48px)',
            backfaceVisibility: 'hidden',
            transition: 'transform 1s cubic-bezier(.4,0,.2,1) .15s, opacity .7s .3s, max-width .5s ease, grid-template-columns .5s ease',
            transform: introPhase >= 2 ? 'rotateX(0deg)' : 'rotateX(-90deg)',
            opacity: introPhase >= 2 ? 1 : 0,
            display: 'grid',
            gridTemplateColumns: explorerMode && !isZoomed
              ? '1fr'
              : 'minmax(0, 0.38fr) minmax(0, 0.62fr)',
            alignItems: 'center',
            gap: 'clamp(24px, 3vw, 48px)',
            maxWidth: explorerMode && !isZoomed ? 1000 : 1520,
            margin: '0 auto',
          }}
        >
          {/* ═══ LEFT ═══ */}
          <div style={{
            position: 'relative', minWidth: 0,
            display: explorerMode && !isZoomed ? 'none' : 'block',
          }}>
            {/* Idle: persona tabs + copy */}
            <div style={{
              opacity: isZoomed || explorerMode ? 0 : 1,
              transform: isZoomed || explorerMode ? 'translateY(-10px)' : 'translateY(0)',
              transition: 'opacity .5s ease, transform .5s ease',
              pointerEvents: isZoomed || explorerMode ? 'none' : 'auto',
              position: isZoomed || explorerMode ? 'absolute' : 'relative',
              visibility: isZoomed || explorerMode ? 'hidden' : 'visible',
              width: '100%',
            }}>
              {/* Persona tabs — 미니멀 언더라인 스타일 */}
              <div style={{
                display: 'inline-flex', gap: 4, justifyContent: 'flex-start', marginBottom: 40,
              }}>
                {PERSONAS.map((persona, i) => (
                  <button
                    key={persona.id}
                    onClick={() => switchPersona(i)}
                    className="hero-tab"
                    style={{
                      padding: '10px 20px', border: 'none',
                      background: 'none',
                      color: activeIdx === i ? 'var(--ink)' : 'var(--ink2)',
                      fontWeight: activeIdx === i ? 800 : 500, fontSize: 14,
                      cursor: 'pointer',
                      transition: 'all .25s', position: 'relative',
                      letterSpacing: activeIdx === i ? '-0.01em' : '0',
                    }}
                  >
                    {persona.tab}
                    <span style={{
                      position: 'absolute', bottom: 0, left: 12, right: 12,
                      height: 2, background: 'var(--accent)',
                      transform: activeIdx === i ? 'scaleX(1)' : 'scaleX(0)',
                      transition: 'transform .3s cubic-bezier(.4,0,.2,1)',
                      transformOrigin: 'left',
                    }} />
                  </button>
                ))}
              </div>

              <div style={{
                opacity: fading ? 0 : 1,
                transform: fading ? 'translateY(6px)' : 'translateY(0)',
                transition: 'opacity .25s, transform .25s',
              }}>
                {/* Eyebrow */}
                <div style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                  fontSize: 12, fontWeight: 600, letterSpacing: '.12em',
                  color: 'var(--accent)', marginBottom: 14,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ width: 20, height: 1.5, background: 'var(--accent)' }} />
                  ENTERPRISE IT PLATFORM
                </div>

                <h2 style={{
                  fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
                  lineHeight: .92, letterSpacing: '-0.05em',
                  color: 'var(--ink)', margin: '0 0 22px', textAlign: 'left',
                }}>
                  {p.headline[0]}<br />{p.headline[1]}
                  <span style={{ color: 'var(--accent)' }}>{p.headlineSuffix}</span>
                </h2>
                <p style={{
                  fontWeight: 400, fontSize: 'clamp(15px, 1.4vw, 17px)',
                  lineHeight: 1.75, color: 'var(--ink2)', maxWidth: 640,
                  margin: '0 0 24px', textAlign: 'left', whiteSpace: 'pre-line',
                }}>{p.sub}</p>

                {/* Hint — 미세한 배경 필 */}
                <div style={{
                  fontSize: 13, color: 'var(--ink2)', marginBottom: 28,
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px',
                  background: 'rgba(245,51,63,.04)',
                  border: '1px solid rgba(245,51,63,.1)',
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
                    boxShadow: '0 0 0 3px rgba(245,51,63,.15)',
                  }} />
                  빨간 노드에 올려 살펴보고, 클릭해 안으로 들어가 보세요
                </div>

                <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                  <a href={p.ctaHref} className="hero-cta-primary" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    padding: '18px 36px', backgroundColor: 'var(--accent)',
                    color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none',
                    whiteSpace: 'nowrap', transition: 'transform .2s, box-shadow .2s',
                    boxShadow: '0 4px 20px -4px rgba(245,51,63,.35)',
                  }}>
                    {p.cta}<span style={{ fontSize: 15, transition: 'transform .2s' }}>&rarr;</span>
                  </a>
                  <a
                    href={p.id === 'ceo' ? '/unionsystems-brochure.pdf' : p.id === 'it' ? '/support/cases' : '/calculator'}
                    {...(p.id === 'ceo' ? { download: '유니온시스템즈 - 회사소개서.pdf', target: '_blank' as const } : {})}
                    className="hero-cta-secondary"
                    style={{
                    display: 'inline-flex', alignItems: 'center', padding: '18px 36px',
                    border: '1.5px solid var(--line)', background: 'transparent',
                    color: 'var(--ink)', fontWeight: 700, fontSize: 15, textDecoration: 'none',
                    whiteSpace: 'nowrap', transition: 'transform .2s, background .2s, color .2s, border-color .2s',
                  }}>{p.sub2}</a>
                </div>

                {/* Stats — Newsreader 세리프 숫자 + 세로 구분선 */}
                <div style={{
                  display: 'flex', gap: 0, marginTop: 36,
                  paddingTop: 28, borderTop: '1px solid var(--line)',
                }}>
                  {[
                    { num: '7', label: '핵심 솔루션' },
                    { num: '20+', label: '보안 솔루션', accent: true },
                    { num: '4,000+', label: '고객사', accent: true },
                  ].map((s, i) => (
                    <div key={i} style={{
                      flex: 1,
                      paddingLeft: i > 0 ? 24 : 0,
                      borderLeft: i > 0 ? '1px solid var(--line)' : 'none',
                    }}>
                      <div style={{
                        fontSize: 28, fontWeight: 800, color: 'var(--ink)',
                        fontFamily: '"Newsreader", Georgia, serif', fontStyle: 'italic',
                        lineHeight: 1,
                      }}>
                        {s.accent ? (
                          <>{s.num.replace('+', '')}<span style={{ color: 'var(--accent)' }}>+</span></>
                        ) : s.num}
                      </div>
                      <div style={{
                        fontSize: 12, color: 'var(--ink2)', marginTop: 6,
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                        letterSpacing: '.04em',
                      }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Zoomed: detail panel */}
            <div style={{
              opacity: isZoomed ? 1 : 0,
              transform: isZoomed ? 'none' : 'translateY(12px)',
              transition: 'opacity .5s ease .28s, transform .5s cubic-bezier(.4,0,.2,1) .28s',
              pointerEvents: isZoomed ? 'auto' : 'none',
              position: isZoomed ? 'relative' : 'absolute',
              visibility: isZoomed ? 'visible' : 'hidden',
              top: isZoomed ? undefined : 0,
              width: '100%',
            }}>
              {zoomedSol && (
                <DetailPanel
                  solution={zoomedSol}
                  onClose={goToMain}
                  onExplorer={goToExplorer}
                />
              )}
            </div>
          </div>

          {/* ═══ RIGHT: Molecular U ═══ */}
          <div
            className="hero-molecular-area"
            style={{
              position: 'relative',
              minHeight: isZoomed ? 'calc(100vh - 120px)' : explorerMode ? 'calc(100vh - 180px)' : 700,
              height: isZoomed ? 'calc(100vh - 120px)' : explorerMode ? 'calc(100vh - 180px)' : 'clamp(600px, 72vh, 960px)',
              overflow: 'visible',
              transition: 'min-height .4s ease, height .4s ease',
            }}
          >
            {/* Explorer mode header */}
            {explorerMode && !isZoomed && (
              <div style={{
                position: 'absolute', top: -48, left: 0, right: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
                zIndex: 20,
                animation: 'detailFadeIn .4s ease-out',
              }}>
                <button
                  onClick={goToMain}
                  style={{
                    background: 'none', border: '1px solid var(--line)',
                    padding: '8px 20px', fontSize: 13, fontWeight: 600,
                    color: 'var(--ink2)', cursor: 'pointer',
                    transition: 'all .2s',
                  }}
                >
                  ← 메인으로 돌아가기
                </button>
                <span style={{
                  fontSize: 14, fontWeight: 700, color: 'var(--ink)',
                  letterSpacing: '-0.02em',
                }}>
                  솔루션을 선택하세요
                </span>
              </div>
            )}
            <MolecularErrorBoundary>
              <MolecularU
                onZoom={(sol) => { setZoomedSol(sol); setExplorerMode(false); }}
                onClose={goToExplorer}
                onBrochure={() => {}}
                zoomedSolution={zoomedSol}
              />
            </MolecularErrorBoundary>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .hero-cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px -4px rgba(245,51,63,.4);
        }
        .hero-cta-primary:hover span { transform: translateX(3px); }
        .hero-cta-secondary:hover {
          background: var(--ink);
          color: #fff;
          transform: translateY(-3px);
        }
        @keyframes detailFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.15; }
        }
        @media (max-width: 1100px) {
          .hero-main-content {
            grid-template-columns: 1fr !important;
            text-align: left !important;
            max-width: 720px !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          .hero-molecular-area {
            min-height: 400px !important;
            height: 400px !important;
          }
        }
        @media (max-width: 640px) {
          .hero-main-content {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .hero-tab {
            padding: 10px 16px !important;
            font-size: 13px !important;
          }
          .hero-molecular-area {
            min-height: 320px !important;
            height: 320px !important;
          }
        }
      `}</style>
    </section>
  );
}
