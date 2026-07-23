'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { apiClient } from '@/lib/api';

type Phase = 'idle' | 'throwing' | 'form' | 'success';

export default function UnicornBrochure() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const throwTimer = useRef<ReturnType<typeof setTimeout>>();
  const successTimer = useRef<ReturnType<typeof setTimeout>>();
  const bubbleTimer = useRef<ReturnType<typeof setTimeout>>();

  // 말풍선 사이클: 3초 후 등장 → 5초 유지 → 사라짐 → 2.6초 후 재등장
  useEffect(() => {
    if (phase !== 'idle') { setBubbleVisible(false); return; }
    let mounted = true;
    const cycle = () => {
      if (!mounted) return;
      bubbleTimer.current = setTimeout(() => {
        if (!mounted) return;
        setBubbleVisible(true);
        bubbleTimer.current = setTimeout(() => {
          if (!mounted) return;
          setBubbleVisible(false);
          bubbleTimer.current = setTimeout(cycle, 2600);
        }, 5000);
      }, 3000);
    };
    cycle();
    return () => { mounted = false; clearTimeout(bubbleTimer.current); };
  }, [phase]);

  // cleanup
  useEffect(() => {
    return () => {
      clearTimeout(throwTimer.current);
      clearTimeout(successTimer.current);
      clearTimeout(bubbleTimer.current);
    };
  }, []);

  const handleClick = useCallback(() => {
    if (phase !== 'idle') return;
    setPhase('throwing');
    setBubbleVisible(false);
    throwTimer.current = setTimeout(() => setPhase('form'), 940);
  }, [phase]);

  const handleSubmit = useCallback(() => {
    if (!email || !/.+@.+\..+/.test(email)) {
      setError(true);
      return;
    }
    if (!consentPrivacy) {
      setConsentError(true);
      return;
    }
    // API 호출
    apiClient.submitDownload({
      name: '(유니콘 소개서 요청)',
      company: '(미입력)',
      email,
      phone: '',
      fileType: '회사소개서',
      consentPrivacy: true,
    }).catch(() => {});

    setPhase('success');
    successTimer.current = setTimeout(() => {
      setPhase('idle');
      setEmail('');
      setError(false);
      setConsentPrivacy(false);
      setConsentError(false);
    }, 3400);
  }, [email, consentPrivacy]);

  const handleClose = useCallback(() => {
    clearTimeout(throwTimer.current);
    clearTimeout(successTimer.current);
    setPhase('idle');
    setEmail('');
    setError(false);
  }, []);

  return (
    <>
      {/* ═══ 캐릭터 블록 ═══ */}
      <div
        role="button"
        tabIndex={0}
        aria-label="소개서 요청"
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        style={{
          position: 'fixed',
          right: -120,
          top: 88,
          width: 110,
          height: 138,
          zIndex: phase === 'form' || phase === 'success' ? 40 : 60,
          cursor: phase === 'idle' ? 'pointer' : 'default',
          animation: phase === 'idle' ? 'ub-float 4s ease-in-out infinite' : 'none',
          transform: phase === 'throwing'
            ? 'translateX(-26px) rotate(-12deg) scale(1.06)'
            : phase === 'form' || phase === 'success'
              ? 'translate(6px, -6px) scale(.9)'
              : 'none',
          transition: phase === 'throwing'
            ? 'transform .45s cubic-bezier(.34,1.56,.64,1)'
            : 'transform .5s cubic-bezier(.34,1.4,.6,1)',
          filter: 'drop-shadow(0 24px 30px rgba(228,0,43,.16))',
        }}
      >
        {/* 기본 포즈 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/unicorn-idle.png"
          alt="유니온 유니콘"
          draggable={false}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'contain', userSelect: 'none',
            opacity: phase === 'idle' ? 1 : 0,
            transition: 'opacity .35s ease',
          }}
        />
        {/* 기쁜 포즈 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/unicorn-joy.png"
          alt=""
          draggable={false}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'contain', userSelect: 'none',
            opacity: phase !== 'idle' ? 1 : 0,
            transition: 'opacity .3s ease',
          }}
        />

        {/* 말풍선 */}
        {phase === 'idle' && (
          <div style={{
            position: 'absolute',
            left: -170, top: 0,
            width: 160,
            background: '#fff',
            border: '1px solid #eef0f3',
            borderRadius: 18,
            padding: '16px 18px',
            boxShadow: '0 16px 44px rgba(17,17,17,.13)',
            opacity: bubbleVisible ? 1 : 0,
            transform: bubbleVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity .5s ease, transform .5s ease',
            pointerEvents: 'none',
            fontSize: 13, fontWeight: 700, lineHeight: 1.5,
            color: '#1a1a1a', textAlign: 'center',
            letterSpacing: '-0.02em',
          }}>
            소개서 받아보고
            싶으시면
            저를 <span style={{ color: '#E4002B' }}>클릭</span>해주세요 !!
            {/* 말풍선 꼬리 */}
            <div style={{
              position: 'absolute', right: -6, top: 28,
              width: 12, height: 12,
              background: '#fff',
              border: '1px solid #eef0f3',
              borderTop: 'none', borderLeft: 'none',
              transform: 'rotate(-45deg)',
            }} />
          </div>
        )}
      </div>

      {/* ═══ 날아가는 소개서 ═══ */}
      {phase === 'throwing' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 55, pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute',
            right: '11%', top: '30%',
            width: 112, height: 140,
            background: '#fff',
            borderRadius: 9,
            boxShadow: '0 12px 26px rgba(17,17,17,.2)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: 14,
            overflow: 'hidden',
            animation: 'ub-fly .88s cubic-bezier(.42,.02,.32,1) forwards',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/union-u-logo.png" alt="" draggable={false} style={{ width: 36, height: 36, objectFit: 'contain' }} />
            <div style={{ fontSize: 10, fontWeight: 800, color: '#111', letterSpacing: '.04em' }}>UNION SYSTEMS</div>
            <div style={{ width: '70%', height: 1, background: '#eee' }} />
            <div style={{ fontSize: 9, color: '#888' }}>회사소개서</div>
          </div>
          {/* 잔상 */}
          <div style={{
            position: 'absolute',
            right: '14%', top: '34%',
            width: 200, height: 12,
            background: 'linear-gradient(to left, rgba(228,0,43,.4), transparent)',
            borderRadius: 6, filter: 'blur(3px)',
            animation: 'ub-trail .5s ease-out forwards',
          }} />
        </div>
      )}

      {/* ═══ 폼 모달 ═══ */}
      {(phase === 'form' || phase === 'success') && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(17,17,17,.30)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'ub-fadeIn .3s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(520px, 90%)',
              background: '#fff',
              borderRadius: 22,
              boxShadow: '0 40px 90px rgba(17,17,17,.28)',
              overflow: 'hidden',
              padding: '32px 34px 28px',
              position: 'relative',
              animation: 'ub-modalPop .5s cubic-bezier(.34,1.4,.5,1)',
            }}
          >
            {/* 데코 글로우 */}
            <div style={{
              position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
              width: 200, height: 200, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(228,0,43,.08) 0%, transparent 70%)',
              pointerEvents: 'none',
              animation: 'ub-burst .7s ease-out',
            }} />

            {/* 헤더 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, position: 'relative', zIndex: 1 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/brand-logo.png" alt="UNION SYSTEMS" draggable={false} style={{ height: 28 }} />
              <button
                onClick={handleClose}
                aria-label="닫기"
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: '#f4f5f7', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#9aa0a6', fontSize: 16,
                }}
              >✕</button>
            </div>

            {/* 구분선 */}
            <div style={{ height: 1, background: '#eef0f3', marginBottom: 24 }} />

            {phase === 'form' ? (
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: 24, fontWeight: 900, color: '#111', margin: '0 0 6px', letterSpacing: '-0.03em' }}>
                  회사 소개서
                </h3>
                <p style={{ fontSize: 14, color: '#676767', margin: '0 0 24px' }}>
                  도입 구성, 레퍼런스, 견적 기준이 담겨 있습니다.
                </p>

                <div style={{ fontSize: 15, fontWeight: 800, color: '#111', marginBottom: 8 }}>
                  이메일로 받기
                </div>
                <p style={{ fontSize: 13, color: '#676767', lineHeight: 1.55, margin: '0 0 16px' }}>
                  입력하신 주소로 PDF 소개서를 보내드립니다.
                </p>

                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(false); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="name@company.com"
                    style={{
                      flex: 1, padding: '12px 16px',
                      borderRadius: 10,
                      border: `1px solid ${error ? '#E4002B' : '#d5d8dd'}`,
                      fontSize: 14, outline: 'none',
                      fontFamily: 'inherit',
                      transition: 'border-color .2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#E4002B'}
                    onBlur={(e) => e.target.style.borderColor = error ? '#E4002B' : '#d5d8dd'}
                    autoFocus
                  />
                  <button
                    onClick={handleSubmit}
                    style={{
                      padding: '12px 24px',
                      background: '#E4002B',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      fontSize: 14, fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 6px 18px rgba(228,0,43,.28)',
                      transition: 'background .2s, transform .2s',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#B80020'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#E4002B'; e.currentTarget.style.transform = 'none'; }}
                  >
                    발송하기
                  </button>
                </div>
                {error && (
                  <div style={{ fontSize: 12, color: '#E4002B', fontWeight: 600, marginTop: 6 }}>
                    올바른 이메일 주소를 입력해주세요.
                  </div>
                )}

                {/* 개인정보 수집 안내 */}
                <div style={{
                  border: '1px solid #eef0f3', padding: '12px 14px', marginTop: 16,
                  background: '#f9fafb', maxHeight: 100, overflowY: 'auto',
                  fontSize: 12, lineHeight: 1.7, color: '#676767', borderRadius: 8,
                }}>
                  <p style={{ fontWeight: 700, fontSize: 12, color: '#111', margin: '0 0 6px' }}>개인정보 수집 및 이용에 대한 안내</p>
                  <p style={{ margin: '0 0 4px' }}><strong style={{ color: '#111' }}>수집항목</strong> : 이메일</p>
                  <p style={{ margin: '0 0 4px' }}><strong style={{ color: '#111' }}>수집·이용 목적</strong> : 소개서 자료 발송, 상담 안내</p>
                  <p style={{ margin: 0 }}><strong style={{ color: '#111' }}>보유 및 이용기간</strong> : 목적 달성 시 파기. 계약/청약철회 기록 5년, 대금결제/재화공급 기록 5년, 소비자 불만/분쟁처리 기록 3년 보존</p>
                </div>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 13, color: '#444', cursor: 'pointer', marginTop: 10,
                }}>
                  <input
                    type="checkbox" checked={consentPrivacy}
                    onChange={(e) => { setConsentPrivacy(e.target.checked); setConsentError(false); }}
                    style={{ width: 16, height: 16, accentColor: '#E4002B', cursor: 'pointer', flexShrink: 0 }}
                  />
                  <span>개인정보 수집 및 이용에 동의합니다. (필수)</span>
                </label>
                {consentError && (
                  <div style={{ fontSize: 12, color: '#E4002B', fontWeight: 600, marginTop: 4, marginLeft: 24 }}>
                    개인정보 수집에 동의해주세요.
                  </div>
                )}

                {/* 포함 내용 */}
                <div style={{ height: 1, background: '#eef0f3', margin: '24px 0 14px' }} />
                <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>소개서에 포함된 내용</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['솔루션 구성도', '도입 레퍼런스', '라이선스 체계', '견적 기준'].map((t) => (
                    <span key={t} style={{
                      padding: '6px 12px', fontSize: 12, fontWeight: 600,
                      color: '#444', background: '#f6f8fa',
                      border: '1px solid #eef0f3',
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            ) : (
              /* 완료 상태 */
              <div style={{ textAlign: 'center', padding: '20px 0', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: '#E4002B',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 10px 26px rgba(228,0,43,.32)',
                  animation: 'ub-checkPop .55s cubic-bezier(.34,1.56,.64,1)',
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#111', marginBottom: 6 }}>
                  소개서를 보내드렸어요!
                </div>
                <div style={{ fontSize: 14, color: '#676767' }}>
                  입력하신 메일함을 확인해주세요.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes ub-float {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-16px) rotate(1.5deg); }
        }
        @keyframes ub-fly {
          0% { transform: translate(0, 0) rotate(9deg) scale(1); opacity: 1; }
          45% { transform: translate(-15vw, -6vh) rotate(-5deg) scale(1.1); opacity: 1; }
          100% { transform: translate(-33vw, 25vh) rotate(-15deg) scale(1.4); opacity: 0; }
        }
        @keyframes ub-trail {
          0% { opacity: .7; transform: scaleX(1); }
          100% { opacity: 0; transform: scaleX(2.5) translateX(-30px); }
        }
        @keyframes ub-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes ub-modalPop {
          0% { transform: scale(.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ub-burst {
          0% { transform: translateX(-50%) scale(.3); opacity: 0; }
          40% { opacity: .6; }
          100% { transform: translateX(-50%) scale(2); opacity: 0; }
        }
        @keyframes ub-checkPop {
          0% { transform: scale(0); }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @media (max-width: 768px) {
          /* 모바일에서 캐릭터 작게 */
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01s !important; }
        }
      `}</style>
    </>
  );
}
