'use client';

import { useEffect, useRef } from 'react';

/**
 * U자 커서 — [data-u-cursor] 요소 위에서 유니온 U 로고가 마우스를 따라다님
 * requestAnimationFrame + lerp로 부드러운 추적, React state 미사용 (성능)
 */
export default function UCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    let mouseX = 0;
    let mouseY = 0;
    let curX = 0;
    let curY = 0;
    let prevX = 0;
    let visible = false;
    let raf: number;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const loop = () => {
      curX = lerp(curX, mouseX, 0.15);
      curY = lerp(curY, mouseY, 0.15);

      // 마우스 이동 방향 기반 회전 (최대 ±15도)
      const dx = mouseX - prevX;
      const rot = Math.max(-15, Math.min(15, dx * 2));
      prevX = lerp(prevX, mouseX, 0.08);

      el.style.transform = `translate(${curX}px, ${curY}px) rotate(${rot.toFixed(1)}deg) scale(${visible ? 1 : 0.4})`;
      el.style.opacity = visible ? '0.85' : '0';

      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX - 18; // 36/2 center offset
      mouseY = e.clientY - 18;
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-u-cursor]');
      if (target) {
        visible = true;
        document.body.style.cursor = 'none';
        target.querySelectorAll('a, button').forEach((a) => {
          (a as HTMLElement).style.cursor = 'none';
        });
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-u-cursor]');
      const related = (e.relatedTarget as HTMLElement)?.closest?.('[data-u-cursor]');
      if (target && !related) {
        visible = false;
        document.body.style.cursor = '';
        target.querySelectorAll('a, button').forEach((a) => {
          (a as HTMLElement).style.cursor = '';
        });
      }
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf);
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 36,
        height: 36,
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0,
        transition: 'opacity .25s ease, transform .08s ease',
        willChange: 'transform, opacity',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/union-u-logo.png"
        alt=""
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 8px rgba(237,60,59,.35))',
          userSelect: 'none',
        }}
      />
    </div>
  );
}
