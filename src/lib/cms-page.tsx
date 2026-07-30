/**
 * CMS 페이지 래퍼 — page_layout API에 PUBLISHED 데이터가 있으면
 * Puck Render로 보여주고, 없으면 기존 하드코딩 컴포넌트를 보여준다.
 */
import { Render } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckRenderConfig } from "./puck-render-config";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/union"
).replace(/\/api\/union\/?$/, "");

export async function fetchPageLayout(pageKey: string) {
  try {
    const res = await fetch(
      `${API_BASE}/api/union/page-layout/${pageKey}`,
      { next: { revalidate: 10 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const parsed = JSON.parse(data.layoutJson);
    if (!parsed.content || parsed.content.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function CmsPageRender({ data }: { data: Record<string, unknown> }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Render config={puckRenderConfig as any} data={data} />
    </div>
  );
}
