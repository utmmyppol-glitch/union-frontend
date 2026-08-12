import LocationPageClient from './LocationPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '오시는 길',
  description: '유니온시스템즈 본사 위치 및 교통편 안내. 지하철, 버스, 주차장 정보를 확인하세요.',
  openGraph: {
    title: '오시는 길 | 유니온시스템즈',
    description: '유니온시스템즈 본사 위치 및 교통편 안내.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/union';
const CONTENT_KEYS = ['location_hero','location_address','location_contact','location_subway','location_bus','location_parking','location_cta','location_sections','location_buttons'];

async function getLocationContent(): Promise<Record<string, string>> {
  try {
    const base = API_URL.replace(/\/api\/union\/?$/, '');
    const res = await fetch(
      `${base}/api/union/content?keys=${CONTENT_KEYS.join(',')}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

export default async function LocationPage() {
  const content = await getLocationContent();
  return <LocationPageClient ssrContent={content} />;
}
