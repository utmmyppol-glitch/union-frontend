/**
 * 목업 모드 분기 헬퍼
 *
 * NEXT_PUBLIC_USE_MOCK=true 환경변수가 설정되면
 * 모든 API fetch를 건너뛰고 목업 데이터를 반환합니다.
 * 시연이 끝나면 환경변수를 제거하면 원래 API로 복귀합니다.
 */

import type { Insight } from '@/types';

export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

/* ─── 인사이트 목업 ─── */
export const MOCK_INSIGHTS: Insight[] = [
  {
    id: 1,
    title: '2026년 기업이 대비해야 할 5가지 보안 위협',
    summary: '랜섬웨어 진화, 공급망 공격, AI 기반 피싱, 클라우드 설정 오류, 내부자 위협까지 — 2026년 기업 보안 담당자가 반드시 점검해야 할 5가지 핵심 위협을 분석합니다. 각 위협별 대응 전략과 실무 체크리스트를 함께 제공합니다.',
    sourceName: '디지털투데이',
    sourceUrl: 'https://www.digitaltoday.co.kr',
    publishedAt: '2026-07-28T09:00:00',
    thumbnailUrl: null,
  },
  {
    id: 2,
    title: 'Microsoft 365 Copilot 도입 전 꼭 체크해야 할 5가지',
    summary: 'Microsoft 365 Copilot 도입을 검토하는 기업이 늘고 있습니다. 도입 전 데이터 보안 정책, 라이선스 구조, 사용자 교육 계획, 기존 워크플로우 호환성, ROI 측정 기준 등 반드시 점검해야 할 5가지 핵심 항목을 정리합니다.',
    sourceName: 'ZDNet Korea',
    sourceUrl: 'https://zdnet.co.kr',
    publishedAt: '2026-07-25T10:30:00',
    thumbnailUrl: null,
  },
  {
    id: 3,
    title: '클라우드 네이티브와 하이브리드 전략, 2026년 IT 인프라 트렌드',
    summary: '컨테이너, 마이크로서비스, CI/CD 파이프라인을 기반으로 한 클라우드 네이티브 기술이 빠르게 확산되고 있습니다. 모든 워크로드를 퍼블릭 클라우드로 이전하는 것이 항상 최선은 아닌 이유와, Azure 기반 하이브리드 환경 구축 전략을 소개합니다.',
    sourceName: '전자신문',
    sourceUrl: 'https://www.etnews.com',
    publishedAt: '2026-07-20T14:00:00',
    thumbnailUrl: null,
  },
  {
    id: 4,
    title: '제로 트러스트 보안 아키텍처 도입 실전 가이드',
    summary: '"아무도 신뢰하지 않는다"는 원칙 하에 모든 접근 요청을 검증하는 제로 트러스트 모델이 새로운 보안 패러다임으로 자리잡고 있습니다. 자산 식별부터 모니터링까지, 실제 도입을 위한 5단계 로드맵을 제시합니다.',
    sourceName: 'AI타임스',
    sourceUrl: 'https://www.aitimes.com',
    publishedAt: '2026-07-15T11:00:00',
    thumbnailUrl: null,
  },
  {
    id: 5,
    title: 'AIOps — AI 기반 IT 운영 자동화의 현재와 미래',
    summary: 'AIOps는 머신러닝과 빅데이터를 활용하여 IT 운영의 복잡성을 줄이고 장애를 사전에 예측합니다. 이상 탐지, 근본 원인 분석, 자동 복구까지 — AIOps가 IT 운영에 가져올 변화를 심층 분석합니다.',
    sourceName: '디지털투데이',
    sourceUrl: 'https://www.digitaltoday.co.kr',
    publishedAt: '2026-07-10T09:30:00',
    thumbnailUrl: null,
  },
  {
    id: 6,
    title: '데이터 표준화, 왜 지금 시작해야 할까',
    summary: '데이터 품질 문제의 80%는 표준 부재에서 시작됩니다. 부서별로 다른 코드 체계, 중복 데이터, 불일치하는 용어가 의사결정을 방해합니다. DA#을 활용한 데이터 표준화 전략과 기대 효과를 소개합니다.',
    sourceName: 'ZDNet Korea',
    sourceUrl: 'https://zdnet.co.kr',
    publishedAt: '2026-07-05T10:00:00',
    thumbnailUrl: null,
  },
  {
    id: 7,
    title: 'Microsoft 365 라이선스 비용, 이렇게 하면 22% 절감',
    summary: '사용자 역할별 플랜 차등 적용, 미사용 라이선스 감사, CSP 볼륨 할인을 조합하면 평균 22%의 비용 절감이 가능합니다. 실제 고객 사례를 바탕으로 라이선스 최적화 방법을 단계별로 안내합니다.',
    sourceName: '전자신문',
    sourceUrl: 'https://www.etnews.com',
    publishedAt: '2026-06-28T13:00:00',
    thumbnailUrl: null,
  },
  {
    id: 8,
    title: 'IT 자산관리, 엑셀에서 벗어나야 하는 3가지 이유',
    summary: '엑셀 기반 IT 자산관리는 실시간 추적 불가, 버전 충돌, 감사 대응 어려움이라는 한계를 가집니다. 전문 자산관리 솔루션 도입 시 기대할 수 있는 운영 효율 향상과 비용 절감 효과를 비교 분석합니다.',
    sourceName: 'AI타임스',
    sourceUrl: 'https://www.aitimes.com',
    publishedAt: '2026-06-20T09:00:00',
    thumbnailUrl: null,
  },
  {
    id: 9,
    title: 'SaaS 도입 시 보안 점검 체크리스트 10가지',
    summary: 'SaaS 서비스 도입이 가속화되면서 데이터 주권, 접근 제어, 암호화, 감사 로그 등 보안 점검의 중요성이 커지고 있습니다. 도입 전 반드시 확인해야 할 10가지 보안 체크리스트를 실무 관점에서 정리합니다.',
    sourceName: '디지털투데이',
    sourceUrl: 'https://www.digitaltoday.co.kr',
    publishedAt: '2026-06-15T11:30:00',
    thumbnailUrl: null,
  },
];

