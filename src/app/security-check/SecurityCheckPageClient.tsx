'use client';

import { useState } from 'react';
import Link from 'next/link';
import { E, useEditableContent, stripHtml, EDITABLE_STYLES } from '@/lib/editable';
import { apiClient } from '@/lib/api';

const QUESTIONS = [
  { q: '기업용 백신(안티바이러스)을 전 PC에 설치하고 있나요?', cat: '엔드포인트 보안', solutions: ['AhnLab V3', 'ESTsecurity 알약'] },
  { q: '백신/보안 솔루션을 최신 버전으로 유지하고 있나요?', cat: '보안 관리', solutions: ['AhnLab EPP'] },
  { q: '임직원 PC에 USB 등 외부저장장치 사용을 통제하고 있나요?', cat: '매체 제어', solutions: ['OfficeKeeper'] },
  { q: '문서/파일 외부 유출 방지(DLP) 솔루션을 사용하고 있나요?', cat: '정보유출 방지', solutions: ['OfficeKeeper DLP'] },
  { q: '원격근무 시 VPN을 사용하고 있나요?', cat: '네트워크 보안', solutions: ['통합 보안 컨설팅'] },
  { q: '임직원 대상 보안 교육을 연 1회 이상 실시하고 있나요?', cat: '보안 인식', solutions: ['보안 교육 컨설팅'] },
  { q: 'PC/소프트웨어 자산을 체계적으로 관리하고 있나요?', cat: '자산관리', solutions: ['NetClient DMS'] },
  { q: '랜섬웨어 대응 백업 체계가 있나요?', cat: '랜섬웨어 대응', solutions: ['AhnLab MDS', 'ESTsecurity 알약 EDR'] },
  { q: '이메일 보안(스팸/피싱 차단) 솔루션을 사용하고 있나요?', cat: '이메일 보안', solutions: ['Microsoft 365 보안'] },
  { q: '퇴사자 계정/권한 관리 절차가 있나요?', cat: '계정 관리', solutions: ['NetClient HSM'] },
];

type Answer = 10 | 5 | 0 | null;

/* ── 기본값 ── */
const DEFAULT_HERO = {
  title: '우리 회사 IT 보안,\n몇 점일까요?',
  subtitle: '10개 질문에 답하면 보안 점수와 취약 영역을 알려드립니다.',
};

const DEFAULT_RESULT = {
  title: '보안 점검 결과',
};

const DEFAULTS = {
  securitycheck_hero: DEFAULT_HERO,
  securitycheck_result: DEFAULT_RESULT,
} as const;

