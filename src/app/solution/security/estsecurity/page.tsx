import EstsecurityPageClient from './EstsecurityPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이스트시큐리티',
  description: '알약, 쓰렛인사이드 등 이스트시큐리티 보안 솔루션. 랜섬웨어·악성코드 탐지 및 대응.',
  openGraph: {
    title: '이스트시큐리티 | 유니온시스템즈',
    description: '알약, 쓰렛인사이드 등 이스트시큐리티 보안 솔루션.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['estsecurity_hero', 'estsecurity_products', 'estsecurity_points', 'estsecurity_features', 'estsecurity_cta', 'estsecurity_sections'];

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
  return <EstsecurityPageClient ssrContent={content} />;
}
