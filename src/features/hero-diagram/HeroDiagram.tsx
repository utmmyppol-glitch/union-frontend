'use client';

/**
 * HeroDiagram — 최종 마감본 파리티 (무광 세라믹 / 블루 앰비언트 / 밀도)
 *
 *  · fit(): 최대 배율 1.4 + 카피 쪽 좌측 이동(shiftX 100)
 *  · 둥근 육각형 + 무광 세라믹 재질(중앙 밝고 가장자리 어두운 방사형)
 *  · 그림자 = 블루 앰비언트(rgba(120,140,170,·)) — 검정 금지
 *  · Halo 최소, 반사/글로우 최소, 대비/가시성 유지
 *  · Hover: 노드 1.05 / 코어 1.015 / 나머지 opacity .8 살짝 디밍
 *  · 흰색 라벨(도형만 호흡, 텍스트는 scale 금지 → 선명)
 *
 * 색/좌표/서브항목/카드 문구는 전부 solutions.ts(HERO_NODES, PLATFORM_CORE)에서 가져옴.
 * → solutions.ts 를 이 파일과 함께 제공된 값으로 먼저 교체하세요(APPLY.md 참고).
 */

import { useEffect, useRef, useState, useCallback, type FormEvent } from 'react';
import { HERO_NODES, PLATFORM_CORE, type HeroNode } from '@/data/solutions';
import { apiClient } from '@/lib/api';

// ─── 스테이지 상수 ──────────────────────────────────────
const SW = 1120;
const SH = 920;
const CX = 580;
const CY = 430;
const CR = 168; // 코어 반경 (+5% 확대)

// ─── SVG 아이콘 ─────────────────────────────────────────
const IC: Record<string, string> = {
  shield:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 2.6V11c0 4.4-3 7.4-7 8.7C8 18.4 5 15.4 5 11V5.6L12 3z"/><path d="M9.2 11.6l1.9 1.9 3.7-3.9"/></svg>',
  layers:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8.5 4.7L12 12.4 3.5 7.7 12 3z"/><path d="M4 12.2l8 4.5 8-4.5"/><path d="M4 16.6l8 4.5 8-4.5"/></svg>',
  box:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 8.4L12 12 4 8.4M12 12v9M20 8.4V16l-8 4-8-4V8.4l8-4 8 4z"/></svg>',
  play:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M10.5 9.2l4.4 2.8-4.4 2.8V9.2z" fill="currentColor" stroke="none"/></svg>',
  ruler:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="6" r="1.6"/><path d="M12 7.6L6.5 20M12 7.6L17.5 20M8.6 16h6.8"/></svg>',
};

// 노드별 미세 변화(사람이 다듬은 균형): [scale, y-offset px]
const JIT: [number, number][] = [[1.02, -1], [0.985, 1.5], [1.01, -2], [0.99, 2], [1.005, -1]];

