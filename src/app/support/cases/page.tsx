'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

import { useApi } from '@/hooks/useApi';
import type { CustomerStory } from '@/types';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SERIF = "'Newsreader', Georgia, serif";

const INDUSTRIES = ['전체', '공공', '금융', '제조', '유통', '항공', 'IT', '교육', '기타'];

/* API 미연결 시 fallback — seed 데이터 기반 실제 고객사례 */
const FALLBACK_STORIES: CustomerStory[] = [
  { id: 1, company: 'SSG닷컴', industry: '유통', title: 'NetClient 도입으로 22% 라이선스 비용 절감', content: 'NetClient DMS를 도입하여 전사 소프트웨어 라이선스를 중앙 관리하고, 미사용 라이선스 회수 및 역할별 플랜 차등 적용으로 연간 22%의 비용을 절감했습니다.', thumbnailUrl: null, logoUrl: null, published: true, createdAt: '2026-01-15T00:00:00', updatedAt: '' },
  { id: 2, company: '한국수자원공사', industry: '공공', title: 'DA#으로 100% 데이터 표준화 달성', content: 'DA# 데이터 모델링 솔루션을 도입하여 조직 전체의 데이터 표준 사전을 구축하고, 모든 DB에 표준을 적용하여 100% 데이터 표준화를 달성했습니다.', thumbnailUrl: null, logoUrl: null, published: true, createdAt: '2025-11-20T00:00:00', updatedAt: '' },
  { id: 3, company: 'KB생명보험', industry: '금융', title: 'AhnLab + ESTsecurity로 35% 위협 탐지율 향상', content: 'AhnLab V3 엔드포인트 보안과 ESTsecurity EDR을 조합한 다층 방어 체계를 구축하여 기존 대비 35%의 위협 탐지율 향상을 달성했습니다.', thumbnailUrl: null, logoUrl: null, published: true, createdAt: '2025-09-10T00:00:00', updatedAt: '' },
  { id: 4, company: '아모레퍼시픽', industry: '제조', title: 'Adobe CC 전사 도입, 80% 라이선스 관리 시간 절감', content: 'Adobe Creative Cloud 기업용 라이선스를 전사 도입하고 중앙 배포 체계를 구축하여 라이선스 관리에 소요되는 시간을 80% 절감했습니다.', thumbnailUrl: null, logoUrl: null, published: true, createdAt: '2025-07-05T00:00:00', updatedAt: '' },
  { id: 5, company: '현대백화점', industry: '유통', title: 'Autodesk Flex 전환, 18% 비용 절감', content: '기존 고정 라이선스에서 Autodesk Flex 토큰 기반 유연 라이선스로 전환하여 실사용량 기반 비용 관리로 연간 18%의 비용을 절감했습니다.', thumbnailUrl: null, logoUrl: null, published: true, createdAt: '2025-05-20T00:00:00', updatedAt: '' },
  { id: 6, company: '대한항공', industry: '항공', title: 'Microsoft 365 전사 마이그레이션, 99.9% 가용성', content: '레거시 이메일 시스템에서 Microsoft 365로 전사 마이그레이션을 진행하여 99.9% 가용성을 달성하고 글로벌 협업 환경을 구축했습니다.', thumbnailUrl: null, logoUrl: null, published: true, createdAt: '2025-03-15T00:00:00', updatedAt: '' },
];

