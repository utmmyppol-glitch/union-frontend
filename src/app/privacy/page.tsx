import PrivacyPageClient from './PrivacyPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '유니온시스템즈 개인정보처리방침. 개인정보의 수집·이용·보관·파기에 관한 안내.',
  openGraph: {
    title: '개인정보처리방침 | 유니온시스템즈',
    description: '유니온시스템즈 개인정보처리방침 안내.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['privacy_hero', 'privacy_intro', 'privacy_officer', 'privacy_date'];

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
  return <PrivacyPageClient ssrContent={content} />;
}
