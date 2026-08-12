import InquiryPageClient from './InquiryPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '문의하기',
  description: '소프트웨어, 보안, IT 자산관리 관련 견적 및 기술 상담을 요청하세요.',
  openGraph: {
    title: '문의하기 | 유니온시스템즈',
    description: '소프트웨어, 보안, IT 자산관리 관련 견적 및 기술 상담 요청.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/union';
const CONTENT_KEYS = ['inquiry_hero', 'inquiry_contact'];

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
  return <InquiryPageClient ssrContent={content} />;
}
