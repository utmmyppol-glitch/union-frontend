"use client";

import { useState, useEffect, useRef } from "react";
import { HeroSection } from "@/features/hero";
import { SoftwareSection } from "@/features/software";
import { SolutionCarousel } from "@/features/solution-carousel";
import { SupportSection } from "@/features/support";
import { ClientMarquee } from "@/features/clients";
import { DownloadGateModal } from "@/features/cta";
import { InsightsSection } from "@/features/insights";

import Link from "next/link";
import { gsap } from "@/lib/gsap-init";
import { E, safeParse, useEditMode, useEditableManifest, EDITABLE_STYLES } from "@/lib/editable";

/* ─── CountUp Hook ─── */
function useCountUp(end: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { value, ref };
}

/* ── 기본값 ── */
const DEFAULT_STATS_HEADER = {
  eyebrow: "By the Numbers",
  title: "숫자가 증명하는 신뢰",
  desc: "2008년부터 쌓아온 IT 파트너십의 기록",
};

const DEFAULT_STATS_ITEMS = [
  { suffix: "년+", label: "IT 파트너십 경험" },
  { suffix: "+", label: "누적 고객사" },
  { suffix: "+", label: "글로벌 파트너" },
  { suffix: "대", label: "핵심 솔루션 라인업" },
  { suffix: "%", label: "고객 재계약률" },
  { suffix: "/7", label: "기술지원 체계" },
];

const DEFAULT_CTA = {
  eyebrow: "Ready to Start?",
  title: "스마트 비즈니스,\n지금 시작하세요.",
  desc: "소프트웨어 도입부터 보안·데이터 구축까지, 유니온시스템즈가 원스톱으로 지원합니다.",
  btn_contact: "도입문의하기",
  btn_download: "소개서 다운받기",
  phone_text: "전화 상담 02-706-8999 · 평일 10:00 – 18:00",
};

const DEFAULT_CTA_MINI_STATS = [
  { num: "200+", label: "고객사" },
  { num: "16년", label: "파트너십" },
  { num: "98%", label: "재계약률" },
  { num: "24/7", label: "기술지원" },
];

const DEFAULT_VIDEO = {
  eyebrow: "Company Introduction",
  title: "유니온시스템즈를 소개합니다",
};

/* ═══════════════════════════════════════════════════════════
   Stats Section
   ═══════════════════════════════════════════════════════════ */
