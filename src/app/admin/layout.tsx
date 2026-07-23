'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { label: '대시보드', href: '/admin/dashboard', icon: '📊' },
  { label: '게시글 관리', href: '/admin/posts', icon: '📝' },
  { label: '문의 관리', href: '/admin/inquiries', icon: '📩' },

  { label: '고객사례', href: '/admin/stories', icon: '🏢' },
  { label: '배너 관리', href: '/admin/banners', icon: '🖼️' },
  { label: '다운로드 관리', href: '/admin/downloads', icon: '📥' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const u = localStorage.getItem('admin_user');
    if (!u && pathname !== '/admin') {
      router.replace('/admin');
    } else {
      setUser(u);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    router.replace('/admin');
  };

  // Login page — no sidebar
  if (pathname === '/admin') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#141416]">
      {/* Sidebar */}
      <aside className="w-56 bg-white dark:bg-[#1C1C1F] border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <Link href="/" className="text-sm font-bold text-[#00A4EF]">
            UNION SYSTEMS
          </Link>
          <p className="text-[10px] text-gray-400 mt-1">관리자 백오피스</p>
        </div>

        <nav className="flex-1 p-2">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors ${
                  active
                    ? 'bg-[#00A4EF]/10 text-[#00A4EF]'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{user}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-red-500 hover:underline"
            >
              로그아웃
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
