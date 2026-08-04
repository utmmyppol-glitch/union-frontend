import TechPageClient from './TechPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '기술지원',
  description: '소프트웨어 설치, 장애 대응, 원격 지원 등 유니온시스템즈 기술지원 서비스 안내.',
  openGraph: {
    title: '기술지원 | 유니온시스템즈',
    description: '소프트웨어 설치, 장애 대응, 원격 지원 등 기술지원 서비스.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['tech_hero', 'tech_services', 'tech_process', 'tech_team', 'tech_da_team', 'tech_faq', 'tech_mid', 'tech_cta', 'tech_contact'];

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
  return <TechPageClient ssrContent={content} />;
}
