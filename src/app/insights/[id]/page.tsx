import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import InsightDetailClient from './InsightDetailClient';
import type { Insight, Page } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';

type InsightPage = Pick<Page<Insight>, 'content' | 'totalPages'>;

async function getAllInsights(): Promise<Insight[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/insights?page=0&size=100`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error();
    const data: InsightPage = await res.json();
    return data.content ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const insights = await getAllInsights();
  const item = insights.find((i) => String(i.id) === params.id);
  if (!item) return { title: '인사이트를 찾을 수 없습니다' };
  return {
    title: `${item.title} | 인사이트`,
    description: item.summary || item.title,
    openGraph: {
      title: item.title,
      description: item.summary || item.title,
      type: 'article',
      ...(item.thumbnailUrl ? { images: [{ url: item.thumbnailUrl }] } : {}),
    },
  };
}

export default async function InsightDetailPage({ params }: { params: { id: string } }) {
  const insights = await getAllInsights();
  const item = insights.find((i) => String(i.id) === params.id);
  if (!item) notFound();

  const related = insights
    .filter((i) => i.id !== item.id)
    .slice(0, 4);

  return <InsightDetailClient item={item} related={related} />;
}