// ─── CSS (전체) ─────────────────────────────────────────
const DIAGRAM_CSS = `
@keyframes hd-coreBreathe{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
@keyframes hd-coreFloat{0%,100%{transform:translate(-50%,-50%)}50%{transform:translate(-50%,calc(-50% - 3px))}}
@keyframes hd-coreShine{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes hd-ringPulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.4}50%{transform:translate(-50%,-50%) scale(1.1);opacity:.7}}
@keyframes hd-faceBreathe{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes hd-dotBreathe{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(calc(-50% + var(--bx,0px)),calc(-50% + var(--by,0px))) scale(1.15)}}
@keyframes hd-halo{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.85}50%{transform:translate(-50%,-50%) scale(1.05);opacity:1}}
@keyframes hd-up{from{opacity:0}to{opacity:1}}

.hd-root{position:relative;width:100%;height:100%;min-height:520px;overflow:visible}
.hd-scaler{position:absolute;left:50%;top:50%;width:${SW}px;height:${SH}px;transform-origin:center center}
.hd-wires{position:absolute;inset:0;width:${SW}px;height:${SH}px;overflow:visible}

/* Halo — 최소 존재감 */
.hd-halo{position:absolute;width:410px;height:410px;left:${CX}px;top:${CY}px;transform:translate(-50%,-50%);border-radius:50%;
  background:radial-gradient(circle,rgba(163,160,192,.010) 0%,rgba(163,160,192,.004) 44%,rgba(163,160,192,0) 66%);
  z-index:1;animation:hd-halo 7s ease-in-out infinite}
.hd-halo::before{content:"";position:absolute;left:50%;top:50%;width:392px;height:392px;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(163,160,192,.014)}
.hd-halo::after{content:"";position:absolute;left:50%;top:50%;width:356px;height:356px;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(163,160,192,.018)}

/* 코어 — 무광 세라믹, 블루 앰비언트, 호버 시 1.015 반응 */
.hd-core{position:absolute;left:${CX}px;top:${CY}px;width:${CR * 2}px;height:${CR * 2}px;transform:translate(-50%,-50%);z-index:6;
  animation:hd-coreFloat 5.5s cubic-bezier(.22,1,.36,1) infinite;transition:scale .4s cubic-bezier(.22,1,.36,1)}
.hd-root.dim .hd-core{scale:1.015}
.hd-ball{position:absolute;inset:0;border-radius:50%;transform-origin:center;animation:hd-coreBreathe 5s cubic-bezier(.37,0,.63,1) infinite;
  background:radial-gradient(circle at 36% 29%,rgba(249,248,252,.99) 0%,rgba(224,221,236,.99) 38%,rgba(192,188,214,1) 74%,rgba(158,153,186,1) 100%);
  border:1px solid rgba(255,255,255,.6);
  box-shadow:0 30px 60px rgba(104,110,145,.20),0 8px 18px rgba(104,110,145,.13),inset -18px -22px 46px rgba(120,116,150,.18),inset 12px 14px 26px rgba(255,255,255,.5)}
.hd-ball::after{content:"";position:absolute;left:26%;top:17%;width:34%;height:24%;border-radius:50%;pointer-events:none;
  background:radial-gradient(closest-side,rgba(255,255,255,.2),rgba(255,255,255,0) 78%);filter:blur(4px)}
.hd-ring{position:absolute;left:50%;top:50%;width:116%;height:116%;transform:translate(-50%,-50%);border-radius:50%;pointer-events:none;z-index:1;
  border:1px solid rgba(140,148,180,.16);animation:hd-ringPulse 4.5s ease-in-out infinite}
.hd-glow{position:absolute;inset:6%;border-radius:50%;pointer-events:none;z-index:2;mix-blend-mode:screen;opacity:.5;
  background:conic-gradient(from 0deg,transparent 0deg,rgba(255,255,255,.16) 46deg,transparent 96deg,transparent 210deg,rgba(200,196,224,.1) 250deg,transparent 300deg);
  -webkit-mask:radial-gradient(circle,transparent 46%,#000 60%,#000 78%,transparent 92%);mask:radial-gradient(circle,transparent 46%,#000 60%,#000 78%,transparent 92%);
  animation:hd-coreShine 14s linear infinite}
.hd-clbl{position:absolute;left:50%;top:52%;transform:translate(-50%,-50%);text-align:center;z-index:3;pointer-events:none}
.hd-clbl b{font-family:'Inter',sans-serif;font-weight:700;font-size:31px;letter-spacing:-.01em;color:#332E4E;display:block}
.hd-cdot{width:8px;height:8px;border-radius:50%;background:#111214;margin:0 auto 9px;box-shadow:0 0 0 3px rgba(0,164,239,.14),0 1px 2px rgba(30,40,55,.18)}
.hd-clbl span{font-size:13px;font-weight:500;color:#736E8C;display:block;margin-top:4px;letter-spacing:.01em}

/* 코어 위성 */
.hd-cnode{position:absolute;transform:translate(-50%,-50%);z-index:7;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:'Pretendard Variable','Pretendard',sans-serif;font-size:13px;font-weight:600;color:#5E5980;
  background:radial-gradient(circle at 35% 28%,rgba(250,249,252,.97),rgba(229,227,236,.95) 54%,rgba(202,199,216,.93));
  border:1px solid rgba(255,255,255,.5);box-shadow:0 6px 13px rgba(120,116,150,.12),inset 4px 5px 10px rgba(255,255,255,.55),inset -5px -6px 11px rgba(120,116,150,.12);
  animation:hd-up .6s cubic-bezier(.22,1,.36,1) both}

.hd-node{position:absolute;width:0;height:0}

/* 둥근 육각형 — 블루 앰비언트 섀도우, 노드별 미세 변화 */
.hd-hex{position:absolute;left:0;top:0;transform:translate(-50%,calc(-50% + var(--jy,0px))) scale(var(--js,1));width:152px;height:168px;cursor:pointer;z-index:5;
  transition:transform .42s cubic-bezier(.22,1,.36,1),filter .42s cubic-bezier(.22,1,.36,1),opacity .35s ease;outline:none;
  filter:drop-shadow(0 10px 22px rgba(120,140,170,.15)) drop-shadow(0 2px 6px rgba(120,140,170,.10))}
.hd-hex::before{content:"";position:absolute;inset:-2.5px;clip-path:url(#hd-rhex);background:var(--rim);z-index:-1}

/* 무광 세라믹 면 — 중앙 밝고 가장자리 어두운 방사형 + 세라믹 이중 테두리 */
.hd-hface{position:absolute;inset:0;clip-path:url(#hd-rhex);
  background:radial-gradient(circle at 50% 36%,color-mix(in srgb,var(--c1) 74%,#fff) 0%,var(--c1) 40%,color-mix(in srgb,var(--c1) 55%,var(--c2)) 76%,var(--c2) 100%);
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.28),inset 0 0 0 2px rgba(255,255,255,.08);
  transform-origin:center;animation:hd-faceBreathe var(--bd,3.7s) cubic-bezier(.37,0,.63,1) var(--bdy,0s) infinite}
.hd-hface::before{content:"";position:absolute;inset:0;clip-path:inherit;pointer-events:none;background:
  linear-gradient(158deg,rgba(255,255,255,.18) 0%,rgba(255,255,255,.05) 30%,rgba(255,255,255,0) 52%),
  radial-gradient(80% 58% at 50% 118%,rgba(70,80,100,.12),transparent 62%)}
.hd-hface::after{content:"";position:absolute;inset:0;clip-path:inherit;pointer-events:none;
  box-shadow:inset 0 1px 2px rgba(255,255,255,.30),inset 0 -12px 22px rgba(70,80,100,.10)}
.hd-hbevel{position:absolute;inset:7px;clip-path:url(#hd-rhex);pointer-events:none;z-index:2;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.10),inset 0 2px 5px rgba(255,255,255,.10),inset 0 -8px 15px rgba(70,80,100,.09)}

/* 라벨 — 흰색, scale 금지(선명) */
.hd-hcont{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;pointer-events:none;z-index:3}
.hd-hcont .hd-ic{width:28px;height:28px;color:#fff;opacity:.96;filter:drop-shadow(0 1px 1px rgba(30,40,55,.18))}
.hd-cih{position:absolute;top:15px;left:50%;transform:translateX(-50%);width:7px;height:7px;border-radius:50%;z-index:4;opacity:.92;box-shadow:0 0 0 2px rgba(255,255,255,.45),0 1px 2px rgba(30,40,55,.25)}
.hd-hcont .hd-ic svg{width:100%;height:100%}
.hd-hcont .hd-nm{font-family:'Pretendard Variable','Pretendard',sans-serif;font-weight:700;font-size:16px;letter-spacing:-.01em;line-height:1.1;color:#fff;text-shadow:0 1px 2px rgba(30,40,55,.16)}
.hd-hcont .hd-br{font-family:'Pretendard Variable','Pretendard',sans-serif;font-weight:500;font-size:11px;letter-spacing:.02em;color:#fff;opacity:.88;text-shadow:0 1px 2px rgba(30,40,55,.14)}

/* 호버/포커스 — 노드 1.05, 나머지 opacity .8 (블러 없음) */
.hd-hex.on{transform:translate(-50%,calc(-50% + var(--jy,0px))) scale(1.05);z-index:40;
  filter:drop-shadow(0 30px 60px rgba(120,140,170,.16)) drop-shadow(0 8px 18px rgba(120,140,170,.12))}
.hd-hex.on .hd-hface{animation-play-state:paused}
.hd-hex.dim{opacity:.8}

/* 위성 dot + 라벨 */
.hd-sdot{position:absolute;width:18px;height:18px;border-radius:50%;transform:translate(-50%,-50%);
  background:radial-gradient(circle at 35% 30%,#fbfbfc,var(--sl) 42%,var(--sc) 100%);
  box-shadow:0 2px 5px rgba(60,60,75,.16),inset 2px 2px 4px rgba(255,255,255,.55),inset -2px -3px 5px rgba(50,50,65,.13);
  animation:hd-dotBreathe var(--dd,3.2s) cubic-bezier(.37,0,.63,1) var(--ddy,0s) infinite;transition:opacity .35s}
.hd-sdot.dim{opacity:.55}
.hd-slab{position:absolute;font-family:'Pretendard Variable','Pretendard',sans-serif;font-size:13px;font-weight:500;letter-spacing:.005em;color:#5F5F5F;white-space:nowrap;transition:opacity .35s}
.hd-slab.dim{opacity:.55}

/* 도입문의 카드 */
.hd-detail{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;
  background:rgba(38,36,46,.30);backdrop-filter:blur(4px);animation:hd-up .2s ease-out both}
.hd-dcard{position:relative;width:440px;max-width:92vw;max-height:85vh;overflow-y:auto;background:#fff;border:1px solid #E2E2E2;border-radius:8px;
  box-shadow:0 18px 48px rgba(40,40,50,.14),0 2px 6px rgba(40,40,50,.06);padding:28px;animation:hd-up .2s ease-out both}
.hd-dx{position:absolute;top:16px;right:16px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;border:1px solid #E2E2E2;background:#fff;
  font-size:13px;color:#8A8A8A;cursor:pointer;border-radius:6px;transition:.15s}
.hd-dx:hover{background:#F6F6F5;color:#5A5A5A}
.hd-dgo{display:block;width:100%;padding:14px;border-radius:6px;background:var(--ac);color:#fff;border:none;
  font-family:'Pretendard Variable','Pretendard',sans-serif;font-weight:700;font-size:15px;cursor:pointer;text-align:center;transition:filter .15s,transform .15s}
.hd-dgo:hover{filter:brightness(1.05);transform:translateY(-1px)}
.hd-dgo:disabled{opacity:.6;cursor:not-allowed;transform:none}
.hd-finput{width:100%;padding:12px 13px;border:1px solid #E2E2E2;border-radius:6px;background:#FCFCFB;
  font-family:'Pretendard Variable','Pretendard',sans-serif;font-size:14px;color:#2C2C2C;outline:none;transition:border-color .15s,background .15s}
.hd-finput:focus{border-color:var(--ac);background:#fff}
.hd-finput::placeholder{color:#A0A0A0}

@media(prefers-reduced-motion:reduce){
  .hd-ball,.hd-hface,.hd-sdot,.hd-halo,.hd-glow,.hd-ring,.hd-cnode,.hd-core{animation:none !important}
  .hd-core{transform:translate(-50%,-50%)}
  .hd-halo{transform:translate(-50%,-50%);opacity:.9}
  .hd-sdot{transform:translate(-50%,-50%)}
}
@media(max-width:920px){.hd-root{min-height:400px}}
`;

