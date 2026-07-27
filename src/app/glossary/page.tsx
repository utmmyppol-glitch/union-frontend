'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ── 현재 취급 제품/솔루션 기반 실제 용어 ── */

interface Term {
  term: string;
  full?: string;
  def: string;
  category: string;
}

const GLOSSARY: Term[] = [
  // 보안
  { term: 'EPP', full: 'Endpoint Protection Platform', def: '안티바이러스·방화벽·행위 기반 탐지를 통합한 엔드포인트 보안 플랫폼. AhnLab V3가 대표 제품입니다.', category: '보안' },
  { term: 'EDR', full: 'Endpoint Detection & Response', def: '엔드포인트에서 발생하는 위협을 실시간 탐지하고, 감염 경로를 추적하여 대응하는 보안 기술. AhnLab EDR, ESTsecurity EDR이 해당됩니다.', category: '보안' },
  { term: 'MDS', full: 'Malware Defense System', def: '샌드박스 기반 동적 분석으로 APT 공격, 랜섬웨어, 제로데이 위협을 사전 차단하는 AhnLab 솔루션입니다.', category: '보안' },
  { term: 'DLP', full: 'Data Loss Prevention', def: 'USB·네트워크·출력물 등 모든 유출 경로를 차단하여 기업 내부 정보의 무단 유출을 방지합니다. OfficeKeeper가 대표 제품입니다.', category: '보안' },
  { term: 'APT', full: 'Advanced Persistent Threat', def: '특정 기업·기관을 겨냥해 장기간 잠복하며 정보를 탈취하는 지능형 지속 공격. EDR과 MDS로 대응합니다.', category: '보안' },
  { term: 'ASM', full: 'Asset-based Security Management', def: 'IT 자산의 보안 상태를 통합적으로 파악하고 취약점을 관리하는 ESTsecurity 솔루션입니다.', category: '보안' },
  // 자산관리
  { term: 'DMS', full: 'Desktop Management System', def: 'PC 자산의 하드웨어/소프트웨어 정보를 자동 수집하고 관리하는 NetClient 모듈입니다. 설치 소프트웨어 현황 파악, 원격 배포를 지원합니다.', category: '자산관리' },
  { term: 'PMS', full: 'Patch Management System', def: 'Windows 보안 패치와 소프트웨어 업데이트를 중앙에서 관리하는 NetClient 모듈입니다. 자동 패치 적용으로 보안 취약점을 최소화합니다.', category: '자산관리' },
  { term: 'PC-OFF', def: '주 52시간 근로시간제에 맞춘 PC 사용시간 기반 근무 관리 기능. 업무 종료 후 미사용 PC를 자동 종료하여 전력도 절감합니다. NetClient 모듈입니다.', category: '자산관리' },
  { term: 'HSM', full: 'Host Security Management', def: '내부 정보 외부 유출 방지, 불법 소프트웨어 통제, PC 보안 점검 및 미디어 보안 관리를 담당하는 NetClient 모듈입니다.', category: '자산관리' },
  { term: 'ITAM', full: 'IT Asset Management', def: '기업 내 모든 IT 자산(PC·서버·SW 라이선스)의 현황을 파악하고 비용을 최적화하는 관리 체계. NetClient로 구현합니다.', category: '자산관리' },
  // 데이터
  { term: 'DA#', def: '엔코아(EN-CORE)의 데이터 모델링 및 설계 표준 도구. 전사 데이터 거버넌스의 시작점으로, 메타데이터·품질·계보를 체계적으로 관리합니다.', category: '데이터' },
  { term: 'BIM', full: 'Building Information Modeling', def: '건축물의 3D 모델에 시공·운영 정보를 결합하는 설계 방식. Autodesk Revit이 대표 도구입니다.', category: '데이터' },
  // 라이선스·계약
  { term: 'CSP', full: 'Cloud Solution Provider', def: 'Microsoft 클라우드 제품(M365·Azure)을 직접 공급하는 공인 파트너 프로그램. 유니온시스템즈는 CSP 파트너입니다.', category: '라이선스' },
  { term: 'VIP', full: 'Value Incentive Plan', def: 'Adobe 기업용 라이선스 프로그램. 수량에 따라 할인이 적용되며 중앙 관리 콘솔을 제공합니다.', category: '라이선스' },
  { term: 'SLA', full: 'Service Level Agreement', def: '서비스 수준 협약. 장애 대응 시간, 가동률 등 운영 기준을 계약으로 명시합니다. Microsoft 365는 99.9% SLA를 보장합니다.', category: '라이선스' },
  { term: 'TCO', full: 'Total Cost of Ownership', def: '제품 구매 비용뿐 아니라 운영·유지보수·교육 비용까지 포함한 총소유비용. 라이선스 최적화의 핵심 지표입니다.', category: '라이선스' },
  // 인프라
  { term: 'SSO', full: 'Single Sign-On', def: '하나의 계정으로 여러 시스템에 접근하는 인증 방식. Microsoft 365 + Azure AD 환경에서 구현됩니다.', category: '인프라' },
  { term: 'MDM', full: 'Mobile Device Management', def: '모바일 기기를 원격으로 관리·보안 정책 적용하는 기술. Microsoft Intune이 해당됩니다.', category: '인프라' },
];

const CATEGORIES = ['전체', ...Array.from(new Set(GLOSSARY.map((g) => g.category)))];

