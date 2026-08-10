import AhnlabPageClient from './AhnlabPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '안랩 (AhnLab)',
  description: 'V3, MDS 등 안랩 보안 솔루션 도입 컨설팅. 엔드포인트부터 네트워크까지 통합 보안.',
  openGraph: {
    title: '안랩 보안 솔루션 | 유니온시스템즈',
    description: 'V3, MDS 등 안랩 보안 솔루션 도입 컨설팅.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['ahnlab_hero', 'ahnlab_products', 'ahnlab_points', 'ahnlab_icons', 'ahnlab_cta', 'ahnlab_sections'];

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
  return <AhnlabPageClient ssrContent={content} />;
}
