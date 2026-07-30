import CompanyPageClient from './CompanyPageClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['company_hero','company_overview','company_stats','company_strengths','company_values','company_depts','company_org','company_ci','company_cta'];

async function getCompanyContent(): Promise<Record<string, string>> {
  try {
    const base = API_URL.replace(/\/api\/union\/?$/, '');
    const res = await fetch(
      `${base}/api/union/content?keys=${CONTENT_KEYS.join(',')}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

export default async function CompanyPage() {
  const content = await getCompanyContent();
  return <CompanyPageClient ssrContent={content} />;
}
