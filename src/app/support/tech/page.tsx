import TechPageClient from './TechPageClient';

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
