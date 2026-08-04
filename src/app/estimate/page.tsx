import EstimatePageClient from './EstimatePageClient';
import type { Metadata } from 'next';
import { USE_MOCK, MOCK_CONTENT } from '@/lib/mock';

export const metadata: Metadata = {
  title: '견적 요청',
  description: '소프트웨어 라이선스, IT 솔루션 도입을 위한 맞춤 견적을 요청하세요.',
  openGraph: {
    title: '견적 요청 | 유니온시스템즈',
    description: '소프트웨어 라이선스, IT 솔루션 맞춤 견적 요청.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['estimate_hero', 'estimate_sample', 'estimate_configs', 'estimate_cta'];

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
  return <EstimatePageClient ssrContent={content} />;
}
