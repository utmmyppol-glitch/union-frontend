'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Container } from '@/components/ui';

/* ── Data ── */
const solutions = [
  { code: 'DA#', cat: 'DATA MODELING \u00B7 국내 총판', name: '전사 데이터 모델링', desc: '논리·물리 데이터 모델을 설계하고 전사 표준을 관리하는 국내 대표 데이터 모델링 툴입니다.', stat: '100%', statL: '데이터 표준화 달성', color: '#111214', feats: ['논리/물리 모델링', '데이터 표준화', 'Forward / Reverse Engineering', '영향도 분석', '품질진단 DQ Edition'] },
  { code: 'NetClient', cat: 'PC MANAGEMENT', name: '통합 PC 관리', desc: 'IT 자산부터 패치·근태·보안까지, 흩어져 있던 PC 관리를 하나로 통합합니다.', stat: '22%', statL: '라이선스 비용 절감', color: '#2B2C30', feats: ['IT 자산관리 (DMS)', '패치관리 (PMS)', '근로시간관리 (PC-OFF)', '보안관리 (HSM)', '원격 제어'] },
  { code: 'AhnLab', cat: 'SECURITY \u00B7 No.1', name: '엔드포인트 통합 보안', desc: 'V3 엔드포인트부터 방화벽·관제까지, 국내 1위 통합 보안 체계를 구축합니다.', stat: '35%', statL: '위협 탐지율 향상', color: '#F5333F', feats: ['V3 Endpoint Security', 'EPP 통합 보안', 'MDS 악성코드 방어', 'TrusGuard 방화벽', '24/7 보안 관제'] },
  { code: 'ESTsecurity', cat: 'EDR \u00B7 AI 기반', name: 'AI 기반 EDR', desc: 'AI가 위협 행위를 실시간으로 탐지하고 자동 대응하는 차세대 엔드포인트 보안입니다.', stat: '실시간', statL: '위협 탐지·자동 대응', color: '#6B655C', feats: ['AI 위협 탐지', '실시간 행위 모니터링', '자동 대응', '위협 헌팅', '포렌식 분석'] },
  { code: 'OfficeKeeper', cat: 'DLP \u00B7 정보유출 방지', name: '정보유출 방지 DLP', desc: '매체·네트워크·출력물까지 모든 유출 경로를 차단하는 정보보안 솔루션입니다.', stat: '전방위', statL: '유출 경로 차단', color: '#6B655C', feats: ['매체 제어 (USB)', '네트워크 유출 차단', '출력물 보안', '파일 암호화', '사용자 행위 감사'] },
] as const;

/* ── Accordion Row ── */
function AccordionRow({
  s,
  idx,
  open,
  toggle,
}: {
  s: typeof solutions[number];
  idx: number;
  open: boolean;
  toggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [bodyHeight, setBodyHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setBodyHeight(bodyRef.current.scrollHeight);
    }
  }, [open]);

  const num = String(idx + 1).padStart(2, '0');

  return (
    <div style={{ borderBottom: '1px solid var(--line)' }}>
      {/* Header */}
      <button
        onClick={toggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '20px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'var(--ink)',
        }}
      >
        <span
          style={{
            fontFamily: "'Pretendard', sans-serif",
            fontWeight: 600,
            fontSize: 18,
            color: 'var(--ink2)',
            minWidth: 28,
          }}
        >
          {num}
        </span>
        <span
          style={{
            fontFamily: "'Pretendard', sans-serif",
            fontWeight: 800,
            fontSize: 22,
            color: open ? s.color : 'var(--ink)',
            transition: 'color .3s',
          }}
        >
          {s.code}
        </span>
        <span
          className="hidden sm:inline"
          style={{
            fontFamily: "'Pretendard', sans-serif",
            fontWeight: 600,
            fontSize: 18,
            color: 'var(--ink2)',
          }}
        >
          {s.name}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: 22,
            fontWeight: 300,
            lineHeight: 1,
            transition: 'transform .35s ease',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            color: 'var(--ink2)',
          }}
        >
          +
        </span>
      </button>

      {/* Body */}
      <div
        style={{
          maxHeight: open ? bodyHeight : 0,
          overflow: 'hidden',
          transition: 'max-height .45s ease',
        }}
      >
        <div ref={bodyRef} style={{ paddingLeft: 44, paddingBottom: 28 }}>
          <div
            className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr]"
            style={{ gap: 28 }}
          >
            {/* Left */}
            <div>
              <span
                style={{
                  fontFamily: "'Pretendard', sans-serif",
                  fontWeight: 600,
                  fontSize: 18,
                  letterSpacing: '.08em',
                  color: s.color,
                  textTransform: 'uppercase',
                }}
              >
                {s.cat}
              </span>
              <p
                style={{
                  fontFamily: "'Pretendard', sans-serif",
                  fontWeight: 400,
                  fontSize: 18,
                  lineHeight: 1.7,
                  color: 'var(--ink2)',
                  marginTop: 10,
                }}
              >
                {s.desc}
              </p>
              {/* Stat badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 16,
                  padding: '6px 14px',
                  borderRadius: 0,
                  background: `${s.color}18`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Pretendard', sans-serif",
                    fontWeight: 800,
                    fontSize: 18,
                    color: s.color,
                  }}
                >
                  {s.stat}
                </span>
                <span
                  style={{
                    fontFamily: "'Pretendard', sans-serif",
                    fontWeight: 500,
                    fontSize: 18,
                    color: s.color,
                  }}
                >
                  {s.statL}
                </span>
              </div>
            </div>

            {/* Right - feature list */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {s.feats.map((f) => (
                <li
                  key={f}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '6px 0',
                    fontFamily: "'Pretendard', sans-serif",
                    fontWeight: 500,
                    fontSize: 18,
                    color: 'var(--ink)',
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: s.color,
                      flexShrink: 0,
                    }}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Section ── */
const SolutionsSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="py-20 lg:py-28" style={{ background: 'var(--bg)' }}>
      <Container>
        {/* Section Title */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span
            style={{
              fontFamily: "'Pretendard', sans-serif",
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: '.14em',
              color: 'var(--ink2)',
              textTransform: 'uppercase',
            }}
          >
            SOFTWARE &middot; SOLUTIONS
          </span>
          <h2
            style={{
              fontFamily: "'Pretendard', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(28px, 4vw, 46px)',
              lineHeight: 1.1,
              letterSpacing: '-.04em',
              color: 'var(--ink)',
              marginTop: 12,
            }}
          >
            5대 전문 솔루션
          </h2>
        </div>

        {/* Accordion */}
        <div style={{ borderTop: '1px solid var(--line)' }}>
          {solutions.map((s, i) => (
            <AccordionRow
              key={s.code}
              s={s}
              idx={i}
              open={openIdx === i}
              toggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default SolutionsSection;
