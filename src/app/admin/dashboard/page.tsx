'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';

interface Stats {
  posts: number;
  inquiries: number;
  stories: number;
  newInquiries: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ posts: 0, inquiries: 0, stories: 0, newInquiries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [posts, inquiries, stories] = await Promise.all([
          fetch(`${API}/posts?size=1`).then(r => r.ok ? r.json() : null),
          fetch(`${API}/inquiries?size=1`).then(r => r.ok ? r.json() : null),
          fetch(`${API}/customer-stories?size=1`).then(r => r.ok ? r.json() : null),
        ]);
        setStats({
          posts: posts?.totalElements ?? 0,
          inquiries: inquiries?.totalElements ?? 0,
          stories: stories?.totalElements ?? 0,
          newInquiries: 0,
        });
      } catch {
        // 백엔드 미실행 시 샘플 데이터
        setStats({ posts: 20, inquiries: 8, stories: 6, newInquiries: 3 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: '전체 게시글', value: stats.posts, color: 'bg-[#00A4EF]', href: '/admin/posts', icon: '📝' },
    { label: '도입문의', value: stats.inquiries, color: 'bg-[#00A4EF]', href: '/admin/inquiries', icon: '📩' },
    { label: '고객사례', value: stats.stories, color: 'bg-[#7C3AED]', href: '/admin/stories', icon: '🏢' },
    { label: '신규 문의', value: stats.newInquiries, color: 'bg-[#059669]', href: '/admin/inquiries', icon: '🔔' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">대시보드</h1>

      {loading ? (
        <div className="text-gray-400">로딩 중...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="bg-white dark:bg-[#1C1C1F] rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{c.icon}</span>
                  <span className={`w-2 h-2 rounded-full ${c.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{c.value}</p>
                <p className="text-xs text-gray-500 mt-1">{c.label}</p>
              </Link>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* 빠른 작업 */}
            <div className="bg-white dark:bg-[#1C1C1F] rounded-xl border border-gray-200 dark:border-gray-800 p-5">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">빠른 작업</h2>
              <div className="space-y-2">
                {[
                  { label: '공지사항 작성', href: '/admin/posts?action=create&category=NOTICE' },
                  { label: '인사이트 작성', href: '/admin/posts?action=create&category=INSIGHT' },
                  { label: '이벤트 등록', href: '/admin/posts?action=create&category=EVENT' },
                  { label: '고객사례 등록', href: '/admin/stories?action=create' },
                ].map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-sm text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    {a.label}
                    <span className="text-gray-400">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 사이트 링크 */}
            <div className="bg-white dark:bg-[#1C1C1F] rounded-xl border border-gray-200 dark:border-gray-800 p-5">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">사이트 바로가기</h2>
              <div className="space-y-2">
                {[
                  { label: '메인 페이지', href: '/' },
                  { label: '공지사항', href: '/support/notices' },
                  { label: '이벤트', href: '/support/events' },
                  { label: '도입문의', href: '/contact' },
                ].map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    target="_blank"
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-sm text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    {a.label}
                    <span className="text-gray-400 text-xs">↗</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
