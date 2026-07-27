'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Solution, SOLUTIONS } from '@/data/molecular-data';


const IMG_NAT_W = 1269;
const IMG_NAT_H = 1239;
const ZOOM = 2.4;
const LENS_R = 78;

type Phase = 'idle' | 'sucking' | 'zoomed' | 'unsucking';

interface Props {
  onZoom: (sol: Solution) => void;
  onClose: () => void;
  onBrochure: () => void;
  zoomedSolution: Solution | null;
}

/* ═══ Micro Structure (zoomed) — 핸드오프 다이어그램 + 기존 콘텐츠 유지 ═══ */
function MicroStructure({ solution, onClose, onBrochure }: {
  solution: Solution;
  onClose: () => void;
  onBrochure: () => void;
}) {
  const [play, setPlay] = useState(false);
  const [hovIdx, setHovIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setDims({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPlay(true));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const feats = solution.feats;
  const N = feats.length;
  const isMobile = dims.w > 0 && dims.w < 480;

  const VB = 720;
  const CX = VB / 2;
  const CY = VB / 2;
  const ORBIT = 230;
  const NODE_R = VB * 0.116;
  const CORE_R = 86;

  const nodePositions = useMemo(() => {
    return feats.map((_, k) => {
      const angle = (-90 + k * (360 / N)) * (Math.PI / 180);
      return { x: CX + Math.cos(angle) * ORBIT, y: CY + Math.sin(angle) * ORBIT };
    });
  }, [N, feats]);

  const arcPaths = useMemo(() => {
    return nodePositions.map((pos, k) => {
      const next = nodePositions[(k + 1) % N];
      return `M ${pos.x.toFixed(1)} ${pos.y.toFixed(1)} A ${ORBIT} ${ORBIT} 0 0 1 ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
    });
  }, [nodePositions, N]);

  const accent = '#E4002B';

  if (isMobile) {
    return (
      <div
        ref={containerRef}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        style={{
          position: 'absolute', inset: 0, zIndex: 12,
          background: '#FBFAF7', cursor: 'default',
          overflowY: 'auto', padding: '24px 20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'flex-start', paddingTop: 60,
        }}
      >
        {/* Core card */}
        <div style={{
          width: '100%', maxWidth: 340, padding: '28px 24px',
          background: 'radial-gradient(circle at 50% 30%, rgba(245,51,63,.06) 0%, rgba(255,255,255,.95) 60%)',
          border: '1px solid rgba(255,255,255,.95)',
          boxShadow: '0 32px 80px rgba(60,70,90,.13), inset 0 1px 0 rgba(255,255,255,.9)',
          textAlign: 'center', marginBottom: 28, borderRadius: 16,
          opacity: play ? 1 : 0, transform: play ? 'scale(1)' : 'scale(.6)',
          transition: 'all .6s cubic-bezier(.34,1.4,.5,1)',
        }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1c22' }}>{solution.area}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: accent, marginTop: 4 }}>{solution.vendor}</div>
          <div style={{ fontSize: 11, color: '#7a8090', marginTop: 6 }}>
            기능 {feats.length} · 도입효과 {solution.gain.length}
          </div>
        </div>

        {feats.map((f, k) => (
          <div key={k} style={{
            width: '100%', maxWidth: 340, padding: '14px 18px',
            background: '#fff', border: '1px solid #E7E2D8', marginBottom: 10,
            opacity: play ? 1 : 0, transform: play ? 'translateY(0)' : 'translateY(20px)',
            transition: `all .45s ease ${0.3 + k * 0.08}s`,
          }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#1a1c22' }}>{f.n}</div>
            <div style={{ fontSize: 13, color: '#6B655C', marginTop: 4 }}>{f.e}</div>
          </div>
        ))}

        <div
          onClick={onBrochure}
          style={{
            marginTop: 16, padding: '10px 22px',
            background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(200,200,210,.4)',
            fontSize: 13, color: '#4a4e5a', cursor: 'pointer',
            opacity: play ? 1 : 0, transition: 'opacity .5s ease .9s',
          }}
        >
          도입 사례 · ROI 수치 · 전체 기능 명세 → 소개서에서 열기
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'absolute', inset: 0, zIndex: 12,
        cursor: 'default', overflow: 'visible',
        background: '#FBFAF7',
        display: 'grid', placeItems: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: 800, padding: '0 16px' }}>
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 12, fontWeight: 800, letterSpacing: '.16em',
            color: accent, textTransform: 'uppercase' as const,
          }}>
            <span style={{ width: 22, height: 2, background: accent, display: 'inline-block' }} />
            {solution.vendor}
          </div>
          <h2 style={{
            fontSize: 'clamp(24px, 3.6vw, 32px)', fontWeight: 900,
            color: '#171d29', letterSpacing: '-0.03em',
            marginTop: 12, lineHeight: 1.2,
          }}>
            {solution.area} 구성도
          </h2>
          <p style={{
            fontSize: 15, color: '#6b7482', marginTop: 10,
            lineHeight: 1.6, letterSpacing: '-0.01em',
            maxWidth: 460, margin: '10px auto 0',
          }}>{solution.desc}</p>
        </div>

        {/* 다이어그램 스테이지 */}
        <div className={play ? 'dg-play' : ''} style={{ position: 'relative', width: 'min(700px, 88vw)', aspectRatio: '1/1', margin: '0 auto' }}>

          <svg viewBox={`0 0 ${VB} ${VB}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }} aria-hidden="true">
            <defs>
              <radialGradient id="dgHexFill" cx="42%" cy="34%" r="72%">
                <stop offset="0%" stopColor="#fff4f5" />
                <stop offset="55%" stopColor="#fbdadd" />
                <stop offset="100%" stopColor="#f6c6cb" />
              </radialGradient>
              <filter id="dgSoft" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#1e2c42" floodOpacity="0.12" />
              </filter>
              <linearGradient id="dgArcGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f7b8bf" />
                <stop offset="100%" stopColor={accent} />
              </linearGradient>
            </defs>

            {arcPaths.map((d, k) => (
              <path key={`arc-${k}`} className="dg-arc" style={{ animationDelay: `${0.18 + k * 0.09}s` }}
                d={d} fill="none" stroke="url(#dgArcGrad)" strokeWidth="5" strokeLinecap="round" pathLength={1} />
            ))}

            <g stroke="#b9c3ce" strokeWidth="2.4" strokeDasharray="2 7" strokeLinecap="round">
              {nodePositions.map((pos, k) => {
                const dx = pos.x - CX; const dy = pos.y - CY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const sx = CX + (dx / dist) * CORE_R; const sy = CY + (dy / dist) * CORE_R;
                const ex = pos.x - (dx / dist) * NODE_R; const ey = pos.y - (dy / dist) * NODE_R;
                return <line key={`ln-${k}`} className="dg-line" style={{ animationDelay: `${0.6 + k * 0.06}s` }}
                  x1={sx} y1={sy} x2={ex} y2={ey} pathLength={1} />;
              })}
            </g>
            <g fill="#8a9bb0">
              {nodePositions.map((pos, k) => {
                const dx = pos.x - CX; const dy = pos.y - CY; const dist = Math.sqrt(dx * dx + dy * dy);
                return <circle key={`dot-${k}`} className="dg-dot" style={{ animationDelay: `${0.6 + k * 0.06}s` }}
                  cx={pos.x - (dx / dist) * NODE_R} cy={pos.y - (dy / dist) * NODE_R} r="5.5" />;
              })}
            </g>

            <g className="dg-hex-g">
              <circle cx={CX} cy={CY} r={CORE_R} fill="url(#dgHexFill)" stroke="#f0bcc1" strokeWidth="2.4" filter="url(#dgSoft)" />
            </g>
          </svg>

          {/* 중앙 레이블 */}
          <div className="dg-center" style={{
            position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
            textAlign: 'center', pointerEvents: 'none',
            width: 160,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              fontSize: 'clamp(20px, 3.5vw, 27px)', fontWeight: 900,
              color: '#1a2130', letterSpacing: '-0.02em', lineHeight: 1.15,
              wordBreak: 'keep-all',
            }}>{solution.area}</div>
            <div style={{
              fontSize: 'clamp(12px, 2vw, 15px)', fontWeight: 800,
              color: accent, marginTop: 5,
              letterSpacing: '-0.01em',
            }}>{solution.vendor}</div>
            <div style={{
              fontSize: 'clamp(10px, 1.4vw, 13px)', color: '#7a828d',
              marginTop: 5, letterSpacing: '-0.01em',
            }}>기능 {feats.length} · 도입효과 {solution.gain.length}</div>
          </div>

          {/* 기능 노드 */}
          {nodePositions.map((pos, k) => {
            const pctX = ((pos.x / VB) * 100).toFixed(1);
            const pctY = ((pos.y / VB) * 100).toFixed(1);
            const isHov = hovIdx === k;
            const isDimmed = hovIdx !== null && !isHov;
            return (
              <div key={k} className="dg-node"
                onMouseEnter={() => setHovIdx(k)} onMouseLeave={() => setHovIdx(null)}
                style={{
                  // @ts-expect-error CSS custom properties
                  '--fx': `${pctX}%`, '--fy': `${pctY}%`,
                  animationDelay: `${0.38 + k * 0.09}s`,
                  position: 'absolute', width: '23.3%', aspectRatio: '1',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 38% 30%, #ffffff, #eef1f5)',
                  boxShadow: isHov
                    ? '0 22px 48px rgba(30,44,66,.22), 0 0 0 6px rgba(228,0,43,.08)'
                    : '0 16px 34px rgba(30,44,66,.16), inset 0 0 0 1px rgba(255,255,255,.9)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  textAlign: 'center',
                  padding: '12px 10px', cursor: 'pointer',
                  opacity: isDimmed ? 0.4 : 1,
                  transition: 'box-shadow .25s, opacity .25s',
                  zIndex: isHov ? 5 : 3,
                }}
              >
                {/* 기능명 */}
                <div style={{
                  fontSize: 'clamp(13px, 1.8vw, 17px)',
                  fontWeight: 900,
                  color: '#1c2431',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                }}>{feats[k].n}</div>
                {/* 설명 */}
                <div style={{
                  fontSize: 'clamp(9px, 1.2vw, 12px)',
                  color: '#6b7482',
                  marginTop: 4,
                  lineHeight: 1.4,
                  whiteSpace: 'nowrap',
                }}>{feats[k].e}</div>
                {/* hover 안내 문구 */}
                <div style={{
                  fontSize: 'clamp(8px, 1vw, 11px)',
                  fontWeight: 700,
                  color: accent,
                  marginTop: 6,
                  lineHeight: 1.2,
                  maxHeight: isHov ? 30 : 0,
                  opacity: isHov ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-height .25s ease, opacity .2s ease',
                }}>자세한 내용은 소개서에서 →</div>
              </div>
            );
          })}
        </div>

        {/* 하단 안내 + 소개서 요청 */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ fontSize: 13, color: '#9aa2ad', margin: '0 0 12px' }}>
            자세한 구성 · 도입 사례 · ROI 수치는 소개서에서 확인하세요
          </p>
          <div
            onClick={onBrochure}
            style={{
              display: 'inline-block', padding: '10px 28px',
              background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(200,200,210,.4)',
              fontSize: 13, fontWeight: 700, color: '#4a4e5a', cursor: 'pointer',
              opacity: play ? 1 : 0, transition: 'opacity .5s ease .9s',
            }}
          >
            도입 사례 · 전체 기능 명세 → 소개서 요청하기
          </div>
        </div>
      </div>

      <style jsx>{`
        .dg-node { opacity: 0; }
        .dg-arc, .dg-line { stroke-dasharray: 1; stroke-dashoffset: 1; }
        .dg-dot { opacity: 0; }
        .dg-hex-g { opacity: 0; transform-box: fill-box; transform-origin: center; }
        .dg-center { opacity: 0; }

        .dg-play .dg-node { animation: dgSpread .62s cubic-bezier(.22,1,.36,1) both; }
        .dg-play .dg-hex-g { animation: dgHex .55s cubic-bezier(.34,1.4,.5,1) .05s both; }
        .dg-play .dg-arc { animation: dgDraw .5s cubic-bezier(.4,0,.2,1) both; }
        .dg-play .dg-line { animation: dgDraw .4s ease both; }
        .dg-play .dg-dot { animation: dgFade .3s ease both; }
        .dg-play .dg-center { animation: dgFade .4s ease .3s both; }

        .dg-node { transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s; }
        .dg-play .dg-node:hover { transform: translate(-50%,-50%) scale(1.05) !important; z-index: 5; }

        @keyframes dgSpread {
          0% { left: 50%; top: 50%; transform: translate(-50%,-50%) scale(.22); opacity: 0; }
          55% { opacity: 1; }
          100% { left: var(--fx); top: var(--fy); transform: translate(-50%,-50%) scale(1); opacity: 1; }
        }
        @keyframes dgDraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes dgHex { 0% { transform: scale(.4); opacity: 0; } 60% { opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes dgFade { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

/* ═══ Portal Burst Effect ═══ */
function PortalBurst({ x, y }: { x: number; y: number }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: x, top: y, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,.98) 0%, rgba(245,51,63,.6) 40%, transparent 72%)', animation: 'pCore .9s cubic-bezier(.4,0,.2,1) forwards' }} />
      <div style={{ position: 'absolute', left: x, top: y, width: 120, height: 120, borderRadius: '50%', border: '2px solid rgba(245,51,63,.7)', animation: 'pRing .85s cubic-bezier(.2,.7,.3,1) forwards' }} />
      {Array.from({ length: 8 }).map((_, a) => (
        <div key={a} style={{
          position: 'absolute', left: x, top: y,
          width: 5, height: 90, borderRadius: 3,
          background: 'linear-gradient(to bottom, rgba(245,51,63,.8), transparent)',
          // @ts-expect-error CSS custom property
          '--r': `${a * 45}deg`,
          animation: 'pRay .8s ease-out forwards',
        }} />
      ))}
    </div>
  );
}

/* ═══ Image-fit 계산: object-fit:contain 일 때 실제 이미지 렌더 영역 ═══ */
function getContainedRect(containerW: number, containerH: number) {
  const imgRatio = IMG_NAT_W / IMG_NAT_H;
  const containerRatio = containerW / containerH;
  let w: number, h: number, offsetX: number, offsetY: number;
  if (containerRatio > imgRatio) {
    h = containerH;
    w = h * imgRatio;
    offsetX = (containerW - w) / 2;
    offsetY = 0;
  } else {
    w = containerW;
    h = w / imgRatio;
    offsetX = 0;
    offsetY = (containerH - h) / 2;
  }
  return { w, h, offsetX, offsetY };
}

/* ═══ Main Component ═══ */
export default function MolecularU({ onZoom, onClose, onBrochure, zoomedSolution }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [suckOrigin, setSuckOrigin] = useState('50% 50%');
  const [burst, setBurst] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // 이미지의 실제 렌더 영역
  const imgRect = useMemo(() => {
    if (containerSize.w === 0) return { w: 0, h: 0, offsetX: 0, offsetY: 0 };
    return getContainedRect(containerSize.w, containerSize.h);
  }, [containerSize]);

  // ResizeObserver on container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setContainerSize({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 부모가 zoomedSolution을 null로 바꾸면 → unsucking → idle 복귀
  useEffect(() => {
    if (!zoomedSolution && phase !== 'idle') {
      setPhase('unsucking');
      const t = setTimeout(() => setPhase('idle'), 800);
      return () => clearTimeout(t);
    }
  }, [zoomedSolution, phase]);

  // Mouse 3D tilt
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleMove = (e: PointerEvent) => {
      if (phase !== 'idle') return;
      const rc = el.getBoundingClientRect();
      const nx = (e.clientX - rc.left) / rc.width - 0.5;
      const ny = (e.clientY - rc.top) / rc.height - 0.5;
      setTilt({ x: nx * 6, y: -ny * 5 });
    };
    const handleLeave = () => { if (phase === 'idle') setTilt({ x: 0, y: 0 }); };
    el.addEventListener('pointermove', handleMove, { passive: true });
    el.addEventListener('pointerleave', handleLeave);
    return () => { el.removeEventListener('pointermove', handleMove); el.removeEventListener('pointerleave', handleLeave); };
  }, [phase]);

  // ESC key
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape' && phase === 'zoomed') doClose(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const doClose = useCallback(() => {
    if (phase !== 'zoomed') return;
    setPhase('unsucking');
    onClose();
    setTimeout(() => setPhase('idle'), 800);
  }, [phase, onClose]);

  const doClick = useCallback((sol: Solution) => {
    if (phase !== 'idle' || imgRect.w === 0) return;
    const px = imgRect.offsetX + sol.x / 100 * imgRect.w;
    const py = imgRect.offsetY + sol.y / 100 * imgRect.h;
    const origin = `${(px / containerSize.w * 100).toFixed(1)}% ${(py / containerSize.h * 100).toFixed(1)}%`;
    setSuckOrigin(origin);
    setBurst({ x: px, y: py });
    setTimeout(() => setBurst(null), 950);
    setHoveredIdx(null);
    setPhase('sucking');
    onZoom(sol);
    setTimeout(() => setPhase('zoomed'), 1100);
  }, [phase, imgRect, containerSize, onZoom]);

  // Stage animation style
  const stageStyle = (() => {
    if (phase === 'sucking') {
      return {
        transformOrigin: suckOrigin,
        animation: 'uSuck 1.1s cubic-bezier(.4,0,.2,1) forwards' as const,
        willChange: 'transform, opacity' as const,
        pointerEvents: 'none' as const,
      };
    }
    if (phase === 'unsucking') {
      return {
        transformOrigin: suckOrigin,
        animation: 'uUnsuck 1s cubic-bezier(.25,.46,.45,.94) forwards' as const,
        willChange: 'transform, opacity' as const,
        pointerEvents: 'none' as const,
      };
    }
    if (phase === 'zoomed') {
      return {
        transformOrigin: suckOrigin,
        visibility: 'hidden' as const,
        pointerEvents: 'none' as const,
      };
    }
    // idle
    return {
      transformOrigin: '50% 50%',
      transform: `rotateY(${tilt.x.toFixed(2)}deg) rotateX(${tilt.y.toFixed(2)}deg)`,
      transition: 'transform .3s ease-out',
      willChange: 'transform' as const,
      pointerEvents: 'auto' as const,
    };
  })();

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, perspective: 1500, overflow: 'visible' }}
    >
      {/* ═══ Stage: U image + hotspots + ripple ═══ */}
      <div
        ref={stageRef}
        style={{
          position: 'absolute', inset: 0,
          ...stageStyle,
        }}
      >
        {/* Ripple */}
        <div style={{ position: 'absolute', left: '50%', bottom: 12, width: '60%', height: 120, transform: 'translateX(-50%)', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: '50%', bottom: 30, width: '88%', height: 40, borderRadius: '50%', background: 'radial-gradient(ellipse at center, rgba(120,130,150,.14) 0%, rgba(120,130,150,.04) 45%, transparent 72%)', transform: 'translateX(-50%)', filter: 'blur(2px)' }} />
          {[
            { w: '100%', h: 90, b: 24, delay: '0s', color: 'rgba(150,162,180,.2)' },
            { w: '76%', h: 68, b: 32, delay: '1.5s', color: 'rgba(150,162,180,.28)' },
            { w: '52%', h: 46, b: 40, delay: '3s', color: 'rgba(150,162,180,.36)' },
            { w: '34%', h: 30, b: 48, delay: '4.5s', color: 'rgba(245,51,63,.24)' },
          ].map((r, i) => (
            <div key={i} style={{ position: 'absolute', left: '50%', bottom: r.b, width: r.w, height: r.h, borderRadius: '50%', border: `1px solid ${r.color}`, transform: 'translateX(-50%)', animation: `uRip 6s cubic-bezier(.33,0,.2,1) infinite ${r.delay}` }} />
          ))}
        </div>

        {/* Float container — U image + hotspots move together */}
        <div style={{
          position: 'absolute', inset: 0,
          animation: phase === 'idle' ? 'flU 6s ease-in-out infinite, uSway 11s ease-in-out infinite' : 'none',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/union-u-v2.png"
            alt="UNION 플랫폼"
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 26px 42px rgba(70,80,100,.10))', userSelect: 'none' }}
          />

          {/* 7 Hotspots — positioned relative to the actual image render area */}
          {imgRect.w > 0 && SOLUTIONS.map((sol, i) => {
            const bd = (sol.r || 42) * (imgRect.w / IMG_NAT_W);
            const px = imgRect.offsetX + sol.x / 100 * imgRect.w;
            const py = imgRect.offsetY + sol.y / 100 * imgRect.h;
            const isHovered = hoveredIdx === i;
            const side: 'r' | 'l' | 'b' = sol.x < 40 ? 'r' : sol.x > 60 ? 'l' : 'b';

            return (
              <button
                key={sol.id}
                aria-label={sol.area}
                onClick={() => doClick(sol)}
                onMouseEnter={() => phase === 'idle' && setHoveredIdx(i)}
                onMouseLeave={() => phase === 'idle' && setHoveredIdx(null)}
                style={{
                  position: 'absolute', left: px, top: py,
                  transform: 'translate(-50%, -50%)',
                  width: bd * 2 + 22, height: bd * 2 + 22,
                  display: phase === 'idle' ? 'flex' : 'none',
                  alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', zIndex: 16,
                  background: 'none', border: 'none', padding: 0, outline: 'none',
                }}
              >
                {/* Pulse glow */}
                <div style={{
                  position: 'absolute', left: '50%', top: '50%',
                  width: bd * 3, height: bd * 3, borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, rgba(245,51,63,.34) 0%, rgba(245,51,63,.14) 38%, transparent 66%)',
                  animation: `hsPulse 3s ease-in-out infinite ${(i * 0.3).toFixed(2)}s`,
                  opacity: isHovered ? 0 : 1, transition: 'opacity .25s',
                }} />

                {/* Magnifying lens */}
                <div style={{
                  position: 'absolute', left: '50%', top: '50%',
                  width: isHovered ? LENS_R * 2 : 0,
                  height: isHovered ? LENS_R * 2 : 0,
                  borderRadius: '50%', transform: 'translate(-50%, -50%)',
                  overflow: 'hidden', opacity: isHovered ? 1 : 0,
                  pointerEvents: 'none',
                  transition: 'width .32s cubic-bezier(.34,1.4,.5,1), height .32s cubic-bezier(.34,1.4,.5,1), opacity .25s ease',
                  boxShadow: '0 16px 38px rgba(60,70,90,.26)', border: '3px solid #fff',
                  backgroundImage: 'url(/images/union-u-v2.png)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: `${imgRect.w * ZOOM}px ${imgRect.h * ZOOM}px`,
                  backgroundPosition: `${-(sol.x / 100 * imgRect.w * ZOOM - LENS_R)}px ${-(sol.y / 100 * imgRect.h * ZOOM - LENS_R)}px`,
                }} />

                {/* Label */}
                <div style={{
                  position: 'absolute',
                  ...(side === 'r' ? { right: '108%', top: '50%', transform: 'translateY(-50%)' }
                    : side === 'l' ? { left: '108%', top: '50%', transform: 'translateY(-50%)' }
                    : { top: '112%', left: '50%', transform: 'translateX(-50%)' }),
                  whiteSpace: 'nowrap',
                  opacity: hoveredIdx === null ? 1 : isHovered ? 1 : 0.3,
                  transition: 'opacity .3s ease', pointerEvents: 'none',
                }}>
                  <div style={{
                    display: 'flex', flexDirection: side === 'r' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start', gap: 8, padding: '9px 14px',
                    background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(13px)',
                    border: '1px solid rgba(255,255,255,.9)', borderRadius: 11,
                    boxShadow: '0 8px 22px rgba(60,70,90,.14)',
                    textAlign: (side === 'r' ? 'right' : 'left') as 'right' | 'left',
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 5, flex: 'none', background: 'var(--accent)' }} />
                    <span>
                      <span style={{ display: 'block', fontSize: 14, fontWeight: 800, color: '#1a1c22' }}>{sol.area}</span>
                      <span style={{ display: 'block', fontSize: 11, color: '#7a8090', marginTop: 1 }}>{sol.vendor}</span>
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Portal Burst */}
      {burst && <PortalBurst x={burst.x} y={burst.y} />}

      {/* Micro Structure */}
      {phase === 'zoomed' && zoomedSolution && (
        <>
          <MicroStructure solution={zoomedSolution} onClose={doClose} onBrochure={onBrochure} />
        </>
      )}

      <style jsx global>{`
        @keyframes flU{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-24px) rotate(1.2deg)}}
        @keyframes uSway{0%,100%{transform:translate(0,0)}25%{transform:translate(10px,-6px)}50%{transform:translate(3px,7px)}75%{transform:translate(-9px,-3px)}}
        @keyframes hsPulse{0%,100%{opacity:.35}50%{opacity:.95}}
        @keyframes uRip{0%{transform:translateX(-50%) scale(.5);opacity:0}22%{opacity:.75}100%{transform:translateX(-50%) scale(1.5);opacity:0}}
        @keyframes pCore{0%{transform:translate(-50%,-50%) scale(.2);opacity:0}20%{opacity:.6}100%{transform:translate(-50%,-50%) scale(4);opacity:0}}
        @keyframes pRing{0%{transform:translate(-50%,-50%) scale(.3);opacity:.6}100%{transform:translate(-50%,-50%) scale(3.5);opacity:0}}
        @keyframes pRay{0%{transform:translate(-50%,-50%) rotate(var(--r)) scaleY(.3);opacity:.5}100%{transform:translate(-50%,-50%) rotate(var(--r)) scaleY(2);opacity:0}}
        @keyframes uSuck{0%{transform:scale(1);opacity:1;filter:blur(0)}40%{transform:scale(1.05);opacity:.8;filter:blur(1px)}100%{transform:scale(2.5);opacity:0;filter:blur(6px)}}
        @keyframes uUnsuck{0%{transform:scale(2.5);opacity:0;filter:blur(6px)}60%{transform:scale(.98);opacity:.9;filter:blur(0)}100%{transform:scale(1);opacity:1;filter:blur(0)}}
        @media(prefers-reduced-motion:reduce){*{animation-duration:0.01s!important;transition-duration:0.01s!important;}}
      `}</style>
    </div>
  );
}
