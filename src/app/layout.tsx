import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/layout/ScrollReveal";
import ChannelTalk from "@/components/ChannelTalk";
import UniMascot from "@/components/UniMascot";
import type { NavItem } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/union";

interface MenuApiItem {
  name: string;
  url: string;
  menuType: string;
  isExposed: boolean;
  children?: MenuApiItem[];
}

function apiToNavItems(items: MenuApiItem[]): NavItem[] {
  return items
    .map((m) => ({
      label: m.name,
      href: m.url,
      children: m.children?.length ? apiToNavItems(m.children) : undefined,
    }));
}

async function getMenu(): Promise<NavItem[] | null> {
  try {
    const base = API_URL.replace(/\/api\/union\/?$/, "");
    const res = await fetch(`${base}/api/union/menu`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data: MenuApiItem[] = await res.json();
    if (!data || data.length === 0) return null;
    return apiToNavItems(data);
  } catch {
    return null;
  }
}


export const metadata: Metadata = {
  title: {
    default: "유니온시스템즈 | IT 인프라 전문 파트너",
    template: "%s | 유니온시스템즈",
  },
  description:
    "소프트웨어 유통부터 보안 솔루션, 데이터 분석까지 — 복잡한 기업 IT를 하나로 연결합니다.",
  keywords: [
    "유니온시스템즈",
    "IT 솔루션",
    "Microsoft 365",
    "보안",
    "데이터 분석",
    "자산관리",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "유니온시스템즈",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ssrMenu = await getMenu();
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `if('scrollRestoration' in history) history.scrollRestoration='manual'; window.scrollTo(0,0);` }} />
      </head>
      <body className="antialiased">
        <Header ssrMenu={ssrMenu} />
        <main>{children}</main>
        <Footer />
        <ScrollReveal />
        <ChannelTalk />
        <UniMascot />
      </body>
    </html>
  );
}
