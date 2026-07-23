'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const NOTICES: Record<string, { title: string; date: string; content: string[] }> = {
  '1': { title: '유니온시스템즈 기업문화 – 3) 소통왕을 찾아라', date: '2022.09.15', content: [
    '유니온 소통왕을 찾아라!',
    '메일, 사내 메신저, 카톡으로 업무를 하다 보면 텍스트만으로는 전달이 어려운 상황이 발생합니다. 유니온시스템즈에서는 이런 커뮤니케이션 갭을 줄이기 위해 다양한 소통 문화를 운영하고 있습니다.',
    '주간 회의, 월간 타운홀 미팅, 분기별 워크숍을 통해 팀 간 벽을 허물고, 자유로운 의견 교환이 이루어집니다.',
    '특히 "소통왕" 제도는 한 달간 가장 적극적으로 소통에 기여한 직원을 선정하여 소정의 상품을 지급하는 프로그램입니다.',
  ]},
  '2': { title: '[채용] 실력있는 마케터, 디자이너 모집', date: '2022.08.10', content: [
    '유니온시스템즈는 2010년 4월부터 기업, 공공기관의 IT 인프라구축에 필요한 S/W, 솔루션 공급 및 기술지원 서비스를 제공하고 있습니다.',
    '함께 성장할 마케터, 디자이너를 모집합니다.',
    '- 마케터: 콘텐츠 기획, SNS 운영, 퍼포먼스 마케팅 경험자 우대',
    '- 디자이너: 웹/앱 UI 디자인, 영상 편집 가능자 우대',
    '지원 방법: sales@unionsystems.co.kr로 포트폴리오와 이력서를 보내주세요.',
  ]},
  '3': { title: '찾아가는 설명회 – 충북대학교병원 (데이터품질관리)', date: '2022.08.05', content: [
    '유니온시스템즈에서는 2022.6.29 데이터 품질관리 세미나를 진행했습니다.',
    '충북대학교병원 정보전산팀을 방문하여 DA# DQ Edition을 활용한 데이터 품질관리 방법론과 실제 적용 사례를 공유했습니다.',
    '병원 내 산재한 환자 데이터, 의료 기록의 표준화 필요성과 DA#을 활용한 해결 방안을 제시하였으며, 참석자들의 높은 관심을 받았습니다.',
  ]},
  '4': { title: '유니온시스템즈 기업문화 – 2) 일하는 법', date: '2022.07.28', content: [
    '유니온시스템즈 밖에서도 유니온, 안에서도 유니온.',
    '자기애가 넘치는 회사! 유니온시스템즈의 일하는 방식을 소개합니다.',
    '1. 자율 출퇴근제: 코어타임(10:00~16:00) 외에는 자유롭게 근무 시간을 조정할 수 있습니다.',
    '2. 원격 근무: 주 1회 재택근무가 가능합니다.',
    '3. 자기계발 지원: 도서 구매비, 온라인 강의 수강료를 지원합니다.',
  ]},
  '5': { title: '유니온시스템즈 기업문화 – 1) 점심 회식', date: '2022.07.20', content: [
    '도란도란 점심회식.',
    '유니온시스템즈에는 점심 회식 문화가 있습니다. 매월 팀별로 맛집을 탐방하며, 업무 외의 이야기를 나누는 시간을 갖고 있습니다.',
    '저녁 회식 대신 점심 회식을 선택한 이유는 워라밸을 중시하는 우리의 문화 때문입니다. 퇴근 후 시간은 온전히 개인의 것이니까요.',
  ]},
  '6': { title: '제2회 데이터품질관리 세미나 (22년 7월)', date: '2022.07.15', content: [
    '제 2회 데이터 품질관리 세미나를 성공적으로 개최했습니다.',
    '성수동 생각담장 2F 세미나실에서 진행된 이번 세미나에는 공공기관, 금융, 의료 분야의 데이터 담당자 30여 명이 참석했습니다.',
    '주요 발표 내용: 데이터 품질관리 방법론, DA# DQ Edition 시연, 실제 도입 사례 공유.',
    '다음 세미나는 2022년 10월에 예정되어 있습니다.',
  ]},
  '7': { title: '유니온시스템즈 상반기 워크숍 (22년 6월)', date: '2022.06.30', content: [
    '2022년 상반기 워크숍을 진행했습니다.',
    '평소에 나누지 못했던 깊은 대화로 사업 방향, 서비스 품질에 대한 초심을 찾을 수 있었습니다.',
    '각 팀별 상반기 성과 공유, 하반기 목표 설정, 그리고 팀 빌딩 활동을 통해 조직 결속력을 강화했습니다.',
  ]},
  '8': { title: '유니온시스템즈, 전산실 사람들 통해 넷클라이언트 무료체험 지원', date: '2021.09.10', content: [
    '데이터넷 기사 — 넷클라이언트 무료체험 지원 프로그램을 시작합니다.',
    '유니온시스템즈가 IT 자산관리 솔루션 "넷클라이언트"의 무료 체험 프로그램을 "전산실 사람들" 커뮤니티를 통해 제공합니다.',
    '30일간 전 기능을 무료로 사용해볼 수 있으며, 체험 후 도입 상담까지 원스톱으로 지원합니다.',
  ]},
  '9': { title: '엔코아, 유니온시스템즈와 DA# 총판 협약 체결', date: '2021.02.15', content: [
    '전자신문 기사 — 엔코아 DA# 총판 협약 체결.',
    '엔코아(대표 이화식)와 유니온시스템즈(대표 홍민석)가 데이터 모델링 솔루션 DA#의 총판 협약을 체결했습니다.',
    '이번 협약을 통해 유니온시스템즈는 DA# 제품의 유통, 기술지원, 교육 서비스를 전담하게 됩니다.',
    '양사는 데이터 거버넌스 시장 확대를 위해 긴밀히 협력할 예정입니다.',
  ]},
  '10': { title: '유니온시스템즈, 데이터 솔루션 사업 강화', date: '2020.03.17', content: [
    '아이티데일리 — 유니온시스템즈가 데이터 솔루션 사업을 강화하고 있습니다.',
    'SW 유통 중심에서 데이터 분석·표준화 솔루션으로 사업 영역을 확장합니다.',
    '엔코아 DA# 공인총판으로서 데이터 모델링, 품질관리 시장 공략에 본격 나섰습니다.',
  ]},
  '11': { title: '새해 福 많이 받으세요', date: '2022.01.03', content: [
    '유니온시스템즈 임직원 모두 새해 복 많이 받으세요!',
    '2022년에도 고객 여러분께 최고의 IT 솔루션과 서비스를 제공하겠습니다.',
    '새해에도 유니온시스템즈를 많은 관심과 사랑 부탁드립니다.',
  ]},
};

