import MicrosoftPageClient from './MicrosoftPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Microsoft 365 · Azure',
  description: 'Microsoft 365, Azure 클라우드 도입부터 운영까지. CSP 파트너 유니온시스템즈의 전문 컨설팅.',
  openGraph: {
    title: 'Microsoft 365 · Azure | 유니온시스템즈',
    description: 'Microsoft 365, Azure 클라우드 도입부터 운영까지.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/union';
const CONTENT_KEYS = ['microsoft_hero', 'microsoft_strengths', 'microsoft_sections', 'microsoft_accents', 'microsoft_products', 'microsoft_plans', 'microsoft_buttons', 'microsoft_cta', 'microsoft_trust'];

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

export default async function Page() {
  const content = await getContent();
  return <MicrosoftPageClient ssrContent={content} />;
}
