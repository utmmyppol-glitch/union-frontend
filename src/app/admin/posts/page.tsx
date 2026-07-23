'use client';

import React, { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CATS = [
  { key: 'NOTICE', label: '공지사항' },
  { key: 'INSIGHT', label: '인사이트' },
  { key: 'EVENT', label: '이벤트' },
];

interface Post {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  published: boolean;
  viewCount: number;
  createdAt: string;
}

export default function PostsPage() {
  const [tab, setTab] = useState('NOTICE');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', category: 'NOTICE', published: true });

  const fetchPosts = async (category: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/posts?category=${category}&size=50`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.content || []);
      }
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(tab); }, [tab]);

  const handleSave = async () => {
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API}/posts/${editId}` : `${API}/posts`;
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, category: tab }),
      });
      setShowForm(false);
      setEditId(null);
      setForm({ title: '', content: '', excerpt: '', category: tab, published: true });
      fetchPosts(tab);
    } catch {
      alert('저장 실패 — 백엔드 서버를 확인해주세요.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await fetch(`${API}/posts/${id}`, { method: 'DELETE' });
      fetchPosts(tab);
    } catch {
      alert('삭제 실패');
    }
  };

  const startEdit = (p: Post) => {
    setEditId(p.id);
    setForm({ title: p.title, content: '', excerpt: p.excerpt, category: p.category, published: p.published });
    setShowForm(true);
  };

  const startCreate = () => {
    setEditId(null);
    setForm({ title: '', content: '', excerpt: '', category: tab, published: true });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">게시글 관리</h1>
        <button onClick={startCreate} className="px-4 py-2 rounded-lg bg-[#00A4EF] text-white text-sm font-bold hover:bg-[#00A4EF]/90">
          + 새 글 작성
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-800">
        {CATS.map((c) => (
          <button
            key={c.key}
            onClick={() => setTab(c.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === c.key ? 'border-[#00A4EF] text-[#00A4EF]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-[#1C1C1F] rounded-xl border border-gray-200 dark:border-gray-800 p-5 mb-6">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
            {editId ? '글 수정' : '새 글 작성'}
          </h2>
          <div className="space-y-3">
            <input
              placeholder="제목"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#141416] text-sm text-gray-900 dark:text-white outline-none"
            />
            <input
              placeholder="요약 (excerpt)"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#141416] text-sm text-gray-900 dark:text-white outline-none"
            />
            <textarea
              placeholder="본문"
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#141416] text-sm text-gray-900 dark:text-white outline-none resize-none"
            />
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              공개
            </label>
            <div className="flex gap-2">
              <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-[#00A4EF] text-white text-sm font-bold">저장</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">취소</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p className="text-gray-400 text-sm">로딩 중...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-400 text-sm py-10 text-center">등록된 게시글이 없습니다.</p>
      ) : (
        <div className="bg-white dark:bg-[#1C1C1F] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#141416]">
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold w-12">ID</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">제목</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold w-20">상태</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold w-16">조회</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold w-28">작업</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="px-4 py-3 text-gray-400">{p.id}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{p.title}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.published ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-gray-100 text-gray-500'}`}>
                      {p.published ? '공개' : '비공개'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{p.viewCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(p)} className="text-xs text-[#00A4EF] hover:underline">수정</button>
                      <button onClick={() => handleDelete(p.id)} className="text-xs text-red-500 hover:underline">삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