export default function SecurityCheckPageClient({ ssrContent }: { ssrContent: Record<string, string> }) {
  const [content, editMode] = useEditableContent(DEFAULTS, ssrContent);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(Array(10).fill(null));
  const [done, setDone] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailSubmitting, setEmailSubmitting] = useState(false);

  const answer = (val: Answer) => {
    const next = [...answers];
    next[current] = val;
    setAnswers(next);
    if (current < 9) {
      setTimeout(() => setCurrent(c => Math.min(c + 1, QUESTIONS.length - 1)), 300);
    } else {
      setTimeout(() => setDone(true), 400);
    }
  };

  const score = answers.reduce((s: number, a) => s + (a ?? 0), 0);
  const getGrade = () => {
    if (score >= 81) return { label: '우수', color: '#059669', emoji: '\uD83D\uDFE2', desc: '보안 체계가 잘 갖춰져 있습니다. 지속적인 관리로 유지하세요.' };
    if (score >= 61) return { label: '양호', color: 'var(--ink2)', emoji: '\uD83D\uDD35', desc: '기본적인 보안은 갖추고 있지만, 일부 취약 영역이 있습니다.' };
    if (score >= 31) return { label: '주의', color: '#D97706', emoji: '\uD83D\uDFE0', desc: '보안 취약점이 다수 존재합니다. 빠른 보강이 필요합니다.' };
    return { label: '위험', color: '#F5333F', emoji: '\uD83D\uDD34', desc: '심각한 보안 위험에 노출되어 있습니다. 즉시 보안 체계 구축이 필요합니다.' };
  };

  const weakAreas = QUESTIONS.filter((_, i) => answers[i] === 0);
  const partialAreas = QUESTIONS.filter((_, i) => answers[i] === 5);
  const grade = getGrade();

  if (!done) {
    const progress = ((current + (answers[current] !== null ? 1 : 0)) / 10) * 100;
    const q = QUESTIONS[Math.min(current, QUESTIONS.length - 1)];
    return (<>
      {editMode && <style>{EDITABLE_STYLES}</style>}

      <section style={{ padding: '120px clamp(20px,4vw,52px) 48px', background: 'linear-gradient(135deg, #0B1220 0%, #1A2744 100%)', color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ marginBottom: 16 }}>
          <path d="M28 6L8 16v12c0 11.04 8.52 21.36 20 24 11.48-2.64 20-12.96 20-24V16L28 6z" stroke="#111214" strokeWidth="3" fill="#11121420"/>
          <path d="M20 28l6 6 10-10" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h1 style={{ fontFamily: "'Pretendard'", fontWeight: 900, fontSize: 'clamp(28px,4.5vw,48px)', lineHeight: 1.2, letterSpacing: '-.03em', marginBottom: 12 }}>
          <E id="securitycheck_hero.title" editMode={editMode}>
            {stripHtml(content.securitycheck_hero.title).split('\n').map((line: string, i: number) => (
              <span key={i}>{i > 0 && <br />}{line}</span>
            ))}
          </E>
        </h1>
        <p style={{ fontFamily: "'Pretendard'", fontWeight: 400, fontSize: 18, opacity: .7 }}>
          <E id="securitycheck_hero.subtitle" editMode={editMode}>{content.securitycheck_hero.subtitle}</E>
        </p>
      </section>

      <section style={{ padding: 'clamp(32px,4vw,48px) clamp(20px,4vw,52px) clamp(60px,8vw,100px)', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          {/* Progress */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, color: 'var(--ink2)' }}><E id="securitycheck_ui.progress" editMode={editMode}>질문 {current + 1} / 10</E></span>
              <span style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, color: 'var(--ink2)' }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: 'var(--line)' }}>
              <div style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #111214, #111214)', width: `${progress}%`, transition: 'width .4s ease' }} />
            </div>
          </div>

          {/* Question card */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 0, padding: 'clamp(28px,4vw,40px)', textAlign: 'center' }}>
            <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 0, background: '#11121410', color: 'var(--ink2)', fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, marginBottom: 20 }}>{q.cat}</span>
            <h2 style={{ fontFamily: "'Pretendard'", fontWeight: 800, fontSize: 'clamp(18px,3vw,24px)', lineHeight: 1.4, color: 'var(--ink)', marginBottom: 32, minHeight: 60 }}>{q.q}</h2>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {([['예', 10, '#059669'], ['부분적으로', 5, '#D97706'], ['아니요', 0, '#F5333F']] as [string, Answer, string][]).map(([label, val, color]) => (
                <button key={label} onClick={() => answer(val)}
                  style={{ padding: '14px 32px', borderRadius: 0, border: `2px solid ${answers[current] === val ? color : 'var(--line)'}`, background: answers[current] === val ? `${color}10` : 'transparent', color: answers[current] === val ? color : 'var(--ink)', fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, cursor: 'pointer', transition: 'all .2s', minWidth: 120 }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick nav dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
            {answers.map((a, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                style={{ width: 10, height: 10, borderRadius: '50%', border: 'none', cursor: 'pointer', background: i === current ? 'var(--ink2)' : a !== null ? (a >= 10 ? '#059669' : a >= 5 ? '#D97706' : '#F5333F') : 'var(--line)', transition: 'all .2s' }} />
            ))}
          </div>
        </div>
      </section>
    </>);
  }

  // Results
  return (<>
    {editMode && <style>{EDITABLE_STYLES}</style>}

    <section style={{ padding: '120px clamp(20px,4vw,52px) 48px', background: 'linear-gradient(135deg, #0B1220 0%, #1A2744 100%)', color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

      <h1 style={{ fontFamily: "'Pretendard'", fontWeight: 900, fontSize: 'clamp(28px,4.5vw,48px)', lineHeight: 1.2, letterSpacing: '-.03em' }}>
        <E id="securitycheck_result.title" editMode={editMode}>{content.securitycheck_result.title}</E>
      </h1>
    </section>

    <section style={{ padding: 'clamp(32px,4vw,48px) clamp(20px,4vw,52px) clamp(60px,8vw,100px)', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Score gauge */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 0, padding: 'clamp(32px,4vw,48px)', textAlign: 'center', marginBottom: 24 }}>
          <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 24px' }}>
            <svg viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="100" cy="100" r="85" fill="none" stroke="var(--line)" strokeWidth="12" />
              <circle cx="100" cy="100" r="85" fill="none" stroke={grade.color} strokeWidth="12" strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 2 * Math.PI * 85} ${2 * Math.PI * 85}`}
                style={{ transition: 'stroke-dasharray 1.5s ease' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 36, marginBottom: 4 }}>{grade.emoji}</span>
              <span style={{ fontFamily: "'Pretendard'", fontWeight: 900, fontSize: 48, color: grade.color, lineHeight: 1 }}>{score}</span>
              <span style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, color: 'var(--ink2)' }}><E id="securitycheck_ui.score_unit" editMode={editMode}>/ 100점</E></span>
            </div>
          </div>
          <div style={{ display: 'inline-block', padding: '6px 20px', borderRadius: 0, background: `${grade.color}15`, marginBottom: 12 }}>
            <span style={{ fontFamily: "'Pretendard'", fontWeight: 800, fontSize: 18, color: grade.color }}>{grade.label}</span>
          </div>
          <p style={{ fontFamily: "'Pretendard'", fontWeight: 400, fontSize: 18, color: 'var(--ink2)', lineHeight: 1.6 }}>{grade.desc}</p>
        </div>

        {/* Weak areas */}
        {weakAreas.length > 0 && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 0, padding: 'clamp(24px,4vw,36px)', marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Pretendard'", fontWeight: 800, fontSize: 18, color: '#F5333F', marginBottom: 20 }}><E id="securitycheck_ui.weak_title" editMode={editMode}>취약 영역 ({weakAreas.length}개)</E></h3>
            {weakAreas.map((item, i) => (
              <div key={i} style={{ padding: '16px 0', borderBottom: i < weakAreas.length - 1 ? '1px solid var(--line)' : 'none' }}>
                <div style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, color: 'var(--ink)', marginBottom: 8 }}>
                  <span style={{ color: '#F5333F', marginRight: 8 }}>&#x25CF;</span>{item.cat}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {item.solutions.map(sol => (
                    <span key={sol} style={{ padding: '4px 12px', borderRadius: 0, background: '#11121410', color: 'var(--ink2)', fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18 }}><E id={`securitycheck_ui.recommend_${i}`} editMode={editMode}>추천: {sol}</E></span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Partial areas */}
        {partialAreas.length > 0 && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 0, padding: 'clamp(24px,4vw,36px)', marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Pretendard'", fontWeight: 800, fontSize: 18, color: '#D97706', marginBottom: 20 }}><E id="securitycheck_ui.partial_title" editMode={editMode}>개선 필요 ({partialAreas.length}개)</E></h3>
            {partialAreas.map((item, i) => (
              <div key={i} style={{ padding: '16px 0', borderBottom: i < partialAreas.length - 1 ? '1px solid var(--line)' : 'none' }}>
                <div style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, color: 'var(--ink)' }}>
                  <span style={{ color: '#D97706', marginRight: 8 }}>&#x25CF;</span>{item.cat}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => setShowEmailModal(true)}
            style={{ flex: 1, padding: '14px 20px', borderRadius: 0, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, cursor: 'pointer', minWidth: 180 }}>
            &#x1F4C4; <E id="securitycheck_buttons.pdf" editMode={editMode}>결과 PDF로 받기</E>
          </button>
          <Link href="/contact"
            style={{ flex: 1, padding: '14px 20px', borderRadius: 0, background: 'var(--ink2)', color: '#fff', fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, textDecoration: 'none', textAlign: 'center', minWidth: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <E id="securitycheck_buttons.consult" editMode={editMode}>보안 취약점 무료 상담 받기</E>
          </Link>
          <button onClick={() => { setDone(false); setCurrent(0); setAnswers(Array(10).fill(null)); }}
            style={{ flex: 1, padding: '14px 20px', borderRadius: 0, border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink2)', fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, cursor: 'pointer', minWidth: 180 }}>
            <E id="securitycheck_buttons.retry" editMode={editMode}>다시 점검하기</E>
          </button>
        </div>
      </div>
    </section>

    {/* Email modal */}
    {showEmailModal && (
      <div role="button" tabIndex={0} aria-label="모달 닫기"
        style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        onClick={() => setShowEmailModal(false)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowEmailModal(false); }}>
        <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}
          style={{ background: 'var(--surface)', borderRadius: 0, padding: 32, maxWidth: 400, width: '100%' }}>
          {!emailSent ? (<>
            <h3 style={{ fontFamily: "'Pretendard'", fontWeight: 800, fontSize: 22, color: 'var(--ink)', marginBottom: 8 }}><E id="securitycheck_modal.title" editMode={editMode}>보안 점검 결과 PDF</E></h3>
            <p style={{ fontFamily: "'Pretendard'", fontWeight: 400, fontSize: 18, color: 'var(--ink2)', marginBottom: 24 }}><E id="securitycheck_modal.desc" editMode={editMode}>이메일로 상세 리포트를 보내드립니다.</E></p>
            <input type="email" placeholder="이메일 주소" value={email} onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 0, border: '1px solid var(--line)', background: 'var(--bg)', fontFamily: "'Pretendard'", fontSize: 18, color: 'var(--ink)', marginBottom: 16, boxSizing: 'border-box' }} />
            <button disabled={emailSubmitting} onClick={async () => {
              if (!email.includes('@')) return;
              setEmailSubmitting(true);
              try {
                const weakNames = weakAreas.map(w => w.cat).join(', ');
                const partialNames = partialAreas.map(p => p.cat).join(', ');
                await apiClient.submitInquiry({
                  name: '보안점검 결과',
                  company: '-',
                  phone: '-',
                  email,
                  product: '보안 점검',
                  message: `[보안 점검 결과] 점수: ${score}/100 (${grade.label}) / 취약: ${weakNames || '없음'} / 부분: ${partialNames || '없음'}`,
                  consentPrivacy: true,
                });
              } catch { /* 실패해도 결과는 보여줌 */ }
              setEmailSent(true);
              setEmailSubmitting(false);
            }}
              style={{ width: '100%', padding: '14px', borderRadius: 0, background: 'var(--ink2)', color: '#fff', fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, border: 'none', cursor: emailSubmitting ? 'wait' : 'pointer', opacity: emailSubmitting ? .6 : 1 }}>
              <E id="securitycheck_buttons.submit" editMode={editMode}>{emailSubmitting ? '전송 중...' : 'PDF 받기'}</E>
            </button>
          </>) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>&#x2705;</div>
              <p style={{ fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, color: 'var(--ink)', marginBottom: 8 }}><E id="securitycheck_modal.success" editMode={editMode}>전송 완료!</E></p>
              <p style={{ fontFamily: "'Pretendard'", fontWeight: 400, fontSize: 18, color: 'var(--ink2)' }}><E id="securitycheck_modal.sent_desc" editMode={editMode}>{email}로 결과 리포트를 보내드리겠습니다.</E></p>
              <button onClick={() => setShowEmailModal(false)}
                style={{ marginTop: 20, padding: '10px 24px', borderRadius: 0, background: 'var(--line)', color: 'var(--ink)', fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, border: 'none', cursor: 'pointer' }}><E id="securitycheck_buttons.close" editMode={editMode}>닫기</E></button>
            </div>
          )}
        </div>
      </div>
    )}
  </>);
}
