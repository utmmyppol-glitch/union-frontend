import SolutionDiagnostic from '@/features/diagnostic/SolutionDiagnostic';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3분 진단',
  description: '3가지 질문에 답하면 우리 회사에 맞는 IT 솔루션을 추천해드립니다.',
  openGraph: {
    title: '3분 진단 | 유니온시스템즈',
    description: '3가지 질문으로 맞춤 IT 솔루션 추천.',
  },
};

export default function Page() {
  return <SolutionDiagnostic />;
}
