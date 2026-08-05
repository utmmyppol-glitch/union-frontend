import SolutionDiagnostic from '@/features/diagnostic/SolutionDiagnostic';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3분 진단',
  description: '3가지 질문에 답하면 우리 회사에 맞는 IT 솔루션을 추천해드립니다.',
  openGraph: {
    title: '3분 진단 | 유니온시스템즈',
    description: '3가지 질문으로 맞춤 IT 솔루션 추천.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['diagnostic_steps', 'diagnostic_solutions'];

async function getContent(): Promise<Record<string, string>> {
  try {
    const base = API_URL.replace(/\/api\/union\/?$/, '');
    const res = await fetch(`${base}/api/union/content?keys=${CONTENT_KEYS.join(',')}`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    return res.json();
  } catch { return {}; }
}

export default async function Page() {
  const content = await getContent();
  return <SolutionDiagnostic ssrContent={content} />;
}
