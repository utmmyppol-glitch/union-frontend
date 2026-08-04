'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { E, safeParse, useEditMode, useEditableManifest, EDITABLE_STYLES } from '@/lib/editable';

/* ── 실제 취급 제품 기반 데이터 ── */

const SIZE_OPTIONS = [
  { label: '10명 이하', value: 'small' },
  { label: '11~50명', value: 'mid' },
  { label: '51~200명', value: 'large' },
  { label: '200명 이상', value: 'enterprise' },
];

const AREA_OPTIONS = [
  { label: '엔드포인트 보안', value: 'endpoint' },
  { label: '정보유출 방지(DLP)', value: 'dlp' },
  { label: 'IT 자산관리', value: 'asset' },
  { label: '오피스 SW (M365·Adobe)', value: 'office' },
  { label: '데이터 거버넌스', value: 'data' },
  { label: '설계 SW (Autodesk)', value: 'cad' },
];

const TYPE_OPTIONS = [
  { label: '신규 도입', value: 'new' },
  { label: '리뉴얼·갱신', value: 'renewal' },
  { label: '비용 절감 상담', value: 'cost' },
];

interface RecoItem {
  areas: string[];
  product: string;
}

const RECO_MAP: RecoItem[] = [
  { areas: ['endpoint'], product: 'AhnLab V3 · EDR' },
  { areas: ['endpoint'], product: 'ESTsecurity 알약 · EDR' },
  { areas: ['dlp'], product: 'OfficeKeeper DLP' },
  { areas: ['asset'], product: 'NetClient (DMS·PMS·PC-OFF·HSM)' },
  { areas: ['office'], product: 'Microsoft 365' },
  { areas: ['office'], product: 'Adobe Creative Cloud' },
  { areas: ['data'], product: 'DA# 데이터 모델링' },
  { areas: ['cad'], product: 'Autodesk (AutoCAD·Revit·Inventor)' },
];

/* ── 기본값 (편집 가능 콘텐츠) ── */
const DEFAULT_HERO = {
  badge: 'ONLINE ESTIMATE',
  title: '온라인 견적',
  desc: '회사 규모·관심 분야·문의 유형 3가지만 고르면, 우리 회사에 맞는 제품 구성과 상담 요청서를 즉시 만들어 드립니다. 담당 컨설턴트가 당일 내 상세 견적으로 답합니다.',
  stat1_num: '3',
  stat1_unit: 'STEP',
  stat1_sub: '약 3분 소요',
  stat2_unit: '분야',
  stat2_sub: '보안·자산·오피스·데이터',
  stat3_num: '당일',
  stat3_unit: '회신',
  stat3_sub: '회신 보장',
};

const DEFAULT_CONFIGS = [
  {
    tag: 'STARTER',
    scale: '~50인',
    title: '소기업 기본 구성',
    items: [
      'AhnLab V3 엔드포인트 보안',
      'ESTsoft 알툴즈 기업용',
      'Microsoft 365 Business',
      'NetClient DMS 자산관리',
    ],
    note: '필수 보안과 업무 SW를 먼저 갖추는 구성입니다.',
  },
  {
    tag: 'STANDARD',
    scale: '50~200인',
    title: '중견 통합 구성',
    items: [
      'AhnLab V3 + EDR 이중 보안',
      'OfficeKeeper DLP 정보유출 방지',
      'NetClient 4모듈 통합 (DMS·PMS·PC-OFF·HSM)',
      'Microsoft 365 E3 + Adobe CC',
    ],
    note: '보안·자산·생산성을 하나의 운영 체계로 통합합니다.',
  },
  {
    tag: 'ENTERPRISE',
    scale: '200인+',
    title: '대기업 거버넌스 구성',
    items: [
      'AhnLab V3 + EDR + MDS 다계층 보안',
      'OfficeKeeper DLP + 매체 제어',
      'NetClient 전사 자산 거버넌스',
      'DA# 데이터 모델링·표준화',
      'Microsoft 365 E5 + Autodesk Collection',
    ],
    note: '전사 보안·자산·데이터 거버넌스를 통합 설계합니다.',
  },
];

