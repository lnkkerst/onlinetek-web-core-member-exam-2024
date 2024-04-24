import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body>
        <main className="w-9/10 max-w-[720px] mx-auto my-8">{children}</main>
      </body>
    </html>
  );
}
