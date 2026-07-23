'use client';

import React, { useState } from 'react';

interface Download {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  fileType: string;
  createdAt: string;
}

export default function DownloadsPage() {
  // 백엔드 미연결 시 샘플 데이터
  const [downloads] = useState<Download[]>([
    { id: 1, name: '김철수', company: '테스트기업', email: 'test@test.com', phone: '02-123-4567', fileType: '회사소개서', createdAt: '2026-07-05T10:00:00' },
    { id: 2, name: '이영희', company: '샘플주식회사', email: 'sample@co.com', phone: '010-1234-5678', fileType: '회사소개서', createdAt: '2026-07-03T14:00:00' },
    { id: 3, name: '박민수', company: '굿컴퍼니', email: 'good@co.kr', phone: '02-987-6543', fileType: 'DA# 소개서', createdAt: '2026-06-28T09:00:00' },
  ]);

  const exportCSV = () => {
    const header = 'ID,이름,회사,이메일,연락처,파일,신청일\n';
    const rows = downloads.map((d) =>
      `${d.id},${d.name},${d.company},${d.email},${d.phone},${d.fileType},${d.createdAt.split('T')[0]}`
    ).join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `다운로드신청_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,'0')}.${String(date.getDate()).padStart(2,'0')}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">다운로드 신청 관리</h1>
        <button onClick={exportCSV} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">
          📥 엑셀(CSV) 내보내기
        </button>
      </div>

      <div className="bg-white dark:bg-[#1C1C1F] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#141416]">
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">이름</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">회사</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">이메일</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">파일</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">신청일</th>
            </tr>
          </thead>
          <tbody>
            {downloads.map((d) => (
              <tr key={d.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{d.name}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{d.company}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{d.email}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">{d.fileType}</span></td>
                <td className="px-4 py-3 text-gray-400">{formatDate(d.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
