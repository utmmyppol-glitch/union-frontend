import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/layout/ScrollReveal";
import ChannelTalk from "@/components/ChannelTalk";
import UniMascot from "@/components/UniMascot";


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
  width: 1280,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `if('scrollRestoration' in history) history.scrollRestoration='manual'; window.scrollTo(0,0);` }} />
      </head>
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <ScrollReveal />
        <ChannelTalk />
        <UniMascot />
      </body>
    </html>
  );
}
