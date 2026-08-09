import HomePageClient from './HomePageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IT 인프라 전문 파트너',
  description: '소프트웨어 유통, 보안 솔루션, IT 자산관리, 데이터 분석까지 — 기업 IT 환경을 하나로 연결하는 유니온시스템즈.',
  openGraph: {
    title: 'IT 인프라 전문 파트너 | 유니온시스템즈',
    description: '소프트웨어 유통, 보안 솔루션, IT 자산관리, 데이터 분석까지 — 기업 IT 환경을 하나로 연결하는 유니온시스템즈.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['home_stats', 'home_stats_items', 'home_cta', 'home_cta_mini_stats', 'home_video'];

async function getContent(): Promise<Record<string, string>> {
  try {
    const base = API_URL.replace(/\/api\/union\/?$/, '');
    const res = await fetch(`${base}/api/union/content?keys=${CONTENT_KEYS.join(',')}`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    return res.json();
  } catch { return {}; }
}

async function getInsights() {
  try {
    const res = await fetch(`${API_URL}/insights?page=0&size=3`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.content ?? [];
  } catch { return []; }
}

export default async function Page() {
  const [content, insights] = await Promise.all([getContent(), getInsights()]);
  return <HomePageClient ssrContent={content} ssrInsights={insights} />;
}
