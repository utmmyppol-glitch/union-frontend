'use client';

import React, { useState, useEffect } from 'react';
import { E, safeParse, useEditMode, useEditableManifest, EDITABLE_STYLES } from '@/lib/editable';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SERIF = "'Newsreader', Georgia, serif";

/* ── 기본값 ── */
const DEFAULT_HERO = {
  title_word: '개인정보처리방침',
  subtitle: '고객님의 개인정보를 중요시하며, \u201c정보통신망 이용촉진 및 정보보호\u201d에 관한 법률을 준수하고 있습니다.',
};

const DEFAULT_INTRO = {
  p1: '\u2018유니온시스템즈\u2019은(는) (이하 \u2018회사\u2019는) 고객님의 개인정보를 중요시하며, \u201c정보통신망 이용촉진 및 정보보호\u201d에 관한 법률을 준수하고 있습니다.',
  p2: '회사는 개인정보처리방침을 통하여 고객님께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.',
  p3: '회사는 개인정보처리방침을 개정하는 경우 웹사이트 공지사항(또는 개별공지)을 통하여 공지할 것입니다.',
};

const DEFAULT_OFFICER = {
  name: '백나래 대리',
  tel: '02-706-8999',
  fax: '02-706-8990',
  email: 'union@unionsystems.co.kr',
};

const DEFAULT_DATE = { text: '2022년 07월 08일' };

