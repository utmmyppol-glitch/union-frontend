import CompanyPageClient from './CompanyPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회사소개',
  description: '유니온시스템즈의 비전, 핵심 가치, 조직 구조를 소개합니다. IT 인프라 전문 파트너로서의 역량과 차별화된 서비스를 확인하세요.',
  openGraph: {
    title: '회사소개 | 유니온시스템즈',
    description: '유니온시스템즈의 비전, 핵심 가치, 조직 구조를 소개합니다.',
  },
};

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
