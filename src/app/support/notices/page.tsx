'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useApi } from '@/hooks/useApi';



const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const UP = '/images/uploads/';

const SAMPLE_NOTICES = [
  { id: 1, title: '유니온시스템즈 기업문화 소개 (1) — 소수정예 전문가 조직', category: 'NOTICE', content: '', excerpt: '소수정예 전문가 조직으로서 유니온시스템즈의 기업문화를 소개합니다.', createdAt: '2026-03-15T00:00:00', viewCount: 142, published: true, img: `${UP}01_1.png` },
  { id: 2, title: '유니온시스템즈 기업문화 소개 (2) — 고객과 함께 성장합니다', category: 'NOTICE', content: '', excerpt: '고객과 함께 성장하는 유니온시스템즈의 파트너십 철학을 소개합니다.', createdAt: '2026-04-02T00:00:00', viewCount: 156, published: true, img: `${UP}01_1.png` },
  { id: 3, title: '유니온시스템즈 기업문화 소개 (3) — 기술 혁신과 학습 문화', category: 'NOTICE', content: '', excerpt: '끊임없는 기술 혁신과 학습 문화로 성장하는 유니온시스템즈를 소개합니다.', createdAt: '2026-04-20T00:00:00', viewCount: 175, published: true, img: `${UP}01_1.png` },
  { id: 4, title: '[채용] 마케터·디자이너 모집', category: 'NOTICE', content: '', excerpt: '유니온시스템즈에서 함께할 마케터와 디자이너를 모집합니다.', createdAt: '2026-05-10T00:00:00', viewCount: 298, published: true, img: `${UP}04_4.png` },
  { id: 5, title: '찾아가는 설명회 — 충북대병원 DA# 도입 컨설팅', category: 'NOTICE', content: '', excerpt: '충북대학교병원에서 DA# 도입 컨설팅 설명회를 진행했습니다.', createdAt: '2026-06-05T00:00:00', viewCount: 187, published: true, img: `${UP}0-1_50.jpg` },
  { id: 6, title: '데이터품질관리 세미나 개최 안내', category: 'NOTICE', content: '', excerpt: '데이터 품질관리 세미나를 개최합니다. 관심 있는 분들의 많은 참여 부탁드립니다.', createdAt: '2026-06-20T00:00:00', viewCount: 203, published: true, img: `${UP}02_2.png` },
  { id: 7, title: '유니온시스템즈 상반기 워크숍 (22년 6월)', category: 'NOTICE', content: '', excerpt: '대부도 블루스카이 펜션에서 1박 2일 상반기 워크숍을 다녀왔습니다.', createdAt: '2022-06-22T00:00:00', viewCount: 134, published: true, img: `${UP}03_3.png` },
  { id: 8, title: '새해 福 많이 받으세요', category: 'NOTICE', content: '', excerpt: '유니온시스템즈 임직원 일동 새해 인사를 드립니다.', createdAt: '2022-01-01T00:00:00', viewCount: 112, published: true, img: `${UP}01_1.png` },
  { id: 9, title: "유니온시스템즈, '전산실 사람들' 통해 넷클라이언트 무료체험 지원", category: 'NOTICE', content: '', excerpt: '전산실 사람들 커뮤니티를 통해 넷클라이언트 무료체험을 지원합니다.', createdAt: '2021-09-13T00:00:00', viewCount: 245, published: true, img: `${UP}02_2.png` },
  { id: 10, title: "엔코아, 유니온시스템즈와 데이터 모델링 툴 'DA#' 총판 협약 체결", category: 'NOTICE', content: '', excerpt: '엔코아와 유니온시스템즈가 데이터 모델링 툴 DA#의 총판 협약을 체결했습니다.', createdAt: '2021-02-24T00:00:00', viewCount: 312, published: true, img: `${UP}01_1.png` },
];

const PER_PAGE = 6;

