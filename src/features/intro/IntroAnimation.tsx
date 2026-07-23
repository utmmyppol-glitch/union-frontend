'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/* ── Constants ─────────────────────────────────────────── */
const SQL_LINES = [
  { text: 'SELECT * FROM ', keyword: 'technology', comment: '  -- 기술', color: '#111214' },
  { text: 'UNION\nSELECT * FROM ', keyword: 'security', comment: '  -- 보안', color: '#6B655C' },
  { text: 'UNION\nSELECT * FROM ', keyword: 'data', comment: '  -- 데이터', color: '#2B2C30' },
  { text: 'UNION\nSELECT * FROM ', keyword: 'maintenance', comment: '  -- 유지보수', color: '#059669' },
];

const PARTICLE_COLORS = ['26,86,219', '14,165,233', '124,58,237', '5,150,105'];
const MAX_PARTICLES = 360;

/* ── Types ─────────────────────────────────────────────── */
interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface BgParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

/* ── Component ─────────────────────────────────────────── */
export default function IntroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const sqlRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const bgParticlesRef = useRef<BgParticle[]>([]);
  const burstParticlesRef = useRef<Particle[]>([]);
  const phaseRef = useRef<'typing' | 'fly' | 'burst' | 'brand' | 'done'>('typing');
  const [visible, setVisible] = useState(true);

  /* ── Background network particles (canvas) ─────────── */
  const initBgParticles = useCallback((w: number, h: number) => {
    const particles: BgParticle[] = [];
    const count = Math.min(80, Math.floor((w * h) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.3 + 0.1,
      });
    }
    bgParticlesRef.current = particles;
  }, []);

  const drawBgParticles = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const particles = bgParticlesRef.current;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(26,86,219,${p.alpha})`;
      ctx.fill();
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(26,86,219,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }, []);

  /* ── Burst particles ───────────────────────────────── */
  const initBurstParticles = useCallback((cx: number, cy: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const angle = (Math.PI * 2 * i) / MAX_PARTICLES + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 6 + 2;
      const dist = Math.random() * 300 + 100;
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      particles.push({
        x: cx,
        y: cy,
        targetX: cx + Math.cos(angle) * dist,
        targetY: cy + Math.sin(angle) * dist,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1,
        color,
        alpha: 1,
        life: 0,
        maxLife: 60 + Math.random() * 40,
      });
    }
    burstParticlesRef.current = particles;
  }, []);

  const drawBurstParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    const particles = burstParticlesRef.current;
    let alive = 0;
    for (const p of particles) {
      p.life++;
      const progress = p.life / p.maxLife;
      if (progress >= 1) continue;
      alive++;

      // Ease out
      const ease = 1 - Math.pow(1 - Math.min(progress * 2, 1), 3);
      const x = p.x + (p.targetX - p.x) * ease;
      const y = p.y + (p.targetY - p.y) * ease;
      p.alpha = 1 - progress;

      ctx.beginPath();
      ctx.arc(x, y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
    }

    // Draw expanding ring
    if (particles.length > 0) {
      const avgLife = particles.reduce((s, p) => s + p.life, 0) / particles.length;
      const ringProgress = avgLife / 80;
      if (ringProgress < 1) {
        const cx = particles[0].x;
        const cy = particles[0].y;
        const ringRadius = ringProgress * 250;
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(26,86,219,${0.4 * (1 - ringProgress)})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    return alive > 0;
  }, []);

  /* ── Canvas render loop ────────────────────────────── */
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBgParticles(ctx, canvas.width, canvas.height);

    if (phaseRef.current === 'burst' || phaseRef.current === 'brand') {
      drawBurstParticles(ctx);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [drawBgParticles, drawBurstParticles]);

  /* ── SQL Typing Animation ──────────────────────────── */
  const runTypingAnimation = useCallback(async () => {
    const sqlContainer = sqlRef.current;
    if (!sqlContainer) return;

    // Build all display lines from SQL_LINES
    interface DisplayLine {
      prefix: string;
      keyword: string;
      comment: string;
      color: string;
    }

    const displayLines: DisplayLine[] = [];
    for (const line of SQL_LINES) {
      const parts = line.text.split('\n');
      for (let i = 0; i < parts.length; i++) {
        if (i < parts.length - 1) {
          // "UNION" line (no keyword)
          displayLines.push({ prefix: parts[i], keyword: '', comment: '', color: '' });
        } else {
          // "SELECT * FROM keyword  -- comment" line
          displayLines.push({ prefix: parts[i], keyword: line.keyword, comment: line.comment, color: line.color });
        }
      }
    }
    // Add semicolon line
    displayLines.push({ prefix: ';', keyword: '', comment: '', color: '' });

    const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

    for (let i = 0; i < displayLines.length; i++) {
      const dl = displayLines[i];
      const lineEl = document.createElement('div');
      lineEl.style.cssText = `
        opacity: 0;
        transform: translateX(-8px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        white-space: pre;
        line-height: 1.8;
        font-size: clamp(14px, 2vw, 18px);
      `;

      // Build line content
      const prefixSpan = document.createElement('span');
      prefixSpan.style.color = '#93A0B4';
      prefixSpan.textContent = dl.prefix;
      lineEl.appendChild(prefixSpan);

      if (dl.keyword) {
        const kwSpan = document.createElement('span');
        kwSpan.style.color = dl.color;
        kwSpan.style.fontWeight = '600';
        kwSpan.textContent = dl.keyword;
        kwSpan.dataset.keyword = dl.keyword;
        kwSpan.dataset.color = dl.color;
        lineEl.appendChild(kwSpan);

        const commentSpan = document.createElement('span');
        commentSpan.style.color = '#5A6678';
        commentSpan.textContent = dl.comment;
        lineEl.appendChild(commentSpan);
      }

      sqlContainer.appendChild(lineEl);

      // Trigger fade-in
      await wait(50);
      lineEl.style.opacity = '1';
      lineEl.style.transform = 'translateX(0)';

      // Typing delay between lines
      await wait(i === displayLines.length - 1 ? 200 : 350);
    }

    // Add blinking cursor to the last line
    const lastLine = sqlContainer.lastElementChild as HTMLElement;
    if (lastLine) {
      const cursor = document.createElement('span');
      cursor.textContent = '▋';
      cursor.style.cssText = `
        animation: mCaret 1s step-end infinite;
        color: #111214;
        margin-left: 2px;
      `;
      lastLine.appendChild(cursor);
    }

    // Wait before flying
    await wait(1200);

    return sqlContainer;
  }, []);

  /* ── Main sequence ─────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    initBgParticles(canvas.width, canvas.height);
    rafRef.current = requestAnimationFrame(animate);

    // Run the full sequence
    const runSequence = async () => {
      const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

      // Phase 1: Typing
      phaseRef.current = 'typing';
      await runTypingAnimation();

      // Phase 2: Fly keywords to center
      phaseRef.current = 'fly';
      const sqlContainer = sqlRef.current;
      const overlay = overlayRef.current;
      const brand = brandRef.current;
      const core = coreRef.current;

      if (!sqlContainer || !overlay || !brand || !core) return;

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      // Find keyword spans
      const keywordSpans = sqlContainer.querySelectorAll<HTMLElement>('[data-keyword]');

      // Blur out all SQL text
      sqlContainer.style.transition = 'filter 0.8s ease, opacity 0.8s ease';
      sqlContainer.style.filter = 'blur(8px)';
      sqlContainer.style.opacity = '0';

      // Fly keywords to center
      keywordSpans.forEach((span) => {
        const rect = span.getBoundingClientRect();
        const clone = span.cloneNode(true) as HTMLElement;
        clone.style.cssText = `
          position: fixed;
          left: ${rect.left}px;
          top: ${rect.top}px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: ${rect.height * 0.7}px;
          font-weight: 600;
          color: ${span.dataset.color};
          z-index: 100000;
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          pointer-events: none;
        `;
        overlay.appendChild(clone);

        // Trigger fly to center
        requestAnimationFrame(() => {
          clone.style.left = `${cx}px`;
          clone.style.top = `${cy}px`;
          clone.style.opacity = '0';
          clone.style.transform = 'translate(-50%, -50%) scale(0.5)';
          clone.style.filter = 'blur(4px)';
        });
      });

      await wait(900);

      // Phase 3: Core dot + burst
      phaseRef.current = 'burst';
      core.style.display = 'block';
      core.style.left = `${cx}px`;
      core.style.top = `${cy}px`;

      // Trigger burst particles
      initBurstParticles(cx, cy);

      await wait(100);
      core.style.opacity = '1';
      core.style.transform = 'translate(-50%, -50%) scale(1)';

      await wait(1000);

      // Phase 4: Fade core, show brand
      phaseRef.current = 'brand';
      core.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      core.style.opacity = '0';
      core.style.transform = 'translate(-50%, -50%) scale(2)';

      await wait(300);

      // Show brand text
      brand.style.display = 'flex';
      await wait(50);
      brand.style.opacity = '1';
      brand.style.transform = 'translateY(0)';

      await wait(2500);

      // Phase 5: Fade out entire intro
      phaseRef.current = 'done';
      overlay.style.transition = 'opacity 0.8s ease, visibility 0.8s ease';
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';

      await wait(850);
      setVisible(false);
    };

    runSequence();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate, initBgParticles, initBurstParticles, runTypingAnimation]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'radial-gradient(ellipse at center, #F4F7FB 0%, #E2E8F2 50%, #D1D9E6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background network canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {/* SQL typing area */}
      <div
        ref={sqlRef}
        style={{
          position: 'relative',
          zIndex: 2,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          maxWidth: '600px',
          padding: '0 24px',
        }}
      />

      {/* Core glow dot */}
      <div
        ref={coreRef}
        style={{
          display: 'none',
          position: 'fixed',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #111214, #6B655C)',
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(0)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          animation: 'mCore 2s ease-in-out infinite',
          zIndex: 3,
        }}
      />

      {/* Brand reveal */}
      <div
        ref={brandRef}
        style={{
          display: 'none',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) translateY(12px)',
          opacity: 0,
          transition: 'opacity 0.8s ease, transform 0.8s ease',
          zIndex: 4,
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontFamily: "'Pretendard', sans-serif",
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #111214 0%, #6B655C 50%, #2B2C30 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.1,
          }}
        >
          UNION
        </span>
        <span
          style={{
            fontFamily: "'Pretendard', sans-serif",
            fontSize: 'clamp(14px, 2vw, 22px)',
            fontWeight: 500,
            letterSpacing: '0.35em',
            color: '#5A6678',
            lineHeight: 1,
          }}
        >
          SYSTEMS
        </span>
      </div>
    </div>
  );
}
