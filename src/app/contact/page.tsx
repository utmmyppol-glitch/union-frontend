import ContactPageClient from './ContactPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '문의·상담',
  description: '유니온시스템즈에 소프트웨어 구매, 보안 솔루션, IT 컨설팅 관련 문의를 남겨주세요.',
  openGraph: {
    title: '문의·상담 | 유니온시스템즈',
    description: '소프트웨어 구매, 보안 솔루션, IT 컨설팅 관련 문의.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/union';
const CONTENT_KEYS = ['contact_hero', 'contact_benefits'];

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
  return <ContactPageClient ssrContent={content} />;
}
