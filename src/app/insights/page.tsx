import { Metadata } from 'next';
import InsightsPageClient from './InsightsPageClient';
import { USE_MOCK, MOCK_INSIGHTS, MOCK_CONTENT } from '@/lib/mock';

export const metadata: Metadata = {
  title: '인사이트',
  description: 'IT 인프라, 보안, 클라우드, 데이터 분석 등 담당자를 위한 최신 트렌드와 업계 뉴스',
  openGraph: {
    title: '인사이트 | 유니온시스템즈',
    description: 'IT 인프라, 보안, 클라우드, 데이터 분석 등 담당자를 위한 최신 트렌드와 업계 뉴스',
  },
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['insights_hero_title', 'insights_hero_desc'];

async function getInsights() {
  if (USE_MOCK) return { content: MOCK_INSIGHTS, totalPages: 1, first: true, last: true };
  try {
    const res = await fetch(`${API_BASE_URL}/insights?page=0&size=12`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { content: MOCK_INSIGHTS, totalPages: 1, first: true, last: true };
  }
}

async function getContent(): Promise<Record<string, string>> {
  if (USE_MOCK) return MOCK_CONTENT;
  try {
    const base = API_BASE_URL.replace(/\/api\/union\/?$/, '');
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

export default async function InsightsPage() {
  const [data, ssrContent] = await Promise.all([getInsights(), getContent()]);
  return <InsightsPageClient initialData={data} ssrContent={ssrContent} />;
}
