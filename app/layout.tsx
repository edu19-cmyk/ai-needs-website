import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 요청 게시판",
  description: "부서별 AI 활용 요청을 모으는 익명 게시판",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