export default function CasesPage() {
  const [industry, setIndustry] = useState('전체');
  const [page, setPage] = useState(0);

  const { data: apiData, isLoading, error } = useApi(
    () => apiClient.getCustomerStories(
      industry === '전체' ? undefined : industry, page, 9,
    ),
    [industry, page],
  );

  const data = apiData || (error ? { content: FALLBACK_STORIES, totalPages: 1, first: true, last: true } : null);
  const stories = data?.content ?? ((!isLoading && !data) ? FALLBACK_STORIES : []);
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
      <section style={{
        position: 'relative', background: 'var(--soft)', overflow: 'hidden',
        borderBottom: '1px solid var(--line)',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 70%, rgba(148,53,67,.07) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', left: '8%', top: '20%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(245,51,63,.04) 0%, transparent 60%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', right: '-3%', bottom: '-10%',
          fontFamily: SERIF, fontStyle: 'italic',
          fontSize: 'clamp(120px, 20vw, 300px)', fontWeight: 300,
          color: 'rgba(255,255,255,.02)', lineHeight: .8, pointerEvents: 'none',
        }}>Stories</div>

        <div className="blob blob-accent" aria-hidden="true" style={{ width: 350, height: 350, right: '5%', top: '5%' }} />
        <div className="blob blob-graphite" aria-hidden="true" style={{ width: 250, height: 250, left: '8%', bottom: '5%', animationDelay: '6s' }} />

        <div className="wrap" style={{
          position: 'relative', zIndex: 1, padding: '120px clamp(20px,4vw,52px) 64px',
        }}>
          <p style={{
            fontFamily: MONO, fontWeight: 500, fontSize: 18, letterSpacing: '.14em',
            textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 12px',
          }}>CUSTOMER STORIES</p>
          <h1 style={{
            fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
            lineHeight: 1.05, letterSpacing: '-.04em', color: 'var(--ink)', margin: '0 0 8px',
          }}>고객사례</h1>
          <p style={{
            fontWeight: 400, fontSize: 18, color: 'var(--ink2)', margin: 0,
          }}>유니온시스템즈와 함께한 기업들의 성공 사례</p>
        </div>
        {/* Stats below hero */}
        <div className="wrap" style={{ position: 'relative', zIndex: 1, paddingBottom: 32 }}>
          <div style={{ display: 'flex', gap: 32, marginTop: 0 }}>
            {[
              { num: '200+', label: '도입 기업' },
              { num: '98%', label: '재계약률' },
            ].map(s => (
              <div key={s.label}>
                <span style={{
                  fontFamily: SERIF, fontStyle: 'italic',
                  fontSize: 28, fontWeight: 400, color: '#fff', lineHeight: 1,
                }}>{s.num}</span>
                <span style={{
                  fontFamily: MONO, fontSize: 18, letterSpacing: '.06em',
                  color: 'rgba(255,255,255,.3)', marginLeft: 8,
                }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Filter + Cards ═══ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0', position: 'relative', overflow: 'hidden' }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div className="blob blob-accent" aria-hidden="true" style={{ width: 280, height: 280, right: '-2%', top: '30%', animationDelay: '5s' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          {/* Industry filter */}
          <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 40 }}>
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                onClick={() => { setIndustry(ind); setPage(0); }}
                style={{
                  padding: '9px 18px',
                  fontFamily: MONO, fontSize: 18, fontWeight: 500, letterSpacing: '.04em',
                  color: industry === ind ? '#fff' : 'var(--ink2)',
                  background: industry === ind ? 'var(--charcoal)' : 'transparent',
                  border: industry === ind ? 'none' : '1px solid var(--line)',
                  cursor: 'pointer', transition: 'all .15s',
                }}
              >
                {ind}
              </button>
            ))}
          </div>

          {isLoading && (
            <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--ink2)', fontSize: 18 }}>로딩 중...</div>
          )}

          {filtered.length === 0 && !isLoading ? (
            <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--ink2)', fontSize: 18 }}>
              해당 산업군의 고객사례가 없습니다.
            </div>
          ) : filtered.length > 0 && (
            <div className="case-grid" style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
            }}>
              {filtered.map((story: CustomerStory, idx: number) => {
                const isDark = idx === 0;

                return (
                  <div
                    key={story.id}
                    className="reveal case-card"                    style={{
                      background: isDark ? 'var(--charcoal)' : 'var(--surface)',
                      border: isDark ? 'none' : '1px solid var(--line)',
                      padding: 0, overflow: 'hidden',
                      transition: 'transform .25s cubic-bezier(.16,.84,.3,1), box-shadow .25s',
                      transitionDelay: `${idx * 0.05}s`,
                      cursor: 'pointer',
                    }}
                  >
                    {/* Top — visual area */}
                    <div style={{
                      height: 160, position: 'relative', overflow: 'hidden',
                      background: isDark
                        ? 'radial-gradient(ellipse at 50% 80%, rgba(148,53,67,.1) 0%, var(--charcoal) 60%)'
                        : 'var(--soft)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {story.thumbnailUrl ? (
                        <img src={story.thumbnailUrl} alt={story.company} style={{
                          width: '100%', height: '100%', objectFit: 'cover',
                        }} />
                      ) : (
                        <span style={{
                          fontFamily: SERIF, fontStyle: 'italic',
                          fontSize: 56, fontWeight: 300,
                          color: isDark ? 'rgba(255,255,255,.06)' : 'var(--line)',
                        }}>
                          {story.company.charAt(0)}
                        </span>
                      )}

                      {/* Industry badge */}
                      <span style={{
                        position: 'absolute', top: 12, left: 12,
                        padding: '3px 10px',
                        fontFamily: MONO, fontSize: 18, fontWeight: 600, letterSpacing: '.06em',
                        background: isDark ? 'var(--accent)' : 'var(--charcoal)',
                        color: '#fff',
                      }}>{story.industry}</span>
                    </div>

                    {/* Bottom — text */}
                    <div style={{
                      padding: 24, position: 'relative',
                    }}>
                      {/* Bg number */}
                      <div aria-hidden="true" style={{
                        position: 'absolute', right: 4, bottom: -6,
                        fontFamily: SERIF, fontStyle: 'italic',
                        fontSize: 64, fontWeight: 300, lineHeight: 1,
                        color: isDark ? 'rgba(255,255,255,.04)' : 'rgba(20,18,16,.03)',
                        pointerEvents: 'none',
                      }}>{String(idx + 1).padStart(2, '0')}</div>

                      <h3 className="case-title" style={{
                        fontWeight: 800, fontSize: 18,
                        color: isDark ? '#fff' : 'var(--ink)',
                        margin: '0 0 6px', letterSpacing: '-.02em',
                        transition: 'color .2s',
                      }}>{story.company}</h3>
                      <p style={{
                        fontSize: 18, lineHeight: 1.6,
                        color: isDark ? 'rgba(255,255,255,.45)' : 'var(--ink2)',
                        margin: '0 0 16px',
                      }}>{story.title}</p>
                      <span className="case-arrow" style={{
                        fontFamily: MONO, fontSize: 18, fontWeight: 600,
                        color: isDark ? 'var(--accent)' : 'var(--ink2)',
                        letterSpacing: '.04em', opacity: 0, transition: 'opacity .2s',
                      }}>자세히 보기 →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center', gap: 4 }}>
              <button disabled={data.first} onClick={() => setPage(p => p - 1)} style={{
                padding: '10px 20px', fontFamily: MONO, fontSize: 18, fontWeight: 600,
                color: data.first ? 'var(--ink2)' : 'var(--ink)', background: 'transparent',
                border: '1px solid var(--line)', cursor: data.first ? 'default' : 'pointer',
                opacity: data.first ? 0.4 : 1,
              }}>PREV</button>
              {Array.from({ length: data.totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i)} style={{
                  width: 36, height: 36, fontSize: 18, fontWeight: 600,
                  color: page === i ? '#fff' : 'var(--ink2)',
                  background: page === i ? 'var(--charcoal)' : 'transparent',
                  border: page === i ? 'none' : '1px solid var(--line)', cursor: 'pointer',
                }}>{i + 1}</button>
              ))}
              <button disabled={data.last} onClick={() => setPage(p => p + 1)} style={{
                padding: '10px 20px', fontFamily: MONO, fontSize: 18, fontWeight: 600,
                color: data.last ? 'var(--ink2)' : 'var(--ink)', background: 'transparent',
                border: '1px solid var(--line)', cursor: data.last ? 'default' : 'pointer',
                opacity: data.last ? 0.4 : 1,
              }}>NEXT</button>
            </div>
          )}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{
        padding: 'clamp(56px, 8vw, 96px) 0',
        background: 'var(--charcoal)', position: 'relative', overflow: 'hidden',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 80%, rgba(148,53,67,.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 600 }}>
          <div className="reveal" style={{
            fontFamily: SERIF, fontStyle: 'italic',
            fontSize: 48, fontWeight: 300, color: 'var(--accent)',
            lineHeight: 1, marginBottom: 16, opacity: .35,
          }}>&ldquo;</div>
          <h2 className="reveal" style={{
            fontFamily: SERIF, fontStyle: 'italic',
            fontWeight: 400, fontSize: 'clamp(26px, 3.5vw, 40px)',
            lineHeight: 1.35, color: '#fff', margin: '0 0 12px',
          }}>
            다음 성공 사례의<br />주인공이 되세요.
          </h2>
          <p className="reveal" style={{
            fontSize: 18, color: 'rgba(255,255,255,.45)', margin: '0 0 28px',
          }}>유니온시스템즈와 함께 IT 환경을 혁신하세요.</p>
          <Link href="/contact" className="reveal btn" style={{
            display: 'inline-block', padding: '16px 36px',
            background: 'var(--accent)', color: '#fff',
            fontWeight: 700, fontSize: 18, textDecoration: 'none',
          }}>도입 문의하기 →</Link>
        </div>
      </section>

      <style>{`
        .case-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px rgba(0,0,0,.08) !important; }
        .case-card:hover .case-title { color: var(--accent) !important; }
        .case-card:hover .case-arrow { opacity: 1 !important; }
        @media (max-width: 920px) { .case-grid { grid-template-columns: 1fr 1fr !important; } .case-hero-img { display: none !important; } }
        @media (max-width: 560px) { .case-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
