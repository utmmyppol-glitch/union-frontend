import LicenseAlertPageClient from './LicenseAlertPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '라이선스 만료 알림',
  description: '소프트웨어 라이선스 만료일을 관리하고 자동 알림을 받아 보세요. SAM 서비스 안내.',
  openGraph: {
    title: '라이선스 만료 알림 | 유니온시스템즈',
    description: '소프트웨어 라이선스 만료 관리 및 자동 알림 서비스.',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const CONTENT_KEYS = ['licensealert_hero', 'licensealert_benefits', 'licensealert_sam', 'licensealert_form', 'licensealert_done'];

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
  return <LicenseAlertPageClient ssrContent={content} />;
}
