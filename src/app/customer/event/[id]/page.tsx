'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const EVENTS: Record<string, { title: string; date: string; status: string; content: string[] }> = {
  '1': { title: '5월 한정 어도비 기업용 라이선스 역대급 특가 프로모션', date: '2026.05', status: '종료', content: [
    'Adobe Creative Cloud 기업용 라이선스를 역대 최저가로 만나보세요!',
    '이벤트 기간: 2026년 5월 1일 ~ 5월 31일',
    '대상: 신규 도입 및 기존 고객 리뉴얼',
    '혜택: 연간 구독 시 최대 30% 할인 + 1개월 무료 연장',
    'Photoshop, Illustrator, Premiere Pro 등 20개 이상의 크리에이티브 앱을 팀 전체에서 활용하세요.',
    '문의: sales@unionsystems.co.kr / 02-706-8999',
  ]},
  '2': { title: '2026 오토캐드 설문 & 상담 이벤트', date: '2026.02', status: '종료', content: [
    'AutoCAD 사용 현황 설문에 참여하고, 맞춤 상담을 받아보세요!',
    '이벤트 기간: 2026년 2월 1일 ~ 2월 28일',
    '참여 방법: 간단한 설문(3분) 작성 후 상담 신청',
    '혜택: 설문 참여자 전원 스타벅스 아메리카노 제공, 상담 후 도입 시 추가 할인',
    'AutoCAD, Inventor, Revit 등 Autodesk 전 제품 상담 가능합니다.',
  ]},
  '3': { title: 'Copilot Business 신제품 출시 기념 프로모션', date: '2026.01', status: '종료', content: [
    'Microsoft Copilot for Business 출시를 기념한 특별 프로모션!',
    '이벤트 기간: 2026년 1월 15일 ~ 2월 15일',
    'Microsoft 365 Business Standard/Premium 신규 구독 시 Copilot 1개월 무료 체험 제공.',
    'AI 기반 업무 자동화로 문서 작성, 이메일 요약, 데이터 분석을 혁신하세요.',
    '유니온시스템즈 CSP 파트너를 통해 가장 합리적인 가격으로 도입할 수 있습니다.',
  ]},
  '4': { title: '유니온 케어팩 오픈! 백신 구매 프로모션', date: '2025.11', status: '종료', content: [
    '유니온 케어팩이 새롭게 오픈했습니다!',
    '이벤트 기간: 2025년 11월 ~ 12월',
    'AhnLab V3, ESTsecurity 알약 등 기업용 백신 솔루션을 케어팩으로 묶어 합리적인 가격에 제공합니다.',
    '케어팩 구성: 백신 라이선스 + 기술지원 + 정기 점검',
    '기존 고객 리뉴얼 시 10% 추가 할인 혜택.',
  ]},
  '5': { title: '2025 DA# 조달 캠페인', date: '2025.11', status: '종료', content: [
    'DA# 데이터 모델링 솔루션 조달 캠페인!',
    '이벤트 기간: 2025년 11월 ~ 12월',
    '공공기관, 지방자치단체 대상 DA# 조달 구매 시 특별 혜택을 제공합니다.',
    '혜택: 조달 구매 시 무료 교육(2일) + 기술지원 1년 포함',
    '나라장터를 통한 간편 구매가 가능합니다.',
  ]},
  '6': { title: 'DA~드리는 DA# 여름 할인 이벤트', date: '2025.07', status: '종료', content: [
    '여름맞이 DA# 특별 할인 이벤트!',
    '이벤트 기간: 2025년 7월 ~ 8월',
    'DA# Standard, DA# DQ Edition 신규 구매 시 최대 20% 할인.',
    '데이터 모델링의 시작, 이번 여름에 합리적으로 시작하세요.',
  ]},
  '7': { title: '유니온시스템즈 x AutoCAD 여름 프로모션', date: '2025.06', status: '종료', content: [
    'AutoCAD 여름 프로모션!',
    '이벤트 기간: 2025년 6월 ~ 7월',
    'AutoCAD 신규 연간 구독 시 특별 할인가 적용.',
    'AEC Collection, Product Design Collection도 함께 할인 중입니다.',
  ]},
  '8': { title: 'Microsoft 365 무상 제공 프로모션', date: '2025.03', status: '종료', content: [
    'Microsoft 365 무상 제공 프로모션!',
    '이벤트 기간: 2025년 3월 ~ 4월',
    '10인 이상 기업 신규 도입 시 1개월 무상 제공.',
    'Word, Excel, PowerPoint, Teams, OneDrive를 팀 전체가 사용해보세요.',
  ]},
  '9': { title: '2025 을사년 맞이 BBAM! 프로모션', date: '2025.02', status: '종료', content: [
    '2025 을사년 새해맞이 BBAM! 프로모션!',
    '이벤트 기간: 2025년 2월',
    '유니온시스템즈 전 제품 대상 새해 특별 할인.',
    '새해에도 유니온시스템즈와 함께 스마트한 IT 환경을 만들어가세요.',
  ]},
};

export default function EventDetailPage() {
  const { id } = useParams();
  const event = EVENTS[id as string];

  if (!event) {
    return (
      <section style={{ padding: '200px clamp(20px,4vw,52px)', textAlign: 'center', background: 'var(--bg)' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <h1 style={{ fontWeight: 900, fontSize: 32, color: 'var(--ink)', marginBottom: 16 }}>이벤트를 찾을 수 없습니다</h1>
        <Link href="/customer/event" style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink)', textDecoration: 'none' }}>&larr; 이벤트 목록으로</Link>
      </section>
    );
  }

  const statusColor = event.status === '진행중' ? '#059669' : '#94A3B8';

  return (<>
    <section style={{ padding: '120px clamp(20px,4vw,52px) 48px', background: 'var(--bg)' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Link href="/customer/event" style={{ fontWeight: 600, fontSize: 18, color: 'var(--ink)', textDecoration: 'none', marginBottom: 24, display: 'inline-block' }}>&larr; 이벤트</Link>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
          <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 0, background: `${statusColor}15`, color: statusColor, fontWeight: 700, fontSize: 18 }}>{event.status}</span>
          <span style={{ fontWeight: 500, fontSize: 18, color: 'var(--ink2)' }}>{event.date}</span>
        </div>
        <h1 style={{ fontWeight: 900, fontSize: 'clamp(24px,4vw,36px)', lineHeight: 1.3, letterSpacing: '-.03em', color: 'var(--ink)' }}>{event.title}</h1>
      </div>
    </section>
    <section style={{ padding: '0 clamp(20px,4vw,52px) clamp(60px,8vw,100px)', background: 'var(--bg)' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {event.content.map((p, i) => (
          <p key={i} style={{ fontWeight: 400, fontSize: 18, lineHeight: 1.9, color: 'var(--ink2)', marginBottom: 24 }}>{p}</p>
        ))}
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 32, marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Link href="/customer/event" style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink)', textDecoration: 'none' }}>&larr; 목록으로 돌아가기</Link>
          <Link href="/contact" style={{ padding: '12px 28px', borderRadius: 0, background: 'var(--ink)', color: '#fff', fontWeight: 700, fontSize: 18, textDecoration: 'none' }}>도입 문의하기</Link>
        </div>
      </div>
    </section>
  </>);
}
