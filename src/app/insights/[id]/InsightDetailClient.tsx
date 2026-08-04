'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { Container } from '@/components/ui';

interface PostData {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  thumbnailUrl?: string | null;
  viewCount: number;
  createdAt: string;
}

export default function InsightDetailClient({ post }: { post: PostData | null }) {
  const router = useRouter();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <section style={{ padding: '120px 0 clamp(48px, 7vw, 80px)', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <Container size="md">
          <button onClick={() => router.back()} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 600, color: 'var(--ink2)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 32, padding: 0, transition: 'color .2s' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            목록으로 돌아가기
          </button>

          {!post && (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <p style={{ color: 'var(--accent)', marginBottom: 16 }}>게시글을 불러올 수 없습니다.</p>
              <button onClick={() => router.push('/insights')} style={{ padding: '10px 24px', border: '1px solid var(--line)', background: 'transparent', fontWeight: 600, fontSize: 18, color: 'var(--ink)', cursor: 'pointer' }}>목록으로 이동</button>
            </div>
          )}

          {post && (
            <article>
              <header style={{ marginBottom: 40 }}>
                <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontWeight: 500, fontSize: 18, letterSpacing: '.14em', textTransform: 'uppercase' as const, color: 'var(--ink2)' }}>인사이트</span>
                <h1 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)', lineHeight: 1.15, letterSpacing: '-.04em', color: 'var(--ink)', marginTop: 12, marginBottom: 16 }}>{post.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 18, color: 'var(--ink2)' }}>
                  <span>{formatDate(post.createdAt)}</span>
                  <span style={{ width: 3, height: 3, background: 'var(--line)' }} />
                  <span>조회 {post.viewCount}</span>
                </div>
              </header>

              {post.thumbnailUrl && (
                <div style={{ marginBottom: 40, overflow: 'hidden' }}>
                  <img src={post.thumbnailUrl} alt={post.title} loading="lazy" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              )}

              <div className="prose prose-neutral max-w-none" style={{ color: 'var(--ink)' }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />

              <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <button onClick={() => router.push('/insights')} style={{ padding: '12px 24px', border: '1px solid var(--line)', background: 'transparent', fontWeight: 600, fontSize: 18, color: 'var(--ink)', cursor: 'pointer' }}>목록으로 돌아가기</button>
                <Link href="/contact" style={{ padding: '12px 24px', background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 18, textDecoration: 'none' }}>도입문의 하기</Link>
              </div>
            </article>
          )}
        </Container>
      </section>
    </div>
  );
}
