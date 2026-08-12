import NetclientPageClient from './NetclientPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NetClient',
  description: 'NetClient IT 자산관리 솔루션. 하드웨어·소프트웨어 자산 현황 파악부터 라이선스 관리까지.',
  openGraph: {
    title: 'NetClient IT 자산관리 | 유니온시스템즈',
    description: 'NetClient IT 자산관리 솔루션.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/union';
const CONTENT_KEYS = ['netclient_hero', 'netclient_modules', 'netclient_points', 'netclient_icons', 'netclient_cta', 'netclient_sections'];

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
  return <NetclientPageClient ssrContent={content} />;
}
