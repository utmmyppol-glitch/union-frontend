import CalculatorPageClient from './CalculatorPageClient';
import type { Metadata } from 'next';
import { USE_MOCK, MOCK_CONTENT } from '@/lib/mock';

export const metadata: Metadata = {
  title: '라이선스 계산기',
  description: 'Microsoft 365, Adobe 등 소프트웨어 라이선스 비용을 간편하게 계산해 보세요.',
  openGraph: {
    title: '라이선스 계산기 | 유니온시스템즈',
    description: '소프트웨어 라이선스 비용 간편 계산.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['calculator_hero', 'calculator_cta'];

async function getContent(): Promise<Record<string, string>> {
  if (USE_MOCK) return MOCK_CONTENT;
  try {
    const base = API_URL.replace(/\/api\/union\/?$/, '');
    const res = await fetch(`${base}/api/union/content?keys=${CONTENT_KEYS.join(',')}`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    return res.json();
  } catch { return {}; }
}

export default async function Page() {
  const content = await getContent();
  return <CalculatorPageClient ssrContent={content} />;
}
