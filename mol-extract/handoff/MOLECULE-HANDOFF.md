# UNION SYSTEMS Hero — Molecular Platform 핸드오프 (Claude Code용)

대상: `Union_frontend/` (Next.js 14 App Router). 히어로 우측 3D 분자 시각화를 이 스펙대로 구현/교체.
레퍼런스 구현: `Union Hero 3D.dc.html` (이 프로젝트에 포함 — 동작·수치 그대로 참고).
핵심 에셋: `hero/union-u-brand.png` → `public/images/union-u-brand.png` 로 복사해 사용 (투명 배경 U 렌더, 펄·실버·레드).

---

## 0. 콘셉트 (3초 메시지)
"유니온시스템즈 = 여러 IT 솔루션을 **하나의 플랫폼(U)** 으로 연결·운영하는 회사."
- Idle: **U 자체가 브랜드/플랫폼** (렌더 이미지).
- Click: U가 줌인되며 사라지고, 그 솔루션의 **내부 분자(궤도 + 기능 비드)** 가 펼쳐짐 → 좌측이 상세로 전환 → 도입문의.
- 흐름: 브랜드(U) → 플랫폼 → 솔루션 → 기능 → 도입.

## 1. 레이아웃 (1520×920 기준, 반응형 clamp 권장)
- Header: 로고 / GNB(회사소개·소프트웨어·솔루션·고객·인사이트) / 우측 CTA(소개서 다운로드 아웃라인 · 도입 문의하기 solid).
- 좌측(≈42%): 두 레이어가 교차 페이드.
  - `#idle` (기본): eyebrow(레드 라인+ENTERPRISE IT PLATFORM) → 헤드라인 → 서브카피 → 안내문 → 통계 3개.
  - `#detail` (줌인 시): ← 돌아가기 / eyebrow / 솔루션명(대) / 벤더 / 설명 / 기능 태그 / 도입문의·소개서 CTA.
- 우측(≈58%): `#stage`(U 이미지 + 핫스팟) 와 `#micro`(펼침 궤도) 오버레이. `#labels`(플로팅 라벨) 최상위.

## 2. 디자인 토큰 (globals.css 그대로)
`--bg #FBFAF7 · --surface #FFFFFF · --ink #111214 · --ink2 #6B655C · --line #E7E2D8 · --accent #F5333F`
- 브랜드 액센트는 `--accent #F5333F` 하나. eyebrow 라인, 헤드라인 마침표, CTA solid, 노드 마커, 레드 비드, 활성 링에만.
- 배경: `radial-gradient(125% 115% at 64% 32%, #fff, #f5f6f8 58%, #eceef1)`.
- 폰트: Pretendard. 버튼 radius 8px, 태그 pill.
- U 이미지 필터: `drop-shadow(0 28px 44px rgba(70,80,100,.08))` (광 이미 눌러둠, 추가 필터 최소).

## 3. 데이터 모델 (⚠ 정보는 팀이 채움 — 구조만)
`molecular-data.ts`. U 렌더의 노드 위치에 맞춰 hotspot 좌표(%)를 매핑.
```ts
export interface Feature { n: string; e: string; }   // n=기능명, e=도입 효과 한 줄
export interface Solution {
  id: string;
  area: string;      // 업무 영역 (크게)
  vendor: string;    // 벤더 (작게)
  vc: string;        // 노드 포인트 색 (기본 '#F5333F' 또는 벤더 식별색)
  desc: string;      // 솔루션 한 줄 설명   ← 팀 작성
  feats: Feature[];  // 4~5개              ← 팀 작성 (n, e)
  hotspot: { x: number; y: number };       // U 이미지 위 % 좌표
}
export const SOLUTIONS: Solution[] = [
  { id:'ms',    area:'IT 인프라 · 협업', vendor:'Microsoft',   vc:'#2f6fd0', desc:'', feats:[], hotspot:{x:23,y:14} },
  { id:'ahn',   area:'통합 보안 인프라', vendor:'AhnLab',      vc:'#F5333F', desc:'', feats:[], hotspot:{x:15,y:40} },
  { id:'est',   area:'통합 유틸리티/백신', vendor:'이스트소프트', vc:'#2f8fb0', desc:'', feats:[], hotspot:{x:22,y:70} },
  { id:'itam',  area:'ITAM · PC OFF',   vendor:'닥터소프트',   vc:'#F5333F', desc:'', feats:[], hotspot:{x:44,y:86} },
  { id:'auto',  area:'설계',            vendor:'Autodesk',    vc:'#3f8f57', desc:'', feats:[], hotspot:{x:67,y:80} },
  { id:'adobe', area:'Contents Creative', vendor:'Adobe',     vc:'#F5333F', desc:'', feats:[], hotspot:{x:82,y:34} },
  { id:'data',  area:'데이터 거버넌스',  vendor:'엔코아',      vc:'#2ba79a', desc:'', feats:[], hotspot:{x:83,y:10} },
];
```
좌측 통계 3개(예: 핵심 솔루션 7 / 보안 솔루션 20+ / 고객사 4,000+)도 상수로 → 팀이 값 확정.

