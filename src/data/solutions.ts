/**
 * solutions.ts — 히어로 다이어그램 · 네비 · 솔루션 페이지의 유일한 데이터 원천
 * ★ 최종 마감본 색/좌표 반영 (풀스크린 확정본과 동일)
 *
 * 색 위계: Microsoft(코어)=가장 밝은 중심 / 보안·자산=차분한 청록·세이지 /
 *          데이터=블루 라벤더 / Adobe=샴페인 오렌지 / Autodesk=웜 베이지.
 * 페이지 액센트(CTA): #111214 (프라이머리 블루)
 */

// ─── 색그룹 ────────────────────────────────────────────
export type ColorGroup = 'platform' | 'protect' | 'create';

export const COLOR_GROUP_HEX: Record<ColorGroup, string> = {
  platform: '#A3A0C0',
  protect:  '#638E8F',
  create:   '#CC9962',
};

export const ACCENT = '#111214';

// ─── 플랫폼 코어 (중앙 노드) ──────────────────────────
export const PLATFORM_CORE = {
  label: 'Microsoft',
  sublabel: '플랫폼 코어',
  satellites: [
    { label: 'OS',      dx: 12,   dy: -150, size: 78 },
    { label: '클라우드', dx: -140, dy: -58,  size: 86 },
    { label: '협업',     dx: 150,  dy: 72,   size: 72 },
  ] as const,
  colorGroup: 'platform' as const,
  href: '/software/microsoft',
};

// ─── 히어로 다이어그램 노드 ────────────────────────────
export interface HeroNode {
  id: string;
  cat: string;
  co: string;
  ic: 'shield' | 'layers' | 'box' | 'play' | 'ruler';
  x: number;
  y: number;
  delay: number;
  colors: {
    c1: string;
    c2: string;
    rim: string;
    shc: string;
    tc: string;
    sc: string;
    sl: string;
  };
  ci?: string;
  sats: [string, number, number][];
  href: string;
  pitch: string;
  cta: string;
  more: string[];
  features: string[];
}

export const HERO_NODES: HeroNode[] = [
  {
    id: 'security',
    cat: '보안',
    co: 'V3 · 이스트',
    ic: 'shield',
    x: 386, y: 250, delay: 0.15,
    colors: {
      c1: '#8FBDE6', c2: '#4A82C0',
      rim: 'rgba(74,130,192,.4)',
      shc: 'rgba(70,110,160,.16)',
      tc: '#6C9DD4', sc: '#4A82C0', sl: '#B6D4F1',
    },
    ci: '#0067AC',
    sats: [['서버', -58, -92], ['메일 보안', 48, -104], ['엔드포인트', -104, -4]],
    href: '/solution/security/ahnlab',
    pitch: '엔드포인트·메일·서버를 한 화면에서 통합 관제합니다.',
    cta: '보안 솔루션 통합 상담하기',
    more: ['악성코드 대응', '24/7 보안 관제'],
    features: [
      'V3 Endpoint Security 기반 악성코드 차단',
      'AI EDR 실시간 위협 탐지·자동 대응',
      '방화벽·관제까지 통합 보안 체계 구축',
    ],
  },
  {
    id: 'dataware',
    cat: '데이터 거버넌스',
    co: '엔코아',
    ic: 'layers',
    x: 855, y: 195, delay: 0.24,
    colors: {
      c1: '#7FCBAF', c2: '#1E8A82',
      rim: 'rgba(30,138,130,.4)',
      shc: 'rgba(40,120,120,.16)',
      tc: '#4FAE9C', sc: '#1E8A82', sl: '#AADFC9',
    },
    ci: '#007379',
    sats: [['데이터 분류', -12, -108], ['접근 통제', 106, -56], ['문서 보안', 116, 22]],
    href: '/solution/data/da',
    pitch: '전사 데이터 흐름과 접근 권한을 실시간으로 가시화합니다.',
    cta: '데이터 거버넌스 도입 상담하기',
    more: ['개인정보·중요정보 관리', 'DB 암호화'],
    features: [
      'DA# 데이터 모델링 및 설계 표준',
      '전사 데이터 흐름 가시화',
      '접근 통제 및 문서 보안 체계',
    ],
  },
  {
    id: 'drsoft',
    cat: '자산관리',
    co: '닥터소프트',
    ic: 'box',
    x: 332, y: 522, delay: 0.34,
    colors: {
      c1: '#84CEDD', c2: '#2E9BB8',
      rim: 'rgba(46,155,184,.4)',
      shc: 'rgba(40,130,155,.16)',
      tc: '#5BB6CC', sc: '#2E9BB8', sl: '#AFE1ED',
    },
    ci: '#2E9BB8',
    sats: [['자산 가시화', -92, 74], ['라이선스', 14, 122]],
    href: '/solution/asset-management/netclient',
    pitch: 'IT 자산과 라이선스를 자동으로 추적하고 최적화합니다.',
    cta: '자산관리 진단 요청하기',
    more: ['SW 자산관리', '원격 제어'],
    features: [
      '분산된 IT 자산 실시간 가시화',
      '라이선스 현황 파악 및 비용 최적화',
    ],
  },
  {
    id: 'adobe',
    cat: '콘텐츠',
    co: 'Adobe',
    ic: 'play',
    x: 880, y: 545, delay: 0.42,
    colors: {
      c1: '#F3B77E', c2: '#C97B37',
      rim: 'rgba(201,123,55,.4)',
      shc: 'rgba(120,110,130,.16)',
      tc: '#E4A066', sc: '#D68A4A', sl: '#F7CFA4',
    },
    ci: '',
    sats: [['디자인', 110, -58], ['영상', 122, 16], ['마케팅', 94, 90]],
    href: '/software/adobe',
    pitch: '디자인·영상·마케팅 제작 환경을 통합 관리합니다.',
    cta: 'Adobe 라이선스 상담하기',
    more: ['Creative Cloud', '팀 라이선스'],
    features: [
      'Photoshop·Illustrator·InDesign 디자인 워크플로우',
      'Premiere Pro·After Effects 영상 제작',
      'Creative Cloud 라이선스 통합 관리',
    ],
  },
  {
    id: 'autodesk',
    cat: '설계',
    co: 'Autodesk',
    ic: 'ruler',
    x: 585, y: 735, delay: 0.52,
    colors: {
      c1: '#E3C489', c2: '#AB8033',
      rim: 'rgba(171,128,51,.4)',
      shc: 'rgba(120,110,130,.15)',
      tc: '#CEA85E', sc: '#BE9440', sl: '#EBD6A6',
    },
    ci: '#0696D7',
    sats: [['제조 · CAD', -90, 86], ['건축 · BIM', 56, 108]],
    href: '/software/autodesk',
    pitch: '설계·제조·건축 워크플로우를 하나로 연결합니다.',
    cta: 'Autodesk 도입 문의하기',
    more: ['Engineering Design', '정품 공급'],
    features: [
      'AutoCAD·Inventor 제조/기계 설계',
      'Revit 건축 BIM 설계 및 협업',
    ],
  },
];

