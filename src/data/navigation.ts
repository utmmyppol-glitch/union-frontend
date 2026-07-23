export interface NavNode {
  label: string;
  href?: string;
  children?: NavNode[];
}

export const NAVIGATION: NavNode[] = [
  {
    label: '회사소개',
    href: '/company',
    children: [
      { label: '기업소개', href: '/company/about' },
      { label: '주요연혁', href: '/company/history' },
      { label: '오시는 길', href: '/company/location' },
    ],
  },
  {
    label: '소프트웨어',
    href: '/software',
    children: [
      { label: 'Microsoft 365', href: '/software/microsoft' },
      { label: 'ESTsoft (알툴즈)', href: '/software/estsoft' },
      { label: 'Autodesk', href: '/software/autodesk' },
      { label: 'Adobe CC', href: '/software/adobe' },
    ],
  },
  {
    label: '솔루션',
    href: '/solution',
    children: [
      {
        label: '데이터',
        children: [
          { label: 'DA#', href: '/solution/data/da' },
        ],
      },
      {
        label: '자산관리',
        children: [
          { label: 'NetClient', href: '/solution/asset-management/netclient' },
        ],
      },
      {
        label: '보안',
        children: [
          { label: 'AhnLab', href: '/solution/security/ahnlab' },
          { label: 'ESTsecurity', href: '/solution/security/estsecurity' },
          { label: 'OfficeKeeper', href: '/solution/security/officekeeper' },
        ],
      },
    ],
  },
  {
    label: '고객지원',
    href: '/support/notices',
    children: [
      { label: '공지사항', href: '/support/notices' },
      { label: '1:1 문의', href: '/support/inquiry' },
      { label: '기술지원', href: '/support/tech' },
      { label: '이벤트', href: '/support/events' },
    ],
  },
  {
    label: '인사이트',
    href: '/insights',
  },
];
