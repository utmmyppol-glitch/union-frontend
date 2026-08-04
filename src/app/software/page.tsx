import SoftwarePageClient from './SoftwarePageClient';
import type { Metadata } from 'next';
import { USE_MOCK, MOCK_CONTENT } from '@/lib/mock';

export const metadata: Metadata = {
  title: '소프트웨어',
  description: 'Microsoft, Adobe, Autodesk, 이스트소프트 등 주요 소프트웨어 라이선스 구매 및 컨설팅 서비스.',
  openGraph: {
    title: '소프트웨어 | 유니온시스템즈',
    description: 'Microsoft, Adobe, Autodesk 등 주요 소프트웨어 라이선스 구매 및 컨설팅.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['software_hero', 'software_process', 'software_stats', 'software_cta'];

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
  return <SoftwarePageClient ssrContent={content} />;
}
