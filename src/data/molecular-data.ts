export interface Feature {
  n: string;
  e: string;
}

export interface Solution {
  id: string;
  area: string;
  vendor: string;
  x: number;
  y: number;
  r: number;
  desc: string;
  gain: string[];
  feats: Feature[];
}

export const SOLUTIONS: Solution[] = [
  {
    id: 'ms', area: 'IT 인프라 · 협업', vendor: 'Microsoft',
    x: 17.3, y: 9.3, r: 30,
    desc: '클라우드·협업·생산성 도구를 통합 도입하고 운영합니다.',
    gain: ['협업 생산성 향상', 'IT 관리 공수 절감', '보안·컴플라이언스 강화'],
    feats: [
      { n: 'Microsoft 365', e: '문서·메일·협업 클라우드 통합' },
      { n: 'Azure', e: '인프라 유연 확장·비용 최적화' },
      { n: 'Teams', e: '채팅·회의·통화 일원화' },
      { n: 'Intune', e: '단말 정책 기반 원격 관리' },
      { n: 'Copilot', e: 'AI로 반복업무 자동화' },
    ],
  },
  {
    id: 'encora', area: '데이터 거버넌스', vendor: '엔코아',
    x: 83.0, y: 9.9, r: 32,
    desc: '데이터 표준·품질·계보를 체계적으로 관리합니다.',
    gain: ['데이터 신뢰도 확보', '규제 대응·감사 대비', '분석·AI 기반 마련'],
    feats: [
      { n: 'Metadata', e: '데이터 정의·표준 일원화' },
      { n: 'Catalog', e: '전사 데이터 검색·활용' },
      { n: 'Quality', e: '데이터 오류 사전 차단' },
      { n: 'Lineage', e: '데이터 흐름·영향 추적' },
      { n: '영향도분석', e: '변경 리스크 사전 파악' },
    ],
  },
  {
    id: 'ahn', area: '통합 보안 인프라', vendor: 'AhnLab',
    x: 16.8, y: 43.1, r: 37,
    desc: '단말부터 네트워크·클라우드까지 통합 보안을 구축합니다.',
    gain: ['랜섬웨어·침해 예방', '사고 대응 시간 단축', '통합 보안 가시성'],
    feats: [
      { n: 'V3', e: '단말 실시간 백신 방어' },
      { n: 'EDR', e: '이상행위 탐지·대응' },
      { n: 'XDR', e: '전 영역 위협 상관분석' },
      { n: '네트워크보안', e: '경계 트래픽 차단' },
      { n: '통합관제', e: '보안 이벤트 중앙 관제' },
    ],
  },
  {
    id: 'adobe', area: 'Contents Creative', vendor: 'Adobe',
    x: 83.6, y: 43.1, r: 37,
    desc: '콘텐츠 제작과 문서·전자서명을 하나로 연결합니다.',
    gain: ['콘텐츠 제작 속도 향상', '브랜드 일관성 확보', '정품 라이선스 관리'],
    feats: [
      { n: 'Photoshop', e: '이미지 제작·편집' },
      { n: 'Illustrator', e: '벡터 그래픽 제작' },
      { n: 'Premiere', e: '영상 편집·제작' },
      { n: 'Acrobat', e: '문서·전자서명 처리' },
      { n: 'Creative Cloud', e: '팀 자산 공유·협업' },
    ],
  },
  {
    id: 'est', area: '통합 유틸리티 / 백신', vendor: '이스트소프트',
    x: 23.2, y: 71.0, r: 34,
    desc: '백신·유틸리티를 중앙에서 배포·관리합니다.',
    gain: ['운영 공수 절감', '전사 표준화', '단말 보안 강화'],
    feats: [
      { n: '알약', e: '전사 백신 일괄 배포' },
      { n: '알툴즈', e: '압축·문서 표준 도구' },
      { n: '통합배포', e: '설치·업데이트 자동화' },
      { n: '백신관리', e: '감염 현황 모니터링' },
      { n: '단말상태', e: 'PC 상태 실시간 확인' },
    ],
  },
  {
    id: 'auto', area: '설계', vendor: 'Autodesk',
    x: 77.0, y: 71.0, r: 34,
    desc: 'BIM·CAD 설계를 하나의 흐름으로 통합합니다.',
    gain: ['설계 생산성 향상', '도면 이력·표준 관리', '현장 협업 강화'],
    feats: [
      { n: 'AutoCAD', e: '2D 도면 표준화' },
      { n: 'BIM', e: '건축·설비 정보 통합 설계' },
      { n: 'Inventor', e: '기계 3D 설계' },
      { n: 'Vault', e: '도면 버전·이력 관리' },
      { n: 'Construction Cloud', e: '현장 협업 일원화' },
    ],
  },
  {
    id: 'doctor', area: 'ITAM · PC OFF', vendor: '닥터소프트',
    x: 50.0, y: 85.0, r: 33,
    desc: 'IT 자산·라이선스·PC 상태를 통합 관리합니다.',
    gain: ['라이선스 비용 절감', '자산 가시성 확보', '전력·운영비 절감'],
    feats: [
      { n: 'IT자산', e: 'HW·SW 자산 현황 파악' },
      { n: '라이선스', e: '미사용·중복 절감' },
      { n: 'PC OFF', e: '비업무시간 절전' },
      { n: '절전정책', e: '전력비 최적화' },
      { n: '운영리포트', e: '자산 운영 근거 확보' },
    ],
  },
];
