'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Solution, SOLUTIONS } from '@/data/molecular-data';
import UnicornBrochure from '@/components/UnicornBrochure';


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

/* ═══ Micro Structure (zoomed) — DC reference radial layout ═══ */
function MicroStructure({ solution, onClose, onBrochure }: {
  solution: Solution;
  onClose: () => void;
  onBrochure: () => void;
}) {
  const [entered, setEntered] = useState(false);
  const [hovIdx, setHovIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  // ResizeObserver for container dimensions
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
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Deterministic ambient particles
  const particles = useMemo(() => {
    const seed = solution.id;
    const arr: { x: number; y: number; size: number; delay: number }[] = [];
    for (let i = 0; i < 26; i++) {
      // deterministic pseudo-random based on index + seed char codes
      const s = seed.charCodeAt(i % seed.length) || 42;
      const a = ((i * 137 + s * 31) % 360) * (Math.PI / 180);
      const dist = 0.15 + ((i * 73 + s) % 100) / 200; // 0.15 to 0.65 of half-container
      arr.push({
        x: 0.5 + Math.cos(a) * dist,
        y: 0.5 + Math.sin(a) * dist,
        size: 2 + ((i * 17 + s) % 3),
        delay: i * 0.04,
      });
    }
    return arr;
  }, [solution.id]);

  const feats = solution.feats;
  const N = feats.length;
  const isMobile = dims.w > 0 && dims.w < 768;

  // Container-relative coordinates
  const W = dims.w;
  const H = dims.h;
  const cx = W * 0.58;
  const cy = H * 0.5;
  const minDim = Math.min(W, H);
  const coreSize = minDim * 0.28;
  const orbitR = minDim * 0.4;
  const beadSize = minDim * 0.115;
  const subAtomSize = minDim * 0.032;
  const subAtomDist = minDim * 0.11;

  const accent = '#F5333F';

  // 솔루션별 제품 사진 여러 장 — 배경 콜라주용
  const bgImagesMap: Record<string, string[]> = {
    ms: [
      '/images/uploads/2022/06/software_microsoft_excel.jpg',
      '/images/uploads/2022/06/software_microsoft_outlook.jpg',
      '/images/uploads/2022/06/software_microsoft_word.jpg',
      '/images/uploads/2022/06/software_microsoft_powerpoint.jpg',
    ],
    encora: [
      '/images/uploads/2022/06/main_solution_encore.jpg',
    ],
    ahn: [
      '/images/uploads/2022/06/solution_ahnlab_epp.jpg',
      '/images/uploads/2022/06/solution_ahnlab_edr.jpg',
      '/images/uploads/2022/06/solution_ahnlab_mds.jpg',
      '/images/uploads/2022/06/main_solution_ahnlab.jpg',
    ],
    adobe: [
      '/images/uploads/2022/06/software_adobe_photoshop.jpg',
      '/images/uploads/2022/06/software_adobe_illustrator.jpg',
      '/images/uploads/2022/06/software_adobe_premiere-pro.jpg',
      '/images/uploads/2022/06/software_adobe_after-effects.jpg',
    ],
    est: [
      '/images/uploads/2022/06/software_estsoft_alzip.jpg',
      '/images/uploads/2022/06/software_estsoft_alsee.jpg',
      '/images/uploads/2022/06/software_estsoft_alpdf.jpg',
      '/images/uploads/2022/06/software_estsoft_alcapture.jpg',
    ],
    auto: [
      '/images/uploads/2022/06/software_autodesk_autocad.jpg',
      '/images/uploads/2022/06/software_autodesk_revit.jpg',
      '/images/uploads/2022/06/software_autodesk_inventor.jpg',
      '/images/uploads/2022/06/software_autodesk_3ds-max.jpg',
    ],
    doctor: [
      '/images/uploads/2022/06/main_solution_netclient.jpg',
    ],
  };
  const bgImages = bgImagesMap[solution.id] || [];

  if (isMobile) {
    // Mobile: core card + vertical feature list
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
          textAlign: 'center', marginBottom: 28,
          opacity: entered ? 1 : 0, transform: entered ? 'scale(1)' : 'scale(.6)',
          transition: 'all .6s cubic-bezier(.34,1.4,.5,1)',
        }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1c22' }}>{solution.area}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: accent, marginTop: 4 }}>{solution.vendor}</div>
          <div style={{ fontSize: 11, color: '#7a8090', marginTop: 6 }}>
            기능 {feats.length} · 도입효과 {solution.gain.length}
          </div>
        </div>

        {/* Feature list */}
        {feats.map((f, k) => (
          <div key={k} style={{
            width: '100%', maxWidth: 340, padding: '14px 18px',
            background: '#fff', border: '1px solid #E7E2D8', marginBottom: 10,
            opacity: entered ? 1 : 0, transform: entered ? 'translateY(0)' : 'translateY(20px)',
            transition: `all .45s ease ${0.3 + k * 0.08}s`,
          }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#1a1c22' }}>{f.n}</div>
            <div style={{ fontSize: 13, color: '#6B655C', marginTop: 4 }}>{f.e}</div>
          </div>
        ))}

        {/* Teaser pill */}
        <div
          onClick={onBrochure}
          style={{
            marginTop: 16, padding: '10px 22px',
            background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(200,200,210,.4)',
            fontSize: 13, color: '#4a4e5a', cursor: 'pointer',
            opacity: entered ? 1 : 0, transition: 'opacity .5s ease .9s',
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
      }}
    >
      {/* Background: 제품 사진 콜라주 + 마스킹 */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {/* 제품 사진 콜라주 — 2x2 그리드로 배치 */}
        {bgImages.length > 0 && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'grid',
            gridTemplateColumns: bgImages.length >= 4 ? '1fr 1fr' : '1fr',
            gridTemplateRows: bgImages.length >= 4 ? '1fr 1fr' : '1fr',
            gap: 0, pointerEvents: 'none',
          }}>
            {bgImages.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i} src={src} alt="" draggable={false}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center',
                  opacity: 0.35, filter: 'grayscale(.08) contrast(1.1)',
                  userSelect: 'none',
                }}
              />
            ))}
          </div>
        )}
        {/* 중앙 비네팅 — 분자 구조 영역만 살짝 밝게 */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 50% 45% at 62% 52%, rgba(251,250,247,.88) 0%, rgba(251,250,247,.4) 55%, transparent 100%)',
          pointerEvents: 'none',
        }} />
        {/* 가장자리 좌우 페이드 */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(251,250,247,.9) 0%, transparent 15%, transparent 85%, rgba(251,250,247,.9) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '18%',
          background: 'linear-gradient(to bottom, #FBFAF7, transparent)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '14%',
          background: 'linear-gradient(to top, #FBFAF7, transparent)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Ambient particles */}
      {dims.w > 0 && particles.map((p, i) => (
        <div key={`p-${i}`} style={{
          position: 'absolute',
          left: p.x * W, top: p.y * H,
          width: p.size, height: p.size, borderRadius: '50%',
          background: 'rgba(150,160,175,.35)',
          opacity: entered ? 1 : 0,
          transition: `opacity .6s ease ${p.delay}s`,
          animation: entered ? `flU 6s ease-in-out infinite ${p.delay}s` : 'none',
          pointerEvents: 'none',
        }} />
      ))}

      {dims.w > 0 && (
        <>
          {/* SVG: 궤도 링 + 본드 + sub-atom 라인 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            {/* 궤도 타원 링 — 정돈된 원자 모델 느낌 */}
            <ellipse
              cx={cx} cy={cy}
              rx={orbitR} ry={orbitR * 0.88}
              fill="none"
              stroke="#E7E2D8"
              strokeWidth={1}
              strokeDasharray="6 8"
              opacity={entered ? 0.5 : 0}
              style={{ transition: 'opacity 1.2s ease .3s' }}
            />
            {/* 코어 → 기능 본드 (hover 시 레드 강조) */}
            {feats.map((_, k) => {
              const angle = (-90 + k * (360 / N)) * (Math.PI / 180);
              const fx = cx + Math.cos(angle) * orbitR;
              const fy = cy + Math.sin(angle) * orbitR;
              const edgeX = cx + Math.cos(angle) * (coreSize / 2);
              const edgeY = cy + Math.sin(angle) * (coreSize / 2);
              const lineLen = Math.sqrt((fx - edgeX) ** 2 + (fy - edgeY) ** 2);
              const isHov = hovIdx === k;
              return (
                <line
                  key={`bond-${k}`}
                  x1={edgeX} y1={edgeY}
                  x2={fx} y2={fy}
                  stroke={isHov ? 'rgba(245,51,63,.45)' : 'rgba(150,160,175,.4)'}
                  strokeWidth={isHov ? 1.8 : 1.2}
                  strokeDasharray={lineLen}
                  strokeDashoffset={entered ? 0 : lineLen}
                  style={{ transition: `stroke-dashoffset .9s cubic-bezier(.25,.46,.45,.94) ${0.3 + k * 0.1}s, stroke .25s, stroke-width .25s` }}
                />
              );
            })}
            {/* 기능 → sub-atom 라인 */}
            {feats.map((_, k) => {
              const angle = (-90 + k * (360 / N)) * (Math.PI / 180);
              const fx = cx + Math.cos(angle) * orbitR;
              const fy = cy + Math.sin(angle) * orbitR;
              const sx = cx + Math.cos(angle) * (orbitR + subAtomDist);
              const sy = cy + Math.sin(angle) * (orbitR + subAtomDist);
              return (
                <line
                  key={`sub-bond-${k}`}
                  x1={fx} y1={fy}
                  x2={sx} y2={sy}
                  stroke="rgba(160,168,180,.3)"
                  strokeWidth={1}
                  strokeDasharray={subAtomDist}
                  strokeDashoffset={entered ? 0 : subAtomDist}
                  style={{ transition: `stroke-dashoffset .7s cubic-bezier(.25,.46,.45,.94) ${0.6 + k * 0.12}s` }}
                />
              );
            })}
          </svg>

          {/* 코어 글로우 링 */}
          <div style={{
            position: 'absolute',
            left: cx - coreSize * 0.7, top: cy - coreSize * 0.7,
            width: coreSize * 1.4, height: coreSize * 1.4, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,51,63,.06) 0%, transparent 70%)',
            opacity: entered ? 1 : 0,
            transition: 'opacity .8s ease .3s',
            pointerEvents: 'none', zIndex: 4,
            animation: entered ? 'coreGlow 4s ease-in-out infinite' : 'none',
          }} />

          {/* Central glass core */}
          <div style={{
            position: 'absolute',
            left: cx - coreSize / 2, top: cy - coreSize / 2,
            width: coreSize, height: coreSize, borderRadius: '50%',
            background: 'radial-gradient(circle at 37% 28%, #fff 0%, #f4f5f8 44%, rgba(245,51,63,.12) 80%, rgba(245,51,63,.24) 100%)',
            border: '1px solid rgba(255,255,255,.95)',
            boxShadow: '0 36px 80px rgba(60,70,90,.24), 0 10px 24px rgba(60,70,90,.12), inset 0 14px 36px rgba(255,255,255,.95), inset 0 -20px 40px rgba(245,51,63,.18)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            zIndex: 5,
            animation: entered ? 'budIn .8s cubic-bezier(.25,.46,.45,.94) both' : 'none',
          }}>
            {/* Specular highlight */}
            <div style={{
              position: 'absolute', top: coreSize * 0.12, left: coreSize * 0.2,
              width: coreSize * 0.22, height: coreSize * 0.12, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,.95), transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              fontSize: Math.max(24, coreSize * 0.12), fontWeight: 800,
              color: '#111214', textAlign: 'center', lineHeight: 1.15,
              letterSpacing: '-0.03em', padding: '0 14px',
            }}>
              {solution.area}
            </div>
            <div style={{ fontSize: Math.max(15, coreSize * 0.075), fontWeight: 700, color: accent, marginTop: 7 }}>
              {solution.vendor}
            </div>
            <div style={{ fontSize: Math.max(12, coreSize * 0.055), color: '#7a8090', marginTop: 8 }}>
              기능 {feats.length} · 도입효과 {solution.gain.length}
            </div>
          </div>

          {/* Info pill below core */}
          <div style={{
            position: 'absolute',
            left: cx, top: cy + coreSize / 2 + 24,
            transform: 'translateX(-50%)',
            padding: '9px 22px',
            background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(200,200,210,.4)',
            fontSize: 13, color: '#4a4e5a',
            whiteSpace: 'nowrap', zIndex: 6,
            opacity: entered ? 1 : 0,
            transition: 'opacity .5s ease .9s',
            pointerEvents: 'none',
          }}>
            각 기능을 클릭해 상세 정보를 확인하세요
          </div>

          {/* Feature atoms — bead+label 통합 hover 영역 */}
          {feats.map((f, k) => {
            const angle = (-90 + k * (360 / N)) * (Math.PI / 180);
            const fx = cx + Math.cos(angle) * orbitR;
            const fy = cy + Math.sin(angle) * orbitR;
            const isHov = hovIdx === k;
            const isLeft = Math.cos(angle) < -0.1;
            const delay = 0.32 + k * 0.12;

            const sx = cx + Math.cos(angle) * (orbitR + subAtomDist);
            const sy = cy + Math.sin(angle) * (orbitR + subAtomDist);

            const isDimmed = hovIdx !== null && !isHov;
            return (
              <div key={k}>
                {/* bead + label 통합 wrapper */}
                <div
                  onMouseEnter={() => setHovIdx(k)}
                  onMouseLeave={() => setHovIdx(null)}
                  style={{
                    position: 'absolute',
                    left: entered ? fx : cx,
                    top: entered ? fy : cy,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 8, cursor: 'default', pointerEvents: 'auto',
                    display: 'flex',
                    flexDirection: isLeft ? 'row-reverse' : 'row',
                    alignItems: 'center', gap: 11,
                    opacity: isDimmed ? 0.35 : 1,
                    transition: `left .8s cubic-bezier(.25,.46,.45,.94) ${delay}s, top .8s cubic-bezier(.25,.46,.45,.94) ${delay}s, opacity .3s ease`,
                  }}
                >
                  {/* Pearl bead */}
                  <span style={{
                    position: 'relative',
                    width: beadSize, height: beadSize, borderRadius: '50%', flex: 'none',
                    background: 'radial-gradient(circle at 34% 28%, #ffffff 0%, #eceef2 50%, #b8bcc6 100%)',
                    boxShadow: isHov
                      ? '0 18px 40px rgba(245,51,63,.24), 0 6px 16px rgba(60,70,90,.15), inset 0 6px 14px rgba(255,255,255,.95), inset 0 -4px 8px rgba(100,110,130,.08)'
                      : '0 14px 32px rgba(60,70,90,.25), 0 4px 12px rgba(60,70,90,.1), inset 0 6px 14px rgba(255,255,255,.95), inset 0 -4px 8px rgba(100,110,130,.06)',
                    transform: isHov ? 'scale(1.2)' : 'scale(1)',
                    transition: 'transform .28s cubic-bezier(.34,1.4,.6,1), box-shadow .25s',
                    display: 'block',
                  }}>
                    <span style={{
                      position: 'absolute', top: beadSize * 0.18, left: beadSize * 0.28,
                      width: beadSize * 0.26, height: beadSize * 0.15, borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(255,255,255,.95), transparent 70%)',
                    }} />
                  </span>

                  {/* Label — 배경 pill로 가독성 확보 */}
                  <span style={{
                    textAlign: isLeft ? 'right' : 'left',
                    background: 'rgba(255,255,255,.8)', backdropFilter: 'blur(10px)',
                    padding: '8px 14px',
                    boxShadow: '0 4px 16px rgba(60,70,90,.08)',
                    border: '1px solid rgba(231,226,216,.4)',
                    minWidth: 'max-content',
                  }}>
                    <span style={{
                      display: 'block',
                      fontSize: Math.max(16, beadSize * 0.2), fontWeight: 800,
                      color: '#111214', whiteSpace: 'nowrap',
                      letterSpacing: '-0.02em',
                    }}>{f.n}</span>
                    <span style={{
                      display: 'block',
                      fontSize: Math.max(13, beadSize * 0.14), color: '#4a4f57',
                      whiteSpace: 'nowrap', marginTop: 3,
                    }}>{f.e}</span>
                    {/* hover 시 상세 안내 */}
                    <span style={{
                      display: 'block', fontSize: 12, color: accent,
                      fontWeight: 700, marginTop: 5,
                      maxHeight: isHov ? 24 : 0,
                      opacity: isHov ? 1 : 0, overflow: 'hidden',
                      transition: 'all .25s ease',
                    }}>← 좌측에서 상담·소개서 요청</span>
                  </span>
                </div>

                {/* Sub-atom */}
                <div style={{
                  position: 'absolute',
                  left: entered ? sx - subAtomSize / 2 : cx - subAtomSize / 2,
                  top: entered ? sy - subAtomSize / 2 : cy - subAtomSize / 2,
                  width: subAtomSize, height: subAtomSize, borderRadius: '50%',
                  background: 'radial-gradient(circle at 34% 28%, #fff 0%, #dddfe4 55%, #b0b4be 100%)',
                  boxShadow: '0 6px 18px rgba(60,70,90,.24), inset 0 2px 5px rgba(255,255,255,.85)',
                  zIndex: 7,
                  transition: `left .9s cubic-bezier(.25,.46,.45,.94) ${delay + 0.15}s, top .9s cubic-bezier(.25,.46,.45,.94) ${delay + 0.15}s`,
                  pointerEvents: 'none',
                }} />
              </div>
            );
          })}
        </>
      )}

      <style jsx>{`
        @keyframes budIn {
          0% { transform: scale(.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes coreGlow {
          0%, 100% { opacity: .6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
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
          <UnicornBrochure />
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