export default function GlossaryPage() {
  const [cat, setCat] = useState('전체');
  const [search, setSearch] = useState('');

  const filtered = GLOSSARY.filter((g) => {
    const matchCat = cat === '전체' || g.category === cat;
    const matchSearch =
      !search ||
      g.term.toLowerCase().includes(search.toLowerCase()) ||
      (g.full && g.full.toLowerCase().includes(search.toLowerCase())) ||
      g.def.includes(search);
    return matchCat && matchSearch;
  });

  return (
    <>
      {/* Hero */}
      <section
        style={{
          padding: '120px clamp(20px, 4vw, 52px) 48px',
          background: 'linear-gradient(135deg, #111214 0%, #2B2C30 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.06) 0.5px, transparent 0.5px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
          <span
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
              fontWeight: 800,
              letterSpacing: '.18em',
              fontSize: 12,
              color: 'var(--accent)',
              background: 'rgba(255,255,255,.08)',
              padding: '5px 12px',
            }}
          >
            GLOSSARY
          </span>
          <h1
            style={{
              fontSize: 'clamp(28px, 4.5vw, 48px)',
              fontWeight: 900,
              letterSpacing: '-.03em',
              marginTop: 16,
              lineHeight: 1.2,
              fontFamily: "'Pretendard', sans-serif",
            }}
          >
            IT · 보안 용어사전
          </h1>
          <p
            style={{
              opacity: 0.7,
              fontSize: 16,
              marginTop: 12,
              maxWidth: 640,
              fontFamily: "'Pretendard', sans-serif",
            }}
          >
            유니온시스템즈가 취급하는 제품과 관련된 IT·보안 핵심 용어를 정리했습니다.
          </p>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(32px, 4vw, 48px) clamp(20px, 4vw, 52px) clamp(60px, 8vw, 100px)',
        }}
      >
        {/* Filters */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: 28,
          }}
        >
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                style={{
                  padding: '8px 16px',
                  border: `1px solid ${cat === c ? 'var(--accent)' : 'var(--line)'}`,
                  background: cat === c ? 'var(--accent)' : 'transparent',
                  color: cat === c ? '#fff' : 'var(--ink2)',
                  fontFamily: "'Pretendard', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all .15s',
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 0 }}>
            <input
              type="text"
              placeholder="용어 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') setSearch(''); }}
              style={{
                padding: '10px 16px',
                border: '1px solid var(--line)',
                borderRight: 'none',
                background: 'var(--bg)',
                fontFamily: "'Pretendard', sans-serif",
                fontSize: 14,
                color: 'var(--ink)',
                width: 200,
                outline: 'none',
              }}
            />
            <button
              onClick={() => { /* 검색은 실시간 필터링이므로 별도 동작 없음 */ }}
              style={{
                padding: '10px 14px',
                border: '1px solid var(--line)',
                background: 'var(--accent)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6" stroke="#fff" strokeWidth="2" />
                <path d="M13.5 13.5L17 17" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  padding: '10px 12px',
                  border: '1px solid var(--line)',
                  borderLeft: 'none',
                  background: 'var(--surface)',
                  color: 'var(--ink2)',
                  cursor: 'pointer',
                  fontFamily: "'Pretendard', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                초기화
              </button>
            )}
          </div>
        </div>

        {/* Terms grid */}
        <div
          className="glossary-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 14,
          }}
        >
          {filtered.map((t) => (
            <div
              key={t.term}
              style={{
                border: '1px solid var(--line)',
                background: 'var(--surface)',
                padding: '24px 26px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                    fontSize: 16,
                    fontWeight: 900,
                    letterSpacing: '.02em',
                    color: 'var(--ink)',
                  }}
                >
                  {t.term}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--accent)',
                    background: 'var(--soft)',
                    padding: '2px 8px',
                  }}
                >
                  {t.category}
                </span>
              </div>
              {t.full && (
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--ink2)',
                    marginBottom: 6,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                  }}
                >
                  {t.full}
                </p>
              )}
              <p
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.7,
                  color: 'var(--ink2)',
                  fontFamily: "'Pretendard', sans-serif",
                }}
              >
                {t.def}
              </p>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p
            style={{
              textAlign: 'center',
              padding: 40,
              color: 'var(--ink2)',
              fontSize: 15,
              fontFamily: "'Pretendard', sans-serif",
            }}
          >
            검색 결과가 없습니다.
          </p>
        )}

        {/* CTA */}
        <div
          style={{
            marginTop: 48,
            background: 'var(--accent)',
            color: '#fff',
            padding: 'clamp(32px, 5vw, 48px)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Pretendard', sans-serif" }}>
              용어가 어렵게 느껴지시나요?
            </h3>
            <p
              style={{
                fontSize: 14,
                opacity: 0.8,
                marginTop: 6,
                fontFamily: "'Pretendard', sans-serif",
              }}
            >
              전문 컨설턴트가 우리 회사에 꼭 필요한 솔루션을 쉽게 설명해드립니다.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link
              href="/contact"
              style={{
                padding: '12px 24px',
                background: '#fff',
                color: 'var(--ink)',
                fontFamily: "'Pretendard', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: 'none',
              }}
            >
              무료 상담 신청
            </Link>
            <Link
              href="/estimate"
              style={{
                padding: '12px 24px',
                border: '1px solid rgba(255,255,255,.4)',
                color: '#fff',
                fontFamily: "'Pretendard', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: 'none',
              }}
            >
              온라인 견적
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .glossary-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 861px) and (max-width: 1100px) {
          .glossary-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  );
}
