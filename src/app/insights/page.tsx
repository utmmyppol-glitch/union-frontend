import { Metadata } from 'next';
import InsightsPageClient from './InsightsPageClient';
import { fetchPageLayout, CmsPageRender } from '@/lib/cms-page';

export const metadata: Metadata = {
  title: '인사이트',
  description: 'IT 인프라, 보안, 클라우드, 데이터 분석 등 담당자를 위한 최신 트렌드와 전문가 칼럼',
  openGraph: {
    title: '인사이트 | 유니온시스템즈',
    description: 'IT 인프라, 보안, 클라우드, 데이터 분석 등 담당자를 위한 최신 트렌드와 전문가 칼럼',
  },
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FALLBACK_INSIGHTS: any[] = [
  { id: 101, title: '2024년 IT 인프라 트렌드: 클라우드 네이티브와 하이브리드 전략', content: '', excerpt: '클라우드 네이티브 기술이 빠르게 확산되면서, 기업들은 하이브리드 클라우드 전략을 채택하고 있습니다.', category: 'INSIGHT', published: true, viewCount: 152, createdAt: '2026-02-10T10:00:00' },
  { id: 102, title: '제로 트러스트 보안 아키텍처 도입 가이드', content: '', excerpt: '경계 기반 보안의 한계를 넘어, 제로 트러스트 모델이 새로운 보안 패러다임으로 자리잡고 있습니다.', category: 'INSIGHT', published: true, viewCount: 198, createdAt: '2026-03-05T10:00:00' },
  { id: 103, title: 'AI 기반 IT 운영 자동화(AIOps)의 현재와 미래', content: '', excerpt: 'AIOps는 머신러닝과 빅데이터를 활용하여 IT 운영의 복잡성을 줄이고 장애를 예측합니다.', category: 'INSIGHT', published: true, viewCount: 134, createdAt: '2026-03-20T10:00:00' },
  { id: 104, title: '2026년 기업이 대비해야 할 5가지 보안 위협', content: '', excerpt: '랜섬웨어 진화, 공급망 공격, AI 기반 피싱 등 2026년 주요 보안 위협을 분석합니다.', category: 'INSIGHT', published: true, viewCount: 267, createdAt: '2026-04-01T10:00:00' },
  { id: 105, title: '데이터 표준화, 왜 지금 시작해야 할까', content: '', excerpt: '데이터 품질 문제의 80%는 표준 부재에서 시작됩니다. DA#을 활용한 표준화 전략을 소개합니다.', category: 'INSIGHT', published: true, viewCount: 189, createdAt: '2026-04-15T10:00:00' },
  { id: 106, title: 'Microsoft 365 라이선스, 이렇게 하면 아낀다', content: '', excerpt: '사용자 역할별 플랜 차등 적용, 미사용 감사, CSP 볼륨 할인으로 평균 22% 비용을 절감할 수 있습니다.', category: 'INSIGHT', published: true, viewCount: 312, createdAt: '2026-05-01T10:00:00' },
  { id: 107, title: 'IT 자산관리, 엑셀에서 벗어나야 하는 3가지 이유', content: '', excerpt: '엑셀 기반 자산관리의 한계와 전문 솔루션 도입 시 기대 효과를 비교합니다.', category: 'INSIGHT', published: true, viewCount: 145, createdAt: '2026-05-20T10:00:00' },
  { id: 108, title: 'Copilot 도입 전 꼭 체크해야 할 5가지', content: '', excerpt: 'Microsoft 365 Copilot 도입 전 데이터 보안, 라이선스 구조, 교육 계획 등 점검 항목을 정리합니다.', category: 'INSIGHT', published: true, viewCount: 223, createdAt: '2026-06-10T10:00:00' },
];

async function getInsights() {
  try {
    const res = await fetch(`${API_BASE_URL}/posts?category=INSIGHT&page=0&size=12`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { content: FALLBACK_INSIGHTS, totalPages: 1, first: true, last: true };
  }
}

export default async function InsightsPage() {
  const cmsData = await fetchPageLayout('insights');
  if (cmsData) return <CmsPageRender data={cmsData} />;

  const data = await getInsights();
  return <InsightsPageClient initialData={data} />;
}