export default function NoticeDetailPage() {
  const { id } = useParams();
  const notice = NOTICES[id as string];

  if (!notice) {
    return (
      <section style={{ padding: '200px clamp(20px,4vw,52px)', textAlign: 'center', background: 'var(--bg)' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <h1 style={{ fontWeight: 900, fontSize: 32, color: 'var(--ink)', marginBottom: 16 }}>글을 찾을 수 없습니다</h1>
        <Link href="/customer/notice" style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink)', textDecoration: 'none' }}>&larr; 공지사항 목록으로</Link>
      </section>
    );
  }

  return (<>
    <section style={{ padding: '120px clamp(20px,4vw,52px) 48px', background: 'var(--bg)' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Link href="/customer/notice" style={{ fontWeight: 600, fontSize: 18, color: 'var(--ink)', textDecoration: 'none', marginBottom: 24, display: 'inline-block' }}>&larr; 공지사항</Link>
        <span style={{ display: 'inline-block', padding: '5px 12px', borderRadius: 0, background: '#11121410', color: 'var(--ink)', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>공지사항</span>
        <h1 style={{ fontWeight: 900, fontSize: 'clamp(24px,4vw,36px)', lineHeight: 1.3, letterSpacing: '-.03em', color: 'var(--ink)', marginBottom: 14 }}>{notice.title}</h1>
        <p style={{ fontWeight: 500, fontSize: 18, color: 'var(--ink2)' }}>{notice.date}</p>
      </div>
    </section>
    <section style={{ padding: '0 clamp(20px,4vw,52px) clamp(60px,8vw,100px)', background: 'var(--bg)' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {notice.content.map((p, i) => (
          <p key={i} style={{ fontWeight: 400, fontSize: 18, lineHeight: 1.9, color: 'var(--ink2)', marginBottom: 24 }}>{p}</p>
        ))}
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 32, marginTop: 40 }}>
          <Link href="/customer/notice" style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink)', textDecoration: 'none' }}>&larr; 목록으로 돌아가기</Link>
        </div>
      </div>
    </section>
  </>);
}
