'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Input } from '@/components/ui';
import { apiClient } from '@/lib/api';
import PrivacyConsent from '@/components/ui/PrivacyConsent';

const SERIF = "'Newsreader', Georgia, serif";

const PRODUCT_GROUPS = [
  {
    category: '소프트웨어',
    items: ['Microsoft 365', 'ESTsoft', 'Autodesk', 'Adobe'],
  },
  {
    category: '솔루션',
    items: ['DA#', 'DA# DQ Edition', 'NetClient', 'AhnLab', 'ESTsecurity', 'OfficeKeeper'],
  },
] as const;

interface FormData {
  products: string[];
  name: string;
  company: string;
  phone: string;
  email: string;
  message: string;
  consentPrivacy: boolean;
  consentMarketing: boolean;
  file: File | null;
}

interface FormErrors {
  products?: string;
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  consentPrivacy?: string;
}

const INITIAL: FormData = {
  products: [], name: '', company: '', phone: '', email: '',
  message: '', consentPrivacy: false, consentMarketing: false, file: null,
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

type Status = 'idle' | 'loading' | 'success' | 'error';

const InquiryForm: React.FC = () => {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const fileRef = useRef<HTMLInputElement>(null);

  const toggle = useCallback((p: string) => {
    setForm(prev => ({
      ...prev,
      products: prev.products.includes(p) ? prev.products.filter(x => x !== p) : [...prev.products, p],
    }));
    setErrors(prev => ({ ...prev, products: undefined }));
  }, []);

  const set = useCallback((f: keyof FormData, v: string | boolean) => {
    setForm(prev => ({ ...prev, [f]: v }));
    setErrors(prev => ({ ...prev, [f]: undefined }));
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > MAX_FILE_SIZE) {
      alert('파일 크기는 10MB 이하만 첨부 가능합니다.');
      e.target.value = '';
      return;
    }
    setForm(prev => ({ ...prev, file }));
  }, []);

  const removeFile = useCallback(() => {
    setForm(prev => ({ ...prev, file: null }));
    if (fileRef.current) fileRef.current.value = '';
  }, []);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.products.length) e.products = '관심 제품을 1개 이상 선택해주세요.';
    if (!form.name.trim()) e.name = '이름을 입력해주세요.';
    if (!form.company.trim()) e.company = '회사명을 입력해주세요.';
    if (!form.phone.trim()) e.phone = '연락처를 입력해주세요.';
    else if (!/^[\d\-+() ]{8,}$/.test(form.phone.trim())) e.phone = '올바른 연락처를 입력해주세요.';
    if (!form.email.trim()) e.email = '이메일을 입력해주세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = '올바른 이메일을 입력해주세요.';
    if (!form.consentPrivacy) e.consentPrivacy = '개인정보 수집에 동의해주세요.';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      await apiClient.submitInquiry({
        name: form.name.trim(), company: form.company.trim(),
        phone: form.phone.trim(), email: form.email.trim(),
        message: form.message.trim(), product: form.products.join(', '),
        consentPrivacy: form.consentPrivacy,
        consentMarketing: form.consentMarketing,
        ...(form.file ? { file: form.file } : {}),
      });
      setStatus('success');
    } catch { setStatus('error'); }
  };

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{
          width: 72, height: 72, margin: '0 auto 20px',
          background: 'rgba(245,51,63,.06)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="32" height="32" viewBox="0 0 20 20" fill="var(--accent)">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 style={{ fontWeight: 800, fontSize: 22, color: 'var(--ink)', margin: '0 0 10px' }}>문의가 접수되었습니다</h3>
        <p style={{ fontSize: 16, color: 'var(--ink2)', margin: '0 0 28px' }}>담당자가 확인 후 빠른 시일 내에 연락드리겠습니다.</p>
        <button onClick={() => { setForm(INITIAL); setErrors({}); setStatus('idle'); if (fileRef.current) fileRef.current.value = ''; }} style={{
          padding: '14px 32px', border: '1px solid var(--line)', background: 'transparent',
          color: 'var(--ink)', fontWeight: 700, fontSize: 15, cursor: 'pointer',
        }}>새 문의하기</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>

      {/* ═══ STEP 01 — 제품 선택 ═══ */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontWeight: 900, fontSize: 22, color: 'var(--ink)', margin: '0 0 6px', letterSpacing: '-.02em' }}>
          <span style={{ fontFamily: SERIF, fontStyle: 'italic', color: 'var(--accent)', marginRight: 8 }}>01.</span>
          관심 제품을 선택해주세요.
        </h2>
        <p style={{ fontSize: 16, color: 'var(--ink2)', margin: '0 0 20px' }}>복수 선택 가능</p>

        {PRODUCT_GROUPS.map((g) => (
          <div key={g.category} style={{ marginBottom: 16 }}>
            <p style={{
              fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: '0 0 10px',
            }}>· {g.category}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {g.items.map((p) => {
                const on = form.products.includes(p);
                return (
                  <button key={p} type="button" onClick={() => toggle(p)} style={{
                    padding: '10px 20px', fontSize: 13, fontWeight: 600,
                    border: on ? '2px solid var(--charcoal)' : '1px solid var(--line)',
                    background: on ? 'var(--charcoal)' : '#fff', color: on ? '#fff' : 'var(--ink)',
                    cursor: 'pointer', transition: 'all .15s',
                  }}>
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {errors.products && <p style={{ fontSize: 14, color: 'var(--accent)', marginTop: 8, fontWeight: 600 }}>{errors.products}</p>}
      </div>

      {/* ═══ STEP 02 — 기본정보 ═══ */}
      <div>
        <h2 style={{ fontWeight: 900, fontSize: 22, color: 'var(--ink)', margin: '0 0 6px', letterSpacing: '-.02em' }}>
          <span style={{ fontFamily: SERIF, fontStyle: 'italic', color: 'var(--accent)', marginRight: 8 }}>02.</span>
          기본 정보를 입력해주세요.
        </h2>
        <p style={{ fontSize: 16, color: 'var(--ink2)', margin: '0 0 24px' }}>* 필수 입력 항목</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <Input label="회사명" name="company" required placeholder="주식회사 OOO" value={form.company} onChange={(e) => set('company', e.target.value)} error={errors.company} />
          <Input label="이름" name="name" required placeholder="홍길동" value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <Input label="연락처" name="phone" type="tel" required placeholder="02-000-0000" value={form.phone} onChange={(e) => set('phone', e.target.value)} error={errors.phone} />
          <Input label="이메일" name="email" type="email" required placeholder="example@company.com" value={form.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label htmlFor="inq-msg" style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', display: 'block', marginBottom: 6 }}>문의작성</label>
          <p style={{ fontSize: 16, color: 'var(--ink2)', margin: '0 0 8px' }}>도입에 궁금하신 점을 자세히 남겨주시면 빠른 상담이 가능합니다.</p>
          <textarea
            id="inq-msg" name="message" rows={5} value={form.message}
            onChange={(e) => set('message', e.target.value)}
            placeholder="문의 내용을 입력해주세요."
            style={{
              width: '100%', padding: '14px 16px', border: '1px solid var(--line)',
              background: '#fff', color: 'var(--ink)', fontSize: 15, resize: 'vertical',
              outline: 'none', boxSizing: 'border-box', transition: 'border-color .15s',
              minHeight: 120,
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--ink)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--line)'; }}
          />
        </div>

        {/* 파일첨부 */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', display: 'block', marginBottom: 6 }}>파일첨부</label>
          <p style={{ fontSize: 16, color: 'var(--ink2)', margin: '0 0 10px' }}>첨부하고자 하는 파일을 선택하여 업로드 해주세요.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', border: '1px solid var(--line)',
                background: 'var(--soft)', color: 'var(--ink)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                transition: 'border-color .15s',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              파일첨부
            </button>
            <input
              ref={fileRef}
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.hwp,.zip,.rar,.jpg,.jpeg,.png,.gif"
              style={{ display: 'none' }}
            />
            {form.file ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 14px', background: 'var(--soft)', border: '1px solid var(--line)',
                fontSize: 14, color: 'var(--ink)',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink2)" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.file.name}</span>
                <span style={{ fontSize: 12, color: 'var(--ink2)' }}>({(form.file.size / 1024 / 1024).toFixed(1)}MB)</span>
                <button type="button" onClick={removeFile} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                  color: 'var(--ink2)', fontSize: 16, lineHeight: 1,
                }}>&times;</button>
              </div>
            ) : (
              <span style={{ fontSize: 14, color: 'var(--ink2)' }}>선택된 파일 없음</span>
            )}
          </div>
          <p style={{ fontSize: 12, color: 'var(--ink2)', margin: '8px 0 0', opacity: .7 }}>
            최대 10MB / PDF, DOC, XLS, PPT, HWP, ZIP, 이미지 파일
          </p>
        </div>

        {/* 개인정보 수집 안내 */}
        <div style={{
          border: '1px solid var(--line)', padding: '20px 24px', marginBottom: 20,
          background: 'var(--soft)', maxHeight: 180, overflowY: 'auto',
        }}>
          <h4 style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', margin: '0 0 14px' }}>
            개인정보 수집 및 이용에 대한 안내
          </h4>
          <div style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ink2)' }}>
            <p style={{ margin: '0 0 12px' }}>
              <strong style={{ color: 'var(--ink)' }}>수집하는 개인정보의 항목</strong><br />
              이름, 회사명, 연락처, 이메일
            </p>
            <p style={{ margin: '0 0 12px' }}>
              <strong style={{ color: 'var(--ink)' }}>개인정보의 수집·이용 목적</strong><br />
              문의 사항에 대한 답변을 전달하기 위한 의사소통 경로의 확보와 안내, 상담, 기타 이벤트 안내 등
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>개인정보의 보유 및 이용기간</strong><br />
              원칙적으로 개인정보의 수집·이용 목적 달성 시 바로 파기합니다.<br />
              수집·이용 목적을 달성한 경우에도 법률의 규정에 따라 보존할 필요가 있다면 고객의 개인정보를 보유할 수 있습니다.<br />
              <span style={{ display: 'block', paddingLeft: 12, marginTop: 4 }}>
                · 계약 또는 청약철회 등에 관한 기록 : 5년<br />
                · 대금결제 및 재화등의 공급에 관한 기록 : 5년<br />
                · 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년
              </span>
            </p>
          </div>
        </div>

        {/* 동의 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          <PrivacyConsent
                checked={form.consentPrivacy}
                onChange={(v) => set('consentPrivacy', v)}
                error={errors.consentPrivacy}
              />

          <div>
            <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', margin: '0 0 8px' }}>
              세미나개최, 제품 업데이트 소식에 대한 정보수신을 동의합니다. (선택)
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" name="marketing" checked={form.consentMarketing === true} onChange={() => set('consentMarketing', true)}
                  style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
                <span style={{ fontSize: 15, color: 'var(--ink)' }}>동의합니다.</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" name="marketing" checked={form.consentMarketing === false} onChange={() => set('consentMarketing', false)}
                  style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
                <span style={{ fontSize: 15, color: 'var(--ink)' }}>동의하지않습니다.</span>
              </label>
            </div>
          </div>
        </div>

        {status === 'error' && (
          <div style={{ padding: 14, border: '1px solid rgba(245,51,63,.2)', background: 'rgba(245,51,63,.04)', marginBottom: 16 }}>
            <p style={{ fontSize: 14, color: 'var(--accent)', margin: 0, fontWeight: 600 }}>문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.</p>
          </div>
        )}

        {/* 제출 버튼 */}
        <button type="submit" disabled={status === 'loading'} style={{
          width: '100%', padding: '20px 0',
          background: 'var(--accent)', color: '#fff',
          fontWeight: 700, fontSize: 15, border: 'none',
          cursor: 'pointer', transition: 'opacity .15s',
          opacity: status === 'loading' ? .6 : 1,
        }}>
          {status === 'loading' ? '접수 중...' : '도입문의서 제출'}
        </button>
      </div>
    </form>
  );
};

export default InquiryForm;
