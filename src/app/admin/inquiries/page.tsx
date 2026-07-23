'use client';

import React, { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';

interface Inquiry {
  id: number;
  name: string;
  company: string;
  phone: string;
  email: string;
  product: string;
  status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
}

const STATUS_MAP = {
  NEW: { label: '신규', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' },
  IN_PROGRESS: { label: '진행중', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400' },
  COMPLETED: { label: '완료', color: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' },
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/inquiries?size=50`);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.content || []);
      }
    } catch {
      // 샘플 데이터
      setInquiries([
        { id: 1, name: '김철수', company: '테스트기업', phone: '02-123-4567', email: 'test@test.com', product: 'Microsoft 365', status: 'NEW', createdAt: '2026-07-05T10:00:00' },
        { id: 2, name: '이영희', company: '샘플주식회사', phone: '010-1234-5678', email: 'sample@company.com', product: '보안 솔루션', status: 'IN_PROGRESS', createdAt: '2026-07-03T14:00:00' },
        { id: 3, name: '박민수', company: '굿컴퍼니', phone: '02-987-6543', email: 'good@company.kr', product: 'DA#, NetClient', status: 'COMPLETED', createdAt: '2026-06-28T09:00:00' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInquiries(); }, []);

  const changeStatus = async (id: number, status: string) => {
    try {
      await fetch(`${API}/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchInquiries();
    } catch {
      // 로컬 업데이트
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: status as Inquiry['status'] } : i))
      );
    }
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,'0')}.${String(date.getDate()).padStart(2,'0')}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">도입문의 관리</h1>

      {loading ? (
        <p className="text-gray-400 text-sm">로딩 중...</p>
      ) : inquiries.length === 0 ? (
        <p className="text-gray-400 text-sm py-10 text-center">접수된 문의가 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => {
            const s = STATUS_MAP[inq.status];
            return (
              <div key={inq.id} className="bg-white dark:bg-[#1C1C1F] rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{inq.company}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${s.color}`}>{s.label}</span>
                    </div>
                    <p className="text-xs text-gray-500">{inq.name} · {inq.phone} · {inq.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(inq.createdAt)}</span>
                </div>

                {inq.product && (
                  <p className="text-xs text-gray-500 mb-3">관심 제품: <span className="text-gray-700 dark:text-gray-300">{inq.product}</span></p>
                )}

                <div className="flex gap-2">
                  {(['NEW', 'IN_PROGRESS', 'COMPLETED'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => changeStatus(inq.id, st)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        inq.status === st
                          ? 'bg-[#00A4EF] text-white border-[#00A4EF]'
                          : 'border-gray-300 dark:border-gray-700 text-gray-500 hover:border-[#00A4EF] hover:text-[#00A4EF]'
                      }`}
                    >
                      {STATUS_MAP[st].label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