// ─── 도입문의 카드 ──────────────────────────────────────
function DetailCard({ node, onClose }: { node: HeroNode; onClose: () => void }) {
  const [view, setView] = useState<'info' | 'form' | 'done'>('info');
  const [submitting, setSubmitting] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentError, setConsentError] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    prevFocus.current = document.activeElement as HTMLElement;
    setView('info');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && cardRef.current) {
        const els = cardRef.current.querySelectorAll<HTMLElement>('button,input,a,[tabindex]:not([tabindex="-1"])');
        if (!els.length) return;
        const first = els[0], last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); prevFocus.current?.focus(); };
  }, [onClose]);

  useEffect(() => { cardRef.current?.querySelector<HTMLElement>('button,a')?.focus(); }, [view]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!consentPrivacy) {
      setConsentError('개인정보 수집에 동의해주세요.');
      return;
    }
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      await apiClient.submitInquiry({
        name: fd.get('fName') as string, company: fd.get('fCo') as string,
        email: fd.get('fEmail') as string, phone: fd.get('fTel') as string,
        product: node.cat, message: `[히어로 다이어그램] ${node.cat} 도입 문의`, consentPrivacy: true,
      });
    } catch { /* fallthrough */ }
    setSubmitting(false);
    setView('done');
  };

  return (
    <div className="hd-detail" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="hd-dcard" ref={cardRef} style={{ '--ac': node.colors.sc } as React.CSSProperties}>
        <button className="hd-dx" onClick={onClose} aria-label="닫기">✕</button>
        {view === 'info' && (
          <>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 18.5, fontWeight: 600, color: node.colors.sc, marginBottom: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: node.colors.sc }} />{node.cat}
            </span>
            <h3 style={{ fontFamily: "'Pretendard Variable',sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: '-.02em', color: '#2C2C2C', margin: '0 0 8px' }}>{node.co}</h3>
            <p style={{ fontSize: 18, lineHeight: 1.65, color: '#6E6E6E', marginBottom: 20 }}>{node.pitch}</p>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#9A9A9A', marginBottom: 11 }}>주요 강점</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[...node.sats.map(s => s[0]), ...node.more].map(f => (
                <li key={f} style={{ fontSize: 18.5, color: '#4A4A4A', lineHeight: 1.5, paddingLeft: 22, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 2, top: 6, width: 11, height: 6, borderLeft: `2px solid ${node.colors.sc}`, borderBottom: `2px solid ${node.colors.sc}`, transform: 'rotate(-45deg)' }} />{f}
                </li>
              ))}
            </ul>
            <button className="hd-dgo" onClick={() => setView('form')}>{node.cta}</button>
          </>
        )}
        {view === 'form' && (
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontWeight: 800, fontSize: 18, color: '#2C2C2C', marginBottom: 18 }}>도입 문의 신청</h3>
            {([['fName', '담당자명', 'text', '홍길동'], ['fCo', '회사명', 'text', '(주)회사명'], ['fEmail', '이메일', 'email', 'name@company.com'], ['fTel', '연락처', 'tel', '010-0000-0000']] as const).map(([id, label, type, ph]) => (
              <div key={id} style={{ marginBottom: 14 }}>
                <label htmlFor={id} style={{ display: 'block', fontSize: 18, fontWeight: 600, color: '#7A7A7A', marginBottom: 5 }}>{label}</label>
                <input id={id} name={id} type={type} placeholder={ph} required className="hd-finput" />
              </div>
            ))}
            {/* 개인정보 수집 안내 */}
            <div style={{
              border: '1px solid #E2E2E2', padding: '12px 14px', marginBottom: 14,
              background: '#FCFCFB', maxHeight: 110, overflowY: 'auto',
              fontSize: 12, lineHeight: 1.7, color: '#6E6E6E', borderRadius: 6,
            }}>
              <p style={{ fontWeight: 700, fontSize: 12, color: '#2C2C2C', margin: '0 0 6px' }}>개인정보 수집 및 이용에 대한 안내</p>
              <p style={{ margin: '0 0 4px' }}><strong style={{ color: '#2C2C2C' }}>수집항목</strong> : 이름, 회사명, 연락처, 이메일</p>
              <p style={{ margin: '0 0 4px' }}><strong style={{ color: '#2C2C2C' }}>수집·이용 목적</strong> : 문의 사항에 대한 답변 전달, 상담, 이벤트 안내 등</p>
              <p style={{ margin: 0 }}><strong style={{ color: '#2C2C2C' }}>보유 및 이용기간</strong> : 목적 달성 시 파기. 계약/청약철회 기록 5년, 대금결제/재화공급 기록 5년, 소비자 불만/분쟁처리 기록 3년 보존</p>
            </div>
            <label style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              fontSize: 13, color: '#6E6E6E', cursor: 'pointer', marginBottom: 14,
            }}>
              <input
                type="checkbox" checked={consentPrivacy}
                onChange={(e) => { setConsentPrivacy(e.target.checked); setConsentError(''); }}
                style={{ width: 16, height: 16, accentColor: node.colors.sc, cursor: 'pointer', marginTop: 1, flexShrink: 0 }}
              />
              <span>개인정보 수집 및 이용동의 내용을 확인했으며, 이에 동의합니다. (필수)</span>
            </label>
            {consentError && <div style={{ fontSize: 13, color: '#c0392f', marginBottom: 10 }}>{consentError}</div>}
            <button type="submit" className="hd-dgo" disabled={submitting}>{submitting ? '접수 중...' : '문의 접수하기'}</button>
          </form>
        )}
        {view === 'done' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: `color-mix(in srgb, ${node.colors.sc} 12%, #fff)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" fill="none" stroke={node.colors.sc} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
            </div>
            <h3 style={{ fontWeight: 800, fontSize: 18, color: '#2C2C2C', marginBottom: 8 }}>신청이 접수되었습니다</h3>
            <p style={{ fontSize: 18.5, color: '#6E6E6E', marginBottom: 24, lineHeight: 1.6 }}>담당 컨설턴트가 1영업일 이내에 연락드리겠습니다.</p>
            <button className="hd-dgo" onClick={onClose}>닫기</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 메인 다이어그램 ────────────────────────────────────
export default function HeroDiagram() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scalerRef = useRef<HTMLDivElement>(null);
  const wiresRef = useRef<SVGSVGElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [detailNode, setDetailNode] = useState<HeroNode | null>(null);

  // ── fit: 최대 1.4배 + 카피 쪽 좌측 이동 ──
  const fit = useCallback(() => {
    const root = rootRef.current;
    const scaler = scalerRef.current;
    if (!root || !scaler) return;
    // 1) 측정용으로 scale 1 리셋
    scaler.style.transition = 'none';
    scaler.style.transform = 'translate(-50%,-50%) scale(1)';
    const sr = scaler.getBoundingClientRect();
    // 2) 실제 렌더된 요소들의 바운딩박스 계산 (스테이지 좌표계)
    let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    scaler.querySelectorAll('.hd-hex,.hd-core,.hd-slab,.hd-sdot,.hd-cnode').forEach((el) => {
      const r = (el as HTMLElement).getBoundingClientRect();
      if (!r.width) return;
      minX = Math.min(minX, r.left - sr.left); maxX = Math.max(maxX, r.right - sr.left);
      minY = Math.min(minY, r.top - sr.top); maxY = Math.max(maxY, r.bottom - sr.top);
    });
    if (!isFinite(minX)) { scaler.style.transition = ''; return; }
    const rw = root.clientWidth || 560;
    const rh = root.clientHeight || 520;
    const padX = 0;
    const padY = 50;
    const cw = maxX - minX, ch = maxY - minY;
    const sc = Math.min((rw - padX) / cw, (rh - padY) / ch, 1.25);
    const ccx = (minX + maxX) / 2, ccy = (minY + maxY) / 2;
    // 3) 바운딩박스 중심 정렬 + 위로
    const shiftX = Math.min(48, rw * 0.04);
    const px = -(ccx - SW / 2) * sc - shiftX;
    const py = -(ccy - 450) * sc;
    const scX = sc * 1.05;
    scaler.style.transform = `translate(calc(-50% + ${px.toFixed(1)}px),calc(-50% + ${py.toFixed(1)}px)) scale(${scX.toFixed(4)}, ${sc.toFixed(4)})`;
    requestAnimationFrame(() => { scaler.style.transition = ''; });
  }, []);

  useEffect(() => {
    fit();
    const t1 = setTimeout(fit, 80);
    const t2 = setTimeout(fit, 420);
    window.addEventListener('resize', fit);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener('resize', fit); };
  }, [fit]);

  // ── 연결선 위 이동 광점(미세 pulse) ──
  useEffect(() => {
    const svg = wiresRef.current;
    if (!svg || window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const NS = 'http://www.w3.org/2000/svg';
    const tubes = svg.querySelectorAll<SVGLineElement>('.hd-tube');
    const flows = Array.from(tubes).map((line, i) => {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('r', '2.4'); c.setAttribute('fill', '#fff'); c.setAttribute('opacity', '0');
      svg.appendChild(c);
      return { c, line, ph: i * 1.15 };
    });
    let raf = 0;
    const CYC = 6, TR = 2.5;
    const loop = (now: number) => {
      const t = now / 1000;
      flows.forEach(f => {
        const lp = (t + f.ph) % CYC;
        if (lp < TR) {
          const k = lp / TR;
          const x1 = +f.line.getAttribute('x1')!, y1 = +f.line.getAttribute('y1')!;
          const x2 = +f.line.getAttribute('x2')!, y2 = +f.line.getAttribute('y2')!;
          f.c.setAttribute('cx', String(x1 + (x2 - x1) * k));
          f.c.setAttribute('cy', String(y1 + (y2 - y1) * k));
          f.c.setAttribute('opacity', (Math.sin(k * Math.PI) * 0.4).toFixed(2));
        } else { f.c.setAttribute('opacity', '0'); }
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); flows.forEach(f => f.c.remove()); };
  }, []);

  const enter = useCallback((id: string) => {
    setHoveredId(id);
    rootRef.current?.classList.add('dim');
  }, []);
  const leave = useCallback(() => {
    setHoveredId(null);
    rootRef.current?.classList.remove('dim');
  }, []);
  const onNodeKey = useCallback((e: React.KeyboardEvent, n: HeroNode) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setDetailNode(n); }
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: DIAGRAM_CSS }} />

      {/* 둥근 육각형 clip-path (전역 1회) */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <clipPath id="hd-rhex" clipPathUnits="objectBoundingBox">
            <path d="M0.44 0.03 Q0.5 0 0.56 0.03 L0.94 0.22 Q1 0.25 1 0.31 L1 0.69 Q1 0.75 0.94 0.78 L0.56 0.97 Q0.5 1 0.44 0.97 L0.06 0.78 Q0 0.75 0 0.69 L0 0.31 Q0 0.25 0.06 0.22 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="hd-root" ref={rootRef}>
        <div className="hd-scaler" ref={scalerRef}>
          <svg className="hd-wires" ref={wiresRef} viewBox={`0 0 ${SW} ${SH}`}>
            {HERO_NODES.map((n, i) => {
              const dx = n.x - CX, dy = n.y - CY, L = Math.hypot(dx, dy);
              const ux = dx / L, uy = dy / L;
              const x1 = CX + ux * (CR - 8), y1 = CY + uy * (CR - 8);
              const x2 = n.x - ux * 33, y2 = n.y - uy * 33; // 노드 쪽으로 더 뻗음(선 길게)
              const isOn = hoveredId === n.id;
              const isDim = hoveredId !== null && !isOn;
              return (
                <g key={n.id}>
                  <defs>
                    <linearGradient id={`hd-tg${i}`} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
                      <stop offset="0" stopColor="#E4E2EE" stopOpacity=".82" />
                      <stop offset=".5" stopColor="#DDE0EA" stopOpacity=".6" />
                      <stop offset="1" stopColor={n.colors.tc} stopOpacity=".62" />
                    </linearGradient>
                  </defs>
                  <line className="hd-tube" x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={`url(#hd-tg${i})`} strokeWidth={isOn ? 15 : 12} strokeLinecap="round"
                    opacity={isDim ? 0.55 : isOn ? 1 : 0.9} style={{ transition: 'opacity .35s,stroke-width .35s' }} />
                  <line x1={x1} y1={y1 - 2.5} x2={x2} y2={y2 - 2.5}
                    stroke="rgba(255,255,255,.4)" strokeWidth={3} strokeLinecap="round"
                    opacity={isDim ? 0.15 : 1} style={{ transition: 'opacity .35s' }} />
                  {n.sats.map(([label, ddx, ddy]) => {
                    const sL = Math.hypot(ddx, ddy), sx = ddx / sL, sy = ddy / sL;
                    return (
                      <line key={label} x1={n.x + sx * 54} y1={n.y + sy * 54} x2={n.x + ddx - sx * 8} y2={n.y + ddy - sy * 8}
                        stroke={n.colors.sc} strokeWidth={1.4} strokeLinecap="round"
                        opacity={isDim ? 0.2 : isOn ? 0.7 : 0.38} style={{ transition: 'opacity .35s' }} />
                    );
                  })}
                </g>
              );
            })}
          </svg>

          <div className="hd-halo" />

          <div className="hd-core">
            <div className="hd-ring" />
            <div className="hd-ball" />
            <div className="hd-glow" />
            <div className="hd-clbl">
              <b>{PLATFORM_CORE.label}</b>
              <span>{PLATFORM_CORE.sublabel}</span>
            </div>
          </div>

          {PLATFORM_CORE.satellites.map(sat => (
            <div key={sat.label} className="hd-cnode"
              style={{ left: CX + sat.dx, top: CY + sat.dy, width: sat.size, height: sat.size, animationDelay: '.12s' }}>
              {sat.label}
            </div>
          ))}

          {HERO_NODES.map((n, idx) => {
            const isOn = hoveredId === n.id;
            const isDim = hoveredId !== null && !isOn;
            const [js, jy] = JIT[idx % JIT.length];
            return (
              <div key={n.id} className="hd-node" style={{ left: n.x, top: n.y }}>
                <div
                  className={`hd-hex ${isOn ? 'on' : ''} ${isDim ? 'dim' : ''}`}
                  style={{
                    '--c1': n.colors.c1, '--c2': n.colors.c2, '--rim': n.colors.rim,
                    '--js': js, '--jy': `${jy}px`,
                    '--bd': `${3.6 + idx * 0.08}s`, '--bdy': `${0.15 + idx * 0.6}s`,
                  } as React.CSSProperties}
                  tabIndex={0}
                  role="button"
                  aria-label={`${n.cat} — ${n.co}`}
                  onMouseEnter={() => enter(n.id)}
                  onMouseLeave={leave}
                  onClick={() => setDetailNode(n)}
                  onKeyDown={e => onNodeKey(e, n)}
                  onFocus={() => enter(n.id)}
                  onBlur={leave}
                >
                  <div className="hd-hface"><div className="hd-hbevel" /></div>
                  <div className="hd-hcont">
                    <div className="hd-ic" dangerouslySetInnerHTML={{ __html: IC[n.ic] || '' }} />
                    <div className="hd-nm">{n.cat}</div>
                    <div className="hd-br">{n.co}</div>
                  </div>
                </div>

                {n.sats.map(([label, ddx, ddy], j) => {
                  const sL = Math.hypot(ddx, ddy) || 1;
                  const bx = (ddx / sL) * 5, by = (ddy / sL) * 5;
                  const side = ddx >= 0 ? 1 : -1;
                  return (
                    <div key={label}>
                      <div className={`hd-sdot ${isDim ? 'dim' : ''}`} style={{
                        left: ddx, top: ddy,
                        '--sc': n.colors.sc, '--sl': n.colors.sl,
                        '--bx': `${bx.toFixed(1)}px`, '--by': `${by.toFixed(1)}px`,
                        '--dd': `${3.1 + ((idx + j) % 3) * 0.15}s`, '--ddy': `${0.15 + idx * 0.6 + 0.15 + j * 0.08}s`,
                      } as React.CSSProperties} />
                      <div className={`hd-slab ${isDim ? 'dim' : ''}`} style={{
                        left: ddx + side * 16, top: ddy,
                        transform: side > 0 ? 'translate(0,-50%)' : 'translate(-100%,-50%)',
                      }}>{label}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {detailNode && <DetailCard node={detailNode} onClose={() => setDetailNode(null)} />}
    </>
  );
}