function StatsSection({ editMode, statsHeader, statsItems }: {
  editMode: boolean;
  statsHeader: typeof DEFAULT_STATS_HEADER;
  statsItems: typeof DEFAULT_STATS_ITEMS;
}) {
  const stat1 = useCountUp(16);
  const stat2 = useCountUp(200);
  const stat3 = useCountUp(10);
  const stat4 = useCountUp(5);
  const stat5 = useCountUp(98);
  const stat6 = useCountUp(24);

  const statValues = [stat1, stat2, stat3, stat4, stat5, stat6];

  const stats = statsItems.map((item, i) => ({
    ref: statValues[i].ref,
    value: statValues[i].value,
    suffix: item.suffix,
    label: item.label,
  }));

  return (
    <section
      style={{
        background: "var(--charcoal)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Wine tint ambient */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 20% 30%, rgba(148,53,67,.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(100,30,45,.06) 0%, transparent 45%)",
          pointerEvents: "none",
        }}
      />

      {/* Background decorative text */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "'Newsreader', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(120px, 18vw, 280px)",
          lineHeight: 1,
          letterSpacing: "-.04em",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,.06)",
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        UNION SYSTEMS
      </div>

      {/* Header */}
      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: "clamp(60px,8vw,100px) clamp(20px,4vw,52px) 0",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: ".14em",
            color: "rgba(255,255,255,.45)",
            textTransform: "uppercase",
            margin: "0 0 16px",
          }}
        >
          <E id="home_stats.eyebrow" editMode={editMode}>{statsHeader.eyebrow}</E>
        </p>
        <h2
          style={{
            fontWeight: 900,
            fontSize: "clamp(26px,3.5vw,40px)",
            lineHeight: .92,
            letterSpacing: "-.05em",
            color: "#fff",
            margin: "0 0 12px",
          }}
        >
          <E id="home_stats.title" editMode={editMode}>{statsHeader.title}</E>
        </h2>
        <p
          style={{
            fontWeight: 400,
            fontSize: 16,
            color: "rgba(255,255,255,.4)",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <E id="home_stats.desc" editMode={editMode}>{statsHeader.desc}</E>
        </p>
      </div>

      {/* Stats grid */}
      <div
        className="stats-grid"
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: "clamp(40px,6vw,72px) clamp(20px,4vw,52px) clamp(60px,8vw,100px)",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            ref={s.ref}
            style={{
              padding: "clamp(28px,4vw,48px) clamp(20px,3vw,36px)",
              borderTop: "1px solid rgba(255,255,255,.1)",
              borderLeft: i % 3 !== 0 ? "1px solid rgba(255,255,255,.1)" : "none",
              position: "relative",
            }}
          >
            {i % 3 === 0 && (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: -4,
                  left: -4,
                  width: 7,
                  height: 7,
                  border: "1px solid rgba(255,255,255,.2)",
                }}
              />
            )}

            <p
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(48px, 6vw, 80px)",
                lineHeight: 1,
                color: "#fff",
                margin: 0,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {s.value}
              <span
                style={{
                  fontSize: "clamp(20px, 2.5vw, 32px)",
                  color: "var(--accent)",
                  fontStyle: "normal",
                  fontWeight: 500,
                  marginLeft: 4,
                }}
              >
                {s.suffix}
              </span>
            </p>
            <p
              style={{
                fontWeight: 500,
                fontSize: 15,
                color: "rgba(255,255,255,.55)",
                margin: "12px 0 0",
                letterSpacing: ".02em",
              }}
            >
              <E id={`home_stats_items.${i}.label`} editMode={editMode}>{s.label}</E>
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CTA Section
   ═══════════════════════════════════════════════════════════ */
