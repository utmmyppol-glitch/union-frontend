import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이벤트',
  description: '유니온시스템즈 진행 중인 이벤트, 프로모션, 할인 혜택을 확인하세요.',
  openGraph: {
    title: '이벤트 | 유니온시스템즈',
    description: '유니온시스템즈 이벤트 및 프로모션 안내.',
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
