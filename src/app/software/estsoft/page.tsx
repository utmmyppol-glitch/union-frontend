import EstsoftPageClient from './EstsoftPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이스트소프트 (알약·알집)',
  description: '알약, 알집, 알PDF 등 이스트소프트 기업용 소프트웨어 라이선스 구매 및 볼륨 라이선스 안내.',
  openGraph: {
    title: '이스트소프트 | 유니온시스템즈',
    description: '알약, 알집 등 이스트소프트 기업용 소프트웨어 라이선스.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['estsoft_hero', 'estsoft_strengths', 'estsoft_cta'];

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
  return <EstsoftPageClient ssrContent={content} />;
}