const DEFAULT_SAMPLE = {
  badge: 'SAMPLE CONFIGURATIONS',
  title: '규모별 추천 구성 예시',
  desc: '아래는 규모별로 자주 도입하는 대표 구성입니다. 견적 도구로 우리 회사에 맞게 조정할 수 있습니다.',
};

const DEFAULT_CTA = {
  title: '맞춤 견적이 필요하신가요?',
  desc: '전화 또는 이메일로 문의하시면 담당 컨설턴트가 직접 안내드립니다.',
  btn_contact: '도입문의',
  btn_tel: '02-706-8999',
};

export default function EstimatePageClient({
  ssrContent,
}: {
  ssrContent: Record<string, string>;
}) {
  const editMode = useEditMode();
  useEditableManifest(editMode);

  /* ── 편집 가능 state ── */
  const [hero, setHero] = useState(() => safeParse(ssrContent.estimate_hero, DEFAULT_HERO));
  const [sample, setSample] = useState(() => safeParse(ssrContent.estimate_sample, DEFAULT_SAMPLE));
  const [configs, setConfigs] = useState(() => safeParse(ssrContent.estimate_configs, DEFAULT_CONFIGS));
  const [cta, setCta] = useState(() => safeParse(ssrContent.estimate_cta, DEFAULT_CTA));

  /* ── content-update 메시지 수신 ── */
  useEffect(() => {
    if (!editMode) return;
    const setters: Record<string, (v: unknown) => void> = {
      estimate_hero: setHero as (v: unknown) => void,
      estimate_sample: setSample as (v: unknown) => void,
      estimate_configs: setConfigs as (v: unknown) => void,
      estimate_cta: setCta as (v: unknown) => void,
    };
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'content-update') {
        const fn = setters[e.data.section];
        if (fn) fn(e.data.data);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [editMode]);

  /* ── 견적 빌더 로컬 상태 ── */
  const [size, setSize] = useState<string | null>(null);
  const [areas, setAreas] = useState<string[]>([]);
  const [type, setType] = useState<string | null>(null);

  const toggleArea = (v: string) =>
    setAreas((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  const ready = size && type;

  const recoProducts =
    areas.length > 0
      ? RECO_MAP.filter((r) => r.areas.some((a) => areas.includes(a))).map((r) => r.product)
      : ['보안 진단', '통합 구축 제안'];

  const sizeLabel = SIZE_OPTIONS.find((o) => o.value === size)?.label ?? '';
  const typeLabel = TYPE_OPTIONS.find((o) => o.value === type)?.label ?? '';

  const builderTitle = ready
    ? `${sizeLabel} · ${typeLabel} 맞춤 구성`
    : '3단계를 선택해 주세요';

  const builderSummary = ready
    ? `${sizeLabel} 규모, ${typeLabel} 기준으로 ${areas.length ? areas.length + '개 분야를' : '핵심 분야를'} 통합한 구성을 제안드립니다. 상담 요청 시 담당 컨설턴트가 상세 견적을 안내합니다.`
    : '회사 규모·관심 분야·문의 유형을 선택하면 추천 구성과 예상 상담 방향을 만들어 드립니다.';

  const optStyle = (selected: boolean): React.CSSProperties => ({
    padding: '13px 18px',
    border: `2px solid ${selected ? 'var(--accent)' : 'var(--line)'}`,
    background: selected ? 'var(--accent)' : 'transparent',
    color: selected ? '#fff' : 'var(--ink)',
    fontFamily: "'Pretendard', sans-serif",
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    transition: 'all .2s',
    textAlign: 'center' as const,
  });

  const chipStyle = (selected: boolean): React.CSSProperties => ({
    padding: '10px 18px',
    border: `2px solid ${selected ? 'var(--accent)' : 'var(--line)'}`,
    background: selected ? 'var(--accent)' : 'transparent',
    color: selected ? '#fff' : 'var(--ink)',
    fontFamily: "'Pretendard', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all .15s',
  });

  return (
    <>
      {editMode && <style>{EDITABLE_STYLES}</style>}

      {/* Hero */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #111214 0%, #2B2C30 100%)',
          padding: 'clamp(100px, 12vw, 140px) clamp(20px, 4vw, 52px) clamp(48px, 6vw, 72px)',
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
            <E id="estimate_hero.badge" editMode={editMode}>{hero.badge}</E>
          </span>
          <h1
            style={{
              color: '#fff',
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 900,
              letterSpacing: '-.03em',
              marginTop: 16,
              lineHeight: 1.1,
              fontFamily: "'Pretendard', sans-serif",
            }}
          >
            <E id="estimate_hero.title" editMode={editMode}>{hero.title}</E>
            <span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,.7)',
              fontSize: 16,
              lineHeight: 1.75,
              marginTop: 16,
              maxWidth: 560,
              fontFamily: "'Pretendard', sans-serif",
            }}
          >
            <E id="estimate_hero.desc" editMode={editMode}>{hero.desc}</E>
          </p>
          <div
            style={{
              display: 'flex',
              gap: 'clamp(28px, 5vw, 56px)',
              marginTop: 32,
              flexWrap: 'wrap',
            }}
          >
            {/* stat1 */}
            <div>
              <div
                style={{
                  color: '#fff',
                  fontSize: 30,
                  fontWeight: 900,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                }}
              >
                <E id="estimate_hero.stat1_num" editMode={editMode}>{hero.stat1_num}</E>
                <span style={{ fontSize: 15, color: 'var(--accent)', marginLeft: 2 }}>
                  <E id="estimate_hero.stat1_unit" editMode={editMode}>{hero.stat1_unit}</E>
                </span>
              </div>
              <div style={{ color: 'rgba(255,255,255,.45)', fontSize: 12, marginTop: 4 }}>
                <E id="estimate_hero.stat1_sub" editMode={editMode}>{hero.stat1_sub}</E>
              </div>
            </div>
            {/* stat2 */}
            <div>
              <div
                style={{
                  color: '#fff',
                  fontSize: 30,
                  fontWeight: 900,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                }}
              >
                {String(AREA_OPTIONS.length)}
                <span style={{ fontSize: 15, color: 'var(--accent)', marginLeft: 2 }}>
                  <E id="estimate_hero.stat2_unit" editMode={editMode}>{hero.stat2_unit}</E>
                </span>
              </div>
              <div style={{ color: 'rgba(255,255,255,.45)', fontSize: 12, marginTop: 4 }}>
                <E id="estimate_hero.stat2_sub" editMode={editMode}>{hero.stat2_sub}</E>
              </div>
            </div>
            {/* stat3 */}
            <div>
              <div
                style={{
                  color: '#fff',
                  fontSize: 30,
                  fontWeight: 900,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                }}
              >
                <E id="estimate_hero.stat3_num" editMode={editMode}>{hero.stat3_num}</E>
                <span style={{ fontSize: 15, color: 'var(--accent)', marginLeft: 2 }}>
                  <E id="estimate_hero.stat3_unit" editMode={editMode}>{hero.stat3_unit}</E>
                </span>
              </div>
              <div style={{ color: 'rgba(255,255,255,.45)', fontSize: 12, marginTop: 4 }}>
                <E id="estimate_hero.stat3_sub" editMode={editMode}>{hero.stat3_sub}</E>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Builder */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(48px, 7vw, 80px) clamp(20px, 4vw, 52px) 0' }}>
        <div
          className="est-builder"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.25fr .75fr',
            gap: 1,
            background: 'var(--line)',
            border: '1px solid var(--line)',
          }}
        >
          {/* Left: Steps */}
          <div
            style={{
              background: 'var(--surface)',
              padding: 'clamp(28px, 4vw, 44px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
            }}
          >
            {/* Step 1: 규모 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
                <span
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                    fontSize: 13,
                    fontWeight: 900,
                    color: 'var(--accent)',
                    letterSpacing: '.08em',
                  }}
                >
                  STEP 01
                </span>
                <p style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Pretendard', sans-serif" }}>
                  회사 규모
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
                {SIZE_OPTIONS.map((o) => (
                  <button key={o.value} onClick={() => setSize(o.value)} style={optStyle(size === o.value)}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: 분야 */}
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 28 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
                <span
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                    fontSize: 13,
                    fontWeight: 900,
                    color: 'var(--accent)',
                    letterSpacing: '.08em',
                  }}
                >
                  STEP 02
                </span>
                <p style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Pretendard', sans-serif" }}>
                  관심 분야{' '}
                  <span style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>
                    · 복수 선택
                  </span>
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {AREA_OPTIONS.map((a) => (
                  <button key={a.value} onClick={() => toggleArea(a.value)} style={chipStyle(areas.includes(a.value))}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: 유형 */}
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 28 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
                <span
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                    fontSize: 13,
                    fontWeight: 900,
                    color: 'var(--accent)',
                    letterSpacing: '.08em',
                  }}
                >
                  STEP 03
                </span>
                <p style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Pretendard', sans-serif" }}>
                  문의 유형
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                {TYPE_OPTIONS.map((o) => (
                  <button key={o.value} onClick={() => setType(o.value)} style={optStyle(type === o.value)}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Result panel */}
          <div
            style={{
              background: '#111214',
              color: '#fff',
              padding: 'clamp(28px, 4vw, 44px)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '.14em',
                color: 'var(--accent)',
              }}
            >
              YOUR ESTIMATE
            </span>
            <h3
              style={{
                fontSize: 22,
                fontWeight: 800,
                marginTop: 16,
                lineHeight: 1.3,
                fontFamily: "'Pretendard', sans-serif",
              }}
            >
              {builderTitle}
            </h3>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,.6)',
                lineHeight: 1.75,
                marginTop: 12,
                fontFamily: "'Pretendard', sans-serif",
              }}
            >
              {builderSummary}
            </p>

            <div style={{ marginTop: 24 }}>
              <p
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '.1em',
                  color: 'rgba(255,255,255,.35)',
                  marginBottom: 10,
                }}
              >
                RECOMMENDED STACK
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {recoProducts.map((r) => (
                  <span
                    key={r}
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      border: '1px solid rgba(255,255,255,.2)',
                      padding: '7px 13px',
                      fontFamily: "'Pretendard', sans-serif",
                    }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: 'auto',
                paddingTop: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <Link
                href="/contact"
                style={{
                  display: 'block',
                  padding: '14px',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontFamily: "'Pretendard', sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
              >
                이 구성으로 상담 요청
              </Link>
              <span
                style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,.35)',
                  textAlign: 'center',
                  fontFamily: "'Pretendard', sans-serif",
                }}
              >
                당일 내 담당 컨설턴트가 연락드립니다.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Configs */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(48px, 7vw, 80px) clamp(20px, 4vw, 52px) 0' }}>
        <span
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            fontWeight: 800,
            letterSpacing: '.14em',
            fontSize: 13,
            color: 'var(--accent)',
          }}
        >
          <E id="estimate_sample.badge" editMode={editMode}>{sample.badge}</E>
        </span>
        <h2
          style={{
            fontSize: 'clamp(24px, 3.2vw, 36px)',
            fontWeight: 900,
            letterSpacing: '-.02em',
            marginTop: 10,
            fontFamily: "'Pretendard', sans-serif",
          }}
        >
          <E id="estimate_sample.title" editMode={editMode}>{sample.title}</E>
        </h2>
        <p
          style={{
            fontSize: 15,
            color: 'var(--ink2)',
            marginTop: 12,
            maxWidth: 600,
            lineHeight: 1.7,
            fontFamily: "'Pretendard', sans-serif",
          }}
        >
          <E id="estimate_sample.desc" editMode={editMode}>{sample.desc}</E>
        </p>
        <div
          className="est-configs"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginTop: 28,
          }}
        >
          {configs.map((c: { tag: string; scale: string; title: string; items: string[]; note: string }, ci: number) => (
            <div
              key={c.tag}
              style={{
                border: '1px solid var(--line)',
                background: 'var(--surface)',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                minHeight: 300,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '.06em',
                    color: 'var(--accent)',
                    background: 'var(--soft)',
                    padding: '5px 11px',
                  }}
                >
                  <E id={`estimate_configs[${ci}].tag`} editMode={editMode}>{c.tag}</E>
                </span>
                <span
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--ink2)',
                  }}
                >
                  <E id={`estimate_configs[${ci}].scale`} editMode={editMode}>{c.scale}</E>
                </span>
              </div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  letterSpacing: '-.01em',
                  fontFamily: "'Pretendard', sans-serif",
                }}
              >
                <E id={`estimate_configs[${ci}].title`} editMode={editMode}>{c.title}</E>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {c.items.map((it: string, ii: number) => (
                  <div
                    key={ii}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 9,
                      fontSize: 14,
                      color: 'var(--ink2)',
                      lineHeight: 1.5,
                      fontFamily: "'Pretendard', sans-serif",
                    }}
                  >
                    <span style={{ color: 'var(--accent)', fontWeight: 800, flexShrink: 0 }}>·</span>
                    <E id={`estimate_configs[${ci}].items[${ii}]`} editMode={editMode}>{it}</E>
                  </div>
                ))}
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: 'var(--ink2)',
                  lineHeight: 1.6,
                  marginTop: 'auto',
                  paddingTop: 12,
                  borderTop: '1px solid var(--line)',
                  fontFamily: "'Pretendard', sans-serif",
                }}
              >
                <E id={`estimate_configs[${ci}].note`} editMode={editMode}>{c.note}</E>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Band */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(48px, 7vw, 80px) clamp(20px, 4vw, 52px) clamp(60px, 8vw, 100px)',
        }}
      >
        <div
          style={{
            background: '#111214',
            padding: 'clamp(36px, 5vw, 56px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          <div>
            <h3
              style={{
                color: '#fff',
                fontSize: 'clamp(20px, 2.8vw, 28px)',
                fontWeight: 800,
                fontFamily: "'Pretendard', sans-serif",
              }}
            >
              <E id="estimate_cta.title" editMode={editMode}>{cta.title}</E>
            </h3>
            <p
              style={{
                color: 'rgba(255,255,255,.55)',
                fontSize: 15,
                marginTop: 8,
                fontFamily: "'Pretendard', sans-serif",
              }}
            >
              <E id="estimate_cta.desc" editMode={editMode}>{cta.desc}</E>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link
              href="/contact"
              style={{
                padding: '14px 28px',
                background: 'var(--accent)',
                color: '#fff',
                fontFamily: "'Pretendard', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                textDecoration: 'none',
              }}
            >
              <E id="estimate_cta.btn_contact" editMode={editMode}>{cta.btn_contact}</E>
            </Link>
            <a
              href={`tel:${cta.btn_tel.replace(/-/g, '')}`}
              style={{
                padding: '14px 28px',
                border: '1px solid rgba(255,255,255,.2)',
                color: '#fff',
                fontFamily: "'Pretendard', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                textDecoration: 'none',
              }}
            >
              <E id="estimate_cta.btn_tel" editMode={editMode}>{cta.btn_tel}</E>
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .est-builder { grid-template-columns: 1fr !important; }
          .est-configs { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
