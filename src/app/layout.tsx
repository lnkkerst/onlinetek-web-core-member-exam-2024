import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "0nlineTek Web 2024 年度核心成员考核",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body>
        {children}
      </body>
    </html>
  );
}
