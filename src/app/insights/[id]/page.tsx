'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { apiClient } from '@/lib/api';
import { useApi } from '@/hooks/useApi';

const FALLBACK_INSIGHTS: Record<number, { id: number; title: string; content: string; excerpt: string; category: string; published: boolean; viewCount: number; createdAt: string }> = {
  101: { id: 101, title: '2024년 IT 인프라 트렌드: 클라우드 네이티브와 하이브리드 전략', content: '클라우드 네이티브 기술이 빠르게 확산되면서, 기업들은 하이브리드 클라우드 전략을 채택하고 있습니다.\n\n## 클라우드 네이티브란?\n\n컨테이너, 마이크로서비스, CI/CD 파이프라인을 기반으로 애플리케이션을 설계·운영하는 접근법입니다. Kubernetes가 사실상 표준으로 자리잡았으며, 대부분의 신규 프로젝트가 클라우드 네이티브 아키텍처를 채택하고 있습니다.\n\n## 하이브리드 전략이 필요한 이유\n\n모든 워크로드를 퍼블릭 클라우드로 이전하는 것이 항상 최선은 아닙니다. 규제 산업(금융, 의료, 공공)에서는 데이터 주권 문제가 있고, 레거시 시스템과의 연동이 필요한 경우도 있습니다.\n\n### 핵심 고려사항\n\n- 데이터 거버넌스와 규제 준수\n- 기존 온프레미스 투자 보호\n- 워크로드별 최적 환경 선택\n- 멀티클라우드 관리 복잡성 대비\n\n## 유니온시스템즈의 제안\n\nMicrosoft 365와 Azure를 활용한 하이브리드 환경 구축, 기존 인프라와의 원활한 연동을 지원합니다. 도입 상담은 02-706-8999로 문의하세요.', excerpt: '클라우드 네이티브 기술이 빠르게 확산되면서, 기업들은 하이브리드 클라우드 전략을 채택하고 있습니다.', category: 'INSIGHT', published: true, viewCount: 152, createdAt: '2026-02-10T10:00:00' },
  102: { id: 102, title: '제로 트러스트 보안 아키텍처 도입 가이드', content: '경계 기반 보안의 한계를 넘어, 제로 트러스트 모델이 새로운 보안 패러다임으로 자리잡고 있습니다.\n\n## 제로 트러스트란?\n\n"아무도 신뢰하지 않는다"는 원칙 하에, 모든 접근 요청을 검증하는 보안 모델입니다. 네트워크 내부에 있다고 해서 자동으로 신뢰하지 않습니다.\n\n## 도입 5단계\n\n1. **자산 식별**: 보호해야 할 데이터, 애플리케이션, 서비스 목록화\n2. **트랜잭션 흐름 매핑**: 데이터가 어떻게 이동하는지 파악\n3. **제로 트러스트 아키텍처 설계**: 마이크로 세그멘테이션 적용\n4. **정책 수립**: 최소 권한 원칙 기반 접근 정책\n5. **모니터링 및 유지관리**: 지속적 검증과 로그 분석\n\n## 실무 적용 포인트\n\n- AhnLab EDR로 엔드포인트 위협 탐지\n- ESTsecurity로 알려지지 않은 위협 대응\n- OfficeKeeper로 정보 유출 방지(DLP)\n\n유니온시스템즈는 기업 환경에 맞는 다층 보안 아키텍처를 설계해 드립니다.', excerpt: '경계 기반 보안의 한계를 넘어, 제로 트러스트 모델이 새로운 보안 패러다임으로 자리잡고 있습니다.', category: 'INSIGHT', published: true, viewCount: 198, createdAt: '2026-03-05T10:00:00' },
  103: { id: 103, title: 'AI 기반 IT 운영 자동화(AIOps)의 현재와 미래', content: 'AIOps는 머신러닝과 빅데이터를 활용하여 IT 운영의 복잡성을 줄이고 장애를 예측합니다.\n\n## AIOps가 해결하는 문제\n\n기업의 IT 환경이 복잡해지면서 수동 모니터링만으로는 한계가 있습니다. AIOps는 대량의 로그, 메트릭, 이벤트 데이터를 분석하여 이상 징후를 사전에 탐지합니다.\n\n## 주요 활용 사례\n\n- **이상 탐지**: 평소와 다른 패턴을 자동 감지\n- **근본 원인 분석**: 장애 발생 시 원인을 빠르게 특정\n- **용량 예측**: 리소스 사용량 추세를 예측하여 선제 대응\n- **자동 복구**: 반복적 장애에 대한 자동화된 조치\n\n## 도입 시 고려사항\n\n데이터 품질이 핵심입니다. DA#으로 데이터 표준화를 먼저 수행하고, NetClient로 IT 자산 현황을 정확히 파악한 후 AIOps를 적용하면 효과가 극대화됩니다.', excerpt: 'AIOps는 머신러닝과 빅데이터를 활용하여 IT 운영의 복잡성을 줄이고 장애를 예측합니다.', category: 'INSIGHT', published: true, viewCount: 134, createdAt: '2026-03-20T10:00:00' },
  104: { id: 104, title: '2026년 기업이 대비해야 할 5가지 보안 위협', content: '랜섬웨어 진화, 공급망 공격, AI 기반 피싱 등 2026년 주요 보안 위협을 분석합니다.\n\n## 1. 랜섬웨어 2.0 — 이중 협박\n\n데이터 암호화뿐 아니라 유출 위협까지 병행하는 이중 협박 방식이 주류가 되었습니다. 정기적 백업과 엔드포인트 보안이 필수입니다.\n\n## 2. 공급망 공격\n\n소프트웨어 공급 체인을 통한 공격이 증가하고 있습니다. 신뢰할 수 있는 공인 파트너를 통한 소프트웨어 조달이 중요합니다.\n\n## 3. AI 기반 피싱\n\n생성형 AI를 활용한 고도화된 피싱 메일이 기존 필터를 우회합니다. 직원 보안 교육과 이메일 보안 솔루션 강화가 필요합니다.\n\n## 4. 클라우드 설정 오류\n\n클라우드 환경의 잘못된 설정이 데이터 유출의 주요 원인입니다.\n\n## 5. 내부자 위협\n\n의도적·비의도적 내부자에 의한 정보 유출에 대비해야 합니다. OfficeKeeper DLP로 문서 반출을 통제하세요.', excerpt: '랜섬웨어 진화, 공급망 공격, AI 기반 피싱 등 2026년 주요 보안 위협을 분석합니다.', category: 'INSIGHT', published: true, viewCount: 267, createdAt: '2026-04-01T10:00:00' },
  105: { id: 105, title: '데이터 표준화, 왜 지금 시작해야 할까', content: '데이터 품질 문제의 80%는 표준 부재에서 시작됩니다. DA#을 활용한 표준화 전략을 소개합니다.\n\n## 데이터 표준화란?\n\n조직 전체가 동일한 기준으로 데이터를 정의·관리하는 것입니다. 부서마다 다른 용어, 다른 형식으로 데이터를 관리하면 분석 결과의 신뢰성이 떨어집니다.\n\n## 표준화 3단계\n\n1. **표준 사전 구축**: 용어, 도메인, 코드의 기업 표준 정의\n2. **모델 표준 적용**: ERD 설계 시 표준 사전을 참조하여 일관성 확보\n3. **DB 동기화**: 물리 DB에 표준을 반영하고 지속적으로 관리\n\n## DA#이 제공하는 가치\n\n- 개괄/개념/논리/물리 모델 전 단계 지원\n- 리버스 엔지니어링으로 기존 DB에서 ERD 자동 생성\n- DQ Edition으로 데이터 품질 진단까지 원스톱\n\n한국수자원공사는 DA#을 도입하여 100% 데이터 표준화를 달성했습니다.', excerpt: '데이터 품질 문제의 80%는 표준 부재에서 시작됩니다. DA#을 활용한 표준화 전략을 소개합니다.', category: 'INSIGHT', published: true, viewCount: 189, createdAt: '2026-04-15T10:00:00' },
  106: { id: 106, title: 'Microsoft 365 라이선스, 이렇게 하면 아낀다', content: '사용자 역할별 플랜 차등 적용, 미사용 감사, CSP 볼륨 할인으로 평균 22% 비용을 절감할 수 있습니다.\n\n## 흔한 실수\n\n모든 직원에게 동일한 E5 플랜을 적용하는 것은 비용 낭비입니다. 실제로 E5의 고급 보안·컴플라이언스 기능이 필요한 직원은 전체의 20% 미만인 경우가 대부분입니다.\n\n## 비용 절감 4가지 방법\n\n1. **역할별 플랜 차등 적용**: 경영진·IT팀은 E5, 일반 사무직은 E3, 현장 인력은 F3\n2. **미사용 라이선스 정기 감사**: 퇴사자·부서 이동 후 방치된 라이선스를 회수\n3. **CSP 파트너 볼륨 할인**: 유니온시스템즈 같은 CSP 파트너를 통해 볼륨 가격 협상\n4. **연간 약정 활용**: 월간 대비 연간 약정 시 16~20% 절감\n\n## 실제 사례\n\nSSG닷컴은 유니온시스템즈의 라이선스 최적화 컨설팅을 통해 연간 22%의 라이선스 비용을 절감했습니다.\n\n무료 라이선스 진단 상담: 02-706-8999', excerpt: '사용자 역할별 플랜 차등 적용, 미사용 감사, CSP 볼륨 할인으로 평균 22% 비용을 절감할 수 있습니다.', category: 'INSIGHT', published: true, viewCount: 312, createdAt: '2026-05-01T10:00:00' },
  107: { id: 107, title: 'IT 자산관리, 엑셀에서 벗어나야 하는 3가지 이유', content: '엑셀 기반 자산관리의 한계와 전문 솔루션 도입 시 기대 효과를 비교합니다.\n\n## 엑셀 자산관리의 문제점\n\n많은 기업이 아직도 엑셀로 PC, 소프트웨어 자산을 관리합니다. 소규모일 때는 괜찮지만, 50대 이상이면 문제가 시작됩니다.\n\n## 이유 1: 데이터 정확도\n\n수동 입력 기반이라 오류가 누적됩니다. NetClient DMS는 에이전트가 자동으로 하드웨어 사양, 설치 소프트웨어를 수집합니다.\n\n## 이유 2: 라이선스 컴플라이언스\n\n불법 소프트웨어 설치 현황을 실시간으로 파악하지 못하면 법적 리스크가 발생합니다. 소프트웨어 자산관리(SAM) 기능으로 라이선스 보유량과 설치량을 자동 비교합니다.\n\n## 이유 3: 보안 패치 관리\n\n엑셀로는 각 PC의 보안 패치 상태를 추적할 수 없습니다. PMS 모듈로 보안 패치를 중앙에서 자동 배포하여 취약점을 사전에 차단합니다.\n\n무료 체험 문의: 02-706-8999', excerpt: '엑셀 기반 자산관리의 한계와 전문 솔루션 도입 시 기대 효과를 비교합니다.', category: 'INSIGHT', published: true, viewCount: 145, createdAt: '2026-05-20T10:00:00' },
  108: { id: 108, title: 'Copilot 도입 전 꼭 체크해야 할 5가지', content: 'Microsoft 365 Copilot 도입 전 데이터 보안, 라이선스 구조, 교육 계획 등 점검 항목을 정리합니다.\n\n## 1. 데이터 보안 점검\n\nCopilot은 조직 내 데이터를 학습합니다. 민감 정보 접근 권한이 제대로 설정되어 있는지 확인하세요. 과도한 공유 폴더나 권한 설정이 Copilot을 통해 노출될 수 있습니다.\n\n## 2. 라이선스 구조 이해\n\nCopilot은 Microsoft 365 E3/E5 또는 Business Standard/Premium 위에 추가 라이선스로 제공됩니다. 기존 플랜에 따라 비용 구조가 달라집니다.\n\n## 3. 파일럿 그룹 선정\n\n전사 동시 배포보다는 부서별 파일럿을 권장합니다. 마케팅, 영업, HR 등 반복 업무가 많은 부서에서 효과가 큽니다.\n\n## 4. 교육 계획\n\n프롬프트 작성법, 업무별 활용 시나리오 등 실무 교육이 필수입니다.\n\n## 5. ROI 측정 기준\n\n도입 전 현재 업무 시간을 측정하고, 도입 후 비교하여 실질적 효과를 검증하세요.\n\n유니온시스템즈는 Copilot 도입 컨설팅 + 관리자 교육을 무료로 지원합니다.', excerpt: 'Microsoft 365 Copilot 도입 전 데이터 보안, 라이선스 구조, 교육 계획 등 점검 항목을 정리합니다.', category: 'INSIGHT', published: true, viewCount: 223, createdAt: '2026-06-10T10:00:00' },
};

