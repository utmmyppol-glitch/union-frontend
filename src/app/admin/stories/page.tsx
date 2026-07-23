'use client';

import React, { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';

interface Story {
  id: number;
  company: string;
  industry: string;
  title: string;
  published: boolean;
  createdAt: string;
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ company: '', industry: '', title: '', content: '', published: true });

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/customer-stories?size=50`);
      if (res.ok) {
        const data = await res.json();
        setStories(data.content || []);
      }
    } catch {
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStories(); }, []);

  const handleSave = async () => {
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API}/customer-stories/${editId}` : `${API}/customer-stories`;
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setShowForm(false);
      setEditId(null);
      setForm({ company: '', industry: '', title: '', content: '', published: true });
      fetchStories();
    } catch {
      alert('저장 실패 — 백엔드 서버를 확인해주세요.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await fetch(`${API}/customer-stories/${id}`, { method: 'DELETE' });
      fetchStories();
    } catch {
      alert('삭제 실패');
    }
  };

  const startCreate = () => {
    setEditId(null);
    setForm({ company: '', industry: '', title: '', content: '', published: true });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">고객사례 관리</h1>
        <button onClick={startCreate} className="px-4 py-2 rounded-lg bg-[#00A4EF] text-white text-sm font-bold hover:bg-[#00A4EF]/90">
          + 사례 등록
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-[#1C1C1F] rounded-xl border border-gray-200 dark:border-gray-800 p-5 mb-6">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
            {editId ? '사례 수정' : '새 사례 등록'}
          </h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="기업명" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#141416] text-sm text-gray-900 dark:text-white outline-none" />
              <input placeholder="업종 (유통/금융/공공/제조/서비스)" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#141416] text-sm text-gray-900 dark:text-white outline-none" />
            </div>
            <input placeholder="제목" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#141416] text-sm text-gray-900 dark:text-white outline-none" />
            <textarea placeholder="사례 내용" rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#141416] text-sm text-gray-900 dark:text-white outline-none resize-none" />
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

      {loading ? (
        <p className="text-gray-400 text-sm">로딩 중...</p>
      ) : stories.length === 0 ? (
        <p className="text-gray-400 text-sm py-10 text-center">등록된 고객사례가 없습니다.</p>
      ) : (
        <div className="grid gap-3">
          {stories.map((s) => (
            <div key={s.id} className="bg-white dark:bg-[#1C1C1F] rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{s.company}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">{s.industry}</span>
                  {!s.published && <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">비공개</span>}
                </div>
                <p className="text-xs text-gray-500">{s.title}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleDelete(s.id)} className="text-xs text-red-500 hover:underline">삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
