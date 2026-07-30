import type { CustomerStory } from '@/types';
import CasesPageClient from './CasesPageClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';

const FALLBACK_STORIES: CustomerStory[] = [
  { id: 1, company: 'SSG닷컴', industry: '유통', title: 'NetClient 도입으로 22% 라이선스 비용 절감', content: 'NetClient DMS를 도입하여 전사 소프트웨어 라이선스를 중앙 관리하고, 미사용 라이선스 회수 및 역할별 플랜 차등 적용으로 연간 22%의 비용을 절감했습니다.', thumbnailUrl: null, logoUrl: null, published: true, createdAt: '2026-01-15T00:00:00', updatedAt: '' },
  { id: 2, company: '한국수자원공사', industry: '공공', title: 'DA#으로 100% 데이터 표준화 달성', content: 'DA# 데이터 모델링 솔루션을 도입하여 조직 전체의 데이터 표준 사전을 구축하고, 모든 DB에 표준을 적용하여 100% 데이터 표준화를 달성했습니다.', thumbnailUrl: null, logoUrl: null, published: true, createdAt: '2025-11-20T00:00:00', updatedAt: '' },
  { id: 3, company: 'KB생명보험', industry: '금융', title: 'AhnLab + ESTsecurity로 35% 위협 탐지율 향상', content: 'AhnLab V3 엔드포인트 보안과 ESTsecurity EDR을 조합한 다층 방어 체계를 구축하여 기존 대비 35%의 위협 탐지율 향상을 달성했습니다.', thumbnailUrl: null, logoUrl: null, published: true, createdAt: '2025-09-10T00:00:00', updatedAt: '' },
  { id: 4, company: '아모레퍼시픽', industry: '제조', title: 'Adobe CC 전사 도입, 80% 라이선스 관리 시간 절감', content: 'Adobe Creative Cloud 기업용 라이선스를 전사 도입하고 중앙 배포 체계를 구축하여 라이선스 관리에 소요되는 시간을 80% 절감했습니다.', thumbnailUrl: null, logoUrl: null, published: true, createdAt: '2025-07-05T00:00:00', updatedAt: '' },
  { id: 5, company: '현대백화점', industry: '유통', title: 'Autodesk Flex 전환, 18% 비용 절감', content: '기존 고정 라이선스에서 Autodesk Flex 토큰 기반 유연 라이선스로 전환하여 실사용량 기반 비용 관리로 연간 18%의 비용을 절감했습니다.', thumbnailUrl: null, logoUrl: null, published: true, createdAt: '2025-05-20T00:00:00', updatedAt: '' },
  { id: 6, company: '대한항공', industry: '항공', title: 'Microsoft 365 전사 마이그레이션, 99.9% 가용성', content: '레거시 이메일 시스템에서 Microsoft 365로 전사 마이그레이션을 진행하여 99.9% 가용성을 달성하고 글로벌 협업 환경을 구축했습니다.', thumbnailUrl: null, logoUrl: null, published: true, createdAt: '2025-03-15T00:00:00', updatedAt: '' },
];

async function getCustomerStories() {
  try {
    const res = await fetch(`${API_BASE_URL}/customer-stories?page=0&size=9`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { content: FALLBACK_STORIES, totalPages: 1, first: true, last: true };
  }
}

export default async function CasesPage() {
  const data = await getCustomerStories();
  return <CasesPageClient initialData={data} />;
}
