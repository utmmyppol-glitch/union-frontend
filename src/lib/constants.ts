import type { NavItem } from '@/types';

export const SITE = {
  name: '유니온시스템즈',
  nameEn: 'UNION SYSTEMS',
  tel: '02-706-8999',
  fax: '02-706-8990',
  emailSales: 'sales@unionsystems.co.kr',
  emailGeneral: 'ud@unionsystems.co.kr',
  address:
    '서울시 성동구 아차산로17길 49, 1209~1210호 (성수동2가, 생각공장데시앙플렉스)',
  ceo: '홍민석',
  bizNo: '120-87-96801',
} as const;

export const COLORS = {
  primary: '#111214',
  accent: '#111214',
  purple: '#2B2C30',
  green: '#059669',
} as const;

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Company',
    href: '/company',
    children: [
      { label: '기업소개', href: '/company/about' },
      { label: '주요연혁', href: '/company/history' },
    ],
  },
  {
    label: 'Software',
    href: '/software',
    children: [
      { label: 'Microsoft', href: '/software/microsoft' },
      { label: 'ESTsoft', href: '/software/estsoft' },
      { label: 'Autodesk', href: '/software/autodesk' },
      { label: 'Adobe', href: '/software/adobe' },
    ],
  },
  {
    label: 'Solution',
    href: '/solution',
    children: [
      {
        label: '데이터',
        href: '/solution/data',
        children: [
          { label: 'DA#', href: '/solution/data/da' },
        ],
      },
      {
        label: '자산관리',
        href: '/solution/asset-management',
        children: [
          { label: 'NetClient', href: '/solution/asset-management/netclient' },
        ],
      },
      {
        label: '보안',
        href: '/solution/security',
        children: [
          { label: 'AhnLab', href: '/solution/security/ahnlab' },
          { label: 'ESTsecurity', href: '/solution/security/estsecurity' },
          { label: 'OfficeKeeper', href: '/solution/security/officekeeper' },
        ],
      },
    ],
  },
  {
    label: 'Customer',
    href: '/support/notices',
    children: [
      { label: '공지사항', href: '/support/notices' },
      { label: '1:1 문의', href: '/support/inquiry' },
      { label: '기술지원', href: '/support/tech' },
      { label: '이벤트', href: '/support/events' },
    ],
  },
  {
    label: 'Insights',
    href: '/insights',
  },
  {
    label: 'Estimate',
    href: '/estimate',
    badge: true,
  },
  {
    label: 'SAM',
    href: '/license-alert',
    children: [
      { label: '라이선스 관리 상담', href: '/license-alert' },
      { label: '보안 점검', href: '/security-check' },
      { label: 'IT·보안 용어사전', href: '/glossary' },
    ],
  },
  {
    label: '도입문의',
    href: '/contact',
  },
];
