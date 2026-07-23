'use client';

import React, { useEffect, useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { gsap } from '@/lib/gsap-init';

interface SpokeData {
  label: string;
  labelEn: string;
  icon: React.ReactNode;
  color: string;
  angle: number;
}

const SPOKES: SpokeData[] = [
  {
    label: '기술',
    labelEn: 'Tech',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    color: '#111214',
    angle: 0,
  },
  {
    label: '보안',
    labelEn: 'Security',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    color: '#2B2C30',
    angle: 90,
  },
  {
    label: '데이터',
    labelEn: 'Data',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
    color: '#059669',
    angle: 180,
  },
  {
    label: '유지보수',
    labelEn: 'Maintenance',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.025 1.193-.14 1.743" />
      </svg>
    ),
    color: '#6B655C',
    angle: 270,
  },
];

const HubDiagram: React.FC = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.3 });
  const svgRef = useRef<SVGSVGElement>(null);
  const animated = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isIntersecting || animated.current || !containerRef.current) return;
    animated.current = true;

    const ctx = gsap.context(() => {
      // Center circle — scale bounce
      gsap.from('.hub-center', { scale: 0, opacity: 0, duration: 0.7, ease: 'back.out(1.4)' });
      // Spokes — draw in
      gsap.from('.hub-spoke', { strokeDashoffset: 200, opacity: 0, duration: 0.6, stagger: 0.15, delay: 0.4 });
      // Nodes — pop in
      gsap.from('.hub-node', { scale: 0, opacity: 0, duration: 0.6, stagger: 0.15, delay: 0.7, ease: 'back.out(1.7)' });
      // Labels — fade rise
      gsap.from('.hub-label', { opacity: 0, y: 16, duration: 0.5, stagger: 0.15, delay: 1.0 });
    }, containerRef);

    return () => ctx.revert();
  }, [isIntersecting]);

  // SVG viewBox dimensions
  const cx = 200;
  const cy = 200;
  const spokeLength = 110;
  const nodeRadius = 36;
  const centerRadius = 44;

  const getSpokeEnd = (angleDeg: number) => {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return {
      x: cx + spokeLength * Math.cos(rad),
      y: cy + spokeLength * Math.sin(rad),
    };
  };

  return (
    <div ref={ref} className="flex items-center justify-center py-8">
      <div ref={containerRef} className="relative w-full max-w-[400px] sm:max-w-[480px] aspect-square">
        <svg
          ref={svgRef}
          viewBox="0 0 400 400"
          className="w-full h-full"
          aria-label="UNION Hub Diagram - 기술, 보안, 데이터, 유지보수 4축 연결"
        >
          <defs>
            {SPOKES.map((spoke) => (
              <linearGradient
                key={`grad-${spoke.labelEn}`}
                id={`grad-${spoke.labelEn}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor={spoke.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={spoke.color} stopOpacity={1} />
              </linearGradient>
            ))}
          </defs>

          {/* Spoke lines */}
          {SPOKES.map((spoke) => {
            const end = getSpokeEnd(spoke.angle);
            return (
              <line
                key={`line-${spoke.labelEn}`}
                className="hub-spoke"
                x1={cx}
                y1={cy}
                x2={end.x}
                y2={end.y}
                stroke={spoke.color}
                strokeWidth={2}
                strokeDasharray={spokeLength}
              />
            );
          })}

          {/* Decorative orbital ring */}
          <circle
            cx={cx}
            cy={cy}
            r={spokeLength - 10}
            fill="none"
            stroke="#111214"
            strokeWidth={1}
            strokeDasharray="4 8"
            opacity={0.2}
            className="hub-spoke"
          />

          {/* Node circles at spoke ends */}
          {SPOKES.map((spoke) => {
            const end = getSpokeEnd(spoke.angle);
            return (
              <g
                key={`node-${spoke.labelEn}`}
                className="hub-node"
              >
                {/* Glow */}
                <circle
                  cx={end.x}
                  cy={end.y}
                  r={nodeRadius + 4}
                  fill={spoke.color}
                  opacity={0.1}
                />
                {/* Circle bg */}
                <circle
                  cx={end.x}
                  cy={end.y}
                  r={nodeRadius}
                  fill="white"
                  stroke={spoke.color}
                  strokeWidth={2}
                  className="dark:fill-[#141C2E]"
                />
              </g>
            );
          })}

          {/* Center circle */}
          <g className="hub-center">
            <circle cx={cx} cy={cy} r={centerRadius + 6} fill="#111214" opacity={0.1} />
            <circle cx={cx} cy={cy} r={centerRadius} fill="#111214" />
            <text
              x={cx}
              y={cy + 1}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-[14px] font-bold fill-white tracking-[0.15em]"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              UNION
            </text>
          </g>
        </svg>

        {/* HTML labels overlay for each node */}
        {SPOKES.map((spoke, i) => {
          const end = getSpokeEnd(spoke.angle);
          const xPct = (end.x / 400) * 100;
          const yPct = (end.y / 400) * 100;

          return (
            <div
              key={`label-${spoke.labelEn}`}
              className="hub-label absolute flex flex-col items-center justify-center pointer-events-none"
              style={{
                left: `${xPct}%`,
                top: `${yPct}%`,
                transform: 'translate(-50%, -50%)',
                opacity: isIntersecting ? 1 : 0,
                transitionDelay: `${500 + i * 150}ms`,
              }}
            >
              <div style={{ color: spoke.color }}>{spoke.icon}</div>
              <span
                className="mt-0.5 text-[10px] sm:text-xs font-bold text-gray-800 dark:text-gray-200"
              >
                {spoke.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HubDiagram;
