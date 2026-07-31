'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';

/* ── JSON 안전 파싱 ── */
export function safeParse<T>(json: string | undefined, fallback: T): T {
  if (!json) return fallback;
  try { return JSON.parse(json); } catch { return fallback; }
}

/* ── 편집모드 매니페스트 전송 훅 ── */
export function useEditableManifest(editMode: boolean) {
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
      window.parent.postMessage({
        type: 'editable-manifest',
        fields,
        path: window.location.pathname,
      }, '*');
    };

    // 내부 링크 클릭 시 ?_edit=1 보존
    const interceptLinks = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      // 내부 링크 — ?_edit=1 붙여서 이동
      e.preventDefault();
      const url = new URL(href, window.location.origin);
      url.searchParams.set('_edit', '1');
      window.location.href = url.toString();
    };
    document.addEventListener('click', interceptLinks, true);

    const timer = setTimeout(sendManifest, 500);
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'request-manifest') sendManifest();
    };
    window.addEventListener('message', handler);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('message', handler);
      document.removeEventListener('click', interceptLinks, true);
    };
  }, [editMode]);
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
