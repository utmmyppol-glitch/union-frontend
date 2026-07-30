import { Metadata } from 'next';
import NoticesPageClient from './NoticesPageClient';

export const metadata: Metadata = {
  title: '공지사항',
  description: '유니온시스템즈 최신 소식, 채용 공고, 파트너십, 이벤트 안내',
  openGraph: {
    title: '공지사항 | 유니온시스템즈',
    description: '유니온시스템즈 최신 소식, 채용 공고, 파트너십, 이벤트 안내',
  },
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const UP = '/images/uploads/';
const PER_PAGE = 6;

const SAMPLE_NOTICES = [
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

async function getNotices() {
  try {
    const res = await fetch(`${API_BASE_URL}/posts?category=NOTICE&page=0&size=${PER_PAGE}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return {
      content: SAMPLE_NOTICES.slice(0, PER_PAGE),
      totalPages: Math.ceil(SAMPLE_NOTICES.length / PER_PAGE),
      first: true,
      last: false,
    };
  }
}

export default async function NoticesPage() {
  const data = await getNotices();
  return <NoticesPageClient initialData={data} />;
}
