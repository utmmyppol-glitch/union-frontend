import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IT 용어 사전',
  description: 'IT 인프라, 보안, 클라우드 관련 주요 용어를 알기 쉽게 정리했습니다.',
  openGraph: {
    title: 'IT 용어 사전 | 유니온시스템즈',
    description: 'IT 인프라, 보안, 클라우드 관련 주요 용어 사전.',
  },
};

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
