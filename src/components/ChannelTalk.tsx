'use client';

import { useEffect } from 'react';

/**
 * 채널톡(channel.io) SDK 부트스트랩 컴포넌트.
 *
 * 환경변수: NEXT_PUBLIC_CHANNEL_TALK_PLUGIN_KEY
 * 채널톡 관리자 > 설정 > 개발자 > 플러그인 키에서 확인.
 *
 * 플러그인 키가 없으면 SDK를 로드하지 않음.
 */
const PLUGIN_KEY = process.env.NEXT_PUBLIC_CHANNEL_TALK_PLUGIN_KEY || '';

declare global {
  interface Window {
    ChannelIO?: (...args: unknown[]) => void;
    ChannelIOInitialized?: boolean;
  }
}

function bootChannelTalk() {
  if (!PLUGIN_KEY) return;
  if (typeof window === 'undefined') return;

  // 이미 초기화됨
  if (window.ChannelIOInitialized) return;

  const ch = function (...args: unknown[]) {
    ch.c(args);
  } as typeof window.ChannelIO & { c: (a: unknown[]) => void; q: unknown[][] };
  ch.q = [];
  ch.c = function (args: unknown[]) {
    ch.q.push(args);
  };
  window.ChannelIO = ch;

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript?.parentNode?.insertBefore(script, firstScript);

  script.onload = () => {
    window.ChannelIOInitialized = true;
    window.ChannelIO?.('boot', {
      pluginKey: PLUGIN_KEY,
      hideChannelButtonOnBoot: false, // 기본 플로팅 버튼 표시
    });
  };
}

export default function ChannelTalk() {
  useEffect(() => {
    bootChannelTalk();

    return () => {
      if (window.ChannelIO) {
        window.ChannelIO('shutdown');
      }
    };
  }, []);

  return null;
}

/** 채널톡 채팅창 열기 */
export function openChannelTalk() {
  if (window.ChannelIO) {
    window.ChannelIO('showMessenger');
  }
}
