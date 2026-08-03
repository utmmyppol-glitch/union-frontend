import OfficekeeperPageClient from './OfficekeeperPageClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['officekeeper_hero', 'officekeeper_problems', 'officekeeper_features_main', 'officekeeper_features_sub', 'officekeeper_process', 'officekeeper_metrics', 'officekeeper_faqs', 'officekeeper_cta'];

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
