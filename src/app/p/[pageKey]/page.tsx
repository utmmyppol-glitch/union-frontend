import { Render } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckRenderConfig } from "@/lib/puck-render-config";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/union"
).replace("/api/union", "");

const THEME = { ink: "#111827", ink2: "#6b7280" };

async function fetchLayout(pageKey: string) {
  try {
    const res = await fetch(
      `${API_BASE}/api/union/page-layout/${pageKey}`,
      { next: { revalidate: 10 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return JSON.parse(data.layoutJson);
  } catch {
    return null;
  }
}

export default async function DynamicPuckPage({
  params,
}: {
  params: { pageKey: string };
}) {
  const data = await fetchLayout(params.pageKey);

  if (!data || !data.content || data.content.length === 0) {
    return (
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: THEME.ink,
            marginBottom: 12,
          }}
        >
          {decodeURIComponent(params.pageKey)}
        </h1>
        <p style={{ color: THEME.ink2 }}>콘텐츠가 준비 중입니다.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Render config={puckRenderConfig as any} data={data} />
    </div>
  );
}
