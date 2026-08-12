import OfficekeeperPageClient from './OfficekeeperPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OfficeKeeper',
  description: 'OfficeKeeper 정보유출방지(DLP) 솔루션. 문서 보안, 매체 제어, 출력물 관리를 한 번에.',
  openGraph: {
    title: 'OfficeKeeper DLP | 유니온시스템즈',
    description: 'OfficeKeeper 정보유출방지(DLP) 솔루션.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/union';
const CONTENT_KEYS = ['officekeeper_hero', 'officekeeper_problems', 'officekeeper_features_main', 'officekeeper_features_sub', 'officekeeper_process', 'officekeeper_metrics', 'officekeeper_faqs', 'officekeeper_cta', 'officekeeper_cta_trust', 'officekeeper_hero_trust', 'officekeeper_sections'];

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
  return <OfficekeeperPageClient ssrContent={content} />;
}
