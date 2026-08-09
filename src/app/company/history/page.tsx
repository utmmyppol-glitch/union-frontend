import HistoryPageClient from "./HistoryPageClient";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '연혁',
  description: '유니온시스템즈의 설립부터 현재까지의 성장 과정을 연도별로 확인하세요.',
  openGraph: {
    title: '연혁 | 유니온시스템즈',
    description: '유니온시스템즈의 설립부터 현재까지의 성장 과정을 연도별로 확인하세요.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['history_hero', 'history_items', 'history_cta'];

async function getContent(): Promise<Record<string, string>> {
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

interface HistoryEntity {
  id: number; year: string; title: string; events: string; sortOrder: number; isActive: boolean;
}

async function getHistoryItems(): Promise<{ year: string; title: string; events: string[] }[] | null> {
  try {
    const base = API_URL.replace(/\/api\/union\/?$/, '');
    const res = await fetch(`${base}/api/union/history`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const items: HistoryEntity[] = await res.json();
    if (!items.length) return null;
    return items.map(h => ({
      year: h.year,
      title: h.title,
      events: (() => { try { return JSON.parse(h.events || '[]'); } catch { return []; } })(),
    }));
  } catch {
    return null;
  }
}

export default async function HistoryPage() {
  const [content, dbItems] = await Promise.all([getContent(), getHistoryItems()]);
  const ssrContent = { ...content };
  if (dbItems) {
    ssrContent.history_items = JSON.stringify(dbItems);
  }
  return <HistoryPageClient ssrContent={ssrContent} />;
}
