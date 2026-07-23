'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { openChannelTalk } from '@/components/ChannelTalk';

/* ═══ FAQ 데이터 ═══ */
const QUESTIONS = [
  {
    q: '라이선스 비용을 절감하려면?',
    a: '사용자 역할별 플랜 차등 적용(E3/E5/F3 혼합), 미사용 라이선스 정기 감사, CSP 파트너를 통한 볼륨 할인으로 평균 22% 비용을 절감할 수 있습니다.',
    solution: 'Microsoft 365 · NetClient',
    href: '/software?tab=microsoft365',
  },
  {
    q: '우리 회사에 맞는 보안 솔루션은?',
    a: '기업 규모와 보안 요구에 따라 다릅니다. 엔드포인트 보안(AhnLab V3), AI 위협 탐지(ESTsecurity EDR), 정보유출 방지(OfficeKeeper DLP)를 조합한 다층 방어를 추천합니다.',
    solution: 'AhnLab · ESTsecurity · OfficeKeeper',
    href: '/solutions?tab=security',
  },
  {
    q: '주52시간 근태관리 방법은?',
    a: 'NetClient PC-OFF 모듈로 PC 사용시간 기반 근로시간을 자동 관리합니다. CoolGate Telework로 재택근무 환경도 지원하며, 52시간 초과 시 자동 알림을 설정할 수 있습니다.',
    solution: 'NetClient PC-OFF',
    href: '/solutions?tab=netclient',
  },
  {
    q: '데이터 표준화가 뭔가요?',
    a: '조직 전체가 동일한 기준으로 데이터를 정의·관리하는 것입니다. DA#으로 표준 사전 구축, 모델 표준 적용, DB 동기화까지 3단계로 데이터 품질과 활용도를 높입니다.',
    solution: 'DA# 데이터 모델링',
    href: 'https://uniondata.co.kr',
  },
];

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const WS_HOST = process.env.NEXT_PUBLIC_API_URL?.replace('/api/union', '') || 'http://localhost:8080';
const WS_URL = `${WS_HOST}/ws/chat`;

type Tab = 'faq' | 'chat';
type ChatMsg = {
  id?: number;
  roomId?: number;
  senderType: 'VISITOR' | 'ADMIN' | 'SYSTEM';
  senderName: string;
  content: string;
  createdAt?: string;
};