function CtaBanner({ editMode, cta, ctaMiniStats }: { editMode: boolean; cta: typeof DEFAULT_CTA; ctaMiniStats: typeof DEFAULT_CTA_MINI_STATS }) {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];
    const COUNT = 40;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        o: Math.random() * 0.3 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      const w = canvas.offsetWidth, h = canvas.offsetHeight;

      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.o})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <section
        style={{
          padding: "clamp(100px,12vw,160px) 0",
          background: "var(--charcoal)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "30%",
            left: "20%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(148,53,67,.15) 0%, transparent 60%)",
            filter: "blur(60px)",
            animation: "ctaGlow 6s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "70%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(26,86,219,.12) 0%, transparent 60%)",
            filter: "blur(50px)",
            animation: "ctaGlow 8s ease-in-out 2s infinite",
            pointerEvents: "none",
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "-5%",
            fontFamily: "'Newsreader', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(140px, 20vw, 320px)",
            lineHeight: .85,
            color: "var(--accent)",
            opacity: 0.07,
            whiteSpace: "nowrap",
            userSelect: "none",
            pointerEvents: "none",
            letterSpacing: "-.04em",
          }}
        >
          Union<br />Systems
        </div>

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-8%",
            right: "-3%",
            fontWeight: 900,
            fontSize: "clamp(80px, 12vw, 200px)",
            lineHeight: .85,
            letterSpacing: "-.06em",
            color: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,.05)",
            whiteSpace: "nowrap",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          UNION
        </div>

        <div
          style={{
            maxWidth: 1300,
            margin: "0 auto",
            padding: "0 clamp(20px,4vw,52px)",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <p
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: ".14em",
              color: "rgba(255,255,255,.45)",
              textTransform: "uppercase",
              margin: "0 0 20px",
            }}
          >
            <E id="home_cta.eyebrow" editMode={editMode}>{cta.eyebrow}</E>
          </p>

          <div style={{ position: "relative", margin: "0 0 24px" }}>
            <h2
              style={{
                fontWeight: 900,
                fontSize: "clamp(32px,5vw,64px)",
                lineHeight: .92,
                letterSpacing: "-.05em",
                color: "#fff",
                margin: 0,
                whiteSpace: "pre-line",
              }}
            >
              <E id="home_cta.title" editMode={editMode}>{cta.title}</E>
            </h2>
            <div
              aria-hidden="true"
              style={{
                fontWeight: 900,
                fontSize: "clamp(32px,5vw,64px)",
                lineHeight: .92,
                letterSpacing: "-.05em",
                color: "#fff",
                whiteSpace: "pre-line",
                animation: "ripple 4s ease-in-out infinite",
                maskImage: "linear-gradient(to bottom, rgba(0,0,0,.18), transparent 70%)",
                WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,.18), transparent 70%)",
                pointerEvents: "none",
                userSelect: "none",
                marginTop: 4,
              }}
            >
              {cta.title}
            </div>
          </div>

          <p
            style={{
              fontWeight: 400,
              fontSize: 17,
              lineHeight: 1.65,
              color: "rgba(255,255,255,.45)",
              maxWidth: 640,
              margin: "0 auto 40px",
            }}
          >
            <E id="home_cta.desc" editMode={editMode}>{cta.desc}</E>
          </p>

          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 40,
            }}
          >
            <Link
              href="/contact"
              className="cta-btn-primary"
              style={{
                padding: "17px 44px",
                border: "none",
                background: "var(--accent)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                transition: "transform .15s",
              }}
            >
              <E id="home_cta.btn_contact" editMode={editMode}>{cta.btn_contact}</E>
              <span style={{ fontSize: 18 }}>&rarr;</span>
            </Link>
            <button
              className="cta-btn-outline"
              onClick={() => setIsDownloadOpen(true)}
              style={{
                padding: "17px 40px",
                border: "1px solid rgba(255,255,255,.18)",
                background: "transparent",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              <E id="home_cta.btn_download" editMode={editMode}>{cta.btn_download}</E>
            </button>
          </div>

          {/* Mini stats strip */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 40,
            marginBottom: 36,
            flexWrap: "wrap",
          }}>
            {ctaMiniStats.map((s: { num: string; label: string }, i: number) => (
              <div key={i} className="cta-stat-item" style={{ textAlign: "center" }}>
                <p style={{
                  fontFamily: "'Newsreader', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 28,
                  fontWeight: 400,
                  color: "#fff",
                  margin: "0 0 2px",
                  lineHeight: 1,
                }}><E id={`home_cta_mini${i}.num`} editMode={editMode}>{s.num}</E></p>
                <p style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: ".08em",
                  color: "rgba(255,255,255,.45)",
                  margin: 0,
                }}><E id={`home_cta_mini${i}.label`} editMode={editMode}>{s.label}</E></p>
              </div>
            ))}
          </div>

          {/* Phone line */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 24px",
            border: "1px solid rgba(255,255,255,.08)",
            background: "rgba(255,255,255,.03)",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: .4 }}>
              <path d="M14.5 11.5v2a1.33 1.33 0 01-1.45 1.33A13.18 13.18 0 011.17 2.95 1.33 1.33 0 012.5 1.5h2a1.33 1.33 0 011.33 1.14 8.56 8.56 0 00.47 1.87 1.33 1.33 0 01-.3 1.41L5 7a10.67 10.67 0 004 4l1.08-1a1.33 1.33 0 011.41-.3 8.56 8.56 0 001.87.47 1.33 1.33 0 011.14 1.36z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{
              fontWeight: 500,
              fontSize: 14,
              color: "rgba(255,255,255,.5)",
            }}>
              <E id="home_cta.phone_text" editMode={editMode}>{cta.phone_text}</E>
            </span>
          </div>
        </div>
      </section>

      <DownloadGateModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main Page
   ═══════════════════════════════════════════════════════════ */
