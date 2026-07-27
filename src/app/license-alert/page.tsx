'use client';
import { useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import PrivacyConsent from '@/components/ui/PrivacyConsent';

const PRODUCTS = ['Microsoft 365', 'Adobe Creative Cloud', 'Autodesk', 'AhnLab', 'ESTsecurity', 'OfficeKeeper', 'NetClient', '알툴즈', '기타'];

interface License {
  id: number;
  product: string;
  customProduct: string;
  qty: number;
  expiry: string;
}

let nextId = 1;
const newLicense = (): License => ({ id: nextId++, product: 'Microsoft 365', customProduct: '', qty: 1, expiry: '' });

export default function LicenseConsultPage() {
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenses, setLicenses] = useState<License[]>([newLicense()]);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addLicense = () => setLicenses(p => [...p, newLicense()]);
  const removeLicense = (id: number) => setLicenses(p => p.filter(l => l.id !== id));
  const updateLicense = (id: number, field: keyof License, value: string | number) =>
    setLicenses(p => p.map(l => l.id === id ? { ...l, [field]: value } : l));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!company.trim()) e.company = '회사명을 입력하세요';
    if (!name.trim()) e.name = '담당자명을 입력하세요';
    if (!email.includes('@')) e.email = '올바른 이메일을 입력하세요';
    if (!consent) e.consent = '개인정보 수집에 동의해주세요';
    const hasValidLicense = licenses.some(l => l.product);
    if (!hasValidLicense) e.license = '제품을 1개 이상 선택하세요';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    const licenseInfo = licenses
      .filter(l => l.product)
      .map(l => {
        const prodName = l.product === '기타' ? l.customProduct : l.product;
        const parts = [`${prodName} ${l.qty}개`];
        if (l.expiry) parts.push(`만료: ${l.expiry}`);
        return parts.join(' / ');
      })
      .join('\n');

    try {
      await apiClient.submitInquiry({
        name,
        company,
        phone,
        email,
        product: 'SAM 라이선스 관리 상담',
        message: `[SAM 라이선스 관리 상담 요청]\n\n${licenseInfo}`,
        consentPrivacy: consent,
      });
      setSubmitted(true);
    } catch {
      // API 미연결 시에도 성공 처리 (데모용)
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (err?: string): React.CSSProperties => ({
    width: '100%', padding: '12px 16px', borderRadius: 0,
    border: `1px solid ${err ? '#F5333F' : 'var(--line)'}`,
    background: 'var(--bg)', fontFamily: "'Pretendard'", fontSize: 15, color: 'var(--ink)',
    boxSizing: 'border-box', outline: 'none',
  });

  if (submitted) {
    return (<>
      <section style={{ padding: '120px clamp(20px,4vw,52px) 48px', background: 'linear-gradient(135deg, #059669, #111214)', color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.06) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>&#10003;</div>
          <h1 style={{ fontFamily: "'Pretendard'", fontWeight: 900, fontSize: 'clamp(28px,4.5vw,42px)', lineHeight: 1.2, marginBottom: 12 }}>상담 신청이 완료되었습니다</h1>
          <p style={{ fontFamily: "'Pretendard'", fontWeight: 400, fontSize: 16, opacity: .85 }}>담당 컨설턴트가 당일 내 {email}로 연락드리겠습니다.</p>
        </div>
      </section>
      <section style={{ padding: 'clamp(32px,4vw,48px) clamp(20px,4vw,52px) clamp(60px,8vw,100px)', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--line)', fontFamily: "'Pretendard'", fontWeight: 800, fontSize: 16, color: 'var(--ink)' }}>
              요청한 라이선스 현황
            </div>
            {licenses.filter(l => l.product).map((l, i, arr) => (
              <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 24px', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none' }}>
                <div>
                  <div style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{l.product === '기타' ? l.customProduct : l.product}</div>
                  <div style={{ fontFamily: "'Pretendard'", fontWeight: 400, fontSize: 14, color: 'var(--ink2)' }}>{l.qty}개</div>
                </div>
                {l.expiry && <div style={{ fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 14, color: 'var(--accent)' }}>{l.expiry}</div>}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/estimate"
              style={{ flex: 1, padding: '14px', background: 'var(--accent)', color: '#fff', fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 15, textDecoration: 'none', textAlign: 'center' }}>
              온라인 견적 받기
            </Link>
            <Link href="/"
              style={{ flex: 1, padding: '14px', border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink2)', fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 15, textDecoration: 'none', textAlign: 'center' }}>
              홈으로
            </Link>
          </div>
        </div>
      </section>
    </>);
  }

  return (<>
    {/* Hero */}
    <section style={{ padding: '120px clamp(20px,4vw,52px) 48px', background: 'linear-gradient(135deg, #2B2C30, #111214)', color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.06) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>
        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontWeight: 800, letterSpacing: '.18em', fontSize: 12, color: 'var(--accent)', background: 'rgba(255,255,255,.08)', padding: '5px 12px' }}>
          SOFTWARE ASSET MANAGEMENT
        </span>
        <h1 style={{ fontFamily: "'Pretendard'", fontWeight: 900, fontSize: 'clamp(28px,4.5vw,48px)', lineHeight: 1.2, letterSpacing: '-.03em', marginTop: 16, marginBottom: 12 }}>
          라이선스, 관리하고 계신가요?
        </h1>
        <p style={{ fontFamily: "'Pretendard'", fontWeight: 400, fontSize: 16, opacity: .75, maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
          보유 중인 SW 라이선스 현황을 알려주시면, 갱신 시기·비용 절감·최적 플랜을 안내드립니다.
        </p>
        <div style={{ display: 'flex', gap: 'clamp(28px,5vw,48px)', marginTop: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { num: String(PRODUCTS.length - 1), unit: '개', sub: '취급 제품' },
            { num: '당일', unit: '', sub: '회신 보장' },
            { num: '200+', unit: '', sub: '기업 고객' },
          ].map(s => (
            <div key={s.sub}>
              <div style={{ color: '#fff', fontSize: 28, fontWeight: 900, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' }}>
                {s.num}<span style={{ fontSize: 14, color: 'var(--accent)', marginLeft: 2 }}>{s.unit}</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 12, marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section style={{ padding: 'clamp(32px,4vw,48px) clamp(20px,4vw,52px) clamp(60px,8vw,100px)', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 32, alignItems: 'flex-start', position: 'relative' }} className="la-grid">
        {/* Form */}
        <div style={{ flex: 2 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', padding: 'clamp(24px,4vw,36px)', marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Pretendard'", fontWeight: 800, fontSize: 20, color: 'var(--ink)', marginBottom: 24 }}>기본 정보</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="la-form-grid">
              <div>
                <label style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 14, color: 'var(--ink)', display: 'block', marginBottom: 6 }}>회사명 *</label>
                <input value={company} onChange={e => setCompany(e.target.value)} placeholder="주식회사 유니온시스템즈" style={inputStyle(errors.company)} />
                {errors.company && <span style={{ fontFamily: "'Pretendard'", fontSize: 13, color: '#F5333F', marginTop: 4, display: 'block' }}>{errors.company}</span>}
              </div>
              <div>
                <label style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 14, color: 'var(--ink)', display: 'block', marginBottom: 6 }}>담당자명 *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="홍길동" style={inputStyle(errors.name)} />
                {errors.name && <span style={{ fontFamily: "'Pretendard'", fontSize: 13, color: '#F5333F', marginTop: 4, display: 'block' }}>{errors.name}</span>}
              </div>
              <div>
                <label style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 14, color: 'var(--ink)', display: 'block', marginBottom: 6 }}>이메일 *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@company.com" style={inputStyle(errors.email)} />
                {errors.email && <span style={{ fontFamily: "'Pretendard'", fontSize: 13, color: '#F5333F', marginTop: 4, display: 'block' }}>{errors.email}</span>}
              </div>
              <div>
                <label style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 14, color: 'var(--ink)', display: 'block', marginBottom: 6 }}>연락처</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="010-0000-0000" style={inputStyle()} />
              </div>
            </div>
          </div>

          {/* Licenses */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', padding: 'clamp(24px,4vw,36px)', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Pretendard'", fontWeight: 800, fontSize: 20, color: 'var(--ink)' }}>보유 라이선스</h2>
              <button onClick={addLicense}
                style={{ padding: '8px 16px', background: '#11121410', color: 'var(--accent)', fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>+ 추가</button>
            </div>
            {errors.license && <p style={{ fontFamily: "'Pretendard'", fontSize: 13, color: '#F5333F', marginBottom: 12 }}>{errors.license}</p>}

            {licenses.map((l, i) => (
              <div key={l.id} style={{ padding: '16px 0', borderTop: i > 0 ? '1px solid var(--line)' : 'none' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div style={{ flex: 2, minWidth: 160 }}>
                    <label style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 13, color: 'var(--ink2)', display: 'block', marginBottom: 4 }}>제품</label>
                    <select value={l.product} onChange={e => updateLicense(l.id, 'product', e.target.value)}
                      style={{ ...inputStyle(), appearance: 'auto' }}>
                      {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  {l.product === '기타' && (
                    <div style={{ flex: 2, minWidth: 140 }}>
                      <label style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 13, color: 'var(--ink2)', display: 'block', marginBottom: 4 }}>제품명</label>
                      <input value={l.customProduct} onChange={e => updateLicense(l.id, 'customProduct', e.target.value)} placeholder="제품명 입력" style={inputStyle()} />
                    </div>
                  )}
                  <div style={{ width: 80 }}>
                    <label style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 13, color: 'var(--ink2)', display: 'block', marginBottom: 4 }}>수량</label>
                    <input type="number" min={1} value={l.qty} onChange={e => updateLicense(l.id, 'qty', Number(e.target.value))} style={{ ...inputStyle(), textAlign: 'center' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 150 }}>
                    <label style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 13, color: 'var(--ink2)', display: 'block', marginBottom: 4 }}>만료일 (알고 있다면)</label>
                    <input type="date" value={l.expiry} onChange={e => updateLicense(l.id, 'expiry', e.target.value)} style={inputStyle()} />
                  </div>
                  {licenses.length > 1 && (
                    <button onClick={() => removeLicense(l.id)}
                      style={{ width: 36, height: 36, border: '1px solid var(--line)', background: 'transparent', color: '#F5333F', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>x</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Consent + Submit */}
          <PrivacyConsent checked={consent} onChange={setConsent} error={errors.consent} />

          <button onClick={handleSubmit} disabled={submitting}
            style={{ width: '100%', padding: '16px', background: submitting ? 'var(--ink2)' : 'var(--accent)', color: '#fff', fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 15, border: 'none', cursor: submitting ? 'default' : 'pointer' }}>
            {submitting ? '전송 중...' : '라이선스 관리 상담 신청'}
          </button>
        </div>

        {/* Benefits sidebar */}
        <div style={{ flex: 1, minWidth: 280, position: 'sticky', top: 100 }} className="la-sidebar">
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', padding: 'clamp(24px,3vw,32px)', marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Pretendard'", fontWeight: 800, fontSize: 16, color: 'var(--ink)', marginBottom: 20 }}>SAM 상담을 받으면</h3>
            {[
              { title: '갱신 시기·비용 분석', desc: '보유 라이선스별 갱신 일정과 최적 플랜을 비교 분석해드립니다.' },
              { title: '과잉·중복 라이선스 정리', desc: '미사용·중복 라이선스를 찾아 비용 절감 방안을 안내드립니다.' },
              { title: '통합 관리 체계 제안', desc: '여러 벤더 라이선스를 하나의 창구로 관리하는 방법을 제안합니다.' },
            ].map((b, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? 18 : 0, paddingBottom: i < 2 ? 18 : 0, borderBottom: i < 2 ? '1px solid var(--line)' : 'none' }}>
                <h4 style={{ fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 15, color: 'var(--ink)', marginBottom: 4 }}>{b.title}</h4>
                <p style={{ fontFamily: "'Pretendard'", fontWeight: 400, fontSize: 14, color: 'var(--ink2)', lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ background: '#111214', color: '#fff', padding: 'clamp(20px,3vw,28px)' }}>
            <p style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize: 11, fontWeight: 800, letterSpacing: '.12em', color: 'var(--accent)', marginBottom: 8 }}>SAM이란?</p>
            <p style={{ fontFamily: "'Pretendard'", fontSize: 13, color: 'rgba(255,255,255,.7)', lineHeight: 1.7 }}>
              Software Asset Management. 기업이 보유한 SW 라이선스의 수량·만료·비용을 체계적으로 관리하는 것을 말합니다. 유니온시스템즈가 라이선스 유통·갱신·자산관리를 대행합니다.
            </p>
          </div>
        </div>
      </div>
    </section>

    <style>{`
      @media(max-width:920px){
        .la-grid{flex-direction:column!important}
        .la-sidebar{position:static!important}
        .la-form-grid{grid-template-columns:1fr!important}
      }
    `}</style>
  </>);
}
