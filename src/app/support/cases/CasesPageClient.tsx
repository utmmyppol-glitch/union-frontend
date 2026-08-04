'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { CustomerStory } from '@/types';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SERIF = "'Newsreader', Georgia, serif";
const INDUSTRIES = ['전체', '공공', '금융', '제조', '유통', '항공', 'IT', '교육', '기타'];

interface PageData {
  content: CustomerStory[];
  totalPages: number;
  first: boolean;
  last: boolean;
}

export default function CasesPageClient({ initialData }: { initialData: PageData }) {
  const [industry, setIndustry] = useState('전체');
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PageData>(initialData);

  useEffect(() => {
    if (page === 0 && industry === '전체') {
      setData(initialData);
      return;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
    const params = new URLSearchParams({ page: String(page), size: '9' });
    if (industry !== '전체') params.set('industry', industry);
    fetch(`${apiUrl}/customer-stories?${params}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData(d); })
      .catch(() => {});
  }, [industry, page, initialData]);

  const stories = data?.content ?? [];
  const filtered = industry === '전체' ? stories : stories.filter(s => s.industry === industry);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filtered]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ═══ Hero ═══ */}
      <section style={{ position: 'relative', background: 'var(--soft)', overflow: 'hidden', borderBottom: '1px solid var(--line)' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 70%, rgba(148,53,67,.07) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', left: '8%', top: '20%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(245,51,63,.04) 0%, transparent 60%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', right: '-3%', bottom: '-10%', fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(120px, 20vw, 300px)', fontWeight: 300, color: 'rgba(255,255,255,.02)', lineHeight: .8, pointerEvents: 'none' }}>Stories</div>
        <div className="blob blob-accent" aria-hidden="true" style={{ width: 350, height: 350, right: '5%', top: '5%' }} />
        <div className="blob blob-graphite" aria-hidden="true" style={{ width: 250, height: 250, left: '8%', bottom: '5%', animationDelay: '6s' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1, padding: '120px clamp(20px,4vw,52px) 64px' }}>
          <p style={{ fontFamily: MONO, fontWeight: 500, fontSize: 18, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 12px' }}>CUSTOMER STORIES</p>
          <h1 style={{ fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)', lineHeight: 1.05, letterSpacing: '-.04em', color: 'var(--ink)', margin: '0 0 8px' }}>고객사례</h1>
          <p style={{ fontWeight: 400, fontSize: 18, color: 'var(--ink2)', margin: 0 }}>유니온시스템즈와 함께한 기업들의 성공 사례</p>
        </div>
        <div className="wrap" style={{ position: 'relative', zIndex: 1, paddingBottom: 32 }}>
          <div style={{ display: 'flex', gap: 32, marginTop: 0 }}>
            {[{ num: '200+', label: '도입 기업' }, { num: '98%', label: '재계약률' }].map(s => (
              <div key={s.label}>
                <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 28, fontWeight: 400, color: '#fff', lineHeight: 1 }}>{s.num}</span>
                <span style={{ fontFamily: MONO, fontSize: 18, letterSpacing: '.06em', color: 'rgba(255,255,255,.3)', marginLeft: 8 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Filter + Cards ═══ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />
        <div className="blob blob-accent" aria-hidden="true" style={{ width: 280, height: 280, right: '-2%', top: '30%', animationDelay: '5s' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 40 }}>
            {INDUSTRIES.map((ind) => (
              <button key={ind} onClick={() => { setIndustry(ind); setPage(0); }} style={{ padding: '9px 18px', fontFamily: MONO, fontSize: 18, fontWeight: 500, letterSpacing: '.04em', color: industry === ind ? '#fff' : 'var(--ink2)', background: industry === ind ? 'var(--charcoal)' : 'transparent', border: industry === ind ? 'none' : '1px solid var(--line)', cursor: 'pointer', transition: 'all .15s' }}>{ind}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--ink2)', fontSize: 18 }}>해당 산업군의 고객사례가 없습니다.</div>
          ) : (
            <div className="case-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {filtered.map((story: CustomerStory, idx: number) => {
                const isDark = idx === 0;
                return (
                  <div key={story.id} className="reveal case-card" style={{ background: isDark ? 'var(--charcoal)' : 'var(--surface)', border: isDark ? 'none' : '1px solid var(--line)', padding: 0, overflow: 'hidden', transition: 'transform .25s cubic-bezier(.16,.84,.3,1), box-shadow .25s', transitionDelay: `${idx * 0.05}s`, cursor: 'pointer' }}>
                    <div style={{ height: 160, position: 'relative', overflow: 'hidden', background: isDark ? 'radial-gradient(ellipse at 50% 80%, rgba(148,53,67,.1) 0%, var(--charcoal) 60%)' : 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {story.thumbnailUrl ? (
                        <img src={story.thumbnailUrl} alt={story.company} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 56, fontWeight: 300, color: isDark ? 'rgba(255,255,255,.06)' : 'var(--line)' }}>{story.company.charAt(0)}</span>
                      )}
                      <span style={{ position: 'absolute', top: 12, left: 12, padding: '3px 10px', fontFamily: MONO, fontSize: 18, fontWeight: 600, letterSpacing: '.06em', background: isDark ? 'var(--accent)' : 'var(--charcoal)', color: '#fff' }}>{story.industry}</span>
                    </div>
                    <div style={{ padding: 24, position: 'relative' }}>
                      <div aria-hidden="true" style={{ position: 'absolute', right: 4, bottom: -6, fontFamily: SERIF, fontStyle: 'italic', fontSize: 64, fontWeight: 300, lineHeight: 1, color: isDark ? 'rgba(255,255,255,.04)' : 'rgba(20,18,16,.03)', pointerEvents: 'none' }}>{String(idx + 1).padStart(2, '0')}</div>
                      <h3 className="case-title" style={{ fontWeight: 800, fontSize: 18, color: isDark ? '#fff' : 'var(--ink)', margin: '0 0 6px', letterSpacing: '-.02em', transition: 'color .2s' }}>{story.company}</h3>
                      <p style={{ fontSize: 18, lineHeight: 1.6, color: isDark ? 'rgba(255,255,255,.45)' : 'var(--ink2)', margin: '0 0 16px' }}>{story.title}</p>
                      <span className="case-arrow" style={{ fontFamily: MONO, fontSize: 18, fontWeight: 600, color: isDark ? 'var(--accent)' : 'var(--ink2)', letterSpacing: '.04em', opacity: 0, transition: 'opacity .2s' }}>자세히 보기 →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {data && data.totalPages > 1 && (
            <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center', gap: 4 }}>
              <button disabled={data.first} onClick={() => setPage(p => p - 1)} style={{ padding: '10px 20px', fontFamily: MONO, fontSize: 18, fontWeight: 600, color: data.first ? 'var(--ink2)' : 'var(--ink)', background: 'transparent', border: '1px solid var(--line)', cursor: data.first ? 'default' : 'pointer', opacity: data.first ? 0.4 : 1 }}>PREV</button>
              {Array.from({ length: data.totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i)} style={{ width: 36, height: 36, fontSize: 18, fontWeight: 600, color: page === i ? '#fff' : 'var(--ink2)', background: page === i ? 'var(--charcoal)' : 'transparent', border: page === i ? 'none' : '1px solid var(--line)', cursor: 'pointer' }}>{i + 1}</button>
              ))}
              <button disabled={data.last} onClick={() => setPage(p => p + 1)} style={{ padding: '10px 20px', fontFamily: MONO, fontSize: 18, fontWeight: 600, color: data.last ? 'var(--ink2)' : 'var(--ink)', background: 'transparent', border: '1px solid var(--line)', cursor: data.last ? 'default' : 'pointer', opacity: data.last ? 0.4 : 1 }}>NEXT</button>
            </div>
          )}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0', background: 'var(--charcoal)', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 80%, rgba(148,53,67,.06) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 600 }}>
          <div className="reveal" style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 48, fontWeight: 300, color: 'var(--accent)', lineHeight: 1, marginBottom: 16, opacity: .35 }}>&ldquo;</div>
          <h2 className="reveal" style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(26px, 3.5vw, 40px)', lineHeight: 1.35, color: '#fff', margin: '0 0 12px' }}>다음 성공 사례의<br />주인공이 되세요.</h2>
          <p className="reveal" style={{ fontSize: 18, color: 'rgba(255,255,255,.45)', margin: '0 0 28px' }}>유니온시스템즈와 함께 IT 환경을 혁신하세요.</p>
          <Link href="/contact" className="reveal btn" style={{ display: 'inline-block', padding: '16px 36px', background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 18, textDecoration: 'none' }}>도입 문의하기 →</Link>
        </div>
      </section>

      <style>{`
        .case-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px rgba(0,0,0,.08) !important; }
        .case-card:hover .case-title { color: var(--accent) !important; }
        .case-card:hover .case-arrow { opacity: 1 !important; }
        @media (max-width: 920px) { .case-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .case-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
