'use client';

import { useState } from 'react';

const PRIVACY_TEXT = `[개인정보 수집 및 이용 동의]

1. 수집하는 개인정보 항목
 - 필수: 이름, 연락처, 이메일, 회사명
 - 선택: 문의 내용, 첨부파일

2. 수집 및 이용 목적
 - 고객 문의사항 확인 및 응대
 - 서비스 제공에 관한 계약 이행 및 요금 정산
 - 마케팅 및 광고에 활용 (선택 동의 시)

3. 보유 및 이용 기간
 - 수집·이용 목적 달성 후 지체 없이 파기합니다.
 - 단, 관계법령에 의해 보존이 필요한 경우 해당 기간 동안 보관합니다.
   · 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)
   · 대금결제 및 재화 등의 공급에 관한 기록: 3년 (전자상거래법)
   · 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)

4. 동의 거부 권리 안내
 - 위 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다.
 - 다만, 필수 항목에 대한 동의를 거부할 경우 서비스 이용이 제한될 수 있습니다.

문의처: 유니온시스템즈 (02-706-8999 / ud@unionsystems.co.kr)`;

export interface PrivacyConsentProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  label?: string;
}

export default function PrivacyConsent({ checked, onChange, error, label }: PrivacyConsentProps) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      setScrolledToBottom(true);
    }
  };

  return (
    <div>
      <div
        onScroll={handleScroll}
        style={{
          height: 160,
          overflowY: 'auto',
          border: '1px solid var(--line)',
          background: 'var(--bg)',
          padding: '16px 18px',
          marginBottom: 12,
          fontSize: 12,
          lineHeight: 1.8,
          color: 'var(--ink2)',
          fontFamily: "'Pretendard', sans-serif",
          whiteSpace: 'pre-wrap',
        }}
      >
        {PRIVACY_TEXT}
      </div>
      {!scrolledToBottom && (
        <p style={{
          fontSize: 12,
          color: 'var(--ink2)',
          marginBottom: 8,
          fontFamily: "'Pretendard', sans-serif",
        }}>
          * 내용을 끝까지 확인해주세요.
        </p>
      )}
      <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{ marginTop: 3, accentColor: 'var(--accent)' }}
        />
        <span style={{
          fontFamily: "'Pretendard', sans-serif",
          fontWeight: 500,
          fontSize: 14,
          color: 'var(--ink)',
          lineHeight: 1.5,
        }}>
          {label || '개인정보 수집 및 이용동의 내용을 확인했으며, 이에 동의합니다. (필수)'}
        </span>
      </label>
      {error && (
        <p style={{
          fontFamily: "'Pretendard', sans-serif",
          fontSize: 13,
          color: '#F5333F',
          marginTop: 4,
          fontWeight: 600,
        }}>
          {error}
        </p>
      )}
    </div>
  );
}
