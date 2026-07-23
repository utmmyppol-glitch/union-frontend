'use client';

import React, { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';

interface Banner {
  id: number;
  title: string;
  imageUrl: string | null;
  linkUrl: string | null;
  position: 'HERO' | 'POPUP' | 'PROMOTION';
  isActive: boolean;
  sortOrder: number;
}

const POS_LABEL = { HERO: '히어로', POPUP: '팝업', PROMOTION: '프로모션' };

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', imageUrl: '', linkUrl: '', position: 'HERO' as Banner['position'], isActive: true, sortOrder: 0 });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/banners`);
      if (res.ok) setBanners(await res.json());
    } catch { setBanners([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleSave = async () => {
    try {
      await fetch(`${API}/banners`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      setShowForm(false);
      fetchBanners();
    } catch { alert('저장 실패'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return;
    try { await fetch(`${API}/banners/${id}`, { method: 'DELETE' }); fetchBanners(); } catch { alert('삭제 실패'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">배너 관리</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-lg bg-[#00A4EF] text-white text-sm font-bold">+ 배너 등록</button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-[#1C1C1F] rounded-xl border border-gray-200 dark:border-gray-800 p-5 mb-6 space-y-3">
          <input placeholder="배너 제목" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#141416] text-sm outline-none text-gray-900 dark:text-white" />
          <input placeholder="이미지 URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#141416] text-sm outline-none text-gray-900 dark:text-white" />
          <input placeholder="링크 URL" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#141416] text-sm outline-none text-gray-900 dark:text-white" />
          <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value as Banner['position'] })}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#141416] text-sm text-gray-900 dark:text-white">
            <option value="HERO">히어로</option><option value="POPUP">팝업</option><option value="PROMOTION">프로모션</option>
          </select>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-[#00A4EF] text-white text-sm font-bold">저장</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600">취소</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-gray-400 text-sm">로딩 중...</p> : banners.length === 0 ? (
        <p className="text-gray-400 text-sm py-10 text-center">등록된 배너가 없습니다.</p>
      ) : (
        <div className="grid gap-3">
          {banners.map((b) => (
            <div key={b.id} className="bg-white dark:bg-[#1C1C1F] rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{b.title}</span>
                <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">{POS_LABEL[b.position]}</span>
                {!b.isActive && <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">비활성</span>}
              </div>
              <button onClick={() => handleDelete(b.id)} className="text-xs text-red-500 hover:underline">삭제</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
