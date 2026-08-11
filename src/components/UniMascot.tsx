'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import PrivacyConsent from '@/components/ui/PrivacyConsent';

type View = 'inquiry' | 'brochure' | null;
type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const MSGS = [
  { text: '도입상담이 필요하시면', bold: '저를 눌러주세요!' },
];

export default function UniMascot() {
  const [visible, setVisible] = useState(true);
  const [view, setView] = useState<View>(null);
  const [throwing, setThrowing] = useState(false);
  const [bubbleShow, setBubbleShow] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const throwT1 = useRef<ReturnType<typeof setTimeout>>();
  const throwT2 = useRef<ReturnType<typeof setTimeout>>();
  const wrapRef = useRef<HTMLButtonElement>(null);
  const rafRef = useRef<number>();

  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentError, setConsentError] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');

  // 말풍선 사이클
  useEffect(() => {
    if (view || throwing || !visible) { setBubbleShow(false); return; }
    let on = true;
    const loop = () => {
      if (!on) return;
      timer.current = setTimeout(() => {
        if (!on) return;
        setBubbleShow(true);
        timer.current = setTimeout(() => {
          if (!on) return;
          setBubbleShow(false);
          setMsgIdx(i => (i + 1) % MSGS.length);
          timer.current = setTimeout(loop, 4000);
        }, 5000);
      }, 1200);
    };
    setBubbleShow(true);
    timer.current = setTimeout(() => {
      if (!on) return;
      setBubbleShow(false);
      setMsgIdx(i => (i + 1) % MSGS.length);
      timer.current = setTimeout(loop, 4000);
    }, 5000);
    return () => { on = false; clearTimeout(timer.current); };
  }, [view, throwing, visible]);

  // 스크롤 trailing — 스크롤 따라 졸졸 따라다님
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduce) return;
    let lastY = window.scrollY;
    let off = 0;
    let vel = 0;
    const loop = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      vel += delta * 0.16;
      vel *= 0.90;
      off += (0 - off) * 0.055 + vel;
      off = Math.max(-30, Math.min(30, off));
      const eased = off * (1 - Math.min(Math.abs(off) / 30, 1) * 0.28);
      if (wrapRef.current) {
        wrapRef.current.style.setProperty('--mcTrail', eased.toFixed(2) + 'px');
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const reset = useCallback(() => {
    setForm({ name: '', company: '', phone: '', email: '', message: '' });
    setErrors({}); setConsentPrivacy(false); setConsentError(''); setStatus('idle');
  }, []);

  // 클릭 → throw 애니메이션 → 폼 등장
  // 현재 말풍선이 소개서 문구면 brochure, 아니면 inquiry
  const handleClick = useCallback(() => {
    if (throwing || view) return;
    setBubbleShow(false);
    setThrowing(true);
    throwT1.current = setTimeout(() => {
      setView('inquiry');
    }, 680);
    throwT2.current = setTimeout(() => {
      setThrowing(false);
    }, 1450);
  }, [throwing, view]);

  const close = useCallback(() => { setView(null); reset(); }, [reset]);

  const dismiss = useCallback(() => {
    setVisible(false); setBubbleShow(false); setView(null); reset();
  }, [reset]);

  const validate = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = '이름을 입력해주세요.';
    if (!form.company.trim()) e.company = '회사명을 입력해주세요.';
    if (!form.phone.trim()) e.phone = '연락처를 입력해주세요.';
    else if (!/^[\d\-+() ]{8,}$/.test(form.phone.trim())) e.phone = '올바른 연락처를 입력해주세요.';
    if (!form.email.trim()) e.email = '이메일을 입력해주세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = '올바른 이메일을 입력해주세요.';
    if (!consentPrivacy) setConsentError('개인정보 수집에 동의해주세요.');
    setErrors(e);
    return Object.keys(e).length === 0 && consentPrivacy;
  }, [form, consentPrivacy]);

  const submit = useCallback(async () => {
    if (!validate()) return;
    setStatus('loading');
    try {
      await apiClient.submitInquiry({
        name: form.name.trim(), company: form.company.trim(),
        phone: form.phone.trim(), email: form.email.trim(),
        message: form.message.trim(),
        product: view === 'brochure' ? '소개서' : undefined,
        consentPrivacy: true,
      });
      setStatus('success');
    } catch { setStatus('error'); }
  }, [validate, view, form]);

  const set = useCallback((k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(throwT1.current);
      clearTimeout(throwT2.current);
      clearTimeout(timer.current);
    };
  }, []);

  if (!visible) return null;

  const msg = MSGS[msgIdx];

  return (
    <>
      {/* ═══ 플로팅 마스코트 CTA ═══ */}
      <button
        ref={wrapRef}
        className={`mc-wrap${throwing ? ' mc-throw' : ''}`}
        onClick={handleClick}
        onDoubleClick={dismiss}
        aria-label="도입상담 문의"
        type="button"
      >
        {/* 말풍선 */}
        <div className="mc-bubble" style={{
          opacity: bubbleShow && !view && !throwing ? 1 : 0,
          animation: bubbleShow && !view && !throwing ? 'mcBubbleIn .5s cubic-bezier(.22,1,.36,1) both' : 'none',
        }}>
          {msg.text}<br /><b>{msg.bold}</b>
          <span className="mc-tail" />
          {/* 말풍선→캐릭터 연결 도트 */}
          <span className="mc-dots">
            <i /><i />
          </span>
        </div>

        {/* 캐릭터 */}
        <div className="mc-char">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={throwing ? '/mascot-fly.png' : '/mascot-sit.png'}
            alt="유니 마스코트"
            draggable={false}
          />
        </div>
      </button>

      {/* ═══ 폼 모달 ═══ */}
      {view && (
        <div className="mc-overlay" onClick={close}>
          <div className="mc-form" onClick={e => e.stopPropagation()}>
            <button className="mc-x" onClick={close} aria-label="닫기" type="button">✕</button>

            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '30px 0 50px' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', background: '#E4002B',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', boxShadow: '0 10px 26px rgba(228,0,43,.32)',
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#141a24', marginBottom: 6 }}>
                  {view === 'brochure' ? '소개서 요청이 접수되었습니다!' : '문의가 접수되었습니다!'}
                </div>
                <div style={{ fontSize: 14, color: '#6b7482' }}>
                  {view === 'brochure' ? '입력하신 이메일로 소개서를 보내드리겠습니다.' : '담당자가 확인 후 빠른 시일 내에 연락드리겠습니다.'}
                </div>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#141a24', letterSpacing: '-0.02em', margin: 0 }}>
                  {view === 'brochure' ? '소개서 요청' : '도입문의'}
                </h2>
                <p style={{ fontSize: 14, color: '#6b7482', margin: '8px 0 22px' }}>
                  {view === 'brochure'
                    ? '정보를 남겨주시면 회사·솔루션 소개서를 이메일로 보내드립니다.'
                    : '궁금한 점을 남겨주시면 담당자가 빠르게 연락드립니다.'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <McField label="이름" value={form.name} error={errors.name} onChange={v => set('name', v)} placeholder="홍길동" />
                  <McField label="회사명" value={form.company} error={errors.company} onChange={v => set('company', v)} placeholder="주식회사 OOO" />
                  <McField label="연락처" value={form.phone} error={errors.phone} onChange={v => set('phone', v)} placeholder="02-000-0000" type="tel" />
                  <McField label="이메일" value={form.email} error={errors.email} onChange={v => set('email', v)} placeholder="name@company.com" type="email" />
                </div>

                {view === 'inquiry' && (
                  <div style={{ marginTop: 16 }}>
                    <label className="mc-lbl">문의 내용</label>
                    <textarea className="mc-in" rows={3} style={{ resize: 'vertical' }}
                      value={form.message} onChange={e => set('message', e.target.value)}
                      placeholder="도입에 궁금하신 점을 자유롭게 남겨주세요." />
                  </div>
                )}

                {view === 'brochure' && (
                  <div style={{ marginTop: 16 }}>
                    <label className="mc-lbl">관심 솔루션</label>
                    <input className="mc-in" placeholder="예) IT 인프라·협업, 설계 등" />
                  </div>
                )}

                <div style={{ marginTop: 16 }}>
                  <PrivacyConsent checked={consentPrivacy} onChange={v => { setConsentPrivacy(v); setConsentError(''); }} error={consentError} />
                </div>

                {status === 'error' && (
                  <div style={{ padding: 12, background: 'rgba(228,0,43,.06)', border: '1px solid rgba(228,0,43,.2)', borderRadius: 10, marginTop: 12 }}>
                    <p style={{ fontSize: 13, color: '#E4002B', margin: 0, fontWeight: 600 }}>접수 중 오류가 발생했습니다. 다시 시도해주세요.</p>
                  </div>
                )}

                <button className="mc-submit" onClick={submit} disabled={status === 'loading'} type="button"
                  style={{ opacity: status === 'loading' ? 0.6 : 1 }}>
                  {status === 'loading' ? '접수 중...'
                    : view === 'brochure' ? '소개서 받기' : '도입문의 제출'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        /* ═══ Floating Mascot CTA ═══ */
        @keyframes mcFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        @keyframes mcBubbleIn { 0% { opacity:0; transform: translateY(6px) scale(.9); } 100% { opacity:1; transform: translateY(0) scale(1); } }
        @keyframes mcThrow {
          0%   { transform: translate(0,0) scale(1) rotate(0); }
          18%  { transform: translate(-6vw,-9vh) scale(1.35) rotate(-7deg); }
          46%  { transform: translate(-34vw,-30vh) scale(2.05) rotate(-5deg); }
          64%  { transform: translate(-34vw,-30vh) scale(2.05) rotate(-3deg); }
          100% { transform: translate(0,0) scale(1) rotate(0); }
        }
        @keyframes formFly {
          0%   { opacity:0; transform: translate(-6vw,-16vh) scale(.16) rotate(10deg); }
          55%  { opacity:1; }
          100% { opacity:1; transform: translate(0,0) scale(1) rotate(0); }
        }
        @keyframes ovFade { from { opacity:0; } to { opacity:1; } }

        .mc-wrap {
          position: fixed;
          right: 26px;
          top: 54%;
          z-index: 60;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          font-family: inherit;
          filter: drop-shadow(0 10px 14px rgba(40,20,25,.16));
          transform: translateY(var(--mcTrail, 0px));
        }

        /* ═══ 말풍선 ═══ */
        .mc-bubble {
          position: relative;
          background: #fff;
          color: #3a2f31;
          font-weight: 600;
          font-size: 13.5px;
          line-height: 1.42;
          padding: 12px 18px;
          border-radius: 22px;
          max-width: 186px;
          text-align: center;
          text-wrap: balance;
          box-shadow: 0 8px 22px rgba(228,0,43,.16);
          border: 1.6px solid #ffd9de;
          transition: opacity .2s;
        }
        .mc-bubble b { color: #E4002B; font-weight: 800; }
        .mc-tail {
          position: absolute;
          left: 50%; bottom: -7px;
          width: 15px; height: 15px;
          background: #fff;
          border-right: 1.6px solid #ffd9de;
          border-bottom: 1.6px solid #ffd9de;
          transform: translateX(-50%) rotate(45deg);
          border-bottom-right-radius: 3px;
        }
        .mc-dots {
          position: absolute;
          left: calc(50% + 26px); bottom: -16px;
          display: flex; gap: 4px;
        }
        .mc-dots i {
          width: 6px; height: 6px; border-radius: 50%;
          background: #fff; border: 1.4px solid #ffd9de;
          display: block;
        }
        .mc-dots i:nth-child(2) { width: 4px; height: 4px; margin-top: 2px; }

        /* ═══ 캐릭터 ═══ */
        .mc-char {
          margin-top: 2px;
          animation: mcFloat 4.2s ease-in-out infinite;
          transition: transform .3s cubic-bezier(.22,1,.36,1);
        }
        .mc-char img {
          display: block;
          width: 132px;
          height: auto;
          pointer-events: none;
        }
        .mc-wrap:hover .mc-char { transform: scale(1.07); }

        /* ═══ Throw 상태 ═══ */
        .mc-throw .mc-char {
          animation: mcThrow 1.45s cubic-bezier(.4,.7,.3,1) both;
          z-index: 80;
          position: relative;
        }
        .mc-throw .mc-bubble { opacity: 0 !important; }

        /* ═══ 오버레이 + 폼 ═══ */
        .mc-overlay {
          position: fixed; inset: 0; z-index: 70;
          background: rgba(20,14,18,.34);
          display: flex; align-items: flex-start; justify-content: center;
          padding: clamp(36px,11vh,120px) 24px 24px;
          animation: ovFade .3s ease both;
        }
        .mc-form {
          width: min(520px, 94vw);
          max-height: 88vh;
          overflow: auto;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 30px 70px rgba(20,14,18,.32);
          padding: 34px 34px 0;
          position: relative;
          animation: formFly .62s cubic-bezier(.22,1,.36,1) both;
        }
        .mc-x {
          position: absolute; top: 16px; right: 16px;
          width: 34px; height: 34px; border-radius: 50%;
          background: #f1f2f4; border: none;
          color: #6b7482; font-size: 16px;
          cursor: pointer; display: grid; place-items: center;
        }
        .mc-x:hover { background: #e6e8ec; }
        .mc-lbl {
          font-size: 13px; font-weight: 700; color: #1c2431;
          margin-bottom: 6px; display: block;
        }
        .mc-lbl span { color: #E4002B; }
        .mc-in {
          width: 100%; padding: 11px 13px;
          border: 1px solid #d5d8dd; border-radius: 10px;
          font-size: 14px; font-family: inherit; color: #1c2431;
          box-sizing: border-box;
        }
        .mc-in:focus { outline: none; border-color: #E4002B; box-shadow: 0 0 0 3px rgba(228,0,43,.1); }
        .mc-submit {
          width: calc(100% + 68px);
          margin: 22px -34px 0;
          padding: 17px;
          background: #E4002B; color: #fff;
          font-weight: 800; font-size: 16px;
          border: none; border-radius: 0 0 18px 18px;
          cursor: pointer; font-family: inherit;
          transition: background .2s;
        }
        .mc-submit:hover { background: #c40025; }

        /* ═══ 반응형 ═══ */
        @media (max-width: 640px) {
          .mc-char img { width: 96px; }
          .mc-bubble { font-size: 12px; padding: 10px 14px; max-width: 160px; }
          .mc-wrap { right: 14px; bottom: 14px; }
          .mc-form { padding: 24px 20px 0; }
          .mc-submit { width: calc(100% + 40px); margin: 22px -20px 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mc-char { animation: none !important; }
          .mc-wrap { transform: none !important; }
        }
      `}</style>
    </>
  );
}

function McField({ label, value, error, onChange, placeholder, type = 'text' }: {
  label: string; value: string; error?: string;
  onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="mc-lbl">{label} <span>*</span></label>
      <input className="mc-in" type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      {error && <p style={{ fontSize: 12, color: '#E4002B', fontWeight: 600, marginTop: 4, marginBottom: 0 }}>{error}</p>}
    </div>
  );
}
