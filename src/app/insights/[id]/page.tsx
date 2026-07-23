import { Metadata } from 'next';
import InsightDetailClient from './InsightDetailClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';

const FALLBACK_INSIGHTS: Record<number, { id: number; title: string; content: string; excerpt: string; category: string; published: boolean; viewCount: number; createdAt: string }> = {
  101: { id: 101, title: '2024년 IT 인프라 트렌드: 클라우드 네이티브와 하이브리드 전략', content: '클라우드 네이티브 기술이 빠르게 확산되면서, 기업들은 하이브리드 클라우드 전략을 채택하고 있습니다.\n\n## 클라우드 네이티브란?\n\n컨테이너, 마이크로서비스, CI/CD 파이프라인을 기반으로 애플리케이션을 설계·운영하는 접근법입니다.\n\n## 하이브리드 전략이 필요한 이유\n\n모든 워크로드를 퍼블릭 클라우드로 이전하는 것이 항상 최선은 아닙니다.\n\n## 유니온시스템즈의 제안\n\nMicrosoft 365와 Azure를 활용한 하이브리드 환경 구축을 지원합니다.', excerpt: '클라우드 네이티브 기술이 빠르게 확산되면서, 기업들은 하이브리드 클라우드 전략을 채택하고 있습니다.', category: 'INSIGHT', published: true, viewCount: 152, createdAt: '2026-02-10T10:00:00' },
  102: { id: 102, title: '제로 트러스트 보안 아키텍처 도입 가이드', content: '경계 기반 보안의 한계를 넘어, 제로 트러스트 모델이 새로운 보안 패러다임으로 자리잡고 있습니다.\n\n## 제로 트러스트란?\n\n"아무도 신뢰하지 않는다"는 원칙 하에, 모든 접근 요청을 검증하는 보안 모델입니다.\n\n## 도입 5단계\n\n1. 자산 식별\n2. 트랜잭션 흐름 매핑\n3. 제로 트러스트 아키텍처 설계\n4. 정책 수립\n5. 모니터링 및 유지관리', excerpt: '경계 기반 보안의 한계를 넘어, 제로 트러스트 모델이 새로운 보안 패러다임으로 자리잡고 있습니다.', category: 'INSIGHT', published: true, viewCount: 198, createdAt: '2026-03-05T10:00:00' },
  103: { id: 103, title: 'AI 기반 IT 운영 자동화(AIOps)의 현재와 미래', content: 'AIOps는 머신러닝과 빅데이터를 활용하여 IT 운영의 복잡성을 줄이고 장애를 예측합니다.', excerpt: 'AIOps는 머신러닝과 빅데이터를 활용하여 IT 운영의 복잡성을 줄이고 장애를 예측합니다.', category: 'INSIGHT', published: true, viewCount: 134, createdAt: '2026-03-20T10:00:00' },
  104: { id: 104, title: '2026년 기업이 대비해야 할 5가지 보안 위협', content: '랜섬웨어 진화, 공급망 공격, AI 기반 피싱 등 2026년 주요 보안 위협을 분석합니다.', excerpt: '랜섬웨어 진화, 공급망 공격, AI 기반 피싱 등 2026년 주요 보안 위협을 분석합니다.', category: 'INSIGHT', published: true, viewCount: 267, createdAt: '2026-04-01T10:00:00' },
  105: { id: 105, title: '데이터 표준화, 왜 지금 시작해야 할까', content: '데이터 품질 문제의 80%는 표준 부재에서 시작됩니다.', excerpt: '데이터 품질 문제의 80%는 표준 부재에서 시작됩니다. DA#을 활용한 표준화 전략을 소개합니다.', category: 'INSIGHT', published: true, viewCount: 189, createdAt: '2026-04-15T10:00:00' },
  106: { id: 106, title: 'Microsoft 365 라이선스, 이렇게 하면 아낀다', content: '사용자 역할별 플랜 차등 적용, 미사용 감사, CSP 볼륨 할인으로 평균 22% 비용을 절감할 수 있습니다.', excerpt: '사용자 역할별 플랜 차등 적용, 미사용 감사, CSP 볼륨 할인으로 평균 22% 비용을 절감할 수 있습니다.', category: 'INSIGHT', published: true, viewCount: 312, createdAt: '2026-05-01T10:00:00' },
  107: { id: 107, title: 'IT 자산관리, 엑셀에서 벗어나야 하는 3가지 이유', content: '엑셀 기반 자산관리의 한계와 전문 솔루션 도입 시 기대 효과를 비교합니다.', excerpt: '엑셀 기반 자산관리의 한계와 전문 솔루션 도입 시 기대 효과를 비교합니다.', category: 'INSIGHT', published: true, viewCount: 145, createdAt: '2026-05-20T10:00:00' },
  108: { id: 108, title: 'Copilot 도입 전 꼭 체크해야 할 5가지', content: 'Microsoft 365 Copilot 도입 전 데이터 보안, 라이선스 구조, 교육 계획 등 점검 항목을 정리합니다.', excerpt: 'Microsoft 365 Copilot 도입 전 데이터 보안, 라이선스 구조, 교육 계획 등 점검 항목을 정리합니다.', category: 'INSIGHT', published: true, viewCount: 223, createdAt: '2026-06-10T10:00:00' },
};

async function getPost(id: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return FALLBACK_INSIGHTS[id] || null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getPost(Number(params.id));
  if (!post) return { title: '게시글을 찾을 수 없습니다' };
  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
    },
  };
}

export default async function InsightDetailPage({ params }: { params: { id: string } }) {
  const post = await getPost(Number(params.id));
  return <InsightDetailClient post={post} />;
}