/* ─── 공지사항 목업 ─── */
const UP = '/images/uploads/';
export const MOCK_NOTICES = [
  { id: 1, title: '유니온시스템즈 기업문화 소개 (1) — 소수정예 전문가 조직', category: 'NOTICE', content: '', excerpt: '소수정예 전문가 조직으로서 유니온시스템즈의 기업문화를 소개합니다.', createdAt: '2026-03-15T00:00:00', viewCount: 142, published: true, img: `${UP}01_1.png` },
  { id: 2, title: '유니온시스템즈 기업문화 소개 (2) — 고객과 함께 성장합니다', category: 'NOTICE', content: '', excerpt: '고객과 함께 성장하는 유니온시스템즈의 파트너십 철학을 소개합니다.', createdAt: '2026-04-02T00:00:00', viewCount: 156, published: true, img: `${UP}01_1.png` },
  { id: 3, title: '유니온시스템즈 기업문화 소개 (3) — 기술 혁신과 학습 문화', category: 'NOTICE', content: '', excerpt: '끊임없는 기술 혁신과 학습 문화로 성장하는 유니온시스템즈를 소개합니다.', createdAt: '2026-04-20T00:00:00', viewCount: 175, published: true, img: `${UP}01_1.png` },
  { id: 4, title: '[채용] 마케터·디자이너 모집', category: 'NOTICE', content: '', excerpt: '유니온시스템즈에서 함께할 마케터와 디자이너를 모집합니다.', createdAt: '2026-05-10T00:00:00', viewCount: 298, published: true, img: `${UP}04_4.png` },
  { id: 5, title: '찾아가는 설명회 — 충북대병원 DA# 도입 컨설팅', category: 'NOTICE', content: '', excerpt: '충북대학교병원에서 DA# 도입 컨설팅 설명회를 진행했습니다.', createdAt: '2026-06-05T00:00:00', viewCount: 187, published: true, img: `${UP}0-1_50.jpg` },
  { id: 6, title: '데이터품질관리 세미나 개최 안내', category: 'NOTICE', content: '', excerpt: '데이터 품질관리 세미나를 개최합니다. 관심 있는 분들의 많은 참여 부탁드립니다.', createdAt: '2026-06-20T00:00:00', viewCount: 203, published: true, img: `${UP}02_2.png` },
  { id: 7, title: '유니온시스템즈 상반기 워크숍 (22년 6월)', category: 'NOTICE', content: '', excerpt: '대부도 블루스카이 펜션에서 1박 2일 상반기 워크숍을 다녀왔습니다.', createdAt: '2022-06-22T00:00:00', viewCount: 134, published: true, img: `${UP}03_3.png` },
  { id: 8, title: '새해 福 많이 받으세요', category: 'NOTICE', content: '', excerpt: '유니온시스템즈 임직원 일동 새해 인사를 드립니다.', createdAt: '2022-01-01T00:00:00', viewCount: 112, published: true, img: `${UP}01_1.png` },
  { id: 9, title: "유니온시스템즈, '전산실 사람들' 통해 넷클라이언트 무료체험 지원", category: 'NOTICE', content: '', excerpt: '전산실 사람들 커뮤니티를 통해 넷클라이언트 무료체험을 지원합니다.', createdAt: '2021-09-13T00:00:00', viewCount: 245, published: true, img: `${UP}02_2.png` },
  { id: 10, title: "엔코아, 유니온시스템즈와 데이터 모델링 툴 'DA#' 총판 협약 체결", category: 'NOTICE', content: '', excerpt: '엔코아와 유니온시스템즈가 데이터 모델링 툴 DA#의 총판 협약을 체결했습니다.', createdAt: '2021-02-24T00:00:00', viewCount: 312, published: true, img: `${UP}01_1.png` },
];