## 4. 상태 (State Machine)
`idle → hovering(node i) → zoomed(solution i) → featurePicked(i,k)` / 복귀 `zoomed→idle` (← 버튼·ESC·외부클릭).
- 한 번에 하나만 zoom. zoom 중 hover 비활성.

## 5. 인터랙션 & 동적 요소 (전부 구현)

### 5-1. Idle
- U 이미지 `@keyframes floatUp`: `translateY(0→-10→0)`, 9s ease-in-out 무한.
- 각 hotspot: 상시 **노드 마커**(흰 dot 15px + 레드 1.5px 테두리 + `hsPulse` 확산 링 2.4s) → 클릭 지점 명확.
- 플로팅 라벨(각 솔루션): 글래스 pill(반투명 흰 + blur), 좌열은 왼쪽/우열은 오른쪽/하단은 아래로 오프셋. 항상 정방향.

### 5-2. Hover (node i)
- 해당 hotspot ring opacity 0→1 + 96→150px 확대(.35s).
- 라벨: 선택 i는 opacity 1, 나머지 0.32.
- (선택) U 위 해당 영역만 살짝 밝게.

### 5-3. Click (zoom-in) — "공 안으로"
- `#stage` `transform-origin`을 클릭 hotspot의 (x%,y%)로 설정.
- `#stage` → `scale(3.6)` + `opacity 0` (transition .7s cubic-bezier(.55,0,.35,1)) = 그 노드가 화면을 꽉 채우며 빨려들어가듯 사라짐.
- `#idle` opacity→0, `#detail` opacity→1 (내용 채움).
- `#micro` 조립 시작(아래).

### 5-4. Micro 궤도 (펼침) — 카드 금지
- 중심 **글라스 코어** 230px: `radial-gradient(circle at 37% 28%, #fff, #f4f5f8 42%, vc16% 78%, vc30%)` + inner 하이라이트/코어 글로우 + 상단 스펙큘러 점. 안에 area(23px 800) + vendor(15px 700 vc). 등장 `micIn`(scale .6→1, .55s, 백이즈).
- **궤도 타원**(SVG ellipse rx384 ry336) 은은한 회색 stroke, `satPop`로 페이드.
- **기능 비드**: 타원 위 균등 배치(시작 -90°). 60px 펄 글라스 비드(`radial-gradient` 흰→실버 + 하이라이트 점 + 그림자). 소수(k=0, 중앙)만 레드 비드(vc). 중심→비드 얇은 라인(레드/실버). 비드마다 바깥쪽 라벨: 기능명 19px 800 + 효과 14px(hover 시 펼침). stagger `satPop`(0.18+k*0.07s).
- 비드 hover: `scale 1.2` + 효과 텍스트 max-height 0→28px 페이드.
- 비드 click → `featurePicked`: 좌측 `#detail`을 "기능명 / 도입 효과 / 도입문의 강조"로 전환(§5-5).

### 5-5. Feature picked
- eyebrow=`VENDOR / 기능명`, title=기능명, vendor=area, desc=`도입 효과 — {e}. …`.
- 도입문의 CTA 살짝 pop(scale 1.04, .26s) 해서 전환 유도.

### 5-6. 복귀
- ← / ESC / 배경클릭 → `#stage` scale(1)+opacity1, `#idle`복귀, `#detail`숨김, `#micro` 비움, 라벨/ring 초기화.

## 6. 애니메이션 keyframes (CSS)
```css
@keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
@keyframes hsPulse { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.5);opacity:0} }
@keyframes micIn  { from{opacity:0;transform:translate(-50%,-50%) scale(.6)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
@keyframes satPop { from{opacity:0;transform:translate(-50%,-50%) scale(.2)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
/* #stage: transition opacity .7s, transform .7s cubic-bezier(.55,0,.35,1) */
```

## 7. 반응형 / 성능 / 접근성
- ≤1024px: 좌우 세로 스택. U는 상단 배치 축소, 라벨은 U 아래로. micro는 전체폭.
- ≤640px: U 정적(floatUp만), 7개 라벨 목록형 유지, click 시 micro 대신 세로 리스트 상세.
- hotspot·비드는 실제 `<button>`(aria-label=area). ESC/외부클릭 닫힘. `prefers-reduced-motion`: floatUp/pulse/stagger 정지, 전환 즉시.
- U 이미지 `<img>` 1장이라 성능 부담 없음. micro는 DOM/SVG(가벼움).

## 8. HeroSection.tsx 통합
- 기존 `dynamic(() => import('@/components/MolecularHero'), {ssr:false})` 및 `<MolecularHero/>` 사용부를 새 컴포넌트로 교체.
- 좌측 카피/역할탭/CTA/Header 기존 유지. 우측 시각 영역만 이 스펙으로.
- 컴포넌트 분리 권장: `MolecularHero.tsx`(상태·레이아웃) / `molecular-data.ts`(콘텐츠) / CSS는 module 또는 styled.

## 9. 완료 기준
- 3초 안에 7개 솔루션명 읽힘 / 클릭 지점 명확(마커) / 클릭 시 줌인+궤도 펼침이 "짜치지 않고" 프리미엄 / 도입문의로 연결 / 브랜드 레드 단일 액센트 / 기존 좌측·Header 보존.
