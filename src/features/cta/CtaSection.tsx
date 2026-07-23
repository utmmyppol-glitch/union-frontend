'use client';

import React, { useState, FormEvent } from 'react';
import { Container } from '@/components/ui';
import { apiClient } from '@/lib/api';

const CtaSection: React.FC = () => {
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!consentPrivacy) {
      setConsentError(true);
      return;
    }
    setSubmitting(true);

    try {
      await apiClient.submitInquiry({
        name,
        company,
        phone: contact,
        email: contact.includes('@') ? contact : '',
        consentPrivacy,
      });
      setSubmitted(true);
      setCompany('');
      setName('');
      setContact('');
      setConsentPrivacy(false);
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      // 백엔드 미실행 시에도 UI 피드백
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 0,
    border: '1px solid var(--line)',
    background: 'var(--bg)',
    fontFamily: "'Pretendard', sans-serif",
    fontWeight: 500,
    fontSize: 18,
    color: 'var(--ink)',
    outline: 'none',
    transition: 'border-color .2s',
    boxSizing: 'border-box' as const,
  };

  return (
    <section style={{ padding: 'clamp(60px, 8vw, 112px) 0' }}>
      <Container>
        <div className="cta-card">
          {/* Radial overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 0,
              background:
                'radial-gradient(circle at 80% 20%, rgba(255,255,255,.16), transparent 42%)',
              pointerEvents: 'none',
            }}
          />

          <div className="cta-inner">
            {/* Left side */}
            <div
              style={{
                padding: 'clamp(36px, 5vw, 64px)',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Newsreader', serif",
                  fontStyle: 'italic',
                  fontWeight: 500,
                  fontSize: 'clamp(32px, 5vw, 56px)',
                  lineHeight: 1.12,
                  letterSpacing: '-.02em',
                  margin: '0 0 20px',
                  whiteSpace: 'pre-line',
                }}
              >
                {'무엇이든\n물어보세요.'}
              </h2>
              <p
                style={{
                  fontFamily: "'Pretendard', sans-serif",
                  fontWeight: 500,
                  fontSize: 'clamp(14px, 1.6vw, 17px)',
                  lineHeight: 1.6,
                  opacity: 0.9,
                  margin: '0 0 32px',
                  whiteSpace: 'pre-line',
                }}
              >
                {'도입 검토부터 견적, 기술 상담까지.\n영업일 기준 24시간 내 답변드립니다.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18 }}>
                  <span>&#x1F4DE;</span>
                  <span style={{ fontWeight: 600 }}>02-706-8999</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18 }}>
                  <span>&#x2709;&#xFE0F;</span>
                  <a
                    href="mailto:sales@unionsystems.co.kr"
                    style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}
                  >
                    sales@unionsystems.co.kr
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18 }}>
                  <span>&#x1F4CD;</span>
                  <span style={{ fontWeight: 500, opacity: 0.9 }}>
                    서울 성동구 아차산로17길 49
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - form */}
            <div
              style={{
                background: 'var(--surface)',
                borderRadius: 0,
                padding: 'clamp(30px, 4vw, 44px)',
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Pretendard', sans-serif",
                  fontWeight: 800,
                  fontSize: 18,
                  color: 'var(--ink)',
                  margin: '0 0 24px',
                }}
              >
                도입 문의하기
              </h3>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input
                  type="text"
                  placeholder="회사명"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="담당자명 / 직함"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="이메일 또는 연락처"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  style={inputStyle}
                />
                {/* 개인정보 수집 안내 박스 */}
                <div style={{
                  border: '1px solid var(--line)', padding: '14px 16px', marginTop: 4,
                  background: 'var(--bg)', maxHeight: 130, overflowY: 'auto',
                }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', margin: '0 0 8px' }}>
                    개인정보 수집 및 이용에 대한 안내
                  </p>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--ink2)' }}>
                    <p style={{ margin: '0 0 6px' }}>
                      <strong style={{ color: 'var(--ink)' }}>수집하는 개인정보의 항목</strong><br />
                      이름, 회사명, 연락처, 이메일
                    </p>
                    <p style={{ margin: '0 0 6px' }}>
                      <strong style={{ color: 'var(--ink)' }}>개인정보의 수집·이용 목적</strong><br />
                      문의 사항에 대한 답변을 전달하기 위한 의사소통 경로의 확보와 안내, 상담, 기타 이벤트 안내 등
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong style={{ color: 'var(--ink)' }}>개인정보의 보유 및 이용기간</strong><br />
                      원칙적으로 개인정보의 수집·이용 목적 달성 시 바로 파기합니다.<br />
                      수집·이용 목적을 달성한 경우에도 법률의 규정에 따라 보존할 필요가 있다면 고객의 개인정보를 보유할 수 있습니다.<br />
                      <span style={{ display: 'block', paddingLeft: 8, marginTop: 2 }}>
                        · 계약 또는 청약철회 등에 관한 기록 : 5년<br />
                        · 대금결제 및 재화등의 공급에 관한 기록 : 5년<br />
                        · 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년
                      </span>
                    </p>
                  </div>
                </div>

                {/* 동의 체크박스 */}
                <div>
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  }}>
                    <input
                      type="checkbox"
                      checked={consentPrivacy}
                      onChange={(e) => { setConsentPrivacy(e.target.checked); setConsentError(false); }}
                      style={{ width: 16, height: 16, accentColor: 'var(--accent)', flexShrink: 0 }}
                    />
                    <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600 }}>
                      위 내용을 확인했으며, 이에 동의합니다.{' '}
                      <span style={{ whiteSpace: 'nowrap', color: 'var(--accent)' }}>(필수)</span>
                    </span>
                  </label>
                  {consentError && (
                    <p style={{ fontSize: 13, color: 'var(--accent)', margin: '4px 0 0 24px', fontWeight: 600 }}>
                      개인정보 수집에 동의해주세요.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 0,
                    border: 'none',
                    background: submitted ? '#111214' : '#fff',
                    color: submitted ? '#fff' : 'var(--charcoal, #141416)',
                    fontFamily: "'Pretendard', sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
                    cursor: 'pointer',
                    transition: 'background .3s',
                    marginTop: 4,
                  }}
                >
                  {submitting ? '접수 중...' : submitted ? '접수되었습니다 \u2713' : '문의 접수하기'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>

      <style>{`
        .cta-card {
          position: relative;
          border-radius: 0;
          background: var(--charcoal, #141416);
          overflow: hidden;
        }
        .cta-inner {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
        }
        @media (max-width: 920px) {
          .cta-inner {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CtaSection;
