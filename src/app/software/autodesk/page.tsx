import AutodeskPageClient from './AutodeskPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Autodesk',
  description: 'AutoCAD, Revit 등 Autodesk 제품 라이선스 구매 및 도입 컨설팅. 설계·건축·제조 분야 전문.',
  openGraph: {
    title: 'Autodesk | 유니온시스템즈',
    description: 'AutoCAD, Revit 등 Autodesk 제품 라이선스 구매 및 도입 컨설팅.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['autodesk_hero', 'autodesk_strengths', 'autodesk_products', 'autodesk_plans', 'autodesk_cta'];

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
  return <AutodeskPageClient ssrContent={content} />;
}
