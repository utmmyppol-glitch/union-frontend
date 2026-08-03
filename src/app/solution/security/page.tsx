import SecurityPageClient from './SecurityPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '보안 솔루션',
  description: '안랩, 이스트시큐리티 등 검증된 보안 솔루션으로 기업 보안 위협에 대응하세요.',
  openGraph: {
    title: '보안 솔루션 | 유니온시스템즈',
    description: '안랩, 이스트시큐리티 등 검증된 보안 솔루션으로 기업 보안 위협에 대응.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['security_hero', 'security_products', 'security_cta'];

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
  return <SecurityPageClient ssrContent={content} />;
}