/* ═══ 자동 응답 (백엔드 없을 때) ═══ */
const AUTO_REPLIES: { keywords: string[]; answer: string }[] = [
  { keywords: ['라이선스', '비용', '가격', '견적', '할인'], answer: '라이선스 비용 관련 문의시네요. 사용자 역할별 플랜 차등 적용(E3/E5/F3)으로 평균 22% 비용 절감이 가능합니다. 정확한 견적은 02-706-8999로 문의하시거나, 도입문의 페이지에서 신청해주세요.' },
  { keywords: ['보안', 'V3', '안랩', '바이러스', '랜섬', 'EDR'], answer: '보안 솔루션 문의시네요. AhnLab V3(엔드포인트), ESTsecurity(AI 위협 탐지), OfficeKeeper(DLP)를 조합한 다층 방어를 추천합니다. 기업 규모에 맞는 맞춤 제안을 원하시면 상담 신청해주세요.' },
  { keywords: ['마이크로소프트', 'microsoft', '365', 'M365', '오피스', 'office', 'teams', 'copilot'], answer: 'Microsoft 365 관련 문의시네요. 개인/가족, 비즈니스, 교육 플랜을 제공하며, CSP 파트너로서 볼륨 할인이 가능합니다. Copilot 도입 컨설팅도 무료 지원합니다.' },
  { keywords: ['자산', '넷클라이언트', 'netclient', 'PC관리', 'DMS', 'PMS'], answer: 'IT 자산관리 솔루션 NetClient는 DMS(자산관리), PMS(패치관리), PC-OFF(근로시간관리), HSM(보안관리) 4개 모듈을 제공합니다. 무료 체험도 가능합니다.' },
  { keywords: ['데이터', 'DA#', 'DA', '모델링', '표준화', '엔코아'], answer: '데이터 모델링 솔루션 DA# 공인총판입니다. 개괄/개념/논리/물리 모델 전 단계를 지원하며, DQ Edition으로 데이터 품질 진단도 가능합니다. uniondata.co.kr에서 상세 정보를 확인하세요.' },
  { keywords: ['어도비', 'adobe', '포토샵', '일러스트', '프리미어', 'CC'], answer: 'Adobe Creative Cloud 기업용 라이선스를 제공합니다. 중앙 배포 관리로 라이선스 관리 시간을 80% 절감할 수 있습니다. 교육기관은 60% 이상 할인됩니다.' },
  { keywords: ['오토데스크', 'autodesk', 'autocad', '캐드', 'revit', 'BIM'], answer: 'Autodesk 공인 리셀러입니다. AutoCAD, Revit, Inventor 등 단일 제품부터 AEC/제조/미디어 컬렉션까지 제공합니다. Flex 토큰 라이선스로 유연한 사용도 가능합니다.' },
  { keywords: ['알툴즈', '알집', '알씨', 'estsoft', '이스트'], answer: 'ESTsoft 알툴즈 기업용 라이선스를 제공합니다. 알집, 알씨, 알PDF, 알캡처 등 기업 필수 유틸리티를 통합팩으로 관리하세요. 공공기관/교육기관용 특별가도 있습니다.' },
  { keywords: ['상담', '전화', '연락', '문의'], answer: '전화 상담: 02-706-8999 (평일 10~18시)\n이메일: sales@unionsystems.co.kr\n또는 도입문의 페이지에서 온라인 상담을 신청하세요.' },
  { keywords: ['안녕', '하이', 'hello', 'hi'], answer: '안녕하세요! 유니온시스템즈 AI 상담 도우미입니다. 소프트웨어, 보안, 데이터, 자산관리 등 IT 솔루션에 대해 물어보세요.' },
];

type BotFlow = null | 'ask_product' | 'ask_quote' | 'ask_email' | 'ask_name' | 'done';

function getAutoReply(msg: string): { answer: string; nextFlow?: BotFlow } {
  const lower = msg.toLowerCase();
  for (const r of AUTO_REPLIES) {
    if (r.keywords.some(k => lower.includes(k.toLowerCase()))) {
      // 가격/견적 관련이면 시나리오 분기
      if (['라이선스', '비용', '가격', '견적', '할인'].some(k => lower.includes(k))) {
        return { answer: r.answer, nextFlow: 'ask_quote' };
      }
      return { answer: r.answer, nextFlow: 'ask_product' };
    }
  }
  return {
    answer: '안녕하세요! 유니온시스템즈 상담 도우미입니다.\n어떤 솔루션에 관심이 있으신가요?\n\n· Microsoft 365\n· 보안 솔루션\n· IT 자산관리\n· 데이터 모델링\n· Adobe / Autodesk\n\n키워드를 입력해주세요!',
    nextFlow: null,
  };
}

