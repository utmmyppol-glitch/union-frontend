'use client';
import { useState } from 'react';
import Link from 'next/link';

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

export default function LicenseAlertPage() {
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenses, setLicenses] = useState<License[]>([newLicense()]);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
    const hasValidLicense = licenses.some(l => l.expiry);
    if (!hasValidLicense) e.license = '만료일을 1개 이상 입력하세요';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) setSubmitted(true);
  };

  const inputStyle = (err?: string): React.CSSProperties => ({
    width: '100%', padding: '12px 16px', borderRadius: 0,
    border: `1px solid ${err ? '#F5333F' : 'var(--line)'}`,
    background: 'var(--bg)', fontFamily: "'Pretendard'", fontSize: 18, color: 'var(--ink)',
    boxSizing: 'border-box', outline: 'none',
  });

  if (submitted) {
    return (<>
      <section style={{ padding: '120px clamp(20px,4vw,52px) 48px', background: 'linear-gradient(135deg, #059669, #111214)', color: '#fff', textAlign: 'center' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <h1 style={{ fontFamily: "'Pretendard'", fontWeight: 900, fontSize: 'clamp(28px,4.5vw,42px)', lineHeight: 1.2, marginBottom: 12 }}>등록이 완료되었습니다!</h1>
        <p style={{ fontFamily: "'Pretendard'", fontWeight: 400, fontSize: 18, opacity: .85 }}>만료 30일 전에 {email}로 알림을 보내드리겠습니다.</p>
      </section>
      <section style={{ padding: 'clamp(32px,4vw,48px) clamp(20px,4vw,52px) clamp(60px,8vw,100px)', background: 'var(--bg)' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 0, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--line)', fontFamily: "'Pretendard'", fontWeight: 800, fontSize: 18, color: 'var(--ink)' }}>등록된 라이선스</div>
            {licenses.filter(l => l.expiry).map((l, i) => (
              <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 24px', borderBottom: i < licenses.filter(x => x.expiry).length - 1 ? '1px solid var(--line)' : 'none' }}>
                <div>
                  <div style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, color: 'var(--ink)' }}>{l.product === '기타' ? l.customProduct : l.product}</div>
                  <div style={{ fontFamily: "'Pretendard'", fontWeight: 400, fontSize: 18, color: 'var(--ink2)' }}>{l.qty}개</div>
                </div>
                <div style={{ fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, color: 'var(--accent)' }}>{l.expiry}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => { setSubmitted(false); setLicenses([newLicense()]); setCompany(''); setName(''); setEmail(''); setConsent(false); }}
              style={{ flex: 1, padding: '14px', borderRadius: 0, border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink2)', fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>추가 등록</button>
            <Link href="/contact"
              style={{ flex: 1, padding: '14px', borderRadius: 0, background: 'var(--accent)', color: '#fff', fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, textDecoration: 'none', textAlign: 'center' }}>지금 바로 리뉴얼 견적 받기</Link>
          </div>
        </div>
      </section>
    </>);
  }

  return (<>
    {/* Hero */}
    <section style={{ padding: '120px clamp(20px,4vw,52px) 48px', background: 'linear-gradient(135deg, #2B2C30, #111214)', color: '#fff', textAlign: 'center' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ marginBottom: 16 }}>
        <rect x="8" y="12" width="40" height="36" rx="4" stroke="#fff" strokeWidth="2.5" fill="none"/>
        <path d="M8 22h40" stroke="#fff" strokeWidth="2.5"/>
        <circle cx="42" cy="12" r="10" fill="#F5333F" stroke="#2B2C30" strokeWidth="2"/>
        <path d="M42 7v6M42 16v1" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <rect x="16" y="28" width="8" height="8" rx="2" fill="#ffffff40"/>
        <rect x="28" y="28" width="8" height="8" rx="2" fill="#ffffff40"/>
        <rect x="16" y="38" width="8" height="4" rx="1" fill="#ffffff20"/>
      </svg>
      <h1 style={{ fontFamily: "'Pretendard'", fontWeight: 900, fontSize: 'clamp(28px,4.5vw,48px)', lineHeight: 1.2, letterSpacing: '-.03em', marginBottom: 12 }}>라이선스 만료,<br/>깜빡하셨나요?</h1>
      <p style={{ fontFamily: "'Pretendard'", fontWeight: 400, fontSize: 18, opacity: .85, maxWidth: 420, margin: '0 auto' }}>등록만 해두세요. 만료 전에 알려드립니다.</p>
    </section>

    <section style={{ padding: 'clamp(32px,4vw,48px) clamp(20px,4vw,52px) clamp(60px,8vw,100px)', background: 'var(--bg)' , position: 'relative', overflow: 'hidden'}}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 32, alignItems: 'flex-start' }} className="la-grid">
        {/* Form */}
        <div style={{ flex: 2 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 0, padding: 'clamp(24px,4vw,36px)', marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Pretendard'", fontWeight: 800, fontSize: 22, color: 'var(--ink)', marginBottom: 24 }}>기본 정보</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="la-form-grid">
              <div>
                <label style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, color: 'var(--ink)', display: 'block', marginBottom: 6 }}>회사명 *</label>
                <input value={company} onChange={e => setCompany(e.target.value)} placeholder="주식회사 유니온시스템즈" style={inputStyle(errors.company)} />
                {errors.company && <span style={{ fontFamily: "'Pretendard'", fontSize: 18, color: '#F5333F', marginTop: 4, display: 'block' }}>{errors.company}</span>}
              </div>
              <div>
                <label style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, color: 'var(--ink)', display: 'block', marginBottom: 6 }}>담당자명 *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="홍길동" style={inputStyle(errors.name)} />
                {errors.name && <span style={{ fontFamily: "'Pretendard'", fontSize: 18, color: '#F5333F', marginTop: 4, display: 'block' }}>{errors.name}</span>}
              </div>
              <div>
                <label style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, color: 'var(--ink)', display: 'block', marginBottom: 6 }}>이메일 *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@company.com" style={inputStyle(errors.email)} />
                {errors.email && <span style={{ fontFamily: "'Pretendard'", fontSize: 18, color: '#F5333F', marginTop: 4, display: 'block' }}>{errors.email}</span>}
              </div>
              <div>
                <label style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, color: 'var(--ink)', display: 'block', marginBottom: 6 }}>연락처</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="010-0000-0000" style={inputStyle()} />
              </div>
            </div>
          </div>

          {/* Licenses */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 0, padding: 'clamp(24px,4vw,36px)', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Pretendard'", fontWeight: 800, fontSize: 22, color: 'var(--ink)' }}>라이선스 정보</h2>
              <button onClick={addLicense}
                style={{ padding: '8px 16px', borderRadius: 0, background: '#11121410', color: 'var(--accent)', fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, border: 'none', cursor: 'pointer' }}>+ 추가</button>
            </div>
            {errors.license && <p style={{ fontFamily: "'Pretendard'", fontSize: 18, color: '#F5333F', marginBottom: 12 }}>{errors.license}</p>}

            {licenses.map((l, i) => (
              <div key={l.id} style={{ padding: '16px 0', borderTop: i > 0 ? '1px solid var(--line)' : 'none' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div style={{ flex: 2, minWidth: 160 }}>
                    <label style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, color: 'var(--ink2)', display: 'block', marginBottom: 4 }}>제품</label>
                    <select value={l.product} onChange={e => updateLicense(l.id, 'product', e.target.value)}
                      style={{ ...inputStyle(), appearance: 'auto' }}>
                      {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  {l.product === '기타' && (
                    <div style={{ flex: 2, minWidth: 140 }}>
                      <label style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, color: 'var(--ink2)', display: 'block', marginBottom: 4 }}>제품명</label>
                      <input value={l.customProduct} onChange={e => updateLicense(l.id, 'customProduct', e.target.value)} placeholder="제품명 입력" style={inputStyle()} />
                    </div>
                  )}
                  <div style={{ width: 80 }}>
                    <label style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, color: 'var(--ink2)', display: 'block', marginBottom: 4 }}>수량</label>
                    <input type="number" min={1} value={l.qty} onChange={e => updateLicense(l.id, 'qty', Number(e.target.value))} style={{ ...inputStyle(), textAlign: 'center' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 150 }}>
                    <label style={{ fontFamily: "'Pretendard'", fontWeight: 600, fontSize: 18, color: 'var(--ink2)', display: 'block', marginBottom: 4 }}>만료일</label>
                    <input type="date" value={l.expiry} onChange={e => updateLicense(l.id, 'expiry', e.target.value)} style={inputStyle()} />
                  </div>
                  {licenses.length > 1 && (
                    <button onClick={() => removeLicense(l.id)}
                      style={{ width: 36, height: 36, borderRadius: 0, border: '1px solid var(--line)', background: 'transparent', color: '#F5333F', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Consent + Submit */}
          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20, cursor: 'pointer' }}>
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}
              style={{ marginTop: 2, accentColor: 'var(--accent)' }} />
            <span style={{ fontFamily: "'Pretendard'", fontWeight: 400, fontSize: 18, color: 'var(--ink2)', lineHeight: 1.5 }}>
              개인정보 수집 및 이용에 동의합니다. (라이선스 만료 알림 및 프로모션 안내 목적)
            </span>
          </label>
          {errors.consent && <p style={{ fontFamily: "'Pretendard'", fontSize: 18, color: '#F5333F', marginBottom: 12 }}>{errors.consent}</p>}

          <button onClick={handleSubmit}
            style={{ width: '100%', padding: '16px', borderRadius: 0, background: 'var(--accent)', color: '#fff', fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, border: 'none', cursor: 'pointer' }}>
            알림 등록하기
          </button>
        </div>

        {/* Benefits sidebar */}
        <div style={{ flex: 1, minWidth: 280, position: 'sticky', top: 100 }} className="la-sidebar">
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 0, padding: 'clamp(24px,3vw,32px)' }}>
            <h3 style={{ fontFamily: "'Pretendard'", fontWeight: 800, fontSize: 18, color: 'var(--ink)', marginBottom: 24 }}>왜 등록해야 하나요?</h3>
            {[
              { icon: '🔔', title: '만료 30일 전 알림', desc: '라이선스 단절 없이 비즈니스를 유지하세요.' },
              { icon: '💰', title: '리뉴얼 특별 할인', desc: '유니온시스템즈 고객 대상 리뉴얼 할인가를 안내드립니다.' },
              { icon: '🎁', title: '프로모션 우선 안내', desc: '벤더사 프로모션, 이벤트 소식을 가장 먼저 받아보세요.' },
            ].map((b, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? 20 : 0 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{b.icon}</div>
                <h4 style={{ fontFamily: "'Pretendard'", fontWeight: 700, fontSize: 18, color: 'var(--ink)', marginBottom: 4 }}>{b.title}</h4>
                <p style={{ fontFamily: "'Pretendard'", fontWeight: 400, fontSize: 18, color: 'var(--ink2)', lineHeight: 1.5 }}>{b.desc}</p>
              </div>
            ))}
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
