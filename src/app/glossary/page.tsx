import GlossaryPageClient from './GlossaryPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IT·보안 용어사전',
  description: '유니온시스템즈가 취급하는 제품과 관련된 IT·보안 핵심 용어를 정리했습니다.',
  openGraph: {
    title: 'IT·보안 용어사전 | 유니온시스템즈',
    description: 'IT·보안 핵심 용어 정리.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['glossary_terms'];

async function getContent(): Promise<Record<string, string>> {
  try {
    const base = API_URL.replace(/\/api\/union\/?$/, '');
    const res = await fetch(`${base}/api/union/content?keys=${CONTENT_KEYS.join(',')}`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    return res.json();
  } catch { return {}; }
}

interface GlossaryEntity {
  id: number; term: string; fullName: string; definition: string; category: string; sortOrder: number; isActive: boolean;
}

async function getGlossaryTerms(): Promise<{ term: string; full: string; def: string; category: string }[] | null> {
  try {
    const base = API_URL.replace(/\/api\/union\/?$/, '');
    const res = await fetch(`${base}/api/union/glossary`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const items: GlossaryEntity[] = await res.json();
    if (!items.length) return null;
    return items.map(g => ({
      term: g.term,
      full: g.fullName || '',
      def: g.definition || '',
      category: g.category || '',
    }));
  } catch {
    return null;
  }
}

export default async function Page() {
  const [content, dbTerms] = await Promise.all([getContent(), getGlossaryTerms()]);
  const ssrContent = { ...content };
  if (dbTerms) {
    ssrContent.glossary_terms = JSON.stringify(dbTerms);
  }
  return <GlossaryPageClient ssrContent={ssrContent} />;
}