// ─── 레거시 호환 (다른 컴포넌트에서 사용) ─────────────
export interface DiagramNode {
  id: string;
  label: string;
  partner: string;
  colorGroup: ColorGroup;
  subItems: string[];
  href: string;
  panel: {
    title: string;
    features: string[];
  };
}

export const DIAGRAM_NODES: DiagramNode[] = HERO_NODES.map((n) => ({
  id: n.id,
  label: n.cat,
  partner: n.co,
  colorGroup:
    n.id === 'security' || n.id === 'dataware' || n.id === 'drsoft'
      ? ('protect' as const)
      : ('create' as const),
  subItems: n.sats.map((s) => s[0]),
  href: n.href,
  panel: { title: n.cat, features: n.features },
}));

// ─── 히어로 카피 ──────────────────────────────────────
export const HERO_COPY = {
  badge: '기업 IT 플랫폼 파트너',
  headline: ['기업 IT 환경을', '하나의 흐름으로', '연결합니다.'],
  sub: '통합된 플랫폼 코어를 중심으로 보안·데이터·콘텐츠·설계·자산관리 분야를 유기적으로 연결하여, 효율적이고 안정적인 IT 환경을 제공합니다.',
  cta: { label: '프로젝트 상담하기', href: '/contact' },
  ctaSub: { label: '회사소개서 보기', href: '#' },
  partnerLogos: ['Microsoft', 'Adobe', 'Autodesk', '닥터소프트'],
};

// ─── 솔루션 포트폴리오 카드 ───────────────────────────
export interface SolutionCard {
  id: string;
  category: string;
  name: string;
  desc: string;
  tags: string[];
  href: string;
  colorGroup: ColorGroup;
}

export const SOLUTION_CARDS: SolutionCard[] = [
  {
    id: 'da',
    category: 'Data Governance',
    name: 'DA#',
    desc: '데이터 모델링 및 설계의 표준. 기업 데이터 거버넌스의 시작입니다.',
    tags: ['Design', 'Standardization'],
    href: '/solution/data/da',
    colorGroup: 'protect',
  },
  {
    id: 'netclient',
    category: 'Asset Management',
    name: 'NetClient',
    desc: '분산된 IT 자산의 실시간 가시성 확보 및 통합 제어 솔루션.',
    tags: ['Visibility', 'Control'],
    href: '/solution/asset-management/netclient',
    colorGroup: 'protect',
  },
  {
    id: 'ahnlab',
    category: 'Protection',
    name: 'AhnLab V3',
    desc: '엔드포인트 보안의 표준. 지능형 위협 탐지 및 대응 방어 체계.',
    tags: ['Endpoint', 'Detection'],
    href: '/solution/security/ahnlab',
    colorGroup: 'protect',
  },
  {
    id: 'adobe',
    category: 'Creative & Content',
    name: 'Adobe Enterprise',
    desc: '디지털 혁신을 위한 크리에이티브 워크플로우 통합 솔루션.',
    tags: ['Asset Cloud', 'Collaboration'],
    href: '/software/adobe',
    colorGroup: 'create',
  },
];