export default function NoticesPage() {
  const [page, setPage] = useState(0);
  const { data: apiData, isLoading, error } = useApi(() => apiClient.getPosts('NOTICE', page, PER_PAGE), [page]);

  // fallback: 프론트 페이지네이션
  const fallbackSlice = SAMPLE_NOTICES.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const fallbackTotalPages = Math.ceil(SAMPLE_NOTICES.length / PER_PAGE);
  const data = apiData || (error ? {
    content: fallbackSlice,
    totalPages: fallbackTotalPages,
    first: page === 0,
    last: page >= fallbackTotalPages - 1,
  } : null);
  const notices = data?.content ?? ((!isLoading && !data) ? SAMPLE_NOTICES.slice(0, PER_PAGE) : []);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [notices]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ═══ Hero ═══ */}
      <section style={{
        position: 'relative', background: 'var(--soft)', overflow: 'hidden',
        borderBottom: '1px solid var(--line)',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="blob blob-accent" aria-hidden="true" style={{ width: 350, height: 350, right: '5%', top: '5%' }} />
        <div className="blob blob-lavender" aria-hidden="true" style={{ width: 250, height: 250, left: '10%', bottom: '5%', animationDelay: '8s' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1, padding: '120px clamp(20px,4vw,52px) 64px' }}>
          <p style={{ fontFamily: MONO, fontWeight: 500, fontSize: 18, letterSpacing: '.14em', color: 'var(--accent)', margin: '0 0 12px' }}>NOTICES</p>
          <h1 style={{ fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)', lineHeight: 1.05, letterSpacing: '-.04em', color: 'var(--ink)', margin: '0 0 8px' }}>공지사항</h1>
          <p style={{ fontWeight: 400, fontSize: 18, color: 'var(--ink2)', margin: 0 }}>유니온시스템즈의 즐거운 최신 소식들을 만나보세요!</p>
        </div>
      </section>

      {/* ═══ 3열 이미지 카드 (기존 사이트처럼) ═══ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0', position: 'relative', overflow: 'hidden' }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="blob blob-accent" aria-hidden="true" style={{ width: 280, height: 280, left: '-3%', top: '20%', animationDelay: '4s' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          {isLoading && <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--ink2)' }}>로딩 중...</div>}
          {notices.length > 0 && (
            <div className="ntc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {notices.map((post: any, idx: number) => {
                const img = (post as typeof SAMPLE_NOTICES[0]).img || `${UP}01_1.png`;
                return (
                  <div key={post.id} className="reveal ntc-card" style={{
                    border: '1px solid var(--line)', overflow: 'hidden',
                    background: 'var(--surface)', cursor: 'pointer',
                    transition: 'transform .3s cubic-bezier(.16,.84,.3,1), box-shadow .3s',
                    transitionDelay: `${idx * 0.05}s`,
                  }}>
                    <div style={{ overflow: 'hidden', aspectRatio: '16/10' }}>
                      <img src={img} alt={post.title} className="ntc-img" style={{
                        width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                        transition: 'transform .5s',
                      }} onError={(e) => { (e.target as HTMLImageElement).src = `${UP}01_1.png`; }} />
                    </div>
                    <div style={{ padding: '20px 22px' }}>
                      <h3 className="ntc-title" style={{
                        fontWeight: 700, fontSize: 18, color: 'var(--ink)',
                        margin: '0 0 8px', lineHeight: 1.4, transition: 'color .2s',
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>{post.title}</h3>
                      {post.excerpt && (
                        <p style={{
                          fontSize: 18, lineHeight: 1.6, color: 'var(--ink2)', margin: '0 0 12px',
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>{post.excerpt}</p>
                      )}
                      <span style={{ fontFamily: MONO, fontSize: 18, color: 'var(--ink2)' }}>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <button
                disabled={data.first}
                onClick={() => setPage(p => p - 1)}
                style={{
                  padding: '10px 20px', border: '1px solid var(--line)',
                  background: 'transparent',
                  fontFamily: MONO, fontWeight: 600, fontSize: 13, letterSpacing: '.04em',
                  color: data.first ? 'var(--line)' : 'var(--ink2)',
                  cursor: data.first ? 'default' : 'pointer',
                }}
              >PREV</button>
              {Array.from({ length: data.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  style={{
                    width: 36, height: 36, border: '1px solid var(--line)',
                    background: page === i ? 'var(--charcoal)' : 'transparent',
                    color: page === i ? '#fff' : 'var(--ink2)',
                    fontWeight: 600, fontSize: 13, cursor: 'pointer',
                    transition: 'background .15s, color .15s',
                  }}
                >{i + 1}</button>
              ))}
              <button
                disabled={data.last}
                onClick={() => setPage(p => p + 1)}
                style={{
                  padding: '10px 20px', border: '1px solid var(--line)',
                  background: 'transparent',
                  fontFamily: MONO, fontWeight: 600, fontSize: 13, letterSpacing: '.04em',
                  color: data.last ? 'var(--line)' : 'var(--ink2)',
                  cursor: data.last ? 'default' : 'pointer',
                }}
              >NEXT</button>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .ntc-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px rgba(0,0,0,.08) !important; }
        .ntc-card:hover .ntc-title { color: var(--accent) !important; }
        .ntc-card:hover .ntc-img { transform: scale(1.05); }
        @media (max-width: 920px) { .ntc-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .ntc-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
