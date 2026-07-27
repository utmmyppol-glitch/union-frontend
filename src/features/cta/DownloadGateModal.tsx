'use client';

import React, { useState, useCallback } from 'react';
import { Modal, Input, Button } from '@/components/ui';
import PrivacyConsent from '@/components/ui/PrivacyConsent';
import { apiClient } from '@/lib/api';

interface DownloadGateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  company: string;
  phone: string;
  email: string;
  consentPrivacy: boolean;
}

interface FormErrors {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  consentPrivacy?: string;
}

const INITIAL_DATA: FormData = {
  name: '',
  company: '',
  phone: '',
  email: '',
  consentPrivacy: false,
};

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const DownloadGateModal: React.FC<DownloadGateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [form, setForm] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const updateField = useCallback(
    (field: keyof FormData, value: string | boolean) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [],
  );

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) newErrors.name = '이름을 입력해주세요.';
    if (!form.company.trim()) newErrors.company = '회사명을 입력해주세요.';
    if (!form.phone.trim()) {
      newErrors.phone = '연락처를 입력해주세요.';
    } else if (!/^[\d\-+() ]{8,}$/.test(form.phone.trim())) {
      newErrors.phone = '올바른 연락처를 입력해주세요.';
    }
    if (!form.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = '올바른 이메일 주소를 입력해주세요.';
    }
    if (!form.consentPrivacy) {
      newErrors.consentPrivacy = '개인정보 수집에 동의해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    setForm(INITIAL_DATA);
    setErrors({});
    setStatus('idle');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    try {
      await apiClient.submitDownload({
        name: form.name.trim(),
        company: form.company.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        fileType: 'BROCHURE',
        consentPrivacy: form.consentPrivacy,
      });

      setStatus('success');

      // Trigger file download
      const downloadUrl =
        process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/downloads/brochure`
          : '/api/union/downloads/brochure';

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'UnionSystems_소개서.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Close after short delay so user sees success
      setTimeout(handleClose, 1500);
    } catch {
      setStatus('error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="소개서 다운로드" size="md">
      {status === 'success' ? (
        <div className="text-center py-6">
          <div className="w-14 h-14 mx-auto bg-[#111214]/10 flex items-center justify-center mb-3">
            <svg className="w-7 h-7 text-[#111214]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            다운로드가 시작됩니다
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            잠시 후 창이 닫힙니다.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            소개서를 다운로드하려면 아래 정보를 입력해주세요.
          </p>

          <div className="space-y-4">
            <Input
              label="이름"
              name="dl-name"
              required
              placeholder="홍길동"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              error={errors.name}
            />
            <Input
              label="회사명"
              name="dl-company"
              required
              placeholder="주식회사 OOO"
              value={form.company}
              onChange={(e) => updateField('company', e.target.value)}
              error={errors.company}
            />
            <Input
              label="연락처"
              name="dl-phone"
              type="tel"
              required
              placeholder="02-000-0000"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              error={errors.phone}
            />
            <Input
              label="이메일"
              name="dl-email"
              type="email"
              required
              placeholder="example@company.com"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              error={errors.email}
            />

            {/* 개인정보 수집 안내 스크롤 박스 */}
            <div style={{
              border: '1px solid var(--line, #e5e7eb)', padding: '14px 16px',
              background: 'var(--soft, #f9fafb)', maxHeight: 120, overflowY: 'auto',
              fontSize: 13, lineHeight: 1.7, color: 'var(--ink2, #6b7280)',
            }}>
              <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink, #111)', margin: '0 0 8px' }}>
                개인정보 수집 및 이용에 대한 안내
              </p>
              <p style={{ margin: '0 0 6px' }}>
                <strong style={{ color: 'var(--ink, #111)' }}>수집하는 개인정보의 항목</strong><br />
                이름, 회사명, 연락처, 이메일
              </p>
              <p style={{ margin: '0 0 6px' }}>
                <strong style={{ color: 'var(--ink, #111)' }}>개인정보의 수집·이용 목적</strong><br />
                문의 사항에 대한 답변을 전달하기 위한 의사소통 경로의 확보와 안내, 상담, 기타 이벤트 안내 등
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: 'var(--ink, #111)' }}>개인정보의 보유 및 이용기간</strong><br />
                원칙적으로 개인정보의 수집·이용 목적 달성 시 바로 파기합니다.<br />
                수집·이용 목적을 달성한 경우에도 법률의 규정에 따라 보존할 필요가 있다면 고객의 개인정보를 보유할 수 있습니다.<br />
                · 계약 또는 청약철회 등에 관한 기록 : 5년<br />
                · 대금결제 및 재화등의 공급에 관한 기록 : 5년<br />
                · 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년
              </p>
            </div>

              <PrivacyConsent
                checked={form.consentPrivacy}
                onChange={(v) => updateField('consentPrivacy', v)}
                error={errors.consentPrivacy}
              />
          </div>

          {status === 'error' && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <p className="text-sm text-red-600 dark:text-red-400">
                오류가 발생했습니다. 다시 시도해주세요.
              </p>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <Button type="button" variant="ghost" onClick={handleClose}>
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              loading={status === 'loading'}
            >
              다운로드
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default DownloadGateModal;