export default function PrivacyPageClient({ ssrContent }: { ssrContent: Record<string, string> }) {
  const editMode = useEditMode();
  useEditableManifest(editMode);

  const [hero, setHero] = useState(() => safeParse(ssrContent.privacy_hero, DEFAULT_HERO));
  const [intro, setIntro] = useState(() => safeParse(ssrContent.privacy_intro, DEFAULT_INTRO));
  const [officer, setOfficer] = useState(() => safeParse(ssrContent.privacy_officer, DEFAULT_OFFICER));
  const [date, setDate] = useState(() => safeParse(ssrContent.privacy_date, DEFAULT_DATE));

  useEffect(() => {
    if (!editMode) return;
    const setters: Record<string, (v: unknown) => void> = {
      privacy_hero: setHero as (v: unknown) => void,
      privacy_intro: setIntro as (v: unknown) => void,
      privacy_officer: setOfficer as (v: unknown) => void,
      privacy_date: setDate as (v: unknown) => void,
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {editMode && <style>{EDITABLE_STYLES}</style>}

      {/* ═══ Hero — 크고 임팩트 있게 ═══ */}
      <section style={{
        background: 'var(--charcoal)', position: 'relative', overflow: 'hidden',
        padding: '132px clamp(20px,4vw,52px) 80px',
      }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(16px,2.5vw,40px)', width: 1, background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', left: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid rgba(255,255,255,.1)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.06)' }} />

        {/* Decorative */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 70% 80%, rgba(148,53,67,.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', right: '-5%', bottom: '-20%',
          fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(200px, 28vw, 400px)',
          fontWeight: 300, color: 'rgba(255,255,255,.02)', lineHeight: .8, pointerEvents: 'none',
        }}>PP</div>

        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: MONO, fontSize: 13, fontWeight: 500,
            letterSpacing: '.14em', color: 'rgba(255,255,255,.4)',
            textTransform: 'uppercase', margin: '0 0 20px',
          }}>PRIVACY POLICY</p>
          <h1 style={{
            fontWeight: 900, fontSize: 'clamp(36px, 5.5vw, 64px)',
            lineHeight: .92, letterSpacing: '-.04em', color: '#fff', margin: '0 0 24px',
          }}>
            유니온시스템즈의{' '}
            <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400 }}>
              <E id="privacy_hero.title_word" editMode={editMode}>{hero.title_word}</E>
            </span>을<br />알려드립니다.
          </h1>
          <p style={{
            fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,.5)',
            maxWidth: 560, margin: 0,
          }}>
            <E id="privacy_hero.subtitle" editMode={editMode}>{hero.subtitle}</E>
          </p>
        </div>
      </section>

      {/* ═══ 서문 ═══ */}
      <section style={{ padding: 'clamp(80px, 6vw, 72px) clamp(20px,4vw,52px) 0', position: 'relative', overflow: 'hidden' }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{
            background: 'var(--soft)', border: '1px solid var(--line)',
            padding: 'clamp(28px, 4vw, 40px)', marginBottom: 48,
          }}>
            <div style={{ fontSize: 17, lineHeight: 1.85, color: 'var(--ink)', margin: '0 0 16px', fontWeight: 500 }}>
              <E id="privacy_intro.p1" editMode={editMode}>{intro.p1}</E>
            </div>
            <div style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--ink2)', margin: '0 0 12px' }}>
              <E id="privacy_intro.p2" editMode={editMode}>{intro.p2}</E>
            </div>
            <div style={{ fontSize: 15, color: 'var(--ink2)', margin: 0 }}>
              <E id="privacy_intro.p3" editMode={editMode}>{intro.p3}</E>
            </div>
            <div style={{
              marginTop: 20, paddingTop: 16,
              borderTop: '1px solid var(--line)',
              fontFamily: MONO, fontSize: 13, fontWeight: 600,
              color: 'var(--accent)', letterSpacing: '.04em',
            }}>
              시행일자 : <E id="privacy_date.text" editMode={editMode}>{date.text}</E>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 본문 섹션들 ═══ */}
      <section style={{ padding: '0 clamp(20px,4vw,52px) clamp(64px, 8vw, 100px)', position: 'relative', overflow: 'hidden' }}>
        {/* Viewport decorators */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, right: 'clamp(16px,2.5vw,40px)', width: 1, background: 'var(--line)', opacity: .2, pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 'clamp(40px,5vw,80px)', right: 'clamp(12px,2.5vw,36px)', width: 7, height: 7, border: '1px solid var(--line)', opacity: .5 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--line)', opacity: .3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--line) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px', opacity: .15, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          <PolicySection num="01" title="수집하는 개인정보 항목">
            <p>회사는 회원 등록 및 서비스 이용, 본인 식별, 원활한 고객상담, 불만처리 등의 각종 서비스 제공을 위한
              최소한의 필수정보와 이용자 맞춤 서비스 제공을 위한 선택항목으로 구분하여 개인정보를 수집하고 있습니다.</p>
            <div style={{ overflowX: 'auto', margin: '24px 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                <thead>
                  <tr style={{ background: 'var(--charcoal)' }}>
                    {['수집 항목', '구분', '수집 및 이용 목적', '보유 기간'].map((h) => (
                      <th key={h} style={{
                        padding: '16px 20px', textAlign: 'left',
                        fontWeight: 700, fontSize: 14, color: '#fff',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: 'var(--soft)', borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '16px 20px', fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>이름, 연락처, 이메일, 회사명</td>
                    <td style={{ padding: '16px 20px', fontSize: 15 }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px',
                        background: 'var(--accent)', color: '#fff',
                        fontSize: 12, fontWeight: 700, fontFamily: MONO,
                      }}>필수</span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: 15, color: 'var(--ink2)' }}>고객 요청사항 처리</td>
                    <td style={{ padding: '16px 20px', fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>응대 후 5년</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </PolicySection>

          <PolicySection num="02" title="개인정보의 수집 및 이용목적">
            <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, margin: '20px 0' }}>
              <InfoCard icon="01" title="서비스 제공" desc="콘텐츠 제공, 구매 및 요금 결제, 물품배송 또는 청구지 등 발송, 금융거래 본인 인증 및 금융 서비스" />
              <InfoCard icon="02" title="회원 관리" desc="회원제 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정 이용 방지, 가입 의사 확인, 연령확인, 불만처리 등 민원처리, 고지사항 전달" />
              <InfoCard icon="03" title="마케팅 및 광고" desc="이벤트 등 광고성 정보 전달, 접속 빈도 파악 또는 회원의 서비스 이용에 대한 통계" />
            </div>
          </PolicySection>

          <PolicySection num="03" title="개인정보의 보유 및 이용기간">
            <p>원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
              단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 아래와 같이 보관합니다.</p>
            <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <RetentionRow label="계약 또는 청약철회 등에 관한 기록" period="5년" law="전자상거래법" />
              <RetentionRow label="대금결제 및 재화 등의 공급에 관한 기록" period="3년" law="전자상거래법" />
              <RetentionRow label="소비자의 불만 또는 분쟁처리에 관한 기록" period="3년" law="전자상거래법" />
            </div>
          </PolicySection>

          <PolicySection num="04" title="개인정보의 파기절차 및 방법">
            <p>회원님이 회원가입 등을 위해 입력하신 정보는 목적이 달성된 후 별도의 DB로 옮겨져 내부 방침 및
              기타 관련 법령에 의한 정보보호 사유에 따라 일정 기간 저장된 후 파기되어집니다.</p>
            <p>별도 DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 보유되어지는 이외의 다른 목적으로 이용되지 않습니다.</p>
            <div style={{
              background: 'var(--soft)', border: '1px solid var(--line)',
              padding: '20px 24px', margin: '16px 0',
            }}>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--ink)', fontSize: 15 }}>
                파기방법
              </p>
              <p style={{ margin: '8px 0 0', color: 'var(--ink2)', fontSize: 15 }}>
                전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.
              </p>
            </div>
          </PolicySection>

          <PolicySection num="05" title="개인정보 제공">
            <p>회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.</p>
            <ul className="privacy-list">
              <li>이용자들이 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </PolicySection>

          <PolicySection num="06" title="수집한 개인정보의 위탁">
            <p>회사는 서비스 이행을 위해 아래와 같이 외부 전문업체에 위탁하여 운영하고 있습니다.</p>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: '20px 0',
            }}>
              <div style={{ background: 'var(--soft)', border: '1px solid var(--line)', padding: '20px 24px' }}>
                <p style={{ fontFamily: MONO, fontSize: 12, color: 'var(--ink2)', margin: '0 0 6px', letterSpacing: '.06em' }}>위탁 대상자</p>
                <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', margin: 0 }}>크로스디자인그룹주식회사</p>
              </div>
              <div style={{ background: 'var(--soft)', border: '1px solid var(--line)', padding: '20px 24px' }}>
                <p style={{ fontFamily: MONO, fontSize: 12, color: 'var(--ink2)', margin: '0 0 6px', letterSpacing: '.06em' }}>위탁업무 내용</p>
                <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', margin: 0 }}>웹사이트 및 시스템 관리</p>
              </div>
            </div>
          </PolicySection>

          <PolicySection num="07" title="이용자 및 법정대리인의 권리와 그 행사방법">
            <p>이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수도 있습니다.</p>
            <p>혹은 개인정보관리책임자에게 서면, 전화 또는 이메일로 연락하시면 지체없이 조치하겠습니다.</p>
            <p>귀하가 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용 또는 제공하지 않습니다.
              또한 잘못된 개인정보를 제3자에게 이미 제공한 경우에는 정정 처리결과를 제3자에게 지체없이 통지하여 정정이 이루어지도록 하겠습니다.</p>
          </PolicySection>

          <PolicySection num="08" title="개인정보 자동수집 장치의 설치, 운영 및 그 거부에 관한 사항">
            <p>회사는 귀하의 정보를 수시로 저장하고 찾아내는 &lsquo;쿠키(cookie)&rsquo; 등을 운용합니다.</p>
            <div style={{
              background: 'var(--soft)', border: '1px solid var(--line)',
              padding: '20px 24px', margin: '16px 0',
            }}>
              <p style={{ margin: '0 0 8px', fontWeight: 600, color: 'var(--ink)', fontSize: 15 }}>쿠키 사용 목적</p>
              <p style={{ margin: 0, color: 'var(--ink2)', fontSize: 15, lineHeight: 1.75 }}>
                회원과 비회원의 접속 빈도나 방문 시간 등을 분석, 이용자의 취향과 관심분야를 파악 및 자취 추적,
                각종 이벤트 참여 정도 및 방문 회수 파악 등을 통한 타겟 마케팅 및 개인 맞춤 서비스 제공
              </p>
            </div>
            <p>귀하는 쿠키 설치에 대한 선택권을 가지고 있습니다. 웹 브라우저의 옵션을 설정함으로써 모든 쿠키를 허용하거나,
              저장될 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다.</p>
            <p style={{ fontSize: 14, color: 'var(--ink2)' }}>
              <strong>설정방법 예(인터넷 익스플로어의 경우):</strong> 웹 브라우저 상단의 도구 &gt; 인터넷 옵션 &gt; 개인정보<br />
              단, 귀하께서 쿠키 설치를 거부하였을 경우 서비스 제공에 어려움이 있을 수 있습니다.
            </p>
          </PolicySection>

          <PolicySection num="09" title="개인정보에 관한 민원서비스">
            <p>회사는 고객의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 관련 부서 및 개인정보 보호책임자를 지정하고 있습니다.</p>

            <div style={{
              background: 'var(--charcoal)', color: '#fff',
              padding: 'clamp(28px, 4vw, 40px)', margin: '24px 0',
            }}>
              <p style={{
                fontFamily: MONO, fontSize: 12, fontWeight: 500,
                letterSpacing: '.1em', color: 'rgba(255,255,255,.4)',
                margin: '0 0 12px', textTransform: 'uppercase',
              }}>PRIVACY OFFICER</p>
              <p style={{ fontWeight: 800, fontSize: 20, margin: '0 0 16px', color: '#fff' }}>개인정보보호 책임자</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px' }}>
                <div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', margin: '0 0 2px' }}>이 름</p>
                  <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
                    <E id="privacy_officer.name" editMode={editMode}>{officer.name}</E>
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', margin: '0 0 2px' }}>전 화</p>
                  <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
                    <E id="privacy_officer.tel" editMode={editMode}>{officer.tel}</E>
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', margin: '0 0 2px' }}>팩 스</p>
                  <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
                    <E id="privacy_officer.fax" editMode={editMode}>{officer.fax}</E>
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', margin: '0 0 2px' }}>이메일</p>
                  <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
                    <E id="privacy_officer.email" editMode={editMode}>{officer.email}</E>
                  </p>
                </div>
              </div>
            </div>

            <p>기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, margin: '16px 0' }}>
              {[
                { name: '개인분쟁조정위원회', contact: '1336' },
                { name: '정보보호마크인증위원회', contact: '02-580-0533~4' },
                { name: '대검찰청 인터넷범죄수사센터', contact: '02-3480-3600' },
                { name: '경찰청 사이버테러대응센터', contact: '02-392-0330' },
              ].map((org) => (
                <div key={org.name} style={{
                  padding: '16px 20px', border: '1px solid var(--line)',
                  background: 'var(--surface)',
                }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', margin: '0 0 4px' }}>{org.name}</p>
                  <p style={{ fontFamily: MONO, fontSize: 13, color: 'var(--accent)', margin: 0, fontWeight: 600 }}>{org.contact}</p>
                </div>
              ))}
            </div>
          </PolicySection>

          <PolicySection num="10" title="정책 변경에 따른 공지의무">
            <p>이 개인정보처리방침은 아래에 명시된 날짜에 수정되었으며 법령, 정책 또는 보안기술의 변경에 따라
              내용의 추가, 삭제 및 수정이 있을 시에는 변경되는 개인정보처리방침을 시행하기 최소 7일전에
              홈페이지를 통해 변경이유 및 내용 등을 공지하도록 하겠습니다.</p>
            <div style={{
              marginTop: 20, padding: '16px 24px',
              background: 'var(--accent)', color: '#fff',
              display: 'inline-block',
            }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>시행일자 : <E id="privacy_date.text" editMode={editMode}>{date.text}</E></p>
            </div>
          </PolicySection>

        </div>
      </section>

      {/* Global styles for this page */}
      <style>{`
        .privacy-list {
          padding-left: 24px;
          margin: 16px 0;
        }
        .privacy-list li {
          margin-bottom: 10px;
          font-size: 16px;
          line-height: 1.75;
          color: var(--ink2);
        }
        .privacy-list li::marker {
          color: var(--accent);
        }
        .privacy-content p {
          margin: 0 0 14px;
        }
        .privacy-content p:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}

/* ── Section Component ── */
function PolicySection({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 48 }}>
      {/* Section header with left accent bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        marginBottom: 16, paddingBottom: 14,
        borderBottom: '2px solid var(--ink)',
      }}>
        <span style={{
          fontFamily: "'Newsreader', Georgia, serif",
          fontStyle: 'italic', fontSize: 28, fontWeight: 400,
          color: 'var(--accent)', lineHeight: 1,
        }}>{num}</span>
        <h2 style={{
          fontWeight: 800, fontSize: 'clamp(18px, 2.5vw, 22px)',
          letterSpacing: '-.02em', color: 'var(--ink)', margin: 0,
          lineHeight: 1.3,
        }}>{title}</h2>
      </div>
      <div className="privacy-content" style={{ fontSize: 16, lineHeight: 1.85, color: 'var(--ink2)' }}>
        {children}
      </div>
    </div>
  );
}

/* ── Info Card for Section 2 ── */
function InfoCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{
      padding: '24px', border: '1px solid var(--line)',
      background: 'var(--surface)', position: 'relative',
    }}>
      <span style={{
        fontFamily: "'Newsreader', Georgia, serif",
        fontStyle: 'italic', fontSize: 32, fontWeight: 400,
        color: 'var(--line)', position: 'absolute', top: 16, right: 20,
        lineHeight: 1,
      }}>{icon}</span>
      <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', margin: '0 0 8px' }}>{title}</p>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink2)', margin: 0 }}>{desc}</p>
    </div>
  );
}

/* ── Retention Row for Section 3 ── */
function RetentionRow({ label, period, law }: { label: string; period: string; law: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 24px', background: 'var(--soft)',
      border: '1px solid var(--line)', gap: 16, flexWrap: 'wrap',
    }}>
      <p style={{ fontSize: 15, color: 'var(--ink)', margin: 0, fontWeight: 500, flex: 1 }}>{label}</p>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{
          fontFamily: "'Newsreader', Georgia, serif",
          fontStyle: 'italic', fontSize: 22, fontWeight: 400,
          color: 'var(--accent)',
        }}>{period}</span>
        <span style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
          fontSize: 11, fontWeight: 500, letterSpacing: '.04em',
          color: 'var(--ink2)', padding: '3px 8px',
          border: '1px solid var(--line)',
        }}>{law}</span>
      </div>
    </div>
  );
}
