# Union Frontend

유니온시스템즈 공식 홈페이지 프론트엔드.

백엔드(`union-backend`)의 `/api/union/` 엔드포인트를 사용한다.

## 기술 스택

- **Next.js 14** (App Router, standalone 빌드)
- **React 18** / TypeScript
- **Tailwind CSS**
- **GSAP** (스크롤 애니메이션)
- **DOMPurify** (HTML sanitize)
- **sharp** (이미지 최적화)

## 페이지 구성

| 경로 | 설명 |
|------|------|
| `/` | 메인 페이지 |
| `/company` | 회사소개 |
| `/solution`, `/solutions` | 솔루션 소개 |
| `/software` | 소프트웨어 |
| `/customer` | 고객 사례 |
| `/insights` | 인사이트 |
| `/glossary` | IT·보안 용어사전 |
| `/support` | 고객 지원 |
| `/contact` | 문의·상담 |
| `/calculator` | 라이선스 계산기 |
| `/estimate` | 견적 요청 |
| `/diagnostic` | 3분 진단 |
| `/security-check` | 보안 점검 |
| `/license-alert` | 라이선스 만료 알림 |
| `/privacy`, `/privacy-policy` | 개인정보처리방침 |

## 로컬 개발

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/union
```

> `NEXT_PUBLIC_API_URL`을 설정하지 않으면 기본값 `http://localhost:8080/api/union`으로 동작한다.

### 3. 개발 서버

```bash
npm run dev
```

`http://localhost:3000`에서 확인.

### 4. 프로덕션 빌드

```bash
npm run build
npm run start
```

`next.config.mjs`에서 `output: 'standalone'`으로 설정되어 있어서 빌드 결과를 `.next/standalone`으로 배포할 수 있다.

## 프로젝트 구조

```
src/
├── app/                     # 페이지 라우트
│   ├── page.tsx             # 메인 페이지
│   ├── HomePageClient.tsx   # 메인 페이지 클라이언트 컴포넌트
│   ├── layout.tsx           # 루트 레이아웃 (Header, Footer, 메뉴 SSR 로딩)
│   ├── company/             # 회사 소개
│   ├── solution/            # 솔루션
│   ├── software/            # 소프트웨어
│   ├── customer/            # 고객사례
│   ├── insights/            # 인사이트
│   ├── contact/             # 문의
│   ├── glossary/            # 용어집
│   ├── calculator/          # 견적 계산기
│   ├── robots.ts            # robots.txt 생성
│   └── sitemap.ts           # sitemap.xml 생성
├── components/
│   ├── layout/              # Header, Footer, ScrollReveal
│   ├── ui/                  # 공통 UI 컴포넌트
│   ├── ChannelTalk.tsx      # 채널톡 위젯
│   ├── UniMascot.tsx        # 마스코트
│   └── UnicornBrochure.tsx  # 브로슈어
└── lib/
    ├── api.ts               # ApiClient 클래스 (백엔드 API 호출)
    ├── constants.ts         # 상수 정의
    ├── editable.tsx         # CMS 인라인 편집 지원
    └── gsap-init.ts         # GSAP 초기화
```

## 주요 설정 (next.config.mjs)

### 이미지 도메인 허용

외부 이미지(뉴스 썸네일 등)를 `next/image`로 로딩하기 위해 아래 도메인이 허용되어 있다:

- `localhost:8080` (로컬 백엔드)
- `*.unionsystems.co.kr`
- `imgnews.pstatic.net`, `mimgnews.pstatic.net`, `s.pstatic.net` (네이버 뉴스)
- `t1.daumcdn.net` (다음)
- `thumb.mt.co.kr`, `image.zdnet.co.kr`, `img.etnews.com`, `cdn.digitaltoday.co.kr`, `cdn.aitimes.com`

### iframe 보안

`X-Frame-Options: SAMEORIGIN`과 CSP `frame-ancestors`를 설정하여 백오피스(`localhost:3002`, `admin.unionsystems.co.kr`)에서만 iframe 임베드를 허용한다. 이는 백오피스에서 콘텐츠 편집 시 미리보기를 위한 것이다.

## API 연동 방식

`src/lib/api.ts`의 `ApiClient` 클래스를 통해 백엔드와 통신한다:

- `apiClient.getPosts(category, page, size)` — 게시글 목록
- `apiClient.getPost(id)` — 게시글 상세
- `apiClient.getCustomerStories(industry, page, size)` — 고객사례
- `apiClient.submitInquiry(data)` — 문의 접수 (파일 첨부 지원)
- `apiClient.submitDownload(data)` — 다운로드 신청
- `apiClient.getBanners(position)` — 배너
- `apiClient.getClientLogos()` — 고객사 로고

메뉴는 `layout.tsx`에서 SSR 시점에 `/api/union/menus`를 호출하여 Header에 전달한다 (60초 revalidate).

## 연관 프로젝트

| 프로젝트 | 포트 | 설명 |
|----------|------|------|
| union-backend | 8080 | 백엔드 API |
| dataware-frontend | 3001 | 유니온데이터웨어 홈페이지 |
| backoffice | 3002 | 백오피스 관리자 |