export default function InsightDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: apiPost, isLoading, error } = useApi(
    () => apiClient.getPost(id),
    [id],
  );

  // 백엔드 없을 때 fallback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const post: any = apiPost || (error && FALLBACK_INSIGHTS[id]) || null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <section style={{ padding: '120px 0 clamp(48px, 7vw, 80px)' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <Container size="md">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 18, fontWeight: 600, color: 'var(--ink2)',
              background: 'none', border: 'none', cursor: 'pointer',
              marginBottom: 32, padding: 0, transition: 'color .2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink2)'; }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            목록으로 돌아가기
          </button>

          {isLoading && (
            <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--ink2)' }}>로딩 중...</div>
          )}

          {error && !post && (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <p style={{ color: 'var(--accent)', marginBottom: 16 }}>
                게시글을 불러올 수 없습니다.
              </p>
              <button
                onClick={() => router.push('/insights')}
                style={{
                  padding: '10px 24px', border: '1px solid var(--line)',
                  background: 'transparent', fontWeight: 600, fontSize: 18,
                  color: 'var(--ink)', cursor: 'pointer',
                }}
              >
                목록으로 이동
              </button>
            </div>
          )}

          {post && (
            <article>
              {/* Header */}
              <header style={{ marginBottom: 40 }}>
                <span style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                  fontWeight: 500, fontSize: 18, letterSpacing: '.14em',
                  textTransform: 'uppercase' as const, color: 'var(--ink2)',
                }}>
                  인사이트
                </span>
                <h1 style={{
                  fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 40px)',
                  lineHeight: 1.15, letterSpacing: '-.04em', color: 'var(--ink)',
                  marginTop: 12, marginBottom: 16,
                }}>
                  {post.title}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 18, color: 'var(--ink2)' }}>
                  <span>{formatDate(post.createdAt)}</span>
                  <span style={{ width: 3, height: 3, background: 'var(--line)' }} />
                  <span>조회 {post.viewCount}</span>
                </div>
              </header>

              {/* Thumbnail */}
              {post.thumbnailUrl && (
                <div style={{ marginBottom: 40, overflow: 'hidden' }}>
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              )}

              {/* Content */}
              <div
                className="prose prose-neutral max-w-none"
                style={{ color: 'var(--ink)' }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Footer */}
              <div style={{
                marginTop: 64, paddingTop: 32,
                borderTop: '1px solid var(--line)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 12,
              }}>
                <button
                  onClick={() => router.push('/insights')}
                  style={{
                    padding: '12px 24px', border: '1px solid var(--line)',
                    background: 'transparent', fontWeight: 600, fontSize: 18,
                    color: 'var(--ink)', cursor: 'pointer',
                  }}
                >
                  목록으로 돌아가기
                </button>
                <Link
                  href="/contact"
                  style={{
                    padding: '12px 24px', background: 'var(--accent)',
                    color: '#fff', fontWeight: 700, fontSize: 18,
                    textDecoration: 'none',
                  }}
                >
                  도입문의 하기
                </Link>
              </div>
            </article>
          )}
        </Container>
      </section>
    </div>
  );
}
