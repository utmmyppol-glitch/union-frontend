'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
const WS_HOST = process.env.NEXT_PUBLIC_API_URL?.replace('/api/union', '') || 'http://localhost:8080';
const WS_URL = `${WS_HOST}/ws/chat`;
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

type RoomStatus = 'WAITING' | 'ACTIVE' | 'CLOSED';
type Room = {
  id: number;
  sessionId: string;
  visitorName: string;
  visitorEmail: string | null;
  status: RoomStatus;
  assignee: string | null;
  unreadCount: number;
  lastMessage: string | null;
  lastMessageAt: string | null;
  createdAt: string;
};
type Msg = {
  id?: number;
  roomId: number;
  sessionId?: string;
  senderType: 'VISITOR' | 'ADMIN' | 'SYSTEM';
  senderName: string;
  content: string;
  createdAt?: string;
};

const STATUS_LABEL: Record<RoomStatus, string> = {
  WAITING: '대기',
  ACTIVE: '상담중',
  CLOSED: '종료',
};
const STATUS_COLOR: Record<RoomStatus, string> = {
  WAITING: '#f59e0b',
  ACTIVE: '#22c55e',
  CLOSED: '#94a3b8',
};

export default function AdminChatPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active'>('active');

  const clientRef = useRef<Client | null>(null);
  const subscribedRoomsRef = useRef<Set<number>>(new Set());
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const adminName = typeof window !== 'undefined' ? localStorage.getItem('admin_user') || '관리자' : '관리자';

  // 채팅방 목록 로드
  const loadRooms = useCallback(() => {
    fetch(`${API}/chat/rooms?filter=${filter}`)
      .then((r) => r.json())
      .then(setRooms)
      .catch(() => {});
  }, [filter]);

  useEffect(() => { loadRooms(); }, [loadRooms]);

  // WebSocket 연결
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL) as WebSocket,
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);

        // 새 채팅방 알림 구독
        client.subscribe('/topic/admin/rooms', () => {
          loadRooms();
        });

        // 채팅방 업데이트 구독
        client.subscribe('/topic/admin/rooms-update', () => {
          loadRooms();
        });
      },
      onDisconnect: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;

    return () => { client.deactivate(); };
  }, [loadRooms]);

  // 채팅방 선택 시 메시지 로드 + 구독
  const selectRoom = useCallback((room: Room) => {
    setSelectedRoom(room);
    setMessages([]);

    // 메시지 로드
    fetch(`${API}/chat/rooms/${room.id}/messages`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch(() => {});

    // 읽음 처리
    fetch(`${API}/chat/rooms/${room.id}/read`, { method: 'POST' })
      .then(() => loadRooms())
      .catch(() => {});

    // 이미 구독 안 한 방만 구독
    if (clientRef.current?.active && !subscribedRoomsRef.current.has(room.id)) {
      clientRef.current.subscribe(`/topic/chat/${room.id}`, (msg) => {
        const parsed: Msg = JSON.parse(msg.body);
        setMessages((prev) => [...prev, parsed]);
      });
      subscribedRoomsRef.current.add(room.id);
    }
  }, [loadRooms]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // 메시지 전송
  const sendMessage = useCallback(() => {
    if (!input.trim() || !selectedRoom || !clientRef.current?.active) return;

    clientRef.current.publish({
      destination: `/app/chat.send/${selectedRoom.id}`,
      body: JSON.stringify({
        roomId: selectedRoom.id,
        senderType: 'ADMIN',
        senderName: adminName,
        content: input.trim(),
      }),
    });
    setInput('');
    inputRef.current?.focus();
  }, [input, selectedRoom, adminName]);

  // 상태 변경
  const changeStatus = (roomId: number, status: RoomStatus) => {
    fetch(`${API}/chat/rooms/${roomId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, assignee: adminName }),
    })
      .then((r) => r.json())
      .then((updated: Room) => {
        setSelectedRoom(updated);
        loadRooms();
      })
      .catch(() => {});
  };

  const waitingCount = rooms.filter((r) => r.status === 'WAITING').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 48px)' }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px', borderBottom: '1px solid var(--line, #e5e7eb)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>실시간 채팅</h1>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', background: connected ? 'rgba(34,197,94,.08)' : 'rgba(245,51,63,.08)',
            fontSize: 12, fontWeight: 600, fontFamily: MONO,
            color: connected ? '#22c55e' : '#ef4444',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: connected ? '#22c55e' : '#ef4444',
            }} />
            {connected ? 'LIVE' : 'OFFLINE'}
          </span>
          {waitingCount > 0 && (
            <span style={{
              padding: '4px 10px', background: '#f59e0b', color: '#fff',
              fontSize: 12, fontWeight: 700,
            }}>
              {waitingCount}건 대기
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['active', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px', border: '1px solid #e5e7eb',
                background: filter === f ? '#1a1c22' : '#fff',
                color: filter === f ? '#fff' : '#6b7280',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {f === 'active' ? '진행중' : '전체'}
            </button>
          ))}
        </div>
      </div>

      {/* Body — 2 column */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Room list */}
        <div style={{
          width: 320, borderRight: '1px solid #e5e7eb',
          overflow: 'auto', flexShrink: 0,
        }}>
          {rooms.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
              채팅이 없습니다
            </div>
          ) : rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => selectRoom(room)}
              style={{
                padding: '14px 18px', borderBottom: '1px solid #f3f4f6',
                cursor: 'pointer', transition: 'background .15s',
                background: selectedRoom?.id === room.id ? '#f0f7ff' : 'transparent',
              }}
              onMouseEnter={(e) => { if (selectedRoom?.id !== room.id) e.currentTarget.style.background = '#fafafa'; }}
              onMouseLeave={(e) => { if (selectedRoom?.id !== room.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{room.visitorName || '방문자'}</span>
                  <span style={{
                    padding: '2px 6px', fontSize: 10, fontWeight: 700,
                    background: STATUS_COLOR[room.status] + '18',
                    color: STATUS_COLOR[room.status],
                  }}>
                    {STATUS_LABEL[room.status]}
                  </span>
                </div>
                {room.unreadCount > 0 && (
                  <span style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: '#ef4444', color: '#fff',
                    fontSize: 10, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {room.unreadCount}
                  </span>
                )}
              </div>
              {room.lastMessage && (
                <p style={{
                  fontSize: 13, color: '#6b7280', margin: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {room.lastMessage}
                </p>
              )}
              {room.lastMessageAt && (
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '4px 0 0', fontFamily: MONO }}>
                  {new Date(room.lastMessageAt).toLocaleString('ko-KR', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {!selectedRoom ? (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#9ca3af', fontSize: 15,
            }}>
              좌측에서 채팅방을 선택하세요
            </div>
          ) : (
            <>
              {/* Room header */}
              <div style={{
                padding: '12px 20px', borderBottom: '1px solid #e5e7eb',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexShrink: 0,
              }}>
                <div>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{selectedRoom.visitorName || '방문자'}</span>
                  <span style={{
                    marginLeft: 8, padding: '2px 8px', fontSize: 11, fontWeight: 700,
                    background: STATUS_COLOR[selectedRoom.status] + '18',
                    color: STATUS_COLOR[selectedRoom.status],
                  }}>
                    {STATUS_LABEL[selectedRoom.status]}
                  </span>
                  <span style={{ marginLeft: 8, fontSize: 12, color: '#9ca3af', fontFamily: MONO }}>
                    #{selectedRoom.id}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {selectedRoom.status === 'WAITING' && (
                    <button
                      onClick={() => changeStatus(selectedRoom.id, 'ACTIVE')}
                      style={{
                        padding: '6px 14px', background: '#22c55e', color: '#fff',
                        fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
                      }}
                    >
                      상담 시작
                    </button>
                  )}
                  {selectedRoom.status !== 'CLOSED' && (
                    <button
                      onClick={() => changeStatus(selectedRoom.id, 'CLOSED')}
                      style={{
                        padding: '6px 14px', background: '#f3f4f6', color: '#6b7280',
                        fontSize: 12, fontWeight: 700, border: '1px solid #e5e7eb', cursor: 'pointer',
                      }}
                    >
                      상담 종료
                    </button>
                  )}
                  {selectedRoom.status === 'CLOSED' && (
                    <button
                      onClick={() => changeStatus(selectedRoom.id, 'ACTIVE')}
                      style={{
                        padding: '6px 14px', background: '#3b82f6', color: '#fff',
                        fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
                      }}
                    >
                      상담 재개
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
                {messages.map((msg, i) => {
                  if (msg.senderType === 'SYSTEM') {
                    return (
                      <div key={i} style={{
                        textAlign: 'center', padding: '8px 0', margin: '4px 0',
                        fontSize: 12, color: '#9ca3af',
                      }}>
                        {msg.content}
                      </div>
                    );
                  }
                  const isAdmin = msg.senderType === 'ADMIN';
                  return (
                    <div key={i} style={{
                      display: 'flex', justifyContent: isAdmin ? 'flex-end' : 'flex-start',
                      marginBottom: 10,
                    }}>
                      <div style={{ maxWidth: '60%' }}>
                        <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 3, fontWeight: 600 }}>
                          {msg.senderName || (isAdmin ? '관리자' : '방문자')}
                        </div>
                        <div style={{
                          padding: '10px 14px',
                          background: isAdmin ? '#1a1c22' : '#f3f4f6',
                          color: isAdmin ? '#fff' : '#1a1c22',
                          fontSize: 14, lineHeight: 1.5, wordBreak: 'break-word',
                        }}>
                          {msg.content}
                        </div>
                        {msg.createdAt && (
                          <div style={{
                            fontSize: 10, color: '#9ca3af', marginTop: 3,
                            textAlign: isAdmin ? 'right' : 'left', fontFamily: MONO,
                          }}>
                            {new Date(msg.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>

              {/* Input */}
              <div style={{
                padding: '12px 16px', borderTop: '1px solid #e5e7eb',
                display: 'flex', gap: 8, flexShrink: 0,
              }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="답변을 입력하세요..."
                  disabled={!connected}
                  style={{
                    flex: 1, padding: '10px 14px',
                    border: '1px solid #e5e7eb', background: '#fff',
                    fontSize: 14, outline: 'none', fontFamily: 'inherit',
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!connected || !input.trim()}
                  style={{
                    padding: '10px 20px', background: '#1a1c22',
                    color: '#fff', fontWeight: 700, fontSize: 13,
                    border: 'none', cursor: connected && input.trim() ? 'pointer' : 'default',
                    opacity: connected && input.trim() ? 1 : 0.5,
                  }}
                >
                  전송
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
