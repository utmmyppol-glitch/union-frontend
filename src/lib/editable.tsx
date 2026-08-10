'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';
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
          : el.innerHTML || '',
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
      if (e.data?.type === 'highlight-field') {
        const el = document.querySelector(`[data-editable="${e.data.id}"]`) as HTMLElement | null;
        if (el) { el.style.outline = '2px solid #3b82f6'; el.style.outlineOffset = '4px'; }
      }
      if (e.data?.type === 'clear-highlight') {
        const el = document.querySelector(`[data-editable="${e.data.id}"]`) as HTMLElement | null;
        if (el) { el.style.outline = ''; el.style.outlineOffset = ''; }
      }
      if (e.data?.type === 'scroll-to-field') {
        const el = document.querySelector(`[data-editable="${e.data.id}"]`) as HTMLElement | null;
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.style.outline = '2px solid #3b82f6'; el.style.outlineOffset = '4px';
          setTimeout(() => { el.style.outline = ''; el.style.outlineOffset = ''; }, 2000);
        }
      }
    };
    window.addEventListener('message', handler);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('message', handler);
    };
  }, [editMode, pathname]); // ← pathname 변화마다 재전송
}

/* ── HTML 태그 제거 (RichEditor 편집값 → 텍스트 변환) ── */
export function stripHtml(s: string): string {
  if (!/<[a-z][\s\S]*?>/i.test(s)) return s;
  return s
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

/* ── HTML 태그 포함 여부 판별 ── */
function containsHtml(v: React.ReactNode): v is string {
  return typeof v === 'string' && /<[a-z][\s\S]*>/i.test(v);
}

/* ── 블록 레벨 HTML 태그 포함 여부 (hydration 안전 래퍼 선택용) ── */
const BLOCK_RE = /<(?:p|div|ul|ol|table|h[1-6]|blockquote|section|article|header|footer|nav|pre|hr|dl|figure)[\s>/]/i;
function hasBlockHtml(html: string): boolean {
  return BLOCK_RE.test(html);
}

/* ── EditableText (HTML 서식 지원) ── */
export function E({ id, editMode, children }: { id: string; editMode: boolean; children: React.ReactNode }) {
  const sanitized = useMemo(
    () => (containsHtml(children) ? DOMPurify.sanitize(children) : null),
    [children],
  );

  /* 블록 HTML이 포함된 경우 <div>로 래핑해야 hydration 오류 방지 */
  const useDiv = sanitized !== null && hasBlockHtml(sanitized);

  if (!editMode) {
    if (sanitized !== null) {
      const Tag = useDiv ? 'div' : 'span';
      return <Tag className="rich-html" style={{ whiteSpace: 'pre-wrap' }} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: sanitized }} />;
    }
    return <span style={{ whiteSpace: 'pre-wrap' }}>{children}</span>;
  }

  if (sanitized !== null) {
    const Tag = useDiv ? 'div' : 'span';
    return (
      <Tag data-editable={id} className="editable-field rich-html" style={{ cursor: 'pointer', position: 'relative', whiteSpace: 'pre-wrap' }}
        suppressHydrationWarning dangerouslySetInnerHTML={{ __html: sanitized }}
        onClick={(e) => {
          e.stopPropagation();
          const value = (e.currentTarget as HTMLElement).innerHTML || '';
          window.parent.postMessage({ type: 'field-click', id, fieldType: 'text', value }, '*');
        }}
      />
    );
  }

  return (
    <span data-editable={id} className="editable-field" style={{ cursor: 'pointer', position: 'relative', whiteSpace: 'pre-wrap' }}
      onClick={(e) => {
        e.stopPropagation();
        const value = (e.currentTarget as HTMLElement).innerHTML || '';
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
