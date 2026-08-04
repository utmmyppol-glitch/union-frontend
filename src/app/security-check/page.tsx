import SecurityCheckPageClient from './SecurityCheckPageClient';
import type { Metadata } from 'next';
import { USE_MOCK, MOCK_CONTENT } from '@/lib/mock';

export const metadata: Metadata = {
  title: '보안 점검',
  description: '기업 IT 보안 현황을 간단한 체크리스트로 점검하고 맞춤 솔루션을 제안받으세요.',
  openGraph: {
    title: '보안 점검 | 유니온시스템즈',
    description: '기업 IT 보안 현황 점검 및 맞춤 솔루션 제안.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['securitycheck_hero', 'securitycheck_result'];

async function getContent(): Promise<Record<string, string>> {
  if (USE_MOCK) return MOCK_CONTENT;
  try {
    const base = API_URL.replace(/\/api\/union\/?$/, '');
    const res = await fetch(
      `${base}/api/union/content?keys=${CONTENT_KEYS.join(',')}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

export default async function Page() {
  const content = await getContent();
  return <SecurityCheckPageClient ssrContent={content} />;
}
