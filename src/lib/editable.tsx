'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';
import { usePathname } from 'next/navigation';

/* ── postMessage origin (보안: "*" 대신 명시) ── */
export const BACKOFFICE_ORIGIN =
  process.env.NEXT_PUBLIC_BACKOFFICE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? `${window.location.protocol}//${window.location.hostname}:3002`
    : 'http://localhost:3002');

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
        id: (el as HTMLElement).dataset.editable!,
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
      }, BACKOFFICE_ORIGIN);
    };

    // DOM이 안정화된 후 전송 (페이지 전환 직후 렌더링 대기)
    const timer = setTimeout(sendManifest, 400);
    const handler = (e: MessageEvent) => {
      if (e.origin !== BACKOFFICE_ORIGIN) return;
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

/* ── 편집 콘텐츠 통합 훅 ──
 *  safeParse 초기화 + useEditMode + useEditableManifest + postMessage 리스너를 한 줄로.
 *
 *  사용법:
 *    const DEFAULTS = { adobe_hero: DEFAULT_HERO, adobe_cta: DEFAULT_CTA } as const;
 *    const [content, editMode] = useEditableContent(DEFAULTS, ssrContent);
 *    // content.adobe_hero — typeof DEFAULT_HERO 타입 유지
 */
export function useEditableContent<D extends Record<string, unknown>>(
  defaults: D,
  ssrContent: Record<string, string>,
): [D, boolean] {
  const editMode = useEditMode();
  useEditableManifest(editMode);

  const [values, setValues] = useState<D>(() => {
    const parsed = {} as Record<string, unknown>;
    for (const key of Object.keys(defaults)) {
      parsed[key] = safeParse(ssrContent[key], defaults[key]);
    }
    return parsed as D;
  });

  useEffect(() => {
    if (!editMode) return;
    const handler = (e: MessageEvent) => {
      if (e.origin !== BACKOFFICE_ORIGIN) return;
      if (e.data?.type === 'content-update') {
        const section = e.data.section as string;
        if (section in defaults) {
          setValues(prev => ({ ...prev, [section]: e.data.data }));
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode]);

  return [values, editMode];
}

/* ── HTML 태그 제거 (RichEditor 편집값 → 텍스트 변환) ── */
export function stripHtml(s: string): string {
  if (!s.includes('<')) return s;
  const d = new DOMParser().parseFromString(s, 'text/html');
  return (d.body.textContent || '').trim();
}

/* ── HTML 태그 포함 여부 판별 ── */
function containsHtml(v: React.ReactNode): v is string {
  return typeof v === 'string' && v.includes('<') && v.includes('>');
}

/* ── 블록 레벨 HTML 태그 포함 여부 (hydration 안전 래퍼 선택용) ── */
const BLOCK_RE = /<(?:p|div|ul|ol|table|h[1-6]|blockquote|section|article|header|footer|nav|pre|hr|dl|figure)[\s>/]/i;
function hasBlockHtml(html: string): boolean {
  return BLOCK_RE.test(html);
}

/* ── EditableText (HTML 서식 지원) ── */
export function E({ id, editMode, children }: Readonly<{ id: string; editMode: boolean; children: React.ReactNode }>) {
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

  const handleFieldClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const value = (e.currentTarget as HTMLElement).innerHTML || '';
    window.parent.postMessage({ type: 'field-click', id, fieldType: 'text', value }, BACKOFFICE_ORIGIN);
  };

  const btnReset: React.CSSProperties = {
    all: 'unset', cursor: 'pointer', position: 'relative', whiteSpace: 'pre-wrap',
    display: useDiv ? 'block' : 'inline', textAlign: 'inherit', font: 'inherit', color: 'inherit',
  };

  if (sanitized !== null) {
    return (
      <button type="button" data-editable={id} className="editable-field rich-html"
        style={btnReset} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: sanitized }}
        onClick={handleFieldClick}
      />
    );
  }

  return (
    <button type="button" data-editable={id} className="editable-field"
      style={btnReset} onClick={handleFieldClick}>
      {children}
    </button>
  );
}

/* ── EditableImage (next/image 최적화 포함) ── */
export function OptImg({ id, editMode, src, alt, width, height, fill, className, style, priority }: Readonly<{
  id?: string; editMode: boolean; src: string; alt: string;
  width?: number; height?: number; fill?: boolean; className?: string;
  style?: React.CSSProperties; priority?: boolean;
}>) {
  const isLocal = src.startsWith('/');
  const editProps = editMode && id ? {
    'data-editable': id,
    className: `${className || ''} editable-field editable-image`.trim(),
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      window.parent.postMessage({ type: 'field-click', id, fieldType: 'image', value: src }, BACKOFFICE_ORIGIN);
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
