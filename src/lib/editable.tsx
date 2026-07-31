'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

/* ── JSON 안전 파싱 ── */
export function safeParse<T>(json: string | undefined, fallback: T): T {
  if (!json) return fallback;
  try { return JSON.parse(json); } catch { return fallback; }
}

/* ── 편집모드 감지 훅 (sessionStorage로 클라이언트 네비게이션 시에도 유지) ── */
const EDIT_STORAGE_KEY = '__cms_edit';

export function useEditMode(): boolean {
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('_edit') === '1';
    const inIframe = window.self !== window.top;
    if (fromUrl) {
      if (inIframe) sessionStorage.setItem(EDIT_STORAGE_KEY, '1');
      setEditMode(true);
    } else if (inIframe && sessionStorage.getItem(EDIT_STORAGE_KEY) === '1') {
      setEditMode(true);
    }
  }, []);
  return editMode;
}

/* ── 편집모드 매니페스트 전송 훅 (pathname 변화마다 재전송) ── */
export function useEditableManifest(editMode: boolean) {
  const pathname = usePathname();

  useEffect(() => {
    if (!editMode) return;

    const sendManifest = () => {
      const fields = Array.from(document.querySelectorAll('[data-editable]')).map(el => ({
        id: el.getAttribute('data-editable')!,
        type: el.classList.contains('editable-image') ? 'image' as const : 'text' as const,
        value: el.classList.contains('editable-image')
          ? (el as HTMLImageElement).src
          : el.textContent || '',
      }));
      console.log('[manifest]', pathname, fields.length);
      window.parent.postMessage({
        type: 'editable-manifest',
        fields,
        path: pathname,
      }, '*');
    };

    // DOM이 안정화된 후 전송 (페이지 전환 직후 렌더링 대기)
    const timer = setTimeout(sendManifest, 400);
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'request-manifest') sendManifest();
    };
    window.addEventListener('message', handler);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('message', handler);
    };
  }, [editMode, pathname]); // ← pathname 변화마다 재전송
}

/* ── EditableText ── */
export function E({ id, editMode, children }: { id: string; editMode: boolean; children: React.ReactNode }) {
  if (!editMode) return <>{children}</>;
  return (
    <span data-editable={id} className="editable-field" style={{ cursor: 'pointer', position: 'relative' }}
      onClick={(e) => {
        e.stopPropagation();
        const value = (e.currentTarget as HTMLElement).textContent || '';
        window.parent.postMessage({ type: 'field-click', id, fieldType: 'text', value }, '*');
      }}>
      {children}
    </span>
  );
}

/* ── EditableImage (next/image 최적화 포함) ── */
export function OptImg({ id, editMode, src, alt, width, height, fill, className, style, priority }: {
  id?: string; editMode: boolean; src: string; alt: string;
  width?: number; height?: number; fill?: boolean; className?: string;
  style?: React.CSSProperties; priority?: boolean;
}) {
  const isLocal = src.startsWith('/');
  const editProps = editMode && id ? {
    'data-editable': id,
    className: `${className || ''} editable-field editable-image`.trim(),
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      window.parent.postMessage({ type: 'field-click', id, fieldType: 'image', value: src }, '*');
    },
  } : { className };

  if (isLocal && !editMode) {
    return fill ? (
      <Image src={src} alt={alt} fill sizes="(max-width: 920px) 100vw, 50vw" style={style} priority={priority} {...editProps} />
    ) : (
      <Image src={src} alt={alt} width={width || 800} height={height || 500} style={style} priority={priority} {...editProps} />
    );
  }

  return <img src={src} alt={alt} style={style} {...editProps} />;
}

/* ── 편집모드 CSS (editMode일 때만 렌더) ── */
export const EDITABLE_STYLES = `
  .editable-field { transition: outline .15s, outline-offset .15s; outline: 2px solid transparent; outline-offset: 2px; border-radius: 2px; }
  .editable-field:hover { outline: 2px dashed #36c88a !important; outline-offset: 4px; }
  .editable-image { display: block; cursor: pointer; }
  .editable-image:hover { outline-offset: -2px; }
`;