function getFlowReply(flow: BotFlow, msg: string): { answer: string; nextFlow?: BotFlow } {
  switch (flow) {
    case 'ask_product':
      return {
        answer: '더 자세한 제품 소개서를 보내드릴까요?\n"네" 또는 "견적"이라고 입력해주세요.',
        nextFlow: 'ask_quote',
      };
    case 'ask_quote': {
      const yes = ['네', '예', '응', 'yes', '좋', '견적', '보내', '부탁', 'ㅇㅇ'].some(k => msg.includes(k));
      if (yes) {
        return {
          answer: '소개서를 보내드리겠습니다.\n받으실 이메일 주소를 입력해주세요.',
          nextFlow: 'ask_email',
        };
      }
      return {
        answer: '알겠습니다. 다른 궁금한 점이 있으시면 언제든 물어보세요!\n전화 상담: 02-706-8999 (평일 10~18시)',
        nextFlow: null,
      };
    }
    case 'ask_email': {
      const emailMatch = msg.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
      if (emailMatch) {
        return {
          answer: `${emailMatch[0]}로 소개서를 발송해 드리겠습니다.\n회사명(또는 성함)을 알려주시면 맞춤 자료를 준비해 드립니다.`,
          nextFlow: 'ask_name',
        };
      }
      return {
        answer: '이메일 주소 형식을 확인해주세요. (예: name@company.com)',
        nextFlow: 'ask_email',
      };
    }
    case 'ask_name':
      return {
        answer: `감사합니다, ${msg}님!\n담당자가 확인 후 영업일 기준 1일 이내 소개서를 발송해 드립니다.\n\n다른 궁금한 점이 있으시면 언제든 물어보세요.`,
        nextFlow: 'done',
      };
    case 'done':
      return getAutoReply(msg);
    default:
      return getAutoReply(msg);
  }
}

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sid = sessionStorage.getItem('union_chat_sid');
  if (!sid) {
    sid = crypto.randomUUID?.() ??
      (`${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`);
    sessionStorage.setItem('union_chat_sid', sid);
  }
  return sid;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('faq');
  const [activeQ, setActiveQ] = useState<number | null>(null);

  // Chat state
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [visitorName, setVisitorName] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [unread, setUnread] = useState(0);
  const [botMode, setBotMode] = useState(false); // 백엔드 없을 때 자동응답
  const [botFlow, setBotFlow] = useState<BotFlow>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [collectedData, setCollectedData] = useState<{ email?: string; name?: string; product?: string }>({});

  const clientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sessionId = typeof window !== 'undefined' ? getSessionId() : '';

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // WebSocket 연결
  const connectWs = useCallback(() => {
    if (clientRef.current?.active) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL) as WebSocket,
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);

        // 입장 응답 구독
        client.subscribe(`/topic/chat/joined/${sessionId}`, (msg) => {
          const data = JSON.parse(msg.body);
          setRoomId(data.roomId);

          // 채팅방 메시지 구독
          client.subscribe(`/topic/chat/${data.roomId}`, (chatMsg) => {
            const parsed: ChatMsg = JSON.parse(chatMsg.body);
            setMessages((prev) => [...prev, parsed]);
            if (parsed.senderType === 'ADMIN' && !isOpen) {
              setUnread((n) => n + 1);
            }
          });
        });

        // 입장 메시지 전송
        client.publish({
          destination: '/app/chat.join',
          body: JSON.stringify({
            sessionId,
            senderName: visitorName || '방문자',
            senderType: 'VISITOR',
          }),
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: () => {
        setConnected(false);
        setBotMode(true); // WebSocket 실패 → 자동응답 모드
      },
    });

    // 3초 내 연결 안 되면 자동응답 모드
    const timeout = setTimeout(() => {
      if (!client.active) {
        setBotMode(true);
        setConnected(true); // UI상 연결된 것처럼
        setMessages(prev => [...prev, {
          senderType: 'SYSTEM', senderName: '시스템',
          content: `${visitorName || '방문자'}님, 환영합니다! AI 상담 도우미가 도와드리겠습니다.`,
        }]);
      }
    }, 3000);

    client.activate();
    clientRef.current = client;
    return () => clearTimeout(timeout);
  }, [sessionId, visitorName, isOpen]);

  // 이미 roomId가 있으면 기존 메시지 로드
  useEffect(() => {
    if (roomId) {
      fetch(`${API_BASE}/chat/rooms/${roomId}/messages`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setMessages(data);
          }
        })
        .catch(() => {});
    }
  }, [roomId]);

  // 메시지 전송
  const sendMessage = useCallback(() => {
    if (!input.trim()) return;
    const text = input.trim();

    // 방문자 메시지 추가
    const myMsg: ChatMsg = {
      senderType: 'VISITOR', senderName: visitorName || '방문자',
      content: text, createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, myMsg]);
    setInput('');
    inputRef.current?.focus();

    if (botMode) {
      // 자동응답 모드
      setTimeout(() => {
        const { answer, nextFlow } = botFlow ? getFlowReply(botFlow, text) : getAutoReply(text);

        // 이메일 수집 체크
        const emailMatch = text.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
        if (emailMatch) setCollectedData(prev => ({ ...prev, email: emailMatch[0] }));
        if (botFlow === 'ask_name') setCollectedData(prev => ({ ...prev, name: text }));

        const botMsg: ChatMsg = {
          senderType: 'ADMIN', senderName: 'AI 상담 도우미',
          content: answer, createdAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, botMsg]);
        if (nextFlow !== undefined) setBotFlow(nextFlow);
      }, 600 + Math.random() * 400); // 자연스러운 딜레이
      return;
    }

    // WebSocket 모드
    if (!roomId || !clientRef.current?.active) return;
    clientRef.current.publish({
      destination: `/app/chat.send/${roomId}`,
      body: JSON.stringify({
        sessionId, roomId,
        senderType: 'VISITOR',
        senderName: visitorName || '방문자',
        content: text,
      }),
    });
  }, [input, roomId, sessionId, visitorName, botMode, botFlow]);

  // 탭 열 때 unread 리셋
  useEffect(() => {
    if (isOpen && tab === 'chat') setUnread(0);
  }, [isOpen, tab]);

  // Cleanup
  useEffect(() => {
    return () => { clientRef.current?.deactivate(); };
  }, []);

  const startChat = () => {
    setNameSubmitted(true);
    connectWs();
  };

  return (
    <>
      {/* ═══ Floating button ═══ */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="솔루션 상담"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: isOpen ? '12px' : '12px 20px',
          border: 'none', background: 'var(--charcoal)', color: '#fff',
          fontWeight: 700, fontSize: 15, cursor: 'pointer', transition: 'all .2s',
        }}
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5L5 15" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 20.105V8.625c0-1.036.84-1.875 1.875-1.875h12.75c1.035 0 1.875.84 1.875 1.875v7.875c0 1.035-.84 1.875-1.875 1.875H7.875L3.75 20.105z" />
            </svg>
            상담
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -6,
                width: 20, height: 20, borderRadius: '50%',
                background: 'var(--accent)', color: '#fff',
                fontSize: 11, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{unread}</span>
            )}
          </>
        )}
      </button>

      {/* ═══ Chat panel ═══ */}
      <div
        className="chat-panel"
        style={{
          position: 'fixed', bottom: 80, right: 24, zIndex: 998,
          width: 380, maxHeight: 560,
          background: 'var(--surface)', border: '1px solid var(--line)',
          overflow: 'hidden',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0)' : 'translateY(8px)',
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity .2s, transform .2s',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 16px 48px rgba(0,0,0,.12)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', background: 'var(--charcoal)', flexShrink: 0 }}>
          <p style={{ fontWeight: 800, fontSize: 16, color: '#fff', margin: '0 0 10px' }}>
            유니온시스템즈 상담
          </p>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0 }}>
            {([
              { key: 'faq' as Tab, label: '자주 묻는 질문' },
              { key: 'chat' as Tab, label: '실시간 채팅' },
            ]).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  flex: 1, padding: '8px 0', border: 'none',
                  background: tab === t.key ? 'rgba(255,255,255,.12)' : 'transparent',
                  color: tab === t.key ? '#fff' : 'rgba(255,255,255,.45)',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  borderBottom: tab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
                  transition: 'all .2s',
                  position: 'relative',
                }}
              >
                {t.label}
                {t.key === 'chat' && unread > 0 && (
                  <span style={{
                    marginLeft: 4, padding: '1px 5px',
                    background: 'var(--accent)', color: '#fff',
                    fontSize: 10, fontWeight: 800,
                  }}>{unread}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ═══ FAQ Tab ═══ */}
        {tab === 'faq' && (
          <div style={{ flex: 1, overflow: 'auto', padding: '16px 16px 12px' }}>
            {activeQ === null ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {QUESTIONS.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveQ(i)}
                    style={{
                      padding: '12px 14px', border: '1px solid var(--line)',
                      background: 'var(--bg)', textAlign: 'left', cursor: 'pointer',
                      fontWeight: 600, fontSize: 14, color: 'var(--ink)',
                      transition: 'border-color .2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; }}
                  >
                    {item.q}
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginLeft: 8 }}>
                      <path d="M7 5l5 5-5 5" stroke="var(--ink2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ))}

                {/* 실시간 채팅으로 유도 */}
                <div style={{
                  marginTop: 8, padding: '14px', background: 'rgba(245,51,63,.04)',
                  border: '1px solid rgba(245,51,63,.1)', textAlign: 'center',
                }}>
                  <p style={{ fontSize: 13, color: 'var(--ink2)', margin: '0 0 8px' }}>
                    원하는 답을 못 찾으셨나요?
                  </p>
                  <button
                    onClick={() => setTab('chat')}
                    style={{
                      padding: '8px 20px', background: 'var(--accent)', color: '#fff',
                      fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
                    }}
                  >
                    실시간 상담 시작하기
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setActiveQ(null)}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: 'var(--ink2)', marginBottom: 12, padding: 0 }}
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M13 15l-5-5 5-5" stroke="var(--ink2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  다른 질문 보기
                </button>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                  <div style={{ padding: '10px 14px', background: 'var(--charcoal)', color: '#fff', fontSize: 14, fontWeight: 600, maxWidth: '85%' }}>
                    {QUESTIONS[activeQ].q}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 14 }}>
                  <div style={{ padding: '14px 16px', background: 'var(--bg)', border: '1px solid var(--line)', maxWidth: '90%' }}>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--ink)', margin: 0 }}>{QUESTIONS[activeQ].a}</p>
                    <p style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 600, marginTop: 10 }}>추천: {QUESTIONS[activeQ].solution}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link href={QUESTIONS[activeQ].href} style={{ flex: 1, padding: '10px', border: '1px solid var(--line)', textAlign: 'center', fontWeight: 600, fontSize: 14, color: 'var(--ink)', textDecoration: 'none' }}>
                    상세 보기
                  </Link>
                  <Link href="/contact" style={{ flex: 1, padding: '10px', background: 'var(--accent)', textAlign: 'center', fontWeight: 700, fontSize: 14, color: '#fff', textDecoration: 'none' }}>
                    전문가 상담
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ Live Chat Tab ═══ */}
        {tab === 'chat' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* 이름 입력 (처음 한 번) */}
            {!nameSubmitted ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
                <div style={{
                  width: 48, height: 48, background: 'rgba(245,51,63,.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 20.105V8.625c0-1.036.84-1.875 1.875-1.875h12.75c1.035 0 1.875.84 1.875 1.875v7.875c0 1.035-.84 1.875-1.875 1.875H7.875L3.75 20.105z" />
                  </svg>
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', margin: 0, textAlign: 'center' }}>
                  실시간 상담을 시작합니다
                </p>
                <p style={{ fontSize: 13, color: 'var(--ink2)', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
                  이름을 입력하시면 담당자가 연결됩니다.<br />
                  평일 10~18시 운영
                </p>
                <input
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="이름 (선택)"
                  onKeyDown={(e) => e.key === 'Enter' && startChat()}
                  style={{
                    width: '100%', padding: '12px 14px',
                    border: '1px solid var(--line)', background: 'var(--bg)',
                    fontSize: 14, color: 'var(--ink)', outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  onClick={startChat}
                  style={{
                    width: '100%', padding: '12px',
                    background: 'var(--accent)', color: '#fff',
                    fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
                  }}
                >
                  상담 시작하기
                </button>
              </div>
            ) : (
              <>
                {/* 연결 상태 */}
                <div style={{
                  padding: '6px 16px', background: connected ? 'rgba(34,197,94,.06)' : 'rgba(245,51,63,.06)',
                  borderBottom: '1px solid var(--line)',
                  display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: connected ? '#22c55e' : 'var(--accent)',
                    boxShadow: connected ? '0 0 6px rgba(34,197,94,.4)' : 'none',
                  }} />
                  <span style={{ fontSize: 12, color: 'var(--ink2)', fontFamily: MONO }}>
                    {botMode ? 'AI 상담 도우미' : connected ? '상담원 연결됨' : '연결 중...'}
                  </span>
                </div>

                {/* 메시지 영역 */}
                <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>
                  {messages.length === 0 && connected && (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ink2)', fontSize: 13 }}>
                      담당자 연결을 기다리는 중입니다...<br />
                      먼저 메시지를 남겨주세요.
                    </div>
                  )}
                  {messages.map((msg, i) => {
                    if (msg.senderType === 'SYSTEM') {
                      return (
                        <div key={i} style={{
                          textAlign: 'center', padding: '6px 0', margin: '4px 0',
                          fontSize: 12, color: 'var(--ink2)',
                        }}>
                          {msg.content}
                        </div>
                      );
                    }
                    const isMe = msg.senderType === 'VISITOR';
                    return (
                      <div key={i} style={{
                        display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start',
                        marginBottom: 8,
                      }}>
                        <div>
                          {!isMe && (
                            <div style={{ fontSize: 11, color: 'var(--ink2)', marginBottom: 3, fontWeight: 600 }}>
                              {msg.senderName || '상담원'}
                            </div>
                          )}
                          <div style={{
                            padding: '10px 14px', maxWidth: 260,
                            background: isMe ? 'var(--charcoal)' : 'var(--bg)',
                            color: isMe ? '#fff' : 'var(--ink)',
                            border: isMe ? 'none' : '1px solid var(--line)',
                            fontSize: 14, lineHeight: 1.5, wordBreak: 'break-word',
                          }}>
                            {msg.content}
                          </div>
                          {msg.createdAt && (
                            <div style={{
                              fontSize: 10, color: 'var(--ink2)', marginTop: 2,
                              textAlign: isMe ? 'right' : 'left', fontFamily: MONO,
                            }}>
                              {new Date(msg.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* 입력창 */}
                <div style={{
                  padding: '10px 12px', borderTop: '1px solid var(--line)',
                  display: 'flex', gap: 8, flexShrink: 0,
                }}>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="메시지를 입력하세요..."
                    disabled={!connected && !botMode}
                    style={{
                      flex: 1, padding: '10px 12px',
                      border: '1px solid var(--line)', background: 'var(--bg)',
                      fontSize: 14, color: 'var(--ink)', outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={(!connected && !botMode) || !input.trim()}
                    style={{
                      padding: '10px 16px', background: 'var(--accent)',
                      color: '#fff', fontWeight: 700, fontSize: 13,
                      border: 'none', cursor: (connected || botMode) && input.trim() ? 'pointer' : 'default',
                      opacity: (connected || botMode) && input.trim() ? 1 : 0.5,
                      transition: 'opacity .2s',
                    }}
                  >
                    전송
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══ Footer: 카카오톡 + 전화 ═══ */}
        <div style={{
          padding: '10px 16px', borderTop: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
          flexShrink: 0,
        }}>
          {/* 채널톡 상담 */}
          <button
            id="channel-talk-btn"
            onClick={() => openChannelTalk()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 600, color: '#fff',
              padding: '6px 12px', border: 'none', cursor: 'pointer',
              background: '#1B1B1B', transition: 'opacity .2s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 5.81 2 10.5c0 2.94 1.95 5.5 4.78 6.96-.13.46-.81 2.95-.84 3.13 0 0-.02.14.07.2.09.05.2.01.2.01.26-.04 3.06-2 3.54-2.34.61.09 1.24.13 1.88.13h.37c5.52 0 10-3.59 10-8.09S17.52 2 12 2z" fill="#fff"/>
            </svg>
            채널톡
          </button>

          <span style={{ width: 1, height: 16, background: 'var(--line)' }} />

          {/* 전화 상담 */}
          <a href="tel:02-706-8999" style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 13, color: 'var(--ink2)', textDecoration: 'none',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
            </svg>
            02-706-8999
          </a>
        </div>
      </div>
    </>
  );
}