export default function HomePageClient({ ssrContent, ssrInsights }: { ssrContent: Record<string, string>; ssrInsights?: Record<string, unknown>[] }) {
  const editMode = useEditMode();
  useEditableManifest(editMode);

  const [statsHeader, setStatsHeader] = useState(() => safeParse(ssrContent.home_stats, DEFAULT_STATS_HEADER));
  const [statsItems, setStatsItems] = useState(() => safeParse(ssrContent.home_stats_items, DEFAULT_STATS_ITEMS));
  const [cta, setCta] = useState(() => safeParse(ssrContent.home_cta, DEFAULT_CTA));
  const [ctaMiniStats, setCtaMiniStats] = useState(() => safeParse(ssrContent.home_cta_mini_stats, DEFAULT_CTA_MINI_STATS));
  const [video, setVideo] = useState(() => safeParse(ssrContent.home_video, DEFAULT_VIDEO));

  useEffect(() => {
    if (!editMode) return;
    const setters: Record<string, (v: unknown) => void> = {
      home_stats: setStatsHeader as (v: unknown) => void,
      home_stats_items: setStatsItems as (v: unknown) => void,
      home_cta: setCta as (v: unknown) => void,
      home_cta_mini_stats: setCtaMiniStats as (v: unknown) => void,
      home_video: setVideo as (v: unknown) => void,
    };
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'content-update') {
        const fn = setters[e.data.section];
        if (fn) fn(e.data.data);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [editMode]);

  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mainRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.gsap-parallax').forEach((el) => {
        gsap.to(el, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement!, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
        });
      });

      gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach((el, i) => {
        gsap.from(el, {
          y: 40, opacity: 0, duration: 0.8,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          delay: i * 0.05,
        });
      });

      gsap.utils.toArray<HTMLElement>('.gsap-scale').forEach((el) => {
        gsap.from(el, {
          scale: 0.92, opacity: 0, duration: 0.7,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef}>
      {editMode && <style>{EDITABLE_STYLES}</style>}

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Software */}
      <div className="gsap-reveal">
        <SoftwareSection />
      </div>

      {/* 3. Solution carousel */}
      <div className="gsap-reveal">
        <SolutionCarousel />
      </div>

      {/* 4. Stats */}
      <div className="gsap-scale">
        <StatsSection editMode={editMode} statsHeader={statsHeader} statsItems={statsItems} />
      </div>

      {/* 5. Video */}
      <div className="gsap-reveal">
        <section style={{
          padding: 'clamp(56px, 8vw, 96px) 0',
          background: 'var(--bg)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            maxWidth: 1300, margin: '0 auto',
            padding: '0 clamp(20px,4vw,52px)',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
              fontWeight: 500, fontSize: 12, letterSpacing: '.14em',
              color: 'var(--ink2)', textTransform: 'uppercase',
              margin: '0 0 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              <span style={{ width: 20, height: 1.5, background: 'var(--accent)' }} />
              <E id="home_video.eyebrow" editMode={editMode}>{video.eyebrow}</E>
              <span style={{ width: 20, height: 1.5, background: 'var(--accent)' }} />
            </p>
            <h2 style={{
              fontWeight: 900, fontSize: 'clamp(26px,3.5vw,40px)',
              lineHeight: 1.1, letterSpacing: '-.04em',
              color: 'var(--ink)', margin: '0 0 36px',
            }}>
              <E id="home_video.title" editMode={editMode}>{video.title}</E>
            </h2>
            <div style={{
              position: 'relative', width: '100%', maxWidth: 900,
              margin: '0 auto', aspectRatio: '16/9',
              border: '1px solid var(--line)',
              overflow: 'hidden',
              boxShadow: '0 16px 48px rgba(0,0,0,.08)',
            }}>
              <iframe
                src="https://www.youtube.com/embed/ZQHgnHSiJS4"
                title="유니온시스템즈 소개 영상"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%', border: 'none',
                }}
              />
            </div>
          </div>
        </section>
      </div>

      {/* 6. Support */}
      <div className="gsap-reveal">
        <SupportSection />
      </div>

      {/* 7. Clients marquee */}
      <div className="gsap-reveal">
        <ClientMarquee />
      </div>

      {/* 7.5 Insights */}
      <div className="gsap-reveal">
        <InsightsSection insights={ssrInsights} />
      </div>

      {/* 8. CTA */}
      <div className="gsap-scale">
        <CtaBanner editMode={editMode} cta={cta} ctaMiniStats={ctaMiniStats} />
      </div>
    </div>
  );
}
