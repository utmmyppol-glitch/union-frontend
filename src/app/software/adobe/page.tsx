import AdobePageClient from './AdobePageClient';
import type { Metadata } from 'next';
import { USE_MOCK, MOCK_CONTENT } from '@/lib/mock';

export const metadata: Metadata = {
  title: 'Adobe Creative Cloud',
  description: 'Adobe Creative Cloud 라이선스 구매, VIP 프로그램 안내. 기업 맞춤 플랜으로 비용을 절감하세요.',
  openGraph: {
    title: 'Adobe Creative Cloud | 유니온시스템즈',
    description: 'Adobe Creative Cloud 라이선스 구매 및 VIP 프로그램 안내.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['adobe_hero', 'adobe_strengths', 'adobe_cta'];

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
  return <AdobePageClient ssrContent={content} />;
}
