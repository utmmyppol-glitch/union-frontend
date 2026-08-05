'use client';

import React, { useState, FormEvent } from 'react';
import { Container } from '@/components/ui';
import { apiClient } from '@/lib/api';
import PrivacyConsent from '@/components/ui/PrivacyConsent';

const CtaSection: React.FC = () => {
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentError, setConsentError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!consentPrivacy) {
      setConsentError('개인정보 수집에 동의해주세요.');
      return;
    }
    setConsentError('');
    setSubmitting(true);

    try {
      await apiClient.submitInquiry({
        name,
        company,
        phone: contact.includes('@') ? '-' : contact,
        email: contact.includes('@') ? contact : `${contact}@no-email.local`,
        consentPrivacy,
      });
      setSubmitted(true);
      setCompany('');
      setName('');
      setContact('');
      setConsentPrivacy(false);
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
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
                {'도입 검토부터 견적, 기술 상담까지.\n당일 내 답변드립니다.'}
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
                      <PrivacyConsent
                        checked={consentPrivacy}
                        onChange={setConsentPrivacy}
                        error={consentError}
                      />

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