/* ─── 고객사례 목업 ─── */
export const MOCK_STORIES = [
  { id: 1, company: 'SSG닷컴', industry: '유통', title: 'NetClient 도입으로 22% 라이선스 비용 절감', content: 'NetClient DMS를 도입하여 전사 소프트웨어 라이선스를 중앙 관리하고, 미사용 라이선스 회수 및 역할별 플랜 차등 적용으로 연간 22%의 비용을 절감했습니다.', thumbnailUrl: null, logoUrl: null, published: true, createdAt: '2026-01-15T00:00:00', updatedAt: '' },
  { id: 2, company: '한국수자원공사', industry: '공공', title: 'DA#으로 100% 데이터 표준화 달성', content: 'DA# 데이터 모델링 솔루션을 도입하여 조직 전체의 데이터 표준 사전을 구축하고, 모든 DB에 표준을 적용하여 100% 데이터 표준화를 달성했습니다.', thumbnailUrl: null, logoUrl: null, published: true, createdAt: '2025-11-20T00:00:00', updatedAt: '' },
  { id: 3, company: 'KB생명보험', industry: '금융', title: 'AhnLab + ESTsecurity로 35% 위협 탐지율 향상', content: 'AhnLab V3 엔드포인트 보안과 ESTsecurity EDR을 조합한 다층 방어 체계를 구축하여 기존 대비 35%의 위협 탐지율 향상을 달성했습니다.', thumbnailUrl: null, logoUrl: null, published: true, createdAt: '2025-09-10T00:00:00', updatedAt: '' },
  { id: 4, company: '아모레퍼시픽', industry: '제조', title: 'Adobe CC 전사 도입, 80% 라이선스 관리 시간 절감', content: 'Adobe Creative Cloud 기업용 라이선스를 전사 도입하고 중앙 배포 체계를 구축하여 라이선스 관리에 소요되는 시간을 80% 절감했습니다.', thumbnailUrl: null, logoUrl: null, published: true, createdAt: '2025-07-05T00:00:00', updatedAt: '' },
  { id: 5, company: '현대백화점', industry: '유통', title: 'Autodesk Flex 전환, 18% 비용 절감', content: '기존 고정 라이선스에서 Autodesk Flex 토큰 기반 유연 라이선스로 전환하여 실사용량 기반 비용 관리로 연간 18%의 비용을 절감했습니다.', thumbnailUrl: null, logoUrl: null, published: true, createdAt: '2025-05-20T00:00:00', updatedAt: '' },
  { id: 6, company: '대한항공', industry: '항공', title: 'Microsoft 365 전사 마이그레이션, 99.9% 가용성', content: '레거시 이메일 시스템에서 Microsoft 365로 전사 마이그레이션을 진행하여 99.9% 가용성을 달성하고 글로벌 협업 환경을 구축했습니다.', thumbnailUrl: null, logoUrl: null, published: true, createdAt: '2025-03-15T00:00:00', updatedAt: '' },
];

/* ─── 편집 콘텐츠 목업 (빈 객체 → 컴포넌트 기본값 사용) ─── */
export const MOCK_CONTENT: Record<string, string> = {};

/* ─── 설정값 목업 ─── */
export const MOCK_CONFIG: Record<string, string> = {
  company_name: '유니온시스템즈',
  ceo: '홍민석',
  address: '서울시 성동구 아차산로17길 49, 1209~1210호 (성수동2가, 생각공장데시앙플렉스)',
  biz_no: '120-87-96801',
  tel: '02-706-8999',
  fax: '02-706-8990',
  copyright: 'Copyright 2015 UNION SYSTEMS. All rights reserved.',
  sns_blog: 'https://blog.naver.com/unionsystems_',
  sns_facebook: '',
};
